import "./globals.css";

export const metadata = {
  title: 'KolmaRD',
  description: 'Lo mejor de Cotuí',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
