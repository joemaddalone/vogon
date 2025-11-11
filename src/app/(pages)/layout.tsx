import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Navigation } from "@/components/Navigation";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "vogon",
  description: "Manage poster artwork for your Plex movies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <Providers>
          <Navigation />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
