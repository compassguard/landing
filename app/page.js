import VirtualsLanding from "./components/VirtualsLanding";

export const metadata = {
  title: "Compass Guard · Mandates for ACP agents",
  description:
    "Compass Guard checks every ACP job against your mandate — provider, budget, settlement token — before your agent signs the Proof of Agreement and escrow funds.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Compass Guard · Mandates for ACP agents",
    description: "Your ACP agent pays only the providers you authorized.",
    url: "/",
  },
};

export default function Page() {
  return <VirtualsLanding />;
}
