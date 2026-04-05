'use client'
import React, { useState, useEffect } from 'react';

// ==========================================
// ICONOS SVG PROFESIONALES (Premium)
// ==========================================
const IconAdd = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconSearch = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconHome = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#E31E24" : "none"} stroke={active ? "#E31E24" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconOrders = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#E31E24" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>;
const IconWallet = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#E31E24" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="12" y1="10" x2="12" y2="10"></line><line x1="2" y1="10" x2="22" y2="10"></line></svg>;
const IconProfile = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#E31E24" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconCart = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const IconClose = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconTrash = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

export default function KolmaPremium() {
  // ==========================================
  // ESTADOS GLOBALES DE LA APP
  // ==========================================
  const [productos, setProductos] = useState([]);
  const [colecciones, setColecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(0.00); // Billetera inicializada en 0
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('inicio');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  
  const [carrito, setCarrito] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const [telefonoInput, setTelefonoInput] = useState('');
  const [errorTelefono, setErrorTelefono] = useState('');
  const [isProcessingCart, setIsProcessingCart] = useState(false);

  // ==========================================
  // CONEXIÓN CON SHOPIFY (CEREBRO)
  // ==========================================
  useEffect(() => {
    const token = localStorage.getItem('kolma_access_token');
    const userName = localStorage.getItem('kolma_user_name');
    if (token) {
      setUser({ nombre: userName || "Cliente", id: token });
    }

    async function fetchData() {
      try {
        const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'mock.myshopify.com';
        const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || 'mock-token';
        
        if(domain === 'mock.myshopify.com') throw new Error("Entorno de prueba (Canvas)");

        const res = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': accessToken },
          body: JSON.stringify({ 
            query: `{ 
              collections(first: 10) { edges { node { id title } } }
              products(first: 30) { edges { node { id title images(first: 1) { edges { node { url } } } variants(first: 1) { edges { node { id price { amount } } } } } } } 
            }` 
          }),
        });
        
        const { data } = await res.json();
        
        if(data?.collections) {
          setColecciones([{node: {id: 'all', title: 'Todas'}}, ...data.collections.edges]);
        }
        if(data?.products) {
          setProductos(data.products.edges);
        }
        setLoading(false);
      } catch (e) {
        // Datos de respaldo amigables para el Canvas o si fallan las credenciales
        setColecciones([
          { node: { id: 'all', title: 'Todas' } }, { node: { id: 'c1', title: 'Víveres' } },
          { node: { id: 'c2', title: 'Lácteos' } }, { node: { id: 'c3', title: 'Despensa' } }
        ]);
        setProductos([
          { node: { id: '1', title: 'Arroz Premium La Garza 10 Lbs', categoria: 'Despensa', images: { edges: [{ node: { url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300' } }] }, variants: { edges: [{ node: { id: 'gid://shopify/ProductVariant/1', price: { amount: '450.00' } } }] } } },
          { node: { id: '2', title: 'Leche Rica Entera 1 Litro', categoria: 'Lácteos', images: { edges: [{ node: { url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=300' } }] }, variants: { edges: [{ node: { id: 'gid://shopify/ProductVariant/2', price: { amount: '75.00' } } }] } } },
          { node: { id: '3', title: 'Plátano Verde Fresco (Unidad)', categoria: 'Víveres', images: { edges: [{ node: { url: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=300' } }] }, variants: { edges: [{ node: { id: 'gid://shopify/ProductVariant/3', price: { amount: '25.00' } } }] } } }
        ]);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ==========================================
  // MANEJO DE LOGIN (Número Telefónico +1)
  // ==========================================
  const procesarLogin = (e) => {
    e.preventDefault();
    setErrorTelefono('');

    let telLimpio = telefonoInput.replace(/\D/g, ''); 
    let telFormateado = telLimpio;

    if (telLimpio.length === 10) {
      telFormateado = `+1${telLimpio}`;
    } else if (telLimpio.length === 11 && telLimpio.startsWith('1')) {
      telFormateado = `+${telLimpio}`;
    } else {
      setErrorTelefono('Ingresa un número de 10 dígitos (Ej: 8095551234)');
      return;
    }

    // Aquí conectarías con CustomerCreate (API Shopify). Ahora simulamos éxito:
    setUser({ nombre: "Cliente", telefono: telFormateado });
    setIsLoginOpen(false);
  };

  // ==========================================
  // LÓGICA DEL CARRITO (Agregar, Editar, Eliminar)
  // ==========================================
  const agregarAlCarrito = (producto) => {
    const variantId = producto.node.variants.edges[0]?.node.id;
    const price = parseFloat(producto.node.variants.edges[0]?.node.price.amount);
    
    setCarrito(prev => {
      const existe = prev.find(item => item.variantId === variantId);
      if (existe) {
        return prev.map(item => item.variantId === variantId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { 
        id: producto.node.id, 
        title: producto.node.title, 
        price, 
        image: producto.node.images.edges[0]?.node.url, 
        variantId, 
        quantity: 1 
      }];
    });
    setIsCartOpen(true);
  };

  const modificarCantidad = (variantId, delta) => {
    setCarrito(prev => prev.map(item => {
      if (item.variantId === variantId) {
        return { ...item, quantity: item.quantity + delta };
      }
      return item;
    }).filter(item => item.quantity > 0)); // Si llega a 0, se elimina del carrito
  };

  const totalCarrito = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // ==========================================
  // CHECKOUT DIRECTO A SHOPIFY
  // ==========================================
  const procesarCheckout = async () => {
    setIsProcessingCart(true);
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const token = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN;
    
    // Si estamos en entorno de prueba y no hay .env reales
    if (!domain || !token) {
      setTimeout(() => {
        alert("¡Éxito! En el entorno real (Vercel) esto abrirá la página de pago segura para poner la dirección de envío.");
        setIsProcessingCart(false);
      }, 1500);
      return;
    }

    try {
      const lineItems = carrito.map(item => ({ 
        merchandiseId: item.variantId, 
        quantity: item.quantity 
      }));
      
      const res = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'X-Shopify-Storefront-Access-Token': token 
        },
        body: JSON.stringify({
          query: `mutation cartCreate($input: CartInput) { cartCreate(input: $input) { cart { checkoutUrl } userErrors { message } } }`,
          variables: { input: { lines: lineItems } }
        })
      });
      
      const { data } = await res.json();
      const checkoutUrl = data?.cartCreate?.cart?.checkoutUrl;
      const errors = data?.cartCreate?.userErrors;
      
      if (checkoutUrl) {
        // Redirige al checkout nativo de Shopify (Donde piden dirección)
        window.location.href = checkoutUrl; 
      } else {
        alert(errors?.[0]?.message || "Hubo un error creando el pedido. Verifica los productos.");
        setIsProcessingCart(false);
      }
    } catch (error) {
      console.error(error);
      alert("Problema de conexión con Shopify.");
      setIsProcessingCart(false);
    }
  };

  const transicionSuave = 'all 0.3s ease-in-out';

  // ==========================================
  // VISTA PRINCIPAL
  // ==========================================
  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#1F2937', paddingBottom: '90px', width: '100%', height: '100%', overflowX: 'hidden' }}>
      
      {/* HEADER SUPERIOR */}
      <header style={{ backgroundColor: '#FFFFFF', padding: '15px 25px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 20px rgba(227, 30, 36, 0.08)', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ backgroundColor: '#E31E24', width: '8px', height: '28px', borderRadius: '4px' }}></div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: '#E31E24', letterSpacing: '-1.5px' }}>
              KOLMA<span style={{fontWeight: '300'}}>RD</span>
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Ícono de carrito en header */}
            <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer', color: '#111', padding: '5px' }}>
              <IconCart />
              {carrito.length > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-8px', backgroundColor: '#E31E24', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {carrito.length}
                </span>
              )}
            </div>

            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right', display: 'none', '@media (min-width: 600px)': { display: 'block' } }}>
                  <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: '700' }}>MI WALLET</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#E31E24' }}>RD$ {wallet.toFixed(2)}</div>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FEE2E2', border: '2px solid #E31E24', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E31E24', fontWeight: '900', fontSize: '1.1rem' }}>
                  {user.nombre.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* VISTAS CONDICIONALES BASADAS EN LA PESTAÑA ACTIVA */}
      {activeTab === 'inicio' && (
        <>
          {/* HERO BANNER OSCURO (Uber Eats Style) */}
          <section style={{ backgroundColor: '#000000', padding: '60px 25px', color: '#FFFFFF', position: 'relative', overflow: 'hidden', borderBottom: '1px solid #222' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(227,30,36,0.12) 0%, rgba(0,0,0,1) 100%)', zIndex: 1 }}></div>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', position: 'relative', zIndex: 10, animation: 'fadeInUp 0.8s ease-out' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(227,30,36,0.15)', border: '1px solid rgba(227,30,36,0.4)', color: '#FF3B30', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '800', marginBottom: '20px', animation: 'pulse 2.5s infinite' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                ENTREGA EN 45 MINUTOS
              </div>

              <h2 style={{ fontSize: '2.8rem', fontWeight: '900', margin: '0 0 25px 0', lineHeight: 1.1, letterSpacing: '-1.5px' }}>¿Qué necesitas<br/>hoy en Cotuí?</h2>
              
              <div style={{ backgroundColor: '#1F2937', borderRadius: '12px', padding: '6px 15px', display: 'flex', alignItems: 'center', border: '1px solid #374151', width: '100%', maxWidth: '600px', transition: transicionSuave, boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }} onFocus={(e) => e.currentTarget.style.borderColor = '#E31E24'}>
                <div style={{ color: '#9CA3AF', padding: '0 5px' }}><IconSearch /></div>
                <input 
                  type="text" 
                  placeholder="Busca arroz, leche, embutidos..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 10px', fontSize: '1.1rem', color: '#FFF', background: 'transparent' }}
                />
              </div>
            </div>
          </section>

      {/* FILTRO DE CATEGORÍAS */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #F3F4F6', padding: '15px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 25px', display: 'flex', overflowX: 'auto', gap: '12px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {colecciones.map(({ node }) => (
            <button
              key={node.id}
              onClick={() => setCategoriaActiva(node.title)}
              style={{ whiteSpace: 'nowrap', padding: '10px 22px', borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', transition: transicionSuave, border: categoriaActiva === node.title ? '1px solid #E31E24' : '1px solid #E5E7EB', backgroundColor: categoriaActiva === node.title ? '#E31E24' : '#F9FAFB', color: categoriaActiva === node.title ? '#FFFFFF' : '#4B5563', boxShadow: categoriaActiva === node.title ? '0 4px 12px rgba(227, 30, 36, 0.25)' : 'none' }}
            >
              {node.title}
            </button>
          ))}
        </div>
      </section>

      {/* GRILLA DE PRODUCTOS */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 25px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#111', margin: '0 0 25px 0' }}>{categoriaActiva === 'Todas' ? 'Pasillos Destacados' : categoriaActiva}</h3>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280', fontSize: '1.1rem', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #E31E24', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px' }}></div>
            Cargando pasillos...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
            {productos
              .filter(p => categoriaActiva === 'Todas' || p.node.categoria === categoriaActiva || !p.node.categoria)
              .filter(p => p.node.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(({ node }, index) => (
              <div 
                key={node.id} 
                style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '15px', border: '1px solid #E5E7EB', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)', animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both` }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(227,30,36,0.1)'; e.currentTarget.style.borderColor = '#FCA5A5'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                <div style={{ height: '120px', overflow: 'hidden', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={node.images.edges[0]?.node.url} style={{ maxWidth: '100%', maxHeight: '120px', objectFit: 'contain', borderRadius: '8px' }} alt={node.title} />
                </div>
                <h4 style={{ fontSize: '0.85rem', margin: '0 0 10px 0', color: '#374151', height: '36px', overflow: 'hidden', lineHeight: '1.3', fontWeight: '600' }}>{node.title}</h4>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '900', fontSize: '1.1rem', color: '#111' }}>RD${parseFloat(node.variants.edges[0]?.node.price.amount).toFixed(0)}</span>
                  <button 
                    onClick={() => agregarAlCarrito({ node })}
                    style={{ backgroundColor: '#fff', color: '#E31E24', border: '2px solid #E31E24', borderRadius: '10px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: transicionSuave, fontWeight: 'bold' }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#E31E24'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#E31E24'; }}>
                    <IconAdd />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
        </>
      )}

      {/* VISTA: WALLET */}
      {activeTab === 'wallet' && (
        <section style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 25px', animation: 'fadeInUp 0.3s ease-out' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '20px', color: '#111' }}>Mi Billetera</h2>
          
          {!user ? (
            <div style={{ textAlign: 'center', backgroundColor: '#fff', borderRadius: '15px', padding: '40px 20px', border: '1px solid #eee' }}>
              <p style={{ color: '#888', marginBottom: '20px' }}>Inicia sesión para ver tu saldo y recargar.</p>
              <button onClick={() => setIsLoginOpen(true)} style={{ backgroundColor: '#E31E24', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Ingresar ahora</button>
            </div>
          ) : (
            <>
              <div style={{ background: 'linear-gradient(135deg, #E31E24 0%, #900a12 100%)', borderRadius: '20px', padding: '30px', color: '#fff', boxShadow: '0 10px 25px rgba(227,30,36,0.3)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: '600', opacity: 0.9 }}>SALDO DISPONIBLE</p>
                <h3 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900' }}>RD$ {wallet.toFixed(2)}</h3>
              </div>
              <div style={{ marginTop: '30px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '15px', color: '#333' }}>Movimientos Recientes</h4>
                <div style={{ backgroundColor: '#fff', borderRadius: '15px', padding: '30px', textAlign: 'center', color: '#888', border: '1px solid #eee' }}>
                  Aún no tienes movimientos en tu billetera.
                </div>
              </div>
            </>
          )}
        </section>
      )}

      {/* VISTA: PERFIL */}
      {activeTab === 'perfil' && (
        <section style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 25px', animation: 'fadeInUp 0.3s ease-out' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '20px', color: '#111' }}>Mi Perfil</h2>
          
          {!user ? (
            <div style={{ textAlign: 'center', backgroundColor: '#fff', borderRadius: '15px', padding: '40px 20px', border: '1px solid #eee' }}>
              <p style={{ color: '#888', marginBottom: '20px' }}>Inicia sesión para gestionar tus datos y pedidos.</p>
              <button onClick={() => setIsLoginOpen(true)} style={{ backgroundColor: '#E31E24', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Ingresar ahora</button>
            </div>
          ) : (
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '30px', border: '1px solid #eee', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#E31E24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '900', margin: '0 auto 20px' }}>
                {user.nombre.charAt(0)}
              </div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: '#111' }}>{user.nombre}</h3>
              <p style={{ margin: '0 0 30px 0', color: '#6B7280', fontWeight: '500' }}>{user.telefono}</p>
              
              <button onClick={() => {
                setUser(null); 
                localStorage.removeItem('kolma_access_token'); 
                localStorage.removeItem('kolma_user_name');
                setActiveTab('inicio');
              }} style={{ backgroundColor: '#F3F4F6', color: '#E31E24', border: 'none', padding: '14px 25px', borderRadius: '12px', fontWeight: 'bold', width: '100%', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                Cerrar Sesión
              </button>
            </div>
          )}
        </section>
      )}

      {/* ==========================================
          MODAL DE REGISTRO
          ========================================== */}
      {isLoginOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '400px', animation: 'fadeInUp 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900' }}>Ingresar</h3>
              <div onClick={() => setIsLoginOpen(false)} style={{ cursor: 'pointer', color: '#888' }}><IconClose /></div>
            </div>
            
            <form onSubmit={procesarLogin}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem', color: '#333' }}>Número de Teléfono</label>
                <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#f5f5f5', padding: '12px 15px', color: '#666', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>+1</div>
                  <input 
                    type="tel" 
                    placeholder="809 555 0000" 
                    value={telefonoInput}
                    onChange={(e) => setTelefonoInput(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: 'none', outline: 'none', fontSize: '1rem' }}
                  />
                </div>
                {errorTelefono && <p style={{ color: '#E31E24', fontSize: '0.85rem', marginTop: '8px', fontWeight: '600', animation: 'pulse 1s' }}>⚠️ {errorTelefono}</p>}
                <p style={{ color: '#888', fontSize: '0.75rem', marginTop: '8px' }}>Solo ingresa tus 10 números. Nosotros completamos el código de país.</p>
              </div>
              <button type="submit" style={{ width: '100%', backgroundColor: '#E31E24', color: '#fff', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
                Continuar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL DEL CARRITO (Con Editar/Eliminar)
          ========================================== */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(3px)' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '420px', height: '100%', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s ease-out' }}>
            
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconCart /> Tu Pedido
              </h3>
              <div onClick={() => setIsCartOpen(false)} style={{ cursor: 'pointer', color: '#888' }}><IconClose /></div>
            </div>

            {/* Listado de Productos en Carrito */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {carrito.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>Tu canasta está vacía.</div>
              ) : (
                carrito.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #f9f9f9', paddingBottom: '15px' }}>
                    <img src={item.image} style={{ width: '70px', height: '70px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #eee' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#333', lineHeight: '1.2' }}>{item.title}</h4>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <span style={{ fontWeight: '900', color: '#E31E24', fontSize: '1.1rem' }}>RD${item.price}</span>
                        
                        {/* Controles de Cantidad */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#F3F4F6', borderRadius: '8px', padding: '4px' }}>
                          <button onClick={() => modificarCantidad(item.variantId, -1)} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: item.quantity === 1 ? '#E31E24' : '#111' }}>
                            {item.quantity === 1 ? <IconTrash /> : '-'}
                          </button>
                          <span style={{ fontWeight: 'bold', fontSize: '0.95rem', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                          <button onClick={() => modificarCantidad(item.variantId, 1)} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold' }}>
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Carrito (Checkout) */}
            <div style={{ padding: '20px', borderTop: '1px solid #eee', backgroundColor: '#f9fafb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '1.2rem', fontWeight: '900', color: '#111' }}>
                <span>Total:</span>
                <span>RD$ {totalCarrito.toFixed(2)}</span>
              </div>
              <button 
                onClick={procesarCheckout}
                disabled={carrito.length === 0 || isProcessingCart}
                style={{ width: '100%', backgroundColor: carrito.length === 0 ? '#ccc' : '#E31E24', color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: carrito.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: transicionSuave }}>
                {isProcessingCart ? 'Preparando...' : 'Poner Dirección y Pagar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MENÚ INFERIOR */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-around', padding: '12px 0', zIndex: 1000, boxShadow: '0 -6px 20px rgba(0,0,0,0.04)' }}>
        <div onClick={() => setActiveTab('inicio')} style={{ textAlign: 'center', fontSize: '0.7rem', color: activeTab === 'inicio' ? '#E31E24' : '#9CA3AF', fontWeight: '700', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25%' }}>
          <IconHome active={activeTab === 'inicio'} />
          <div style={{ marginTop: '4px' }}>Inicio</div>
        </div>
        <div onClick={() => setIsCartOpen(true)} style={{ textAlign: 'center', fontSize: '0.7rem', color: '#9CA3AF', fontWeight: '600', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25%', position: 'relative' }}>
          <IconOrders active={false} />
          {carrito.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '15px', backgroundColor: '#E31E24', color: '#fff', fontSize: '0.6rem', fontWeight: 'bold', width: '14px', height: '14px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{carrito.length}</span>}
          <div style={{ marginTop: '4px' }}>Mi Pedido</div>
        </div>
        <div onClick={() => setActiveTab('wallet')} style={{ textAlign: 'center', fontSize: '0.7rem', color: activeTab === 'wallet' ? '#E31E24' : '#9CA3AF', fontWeight: '600', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25%' }}>
          <IconWallet active={activeTab === 'wallet'} />
          <div style={{ marginTop: '4px' }}>Wallet</div>
        </div>
        <div onClick={() => setActiveTab('perfil')} style={{ textAlign: 'center', fontSize: '0.7rem', color: activeTab === 'perfil' ? '#E31E24' : '#9CA3AF', fontWeight: '600', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25%' }}>
          <IconProfile active={activeTab === 'perfil'} />
          <div style={{ marginTop: '4px' }}>Perfil</div>
        </div>
      </nav>

      {/* ESTILOS GLOBALES / ANIMACIONES */}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(25px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { 0% { opacity: 0; transform: translateX(100%); } 100% { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
      `}</style>
    </div>
  );
}
