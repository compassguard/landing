import Landing from "../components/Landing";

export const metadata = {
  title: "Compass Guard · Execution firewall",
  description:
    "Compass Guard is the execution firewall between autonomous agents and financial execution. It verifies every payment, tool call and transaction against your guardrails before anything reaches the signer.",
  alternates: { canonical: "/agents" },
  openGraph: {
    title: "Compass Guard · Execution firewall",
    description: "Your agent moves money only where you authorized.",
    url: "/agents",
  },
};

export default function Page() {
  return <Landing />;
}
