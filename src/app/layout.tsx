import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Artemis Trader — Automated Forex & Gold Trading",
  description:
    "Connect your XM MT5 account and let Artemis trade Forex and Gold for you. Trading Automation & Peace of Mind.",
  keywords: ["forex trading", "automated trading", "MT5 bot", "XM broker", "gold trading"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Artemis Trader",
    description: "Trading Automation & Peace of Mind",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('artemis-theme')||'light';var h=document.documentElement;h.classList.toggle('dark',t==='dark');h.classList.add('no-transition');requestAnimationFrame(function(){requestAnimationFrame(function(){h.classList.remove('no-transition');});});})()`,
          }}
        />
      </head>
      <body className={`${jakarta.variable} ${mono.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
