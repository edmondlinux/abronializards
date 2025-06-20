import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { ClerkProvider } from "@clerk/nextjs";
import GiveawayModal from "@/components/GiveawayModal";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_SITE_URL || 'https://abronializards.com'
    : 'http://localhost:3000'),
  title: {
    default: "Abronia Lizards | Captive-Bred Graminea, Taeniata & More — Expert Care & Supplies",
    template: "%s | Abronia Lizards"
  },
  description: "Shop premium captive-bred Abronia lizards including Graminea, Taeniata, and Mixteca. Trusted breeders with expert care guides, terrarium setup tips, and top reptile supplies. Safe shipping. Healthy lizards guaranteed.",
  keywords: [
    "abronia lizards", "abronia graminea", "abronia taeniata", "abronia mixteca",
    "captive bred lizards", "arboreal lizards", "exotic reptiles", 
    "reptile breeders", "reptile care", "terrarium setup", 
    "live reptile shipping", "herpetology supplies"
  ],
  authors: [{ name: "Abronia Lizards" }],
  creator: "Abronia Lizards",
  publisher: "Abronia Lizards",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Abronia Lizards',
    title: 'Abronia Lizards | Healthy Captive-Bred Lizards, Expert Care & Reptile Supplies',
    description: 'Your trusted source for Abronia lizards and arboreal reptile care. Expert breeding, live shipping, and premium supplies for Graminea, Taeniata, Mixteca & more.',
    images: [
      {
        url: 'https://ik.imagekit.io/14iir4o77/IMG_9610.png?updatedAt=1748940318208',
        width: 1200,
        height: 630,
        alt: 'Captive-Bred Abronia Graminea in Naturalistic Terrarium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abronia Lizards | Captive-Bred & Expert-Cared Arboreal Reptiles',
    description: 'Buy healthy captive-bred Abronia lizards with expert care support. Graminea, Taeniata, Mixteca & more with live delivery and setup tips.',
    creator: '@abronializards',
    images: ['https://ik.imagekit.io/14iir4o77/IMG_9610.png?updatedAt=1748940318208', 'https://ik.imagekit.io/14iir4o77/IMG_9610.png?updatedAt=1748940318208'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'pets',
  classification: 'business',
  alternates: {
    canonical: '/',
  }
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" content="noindex">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AppContextProvider>
            {children}
            <GiveawayModal />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#10b981',
                  },
                },
                error: {
                  style: {
                    background: '#ef4444',
                  },
                },
              }}
            />
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}