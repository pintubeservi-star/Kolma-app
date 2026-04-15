```react
import './globals.css'

export const metadata = {
  title: 'KolmaRD Premium',
  description: 'Supermercado Inteligente en Cotuí',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" async></script>
      </head>
      <body>{children}</body>
    </html>
  )
}

```
