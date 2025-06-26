import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

// Optimized font loading with Apple-inspired configuration
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improves loading performance
  preload: true,
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Only preload primary font
  fallback: ["SF Mono", "Monaco", "Cascadia Code", "monospace"],
});

export const metadata: Metadata = {
  title: "فارما بريدج | Pharma Bridge",
  description: "المنصة الرائدة التي تربط الصيادلة الموهوبين بأصحاب الصيدليات في مصر - The leading platform connecting talented pharmacists with pharmacy owners in Egypt",
  keywords: "pharmacy, pharmacist, Egypt, صيدلية, صيدلي, مصر, وظائف, jobs",
  authors: [{ name: "Pharma Bridge Team" }],
  creator: "Pharma Bridge",
  publisher: "Pharma Bridge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/pharma-bridge-icon.svg", type: "image/svg+xml" }],
    apple: [
      { url: "/pharma-bridge-icon.svg", type: "image/svg+xml" }
    ],
  },
  openGraph: {
    title: "فارما بريدج | Pharma Bridge",
    description: "المنصة الرائدة التي تربط الصيادلة الموهوبين بأصحاب الصيدليات في مصر",
    url: "https://pharmabridge.com",
    siteName: "Pharma Bridge",
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "فارما بريدج | Pharma Bridge",
    description: "المنصة الرائدة التي تربط الصيادلة الموهوبين بأصحاب الصيدليات في مصر",
    creator: "@pharmabridge",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
