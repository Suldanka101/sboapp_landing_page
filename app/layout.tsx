import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Suspense } from "react"
import Script from "next/script"
import "./globals.css"

export const metadata: Metadata = {
  title: "SBO APP - Your Digital Library",
  description:
    "Transform your mobile device into a premium digital library with SBO APP. Access thousands of books, enjoy personalized recommendations, and read offline anywhere, anytime.",
  keywords: "digital library, ebooks, mobile reading, book app, offline reading, book recommendations, reading app",
  authors: [{ name: "SBO APP Team" }],
  creator: "SBO APP",
  publisher: "SBO APP",
  robots: "index, follow",
  openGraph: {
    title: "SBO APP - Your Digital Library",
    description: "Transform your mobile device into a premium digital library with SBO APP",
    type: "website",
    locale: "en_US",
    siteName: "SBO APP",
  },
  twitter: {
    card: "summary_large_image",
    title: "SBO APP - Your Digital Library",
    description: "Transform your mobile device into a premium digital library with SBO APP",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
        <Script id="structured-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "MobileApplication",
              "name": "SBO APP",
              "description": "Transform your mobile device into a premium digital library with SBO APP",
              "applicationCategory": "BookApplication",
              "operatingSystem": "iOS, Android",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "2000000"
              }
            }
          `}
        </Script>
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
