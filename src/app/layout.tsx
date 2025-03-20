import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google"; 

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins", 
});

export const metadata: Metadata = {
  title: "RedditLens",
  description: "User Insights with AI-Powered Analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} dark`}>
      <body className="antialiased font-poppins bg-n eutral-900">
        {children}
      </body>
    </html>
  );
}