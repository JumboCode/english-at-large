import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { PopupProvider } from "@/lib/context/ConfirmPopupContext";

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

const rubik = localFont({
  src: "./fonts/Rubik-VariableFont_wght.ttf",
  variable: "--font-rubik",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "English at Large",
  description:
    "Connecting volunteers with English language learners in the Greater Boston Area through community programs and resources.",
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
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      dynamic
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${rubik.variable} antialiased`}
        >
          <PopupProvider>{children}</PopupProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
