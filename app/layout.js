export const metadata = {
  title: 'Kolma RD | Supermercado Digital',
  description: 'Delivery de colmado en Cotuí',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#000' }}>
        {children}
      </body>
    </html>
  )
}
