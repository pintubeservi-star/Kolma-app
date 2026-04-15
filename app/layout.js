import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Aquí va tu script de PWA que ya tienes */}
      </head>
      {/* QUITAMOS EL STYLE DEL BODY PARA QUE TAILWIND TOME EL CONTROL */}
      <body>
        {children}
      </body>
    </html>
  )
}
