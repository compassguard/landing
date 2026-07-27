import assert from "node:assert/strict";

const CDP = "http://127.0.0.1:9222";
const APP = "http://127.0.0.1:3003/";

const targets = await (await fetch(`${CDP}/json/list`)).json();
const target = targets.find(({ type, url }) => type === "page" && url.startsWith(APP));
assert(target, `no dev-server page at ${APP}`);

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
let nextId = 0;
const pending = new Map();
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (!message.id) return;
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const { result, exceptionDetails } = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (exceptionDetails) throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
  return result.value;
};
const waitFor = async (condition) => {
  const until = Date.now() + 4000;
  while (Date.now() < until) {
    try { if (await evaluate(`Boolean(${condition})`)) return; } catch (_) {}
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error(`timed out waiting for ${condition}`);
};
const snapshot = () => evaluate(`(() => {
  const v = document.querySelector('[data-demo]'), stage = document.querySelector('[data-stage]'), landing = document.querySelector('[data-landing]');
  return { calls: window.__videoGateCalls, metadata: { ...window.__videoGateMetadata, active: window.__videoGateActive() }, paused: v.paused, time: v.currentTime,
    stageHidden: getComputedStyle(stage).visibility === 'hidden' || getComputedStyle(stage).display === 'none',
    landingVisible: landing.getAttribute('aria-hidden') === 'false' && !!v.getClientRects().length };
})()`);

await send("Page.enable");
await send("Runtime.enable");
const instrumentation = await send("Page.addScriptToEvaluateOnNewDocument", { source: `(() => {
  if (window.__videoGateInstrumented) return;
  window.__videoGateInstrumented = true;
  window.__videoGateCalls = [];
  window.__videoGateMetadata = { added: 0, removed: 0, active: new Set() };
  // React DOM attaches its own non-delegated 'loadedmetadata' listener to
  // every media element it renders and never removes it, so the raw counts
  // include one listener that is never ours. Arming after load records those
  // as a baseline and measures the gate's own add/remove balance against it.
  window.__videoGateBaseline = new Set();
  window.__videoGateArm = () => {
    window.__videoGateBaseline = new Set(window.__videoGateMetadata.active);
    window.__videoGateMetadata.added = 0;
    window.__videoGateMetadata.removed = 0;
  };
  window.__videoGateActive = () =>
    [...window.__videoGateMetadata.active].filter((l) => !window.__videoGateBaseline.has(l)).length;
  const play = HTMLMediaElement.prototype.play;
  const add = HTMLMediaElement.prototype.addEventListener, remove = HTMLMediaElement.prototype.removeEventListener;
  HTMLMediaElement.prototype.addEventListener = function(type, listener, ...args) {
    if (type === 'loadedmetadata' && this.hasAttribute('data-demo')) {
      window.__videoGateMetadata.added++;
      window.__videoGateMetadata.active.add(listener);
    }
    return add.call(this, type, listener, ...args);
  };
  HTMLMediaElement.prototype.removeEventListener = function(type, listener, ...args) {
    if (type === 'loadedmetadata' && this.hasAttribute('data-demo')) {
      window.__videoGateMetadata.removed++;
      window.__videoGateMetadata.active.delete(listener);
    }
    return remove.call(this, type, listener, ...args);
  };
  HTMLMediaElement.prototype.play = function(...args) {
    const stage = document.querySelector('[data-stage]'), landing = document.querySelector('[data-landing]');
    window.__videoGateCalls.push({ time: this.currentTime,
      stageHidden: !!stage && (getComputedStyle(stage).visibility === 'hidden' || getComputedStyle(stage).display === 'none'),
      landingVisible: !!landing && landing.getAttribute('aria-hidden') === 'false' && !!this.getClientRects().length });
    return play.apply(this, args);
  };
})();` });
let reducedMotion;
const navigate = async (suffix = "") => {
  await send("Page.navigate", { url: `${APP}?video-gate=${Date.now()}${suffix}` });
  await waitFor("document.querySelector('[data-demo]') && document.querySelector('[data-stage]')");
  await evaluate("window.scrollTo(0, 0)");
  await new Promise((resolve) => setTimeout(resolve, 250));
  await waitFor("document.querySelector('[data-demo]') && document.querySelector('[data-stage]') && document.querySelector('[data-landing]')");
  // Arm only once React's own media listener has actually landed. The
  // elements above are in the server HTML, so waiting on them alone would
  // snapshot the baseline before hydration and count React's listener as the
  // gate's. The page is still at scroll 0 under the intro here, so nothing
  // the gate registers can be in this baseline.
  await waitFor("window.__videoGateMetadata.active.size >= 1");
  await evaluate("window.__videoGateArm()");
};

try {
  await navigate();
  let state = await snapshot();
  assert.equal(state.calls.length, 0, "covered load called play()");
  assert(state.paused && state.time < 0.05 && !state.stageHidden && !state.landingVisible, "covered load is not paused at zero");

  await evaluate("window.scrollTo(0, document.querySelector('[data-spacer]').offsetHeight / 2)");
  await new Promise((resolve) => setTimeout(resolve, 100));
  state = await snapshot();
  assert.equal(state.calls.length, 0, "midpoint called play()");
  assert(state.paused && state.time < 0.05, "midpoint video advanced");

  await evaluate("window.scrollTo(0, document.querySelector('[data-spacer]').offsetHeight + 1)");
  await waitFor("window.__videoGateCalls.length === 1");
  state = await snapshot();
  assert.deepEqual(state.calls[0], { time: 0, stageHidden: true, landingVisible: true }, "first play was not a visible zero-time reveal");

  await evaluate("window.scrollTo(0, 0)");
  await new Promise((resolve) => setTimeout(resolve, 80));
  await evaluate("window.scrollTo(0, document.querySelector('[data-spacer]').offsetHeight + 1)");
  await new Promise((resolve) => setTimeout(resolve, 100));
  assert.equal((await snapshot()).calls.length, 1, "reverse/forward replayed the video");

  await navigate("-race");
  await evaluate(`(() => {
    const v = document.querySelector('[data-demo]');
    const descriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'readyState');
    window.__restoreReadyState = () => Object.defineProperty(HTMLMediaElement.prototype, 'readyState', descriptor);
    Object.defineProperty(HTMLMediaElement.prototype, 'readyState', { ...descriptor, get() { return this === v ? 0 : descriptor.get.call(this); } });
    window.__complete = () => window.scrollTo(0, document.querySelector('[data-spacer]').offsetHeight + 1);
    window.__reverse = () => window.scrollTo(0, 0);
    window.__complete();
  })()`);
  for (let cycle = 1; cycle <= 3; cycle++) {
    await waitFor(`window.__videoGateMetadata.added === ${cycle} && window.__videoGateActive() === 1`);
    await evaluate("window.__reverse()");
    await waitFor("getComputedStyle(document.querySelector('[data-stage]')).visibility === 'visible' && document.querySelector('[data-landing]').getAttribute('aria-hidden') === 'true'");
    state = await snapshot();
    assert.equal(state.metadata.active, 0, `reverse ${cycle} left a metadata listener`);
    assert.equal(state.metadata.removed, cycle, `reverse ${cycle} did not remove its metadata listener`);
    if (cycle < 3) await evaluate("window.__complete()");
  }
  await evaluate(`(() => { const v = document.querySelector('[data-demo]'); window.__restoreReadyState(); v.dispatchEvent(new Event('loadedmetadata')); })()`);
  state = await snapshot();
  assert.equal(state.calls.length, 0, "stale metadata callback played while covered");
  assert.equal(state.metadata.added, 3, "reversals created more than one pending path per completion");
  await evaluate("window.__complete()");
  await waitFor("window.__videoGateCalls.length === 1");
  assert.deepEqual((await snapshot()).calls[0], { time: 0, stageHidden: true, landingVisible: true }, "re-completion did not retry from zero");

  reducedMotion = await send("Page.addScriptToEvaluateOnNewDocument", { source: `{
    const nativeMatchMedia = window.matchMedia;
    window.matchMedia = (query) => query === '(prefers-reduced-motion: reduce)' ? { matches: true, addEventListener() {}, removeEventListener() {} } : nativeMatchMedia(query);
  }` });
  await navigate("-reduced");
  await waitFor("window.__videoGateCalls.length === 1");
  state = await snapshot();
  assert(state.stageHidden && state.landingVisible && !state.paused, "reduced-motion completion did not reveal and play");
  assert.deepEqual(state.calls[0], { time: 0, stageHidden: true, landingVisible: true }, "reduced-motion play was not gated");
  console.log("video gate runtime checks passed");
} finally {
  if (reducedMotion) await send("Page.removeScriptToEvaluateOnNewDocument", { identifier: reducedMotion.identifier });
  await send("Page.removeScriptToEvaluateOnNewDocument", { identifier: instrumentation.identifier });
  await send("Page.navigate", { url: APP });
  socket.close();
}
