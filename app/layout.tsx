import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { IosInstallHint } from "@/components/IosInstallHint";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sloka Group of Schools — Student Results",
  description:
    "Official student report portal for Sloka — The Global School. View formative and summative results.",
  applicationName: "Sloka Results",
  appleWebApp: {
    capable: true,
    title: "Sloka Results",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [{ url: "/brand/sloka-logo.png", type: "image/png" }],
    apple: [
      {
        url: "/brand/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#004d40" },
    { media: "(prefers-color-scheme: dark)", color: "#004d40" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} flex min-h-dvh flex-col font-sans`}
      >
        <ServiceWorkerRegister />
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <IosInstallHint />
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
