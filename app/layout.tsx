import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import { headers } from "next/headers";

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
  const isMaintenanceMode =
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true" ||
    headersList.get("X-Maintenance-Mode") === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/zdt4eix.css" />
        <link rel="icon" href="/favicon.ico" />
        <title>Woodgreen Landscaping</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {isMaintenanceMode ? (
            children
          ) : (
            <div className="flex flex-col min-h-screen">{children}</div>
          )}
        </Providers>
      </body>
    </html>
  );
}
