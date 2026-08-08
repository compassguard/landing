import LandingShell from "./LandingShell";
import { BackedBy, Team } from "./Sections";
import {
  AcpFailure, AcpFlow, AcpMandate, VirtualsClosingCta, VirtualsPitch, VirtualsTraction,
} from "./VirtualsSections";
import { DOCS, QUICKSTART } from "../content";

const NAV_LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#mandate", label: "Mandate" },
  { href: "#team", label: "Team" },
  { href: QUICKSTART, label: "API docs", external: true },
  { href: DOCS, label: "Docs", external: true },
];

const HERO_VIDEO = {
  src: "/compass-acp-call-1080p.mp4",
  poster: "/art/demo-poster-acp-call.webp",
  tag: "Compass guard / call the agent",
  // Scenes carry a lot of copy to read (CLI output, JSON deliverables); full
  // speed doesn't leave enough time to read them in a loop.
  rate: 0.6,
};

export default function VirtualsLanding() {
  return (
    <LandingShell
      navLinks={NAV_LINKS}
      heroVideo={HERO_VIDEO}
      footerNote="© 2026 Compass Guard · Mandates for agents on the Agent Commerce Protocol. Not affiliated with or endorsed by Virtuals Protocol."
    >
      <VirtualsPitch />
      <BackedBy />
      <AcpFlow />
      {/* Proof of life sits right after the explanation, same as the
          general landing: who is already using it, before the ACP-specific
          failure narrative. */}
      <VirtualsTraction />
      <Team />
      <AcpFailure />
      <AcpMandate />
      <VirtualsClosingCta />
    </LandingShell>
  );
}
