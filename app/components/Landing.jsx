import LandingShell from "./LandingShell";
import { Pitch } from "./Hero";
import {
  BackedBy, ClosingCta, Heist, HowItWorks, Team, Traction, WhyNothingCaught,
} from "./Sections";

export default function Landing() {
  return (
    <LandingShell footerNote="© 2026 Compass Guard · Execution firewall for autonomous agents.">
      <Pitch />
      <BackedBy />
      <HowItWorks />
      {/* Proof of life sits right after the explanation: who is already
          using it and who built it, before the longer heist narrative. */}
      <Traction />
      <Team />
      <Heist />
      <WhyNothingCaught />
      <ClosingCta />
    </LandingShell>
  );
}
