import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  metadataBase: new URL("https://compassguard.xyz"),
  title: "Compass Guard · Execution firewall",
  description:
    "Compass Guard is the execution firewall between autonomous agents and financial execution. It verifies every payment, tool call and transaction against your guardrails before anything reaches the signer.",
  alternates: { canonical: "/" },
  icons: {
    icon: "/compass-tab-logo.png",
    apple: "/compass-brand-logo.png",
  },
  openGraph: {
    title: "Compass Guard · Execution firewall",
    description: "Your agent moves money only where you authorized.",
    url: "/",
    siteName: "Compass Guard",
    type: "website",
  },
};

export const viewport = { themeColor: "#0D1F17" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
