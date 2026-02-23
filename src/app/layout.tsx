import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/providers/Providers"
import CustomerChatWidget from "@/components/chat/CustomerChatWidget"
import "@/styles/globals.css"

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
})

export const metadata: Metadata = {
    title: {
        default: "TechCare - Electronics Store",
        template: "%s | TechCare",
    },
    description:
        "TechCare - Your trusted destination for premium electronics with warranty and care services.",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('techcare-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
                    }}
                />
            </head>
            <body className={`${inter.variable} font-sans antialiased`}>
                <Providers>
                    {children}
                    <CustomerChatWidget />
                </Providers>
            </body>
        </html>
    )
}
