```react
import './globals.css'

export const metadata = {
  title: 'KolmaRD - Premium Supermarket',
  description: 'El supermercado inteligente de Cotuí',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" defer></script>
      </head>
      <body>{children}</body>
    </html>
  )
}

```
