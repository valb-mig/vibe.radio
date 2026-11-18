import type { Metadata, Viewport } from "next"
import { Anton, Geist, Geist_Mono } from "next/font/google"
import { cx } from "@/ui/base/cx"
import { Deck } from "@/ui/deck/deck"
import { Screen } from "@/ui/deck/screen"
import { Theme } from "@/ui/radio/theme"
import { Backdrop } from "@/ui/shell/backdrop"
import { Footer } from "@/ui/shell/footer"
import { Header } from "@/ui/shell/header"
import { Keys } from "@/ui/shell/keys"
import { Wheel } from "@/ui/wheel/wheel"
import "./globals.css"

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" })
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "vibe.radio · GTA VI radio, live",
  description:
    "Every Grand Theft Auto VI radio station, always on air. Tune in and land mid-song, like you just jumped into a car.",
}

export const viewport: Viewport = {
  themeColor: "#07040c",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cx(anton.variable, geist.variable, mono.variable, "antialiased")}>
      <body className="min-h-dvh font-sans">
        <Backdrop />
        <Theme />
        <Keys />
        <Header />
        {children}
        <Footer />
        <Deck />
        <Screen />
        <Wheel />
      </body>
    </html>
  )
}
