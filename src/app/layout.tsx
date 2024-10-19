import type { Metadata } from "next";
import { Open_Sans } from 'next/font/google';
import "@coinbase/onchainkit/styles.css";
import "./globals.css";
import OnchainProviders from "@/providers/OnchainProviders";

const open_sans = Open_Sans({ subsets: ['latin'] });


export const metadata: Metadata = {
  title: "BridgePay",
  description: "Where you can get your Farcaster ACCOUNT created for you with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${open_sans.className} bg-[#f2f4f7]`}>
        <OnchainProviders>{children}</OnchainProviders>
      </body>
    </html>
  );
}
