export const metadata = {
  title: 'Kolma RD | Supermercado Digital',
  description: 'Tu supermercado digital en Cotuí. Calidad y rapidez en tus manos.',
  manifest: '/manifest.json',
  themeColor: '#E31E24',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kolma RD',
  },
  icons: {
    apple: '/icon-192x192.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('Kolma RD PWA lista');
                  }).catch(function(err) {
                    console.log('PWA Error:', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#000' }}>
        {children}
      </body>
    </html>
  )
}
