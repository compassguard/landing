import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: "Compass Guard",
  description: "Execution firewall for autonomous agents.",
};

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
