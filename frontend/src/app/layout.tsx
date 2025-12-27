import { Providers } from "@/components/Providers";
import './globals.css'
import type { Metadata } from 'next'
import { Rowdies } from 'next/font/google'

const rowdies = Rowdies({ 
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Proof Of Impact',
  description: 'Turning Corporate Promises into Public Proof',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={rowdies.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
