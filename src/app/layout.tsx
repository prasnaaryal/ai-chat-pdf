import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { FileProvider } from "@/contexts/FileContext"; // Adjust the path as necessary

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI-Chat-pdf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <FileProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </FileProvider>
    </ClerkProvider>
  );
}
