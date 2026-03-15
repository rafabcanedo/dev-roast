import type { Metadata } from "next";
import { IBM_Plex_Mono, JetBrains_Mono } from "next/font/google";
import { Navbar, NavbarBrand, NavbarLink, NavbarLinks } from "@/components/ui/navbar";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "devroast",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${jetbrainsMono.variable} ${ibmPlexMono.variable}`}
    >
      <body className="min-h-screen bg-page text-content">
        <Navbar>
          <NavbarBrand />
          <NavbarLinks>
            <NavbarLink href="/leaderboard">leaderboard</NavbarLink>
          </NavbarLinks>
        </Navbar>
        <main>{children}</main>
      </body>
    </html>
  );
}
