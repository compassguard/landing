import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

// Title, description and canonical are page-specific now that there is more
// than one landing (/ for Virtuals ACP, /agents for the general pitch) — see
// each page's own metadata export. This stays with what's true site-wide.
export const metadata = {
  metadataBase: new URL("https://compassguard.xyz"),
  icons: {
    icon: "/compass-tab-logo.png",
    apple: "/compass-brand-logo.png",
  },
  openGraph: {
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
