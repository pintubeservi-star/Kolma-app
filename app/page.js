'use client'
import { useState, useEffect } from 'react'

export default function KolmaApp() {
  const [user, setUser] = useState(null)
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [walletBalance, setWalletBalance] = useState(0)

  // 1. Cargar Productos de Shopify
  useEffect(() => {
    async function loadShopify() {
      try {
        const res = await fetch(`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN,
          },
          body: JSON.stringify({
            query: `{
              products(first: 12) {
                edges {
                  node {
                    id
                    title
                    images(first: 1) { edges { node { url } } }
                    variants(first: 1) { edges { node { price { amount } } } }
                  }
                }
              }
            }`
          }),
        })
        const { data } = await res.json()
        setProductos(data.products.edges)
        setLoading(false)
      } catch (e) { console.error("Error Shopify:", e) }
    }
    loadShopify()
  }, [])

  // 2. Simulación de Login y Wallet (Esto se conectará con Prisma luego)
  const handleLogin = () => {
    setUser({ name: "Cliente Kolma", phone: "809-000-0000" })
    setWalletBalance(1500.00) // Saldo de prueba
  }

  return (
    <main style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', fontFamily: 'Segoe UI, Roboto, sans-serif' }}>
      
      {/* HEADER PROFESIONAL (Estilo Bravo/PedidosYa) */}
      <header style={{ backgroundColor: '#E31E24', color: '#fff', padding: '12px 20px', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, letterSpacing: '-1.5px' }}>KOLMA<span style={{fontWeight: '300'}}>RD</span></h1>
          
          {!user ? (
            <button onClick={handleLogin} style={{ backgroundColor: '#fff', color: '#E31E24', border: 'none', padding: '8px 18px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>
              Iniciar Sesión
            </button>
          ) : (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>MI BILLETERA</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>RD$ {walletBalance.toLocaleString()}</div>
            </div>
          )}
        </div>
      </header>

      {/* BUSCADOR Y CATEGORÍAS */}
      <section style={{ backgroundColor: '#E31E24', padding: '20px', borderBottomLeftRadius: '25px', borderBottomRightRadius: '25px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <input type="text" placeholder="Busca productos en Cotuí..." style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: 'none', fontSize: '1rem', outline: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
        </div>
      </section>

      {/* CUERPO DE LA APP */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#333', marginBottom: '20px', fontWeight: '700' }}>Productos Destacados</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Cargando pasillos...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
            {productos.map(({ node }) => (
              <div key={node.id} style={{ backgroundColor: '#fff', borderRadius: '15px', padding: '15px', border: '1px solid #eee', transition: 'transform 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <img src={node.images.edges[0]?.node.url} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <h3 style={{ fontSize: '0.85rem', color: '#555', margin: '0 0 10px 0', height: '35px', overflow: 'hidden' }}>{node.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#333' }}>RD${parseFloat(node.variants.edges[0]?.node.price.amount).toFixed(2)}</span>
                  <button style={{ backgroundColor: '#E31E24', color: '#fff', border: 'none', borderRadius: '8px', padding: '5px 12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>+</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NAVEGACIÓN INFERIOR (Mobile First) */}
      <nav style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: '#fff', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', padding: '12px 0', boxShadow: '0 -2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', color: '#E31E24', fontSize: '0.7rem' }}>🏠<br/>Inicio</div>
        <div style={{ textAlign: 'center', color: '#888', fontSize: '0.7rem' }}>📦<br/>Pedidos</div>
        <div style={{ textAlign: 'center', color: '#888', fontSize: '0.7rem' }}>💳<br/>Wallet</div>
        <div style={{ textAlign: 'center', color: '#888', fontSize: '0.7rem' }}>👤<br/>Perfil</div>
      </nav>
    </main>
  )
}
