import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mohamed AbuHamida | AI Engineer | LLMs & RAG Specialist",
    template: "%s | Mohamed AbuHamida",
  },
  description:
    "Mohamed AbuHamida is an AI Engineer specializing in Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), and scalable AI systems. Instructor at Digital Knights.",
  keywords: [
    "Mohamed AbuHamida",
    "AI Engineer",
    "LLMs",
    "RAG Systems",
    "Machine Learning",
    "Artificial Intelligence",
    "Vector Databases",
    "LangChain",
    "AI Instructor",
    "Digital Knights",
  ],
  authors: [{ name: "Mohamed AbuHamida" }],
  creator: "Mohamed AbuHamida",
  metadataBase: new URL("https://mohamed-abuhamida.vercel.app/"), // غيرها بدومينك
  openGraph: {
    title: "Mohamed AbuHamida | AI Engineer",
    description:
      "AI Engineer specializing in LLMs, RAG systems, and intelligent AI architectures.",
    url: "https://mohamed-abuhamida.vercel.app/",
    siteName: "Mohamed AbuHamida Portfolio",
    images: [
      {
        url: "/og-image.png", // اعمل صورة OG لاحقًا
        width: 1200,
        height: 630,
        alt: "Mohamed AbuHamida - AI Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed AbuHamida | AI Engineer",
    description:
      "Building intelligent systems using LLMs, RAG, and scalable AI pipelines.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg font-sans text-text dark:bg-bg-dark dark:text-text-dark flex min-h-screen flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
