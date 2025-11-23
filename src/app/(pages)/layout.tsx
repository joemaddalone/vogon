import type { Metadata } from "next";
import { Providers } from "@/components/context/Providers";
import { Navigation } from "@/components/Navigation";
import "@/styles/globals.css";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "vogon",
  description: "Manage poster artwork for your Plex movies",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await api.session.get();
  if (session.error) {
    console.error(session.error);
  }
  const servers = await api.server.get();
  if (servers.error) {
    console.error(servers.error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <Providers>
          <Navigation session={session?.data} servers={servers?.data} />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
