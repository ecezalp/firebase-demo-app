import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import Body from "@/components/Body";
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clinic",
  description: "Manage your Patients",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <Head>
        <link rel="icon" type="image/png" href="/icon.png" />
      </Head>
      <body className={inter.className}>
        <ThemeRegistry>
          <Body>{children}</Body>
        </ThemeRegistry>
      </body>
    </html>
  );
}
