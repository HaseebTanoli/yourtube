import "./globals.css";

export const metadata = {
  title: "YouTube Live Views Tracker",
  description:
    "Track top 50 most viewed YouTube videos with near real-time view counts by country.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900">{children}</body>
    </html>
  );
}
