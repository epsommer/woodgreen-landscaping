import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import { headers } from "next/headers";
import { MainNav } from "@/components/main-nav";
import {
  isInMaintenanceMode,
  shouldShowMaintenanceForHeaders,
} from "@/lib/maintenance";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();

  // Use centralized maintenance detection - this guarantees consistency
  const isMaintenanceActive =
    isInMaintenanceMode() || shouldShowMaintenanceForHeaders(headersList);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preload" href="https://use.typekit.net/zdt4eix.css" as="style" />
        <link rel="stylesheet" href="https://use.typekit.net/zdt4eix.css" media="all" />
        <link rel="icon" href="/favicon.ico" />
        <title>Woodgreen Landscaping</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if ('fonts' in document) {
                  Promise.all([
                    document.fonts.load('800 101.89px "quincy-cf"'),
                    document.fonts.load('700 40.62px "Late Serif Variable"')
                  ]).then(function() {
                    document.documentElement.classList.add('fonts-loaded');
                  }).catch(function() {
                    document.documentElement.classList.add('fonts-loaded');
                  });
                  setTimeout(function() {
                    document.documentElement.classList.add('fonts-loaded');
                  }, 3000);
                } else {
                  document.documentElement.classList.add('fonts-loaded');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {isMaintenanceActive ? (
            children
          ) : (
            <div className="flex flex-col min-h-screen">
              <MainNav />
              {children}
            </div>
          )}
        </Providers>
      </body>
    </html>
  );
}
