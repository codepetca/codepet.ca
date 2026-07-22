import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// FontAwesome CSS - prevent flash of large icons
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CodePet",
    template: "%s | CodePet",
  },
  description: "A playful learning companion",
  openGraph: {
    title: "CodePet",
    description: "A playful learning companion",
    url: SITE_URL,
    siteName: "CodePet",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/paw-light.svg", media: "(prefers-color-scheme: light)" },
      { url: "/paw-dark.svg", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/paw-light.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <Header />
          <main className="flex-1 flex items-center justify-center p-2">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
