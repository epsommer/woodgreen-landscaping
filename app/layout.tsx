import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";
import { LayoutClient } from "@/components/layout-client";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Woodgreen Landscaping",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://use.typekit.net/zdt4eix.js"
          strategy="beforeInteractive"
        />
        <Script
          id="typekit-load"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{Typekit.load({async:false});}catch(e){}`,
          }}
        />
        <Providers>
          <LayoutClient>{children}</LayoutClient>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
