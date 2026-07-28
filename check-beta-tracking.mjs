import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const landing = await readFile(new URL("./app/components/Landing.jsx", import.meta.url), "utf8");
const nav = await readFile(new URL("./app/components/Nav.jsx", import.meta.url), "utf8");
const hero = await readFile(new URL("./app/components/Hero.jsx", import.meta.url), "utf8");
const sections = await readFile(new URL("./app/components/Sections.jsx", import.meta.url), "utf8");
const vercel = JSON.parse(await readFile(new URL("./vercel.json", import.meta.url), "utf8"));

function findJoinBetaAnchors(source) {
  return [...source.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)]
    .filter(([, , text]) => text.trim() === "Join the beta");
}

function extractFunctionBody(source, name, isDefault = false) {
  const prefix = isDefault ? `export default function ${name}` : `export function ${name}`;
  const idx = source.indexOf(prefix);
  if (idx === -1) throw new Error(`Component "${name}" not found in source`);

  let pos = idx + prefix.length;
  while (pos < source.length && /\s/.test(source[pos])) pos++;
  if (source[pos] !== "(") throw new Error(`Expected ( after ${prefix}`);

  let depth = 1;
  pos++;
  while (pos < source.length && depth > 0) {
    if (source[pos] === "(") depth++;
    else if (source[pos] === ")") depth--;
    pos++;
  }

  while (pos < source.length && /\s/.test(source[pos])) pos++;
  if (source[pos] !== "{") throw new Error(`Expected { after params for ${name}`);
  depth = 1;
  pos++;
  const bodyStart = pos;
  while (pos < source.length && depth > 0) {
    if (source[pos] === "{") depth++;
    else if (source[pos] === "}") depth--;
    if (depth > 0) pos++;
  }
  return source.slice(bodyStart, pos);
}

// Extract component bodies and verify their selector markers
const navBody = extractFunctionBody(nav, "Nav", true);
assert.ok(navBody.includes("data-nav"), 'Nav component body must include data-nav');

const pitchBody = extractFunctionBody(hero, "Pitch");
assert.ok(pitchBody.includes('className="pitch"'), 'Pitch component body must include className="pitch"');

const closingBody = extractFunctionBody(sections, "ClosingCta");
assert.ok(closingBody.includes('className="closing"'), 'ClosingCta component body must include className="closing"');

// Exactly one CONTACT-backed "Join the beta" per component body
for (const [name, body] of [["Nav", navBody], ["Pitch", pitchBody], ["ClosingCta", closingBody]]) {
  const anchors = findJoinBetaAnchors(body);
  assert.equal(anchors.length, 1, `exactly one Join the beta in ${name} component body`);
  assert.ok(/\bhref=\{CONTACT\}/.test(anchors[0][1]), `Join the beta in ${name} must use CONTACT`);
}

// Tracking handler in Landing.jsx
assert.match(landing, /onClick=\{trackBetaClick\}/);
assert.match(landing, /event\.target\.closest\("a"\)/);
assert.match(landing, /link\.textContent\.trim\(\) !== "Join the beta"/);
assert.match(landing, /new URL\(link\.href\)\.href !== new URL\(CONTACT\)\.href/);
assert.match(landing, /link\.closest\("\[data-nav\]"\)\s*\?\s*"nav"/);
assert.match(landing, /link\.closest\("\.pitch"\)\s*\?\s*"hero"/);
assert.match(landing, /link\.closest\("\.closing"\)\s*\?\s*"closing"/);
assert.match(landing, /navigator\.sendBeacon\("\/events\/beta-click"/);
assert.match(landing, /<a href=\{CONTACT\}[^>]*>Contact us<\/a>/);

// Hero BetaBanner uses a button for the dynamic label, not an anchor
assert.match(hero, /<button[^>]*>\{label\}<\/button>/);
assert.doesNotMatch(hero, /<a[^>]*>\{label\}<\/a>/);

// Vercel rewrite for the beta-click beacon endpoint
assert.deepEqual(
  vercel.rewrites.find((rewrite) => rewrite.source === "/events/beta-click"),
  { source: "/events/beta-click", destination: "https://api.compassguard.xyz/events/beta-click" },
);

console.log("beta tracking checks passed");
