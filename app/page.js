'use client'
import { useState } from 'react'

export default function Home() {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')

  const registrarUsuario = async (e) => {
    e.preventDefault()
    alert(`Registrando a ${nombre}... (Aquí conectaremos con Prisma en el siguiente paso)`)
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      {/* Header Minimalista */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '800px', margin: '0 auto 60px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px' }}>KOLMA<span style={{ color: '#00ff00' }}>RD</span></h1>
        <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Cotuí, RD</span>
      </nav>

      {/* Hero Section */}
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '20px', lineHeight: '1.1' }}>Tu supermercado digital, <br/>directo a casa.</h2>
        <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '40px' }}>Regístrate para ser el primero en pedir por WhatsApp.</p>

        {/* Formulario de Registro */}
        <form onSubmit={registrarUsuario} style={{ backgroundColor: '#111', padding: '30px', borderRadius: '15px', border: '1px solid #333', textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Nombre Completo</label>
            <input 
              type="text" 
              placeholder="Ej. Juan Pérez" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{ width: '100%', padding: '12px', backgroundColor: '#000', border: '1px solid #444', color: '#fff', borderRadius: '8px' }}
              required 
            />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>WhatsApp</label>
            <input 
              type="tel" 
              placeholder="809-000-0000" 
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              style={{ width: '100%', padding: '12px', backgroundColor: '#000', border: '1px solid #444', color: '#fff', borderRadius: '8px' }}
              required 
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: '0.3s' }}>
            UNIRME AHORA
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer style={{ marginTop: '100px', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
        &copy; 2026 Kolma RD - El supermercado del futuro.
      </footer>
    </main>
  )
}
