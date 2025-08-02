import './globals.css'

export const metadata = {
  title: 'StudioMate - Professional Audio Platform',
  description: 'Plateforme professionnelle de gestion audio avec interface neumorphism moderne',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-neu-light to-white dark:from-neu-dark dark:to-gray-900 transition-colors duration-300">
        {children}
      </body>
    </html>
  )
}
