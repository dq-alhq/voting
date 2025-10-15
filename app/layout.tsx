import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";
import { fontMono, fontSans } from "@/app/fonts";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://votty.vercel.app",
  ),
  title: {
    default: "Votty",
    template: "%s | Votty",
  },
  description: "Aplikasi Voting Realtime",
  alternates: {
    canonical: "/",
  },
  keywords: ["voting"],
  authors: [
    {
      name: "Arch",
      url: "https://archproperty.id",
    },
  ],
  creator: "Arch",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export const revalidate = 60;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${fontMono.variable} ${fontSans.variable}`}
    >
      <head>
        {/* Google Tag Manager */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17524467920"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
                       window.dataLayer = window.dataLayer || [];
                       function gtag(){dataLayer.push(arguments);}
                       gtag('js', new Date());
                       gtag('config', 'AW-17524467920');
                     `}
        </Script>
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
