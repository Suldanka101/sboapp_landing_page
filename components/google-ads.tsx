"use client"

import { useEffect } from "react"

interface GoogleAdProps {
  adSlot: string
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal"
  fullWidthResponsive?: boolean
  className?: string
}

export function GoogleAd({ adSlot, adFormat = "auto", fullWidthResponsive = true, className = "" }: GoogleAdProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      if (typeof window !== "undefined" && window.adsbygoogle) {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error("AdSense error:", error)
    }
  }, [])

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  )
}

// Privacy-compliant cookie consent component
export function CookieConsent() {
  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Show cookie consent banner
      const banner = document.getElementById("cookie-consent-banner")
      if (banner) {
        banner.style.display = "block"
      }
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted")
    const banner = document.getElementById("cookie-consent-banner")
    if (banner) {
      banner.style.display = "none"
    }
    // Initialize ads after consent
    // @ts-ignore
    if (typeof window !== "undefined" && window.adsbygoogle) {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  }

  return (
    <div
      id="cookie-consent-banner"
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg z-50 hidden"
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          We use cookies to improve your experience and show relevant ads. By continuing to use our site, you agree to
          our use of cookies.
        </p>
        <div className="flex gap-2">
          <button
            onClick={acceptCookies}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors"
          >
            Accept
          </button>
          <button className="border border-border px-4 py-2 rounded-md text-sm hover:bg-muted transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}
