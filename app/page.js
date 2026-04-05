'use client'
import { useState, useEffect } from 'react'

export default function KolmaApp() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [wallet, setWallet] = useState(0)

  // CONEXIÓN AL CEREBRO DE SHOPIFY
  useEffect(() => {
    async function cargarProductos() {
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
        if (data?.products) setProductos(data.products.edges)
        setLoading(false)
      } catch (e) {
        console.error("Error conectando Shopify:", e)
        setLoading(false)
      }
    }
    cargarProductos()
  }, [])

  const handleLogin = () => {
    setUser({ nombre: "Cliente Kolma", id: "001" })
    setWallet(2500.00) // Saldo inicial de prueba en RD$
  }

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER PROFESIONAL ROJO BRAVO */}
      <header style={{ backgroundColor: '#E31E24', color: '#fff', padding: '15px 20px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, letterSpacing: '-1.5px' }}>KOLMA<span style={{fontWeight: '300'}}>RD</span></h1>
          
          {!user ? (
            <button onClick={handleLogin} style={{ backgroundColor: '#fff', color: '#E31E24', border: 'none', padding: '8px 20px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>
              INGRESAR
            </button>
          ) : (
            <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '15px' }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 'bold', opacity: 0.8 }}>MI BILLETERA</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '900' }}>RD$ {wallet.toLocaleString()}</div>
            </div>
          )}
        </div>
      </header>

      {/* BUSCADOR ESTILO PEDIDOS YA */}
      <section style={{ backgroundColor: '#E31E24', padding: '30px 20px', textAlign: 'center', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <input 
            type="text" 
            placeholder="¿Qué necesitas hoy en Cotuí?" 
            style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: 'none', fontSize: '1rem', outline: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
          />
        </div>
      </section>

      {/* GRILLA DE PRODUCTOS (CEREBRO SHOPIFY) */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        <h3 style={{ borderLeft: '5px solid #E31E24', paddingLeft: '12px', color: '#333', fontSize: '1.2rem', marginBottom: '25px' }}>OFERTAS DEL DÍA</h3>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>Sincronizando con los pasillos de Kolma...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
            {productos.map(({ node }) => (
              <div key={node.id} style={{ backgroundColor: '#fff', borderRadius: '15px', padding: '15px', border: '1px solid #f0f0f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '140px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={node.images.edges[0]?.node.url} style={{ maxWidth: '100%', maxHeight: '140px', objectFit: 'contain' }} alt={node.title} />
                </div>
                <h4 style={{ fontSize: '0.85rem', margin: '0 0 10px 0', color: '#555', height: '35px', overflow: 'hidden' }}>{node.title}</h4>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#E31E24' }}>RD${parseFloat(node.variants.edges[0]?.node.price.amount).toFixed(0)}</span>
                  <button style={{ backgroundColor: '#E31E24', color: '#fff', border: 'none', borderRadius: '8px', width: '35px', height: '35px', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>+</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MENÚ INFERIOR (FOOTER MOBILE) */}
      <footer style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: '#fff', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', padding: '12px 0', zIndex: 1000, boxShadow: '0 -2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#E31E24' }}>🏠<br/>Inicio</div>
        <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#999' }}>📦<br/>Pedidos</div>
        <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#999' }}>💳<br/>Billetera</div>
        <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#999' }}>👤<br/>Perfil</div>
      </footer>
    </main>
  )
}
