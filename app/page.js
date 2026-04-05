'use client'
import React, { useState, useEffect } from 'react';

// ==========================================
// ICONOS SVG PROFESIONALES (Premium)
// ==========================================
const IconAdd = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconSearch = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconHome = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#E31E24" : "none"} stroke={active ? "#E31E24" : "#9CA3AF"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconOrders = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#E31E24" : "#9CA3AF"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const IconWallet = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#E31E24" : "#9CA3AF"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>;
const IconProfile = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#E31E24" : "#9CA3AF"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconCart = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const IconClose = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconLogout = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

export default function App() {
  // ==========================================
  // ESTADOS GLOBALES
  // ==========================================
  const [productos, setProductos] = useState([]);
  const [colecciones, setColecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(0.00); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('inicio');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  
  const [carrito, setCarrito] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', direccion: '' });
  const [errorForm, setErrorForm] = useState('');
  const [isProcessingCart, setIsProcessingCart] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // CARGAR DATOS INICIALES
  // ==========================================
  useEffect(() => {
    const token = localStorage.getItem('kolma_access_token');
    if (token) {
      setUser({ 
        nombre: localStorage.getItem('kolma_user_name'), 
        telefono: localStorage.getItem('kolma_user_phone'), 
        email: localStorage.getItem('kolma_user_email'), 
        direccion: localStorage.getItem('kolma_user_address'), 
        id: token 
      });
      setFormData({ 
        nombre: localStorage.getItem('kolma_user_name'), 
        telefono: localStorage.getItem('kolma_user_phone'), 
        email: localStorage.getItem('kolma_user_email'), 
        direccion: localStorage.getItem('kolma_user_address') 
      });
    }

    async function fetchData() {
      try {
        const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
        const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN;
        if(!domain || !accessToken) throw new Error("Config missing");
        const res = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': accessToken },
          body: JSON.stringify({ 
            query: `{ 
              collections(first: 10) { edges { node { id title } } }
              products(first: 40) { edges { node { id title images(first: 1) { edges { node { url } } } variants(first: 1) { edges { node { id price { amount } } } } } } } 
            }` 
          }),
        });
        const { data } = await res.json();
        if(data?.collections) setColecciones([{node: {id: 'all', title: 'Todas'}}, ...data.collections.edges]);
        if(data?.products) setProductos(data.products.edges);
        setLoading(false);
      } catch (e) {
        setColecciones([{ node: { id: 'all', title: 'Todas' } }, { node: { id: 'c1', title: 'Víveres' } }, { node: { id: 'c2', title: 'Lácteos' } }]);
        setProductos([
          { node: { id: '1', title: 'Arroz Premium La Garza 10 Lbs', images: { edges: [{ node: { url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300' } }] }, variants: { edges: [{ node: { id: 'v1', price: { amount: '450.00' } } }] } } },
          { node: { id: '2', title: 'Leche Rica Entera 1 Litro', images: { edges: [{ node: { url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=300' } }] }, variants: { edges: [{ node: { id: 'v2', price: { amount: '75.00' } } }] } } },
          { node: { id: '3', title: 'Plátano Maduro Unidad', images: { edges: [{ node: { url: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=300' } }] }, variants: { edges: [{ node: { id: 'v3', price: { amount: '22.00' } } }] } } },
          { node: { id: '4', title: 'Aceite Crisol 64oz', images: { edges: [{ node: { url: 'https://images.unsplash.com/photo-1620619894458-150244435133?auto=format&fit=crop&q=80&w=300' } }] }, variants: { edges: [{ node: { id: 'v4', price: { amount: '315.00' } } }] } } }
        ]);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ==========================================
  // LOGICA DE REGISTRO / SHOPIFY +1
  // ==========================================
  const procesarRegistro = async (e) => {
    if(e) e.preventDefault();
    setIsSubmitting(true);
    setErrorForm('');

    let telLimpio = formData.telefono.replace(/\D/g, ''); 
    let telFormateado = telLimpio;

    if (telLimpio.length === 10) telFormateado = `+1${telLimpio}`;
    else if (telLimpio.length === 11 && telLimpio.startsWith('1')) telFormateado = `+${telLimpio}`;
    else {
      setErrorForm('El teléfono debe tener 10 dígitos.');
      setIsSubmitting(false);
      return;
    }

    localStorage.setItem('kolma_user_name', formData.nombre);
    localStorage.setItem('kolma_user_phone', telFormateado);
    localStorage.setItem('kolma_user_email', formData.email);
    localStorage.setItem('kolma_user_address', formData.direccion);
    localStorage.setItem('kolma_access_token', 'session-' + Date.now());

    setUser({ nombre: formData.nombre, telefono: telFormateado, email: formData.email, direccion: formData.direccion, id: 'session-' + Date.now() });
    setIsLoginOpen(false);
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setFormData({ nombre: '', email: '', telefono: '', direccion: '' });
    setActiveTab('inicio');
  };

  const agregarAlCarrito = (producto) => {
    const variantId = producto.node.variants.edges[0]?.node.id;
    const price = parseFloat(producto.node.variants.edges[0]?.node.price.amount);
    setCarrito(prev => {
      const existe = prev.find(item => item.variantId === variantId);
      if (existe) return prev.map(item => item.variantId === variantId ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { id: producto.node.id, title: producto.node.title, price, image: producto.node.images.edges[0]?.node.url, variantId, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const procesarCheckout = async () => {
    if (!user) { setIsCartOpen(false); setIsLoginOpen(true); return; }
    setIsProcessingCart(true);
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const token = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN;
    if (!domain || !token) {
      setTimeout(() => { alert("Redirigiendo al checkout seguro..."); setIsProcessingCart(false); }, 1500);
      return;
    }
    try {
      const lineItems = carrito.map(item => ({ merchandiseId: item.variantId, quantity: item.quantity }));
      const res = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
        body: JSON.stringify({
          query: `mutation cartCreate($input: CartInput) { cartCreate(input: $input) { cart { checkoutUrl } } }`,
          variables: { input: { lines: lineItems } }
        })
      });
      const { data } = await res.json();
      if (data?.cartCreate?.cart?.checkoutUrl) window.location.href = data.cartCreate.cart.checkoutUrl;
    } catch (e) { setIsProcessingCart(false); }
  };

  const totalCarrito = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const transicionSuave = 'all 0.25s ease-in-out';

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1F2937', paddingBottom: '100px' }}>
      
      {/* HEADER */}
      <header style={{ backgroundColor: '#FFFFFF', padding: '15px 25px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 20px rgba(227, 30, 36, 0.08)', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ backgroundColor: '#E31E24', width: '8px', height: '28px', borderRadius: '4px' }}></div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: '#E31E24', letterSpacing: '-1.5px' }}>KOLMA<span style={{fontWeight: '300'}}>RD</span></h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer', color: '#111' }}>
              <IconCart />
              {carrito.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-8px', backgroundColor: '#E31E24', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{carrito.length}</span>}
            </div>
            {!user ? (
              <button onClick={() => setIsLoginOpen(true)} style={{ backgroundColor: '#E31E24', color: '#FFFFFF', border: 'none', padding: '10px 22px', borderRadius: '25px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' }}>Ingresar</button>
            ) : (
              <div onClick={() => setActiveTab('perfil')} style={{ cursor: 'pointer', width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#FEE2E2', border: '2px solid #E31E24', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E31E24', fontWeight: '900' }}>{user.nombre.charAt(0)}</div>
            )}
          </div>
        </div>
      </header>

      {/* VISTA INICIO */}
      {activeTab === 'inicio' && (
        <>
          <section style={{ backgroundColor: '#000000', padding: '60px 25px', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(227,30,36,0.12) 0%, rgba(0,0,0,1) 100%)', zIndex: 1 }}></div>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', position: 'relative', zIndex: 10 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(227,30,36,0.15)', border: '1px solid rgba(227,30,36,0.4)', color: '#FF3B30', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '800', marginBottom: '20px', animation: 'pulse 2.5s infinite' }}>ENTREGA EN 45 MINUTOS</div>
              <h2 style={{ fontSize: '2.8rem', fontWeight: '900', margin: '0 0 10px 0', lineHeight: 1.1 }}>El súper de Cotuí<br/>en 45 minutos.</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.8, margin: '0 0 25px 0' }}>Fresco, rápido y directo a tu puerta.</p>
              <div style={{ backgroundColor: '#1F2937', borderRadius: '12px', padding: '6px 15px', display: 'flex', alignItems: 'center', border: '1px solid #374151', width: '100%', maxWidth: '600px' }}>
                <div style={{ color: '#9CA3AF', padding: '0 5px' }}><IconSearch /></div>
                <input type="text" placeholder="¿Qué necesitas hoy?" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 10px', fontSize: '1.1rem', color: '#FFF', background: 'transparent' }} />
              </div>
            </div>
          </section>

          {/* GRID DE PRODUCTOS (Corregido: más compacto y profesional) */}
          <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 15px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', 
              gap: '12px',
              paddingBottom: '20px'
            }}>
              {loading ? <p>Sincronizando pasillos...</p> : productos.filter(p => p.node.title.toLowerCase().includes(searchTerm.toLowerCase())).map(({ node }, index) => (
                <div 
                  key={node.id} 
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '14px', 
                    padding: '14px', 
                    border: '1px solid #E5E7EB', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    transition: transicionSuave,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }} 
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.05)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}
                >
                  <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <img src={node.images.edges[0]?.node.url} style={{ maxWidth: '100%', maxHeight: '120px', objectFit: 'contain' }} />
                  </div>
                  <h4 style={{ 
                    fontSize: '0.82rem', 
                    margin: '0 0 10px 0', 
                    height: '36px', 
                    overflow: 'hidden', 
                    fontWeight: '600',
                    lineHeight: '1.2',
                    color: '#374151'
                  }}>{node.title}</h4>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '800', fontSize: '1.15rem', color: '#111' }}>RD${parseFloat(node.variants.edges[0]?.node.price.amount).toFixed(0)}</span>
                    <button 
                      onClick={() => agregarAlCarrito({ node })} 
                      style={{ 
                        backgroundColor: '#fff', 
                        color: '#E31E24', 
                        border: '1.5px solid #E31E24', 
                        borderRadius: '10px', 
                        width: '34px', 
                        height: '34px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: transicionSuave
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#E31E24'; e.currentTarget.style.color = '#fff'; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#E31E24'; }}
                    >
                      <IconAdd />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* VISTA WALLET */}
      {activeTab === 'wallet' && (
        <section style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 25px' }}>
          <h2 style={{ fontWeight: '900', marginBottom: '20px', fontSize: '1.8rem' }}>Mi Billetera</h2>
          <div style={{ background: 'linear-gradient(135deg, #E31E24 0%, #900a12 100%)', borderRadius: '24px', padding: '35px', color: '#fff', boxShadow: '0 12px 30px rgba(227,30,36,0.3)', position: 'relative', overflow: 'hidden' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', opacity: 0.8, letterSpacing: '1px' }}>SALDO ACUMULADO</p>
            <h3 style={{ margin: '15px 0', fontSize: '2.8rem', fontWeight: '900' }}>RD$ {wallet.toFixed(2)}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>{user ? user.nombre.toUpperCase() : 'CLIENTE KOLMA'}</p>
          </div>
        </section>
      )}

      {/* VISTA PERFIL */}
      {activeTab === 'perfil' && (
        <section style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontWeight: '900', fontSize: '1.8rem', margin: 0 }}>Mi Perfil</h2>
            {user && <button onClick={handleLogout} style={{ color: '#E31E24', background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><IconLogout /> Salir</button>}
          </div>
          {user ? (
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '30px', border: '1px solid #eee' }}>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#999', marginBottom: '8px' }}>NOMBRE</label><input name="nombre" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '1rem', fontWeight: '600' }} /></div>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#999', marginBottom: '8px' }}>DIRECCIÓN EN COTUÍ</label><textarea name="direccion" value={formData.direccion} onChange={(e) => setFormData({...formData, direccion: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '1rem', fontWeight: '600', height: '80px', resize: 'none' }} /></div>
              <button onClick={procesarRegistro} style={{ width: '100%', backgroundColor: '#111', color: '#fff', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Actualizar Datos</button>
            </div>
          ) : <p style={{ textAlign: 'center', padding: '50px' }}>Inicia sesión para gestionar tu perfil.</p>}
        </section>
      )}

      {/* REGISTRO MODAL */}
      {isLoginOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ backgroundColor: '#fff', padding: '35px', borderRadius: '24px', width: '90%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}><h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900' }}>Bienvenido</h3><div onClick={() => setIsLoginOpen(false)} style={{ cursor: 'pointer', color: '#999' }}><IconClose /></div></div>
            <form onSubmit={procesarRegistro}>
              <input name="nombre" placeholder="Nombre" required value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: '15px' }} />
              <input name="email" type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: '15px' }} />
              <div style={{ display: 'flex', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden', marginBottom: '15px' }}><div style={{ backgroundColor: '#F3F4F6', padding: '14px', fontWeight: 'bold' }}>+1</div><input name="telefono" placeholder="8090000000" required value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} style={{ width: '100%', padding: '14px', border: 'none' }} /></div>
              <input name="direccion" placeholder="Dirección en Cotuí" required value={formData.direccion} onChange={(e) => setFormData({...formData, direccion: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: '20px' }} />
              {errorForm && <p style={{ color: '#E31E24', fontWeight: 'bold', fontSize: '0.8rem' }}>{errorForm}</p>}
              <button type="submit" disabled={isSubmitting} style={{ width: '100%', backgroundColor: '#E31E24', color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: '900' }}>{isSubmitting ? 'Cargando...' : 'REGISTRARME'}</button>
            </form>
          </div>
        </div>
      )}

      {/* CARRITO DRAWER */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(3px)' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '400px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h3 style={{ margin: 0, fontWeight: '900' }}>Tu Canasta</h3><div onClick={() => setIsCartOpen(false)} style={{ cursor: 'pointer' }}><IconClose /></div></div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {carrito.length === 0 ? <p style={{ textAlign: 'center', marginTop: '50px', color: '#999' }}>Aún no hay productos.</p> : carrito.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                  <img src={item.image} style={{ width: '50px', height: '50px', objectFit: 'contain', border: '1px solid #eee', borderRadius: '8px' }} />
                  <div style={{ flex: 1 }}><h4 style={{ margin: '0 0 5px 0', fontSize: '0.85rem' }}>{item.title}</h4><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontWeight: '800', color: '#E31E24' }}>RD${item.price}</span><span>x{item.quantity}</span></div></div>
                </div>
              ))}
            </div>
            <div style={{ padding: '20px', borderTop: '1px solid #eee', backgroundColor: '#f9fafb' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.3rem', fontWeight: '900' }}><span>Total:</span><span>RD$ {totalCarrito.toFixed(2)}</span></div><button onClick={procesarCheckout} disabled={carrito.length === 0 || isProcessingCart} style={{ width: '100%', backgroundColor: '#E31E24', color: '#fff', padding: '18px', borderRadius: '15px', border: 'none', fontWeight: '900' }}>PAGAR</button></div>
          </div>
        </div>
      )}

      {/* MENÚ INFERIOR */}
      <nav style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: '#FFFFFF', 
        borderTop: '1px solid #F1F1F1', 
        display: 'flex', 
        justifyContent: 'space-around', 
        alignItems: 'center',
        height: '75px',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 1000, 
        boxShadow: '0 -8px 25px rgba(0,0,0,0.04)' 
      }}>
        <div onClick={() => setActiveTab('inicio')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, cursor: 'pointer' }}>
          <IconHome active={activeTab === 'inicio'} />
          <span style={{ fontSize: '0.75rem', fontWeight: activeTab === 'inicio' ? '800' : '500', marginTop: '5px', color: activeTab === 'inicio' ? '#E31E24' : '#9CA3AF' }}>Inicio</span>
        </div>
        <div onClick={() => setIsCartOpen(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, cursor: 'pointer', position: 'relative' }}>
          <IconOrders active={isCartOpen} />
          {carrito.length > 0 && <div style={{ position: 'absolute', top: '0px', right: '30%', width: '10px', height: '10px', backgroundColor: '#E31E24', borderRadius: '50%', border: '2px solid #fff' }}></div>}
          <span style={{ fontSize: '0.75rem', fontWeight: '500', marginTop: '5px', color: '#9CA3AF' }}>Pedido</span>
        </div>
        <div onClick={() => setActiveTab('wallet')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, cursor: 'pointer' }}>
          <IconWallet active={activeTab === 'wallet'} />
          <span style={{ fontSize: '0.75rem', fontWeight: activeTab === 'wallet' ? '800' : '500', marginTop: '5px', color: activeTab === 'wallet' ? '#E31E24' : '#9CA3AF' }}>Wallet</span>
        </div>
        <div onClick={() => setActiveTab('perfil')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, cursor: 'pointer' }}>
          <IconProfile active={activeTab === 'perfil'} />
          <span style={{ fontSize: '0.75rem', fontWeight: activeTab === 'perfil' ? '800' : '500', marginTop: '5px', color: activeTab === 'perfil' ? '#E31E24' : '#9CA3AF' }}>Perfil</span>
        </div>
      </nav>

      <style>{`
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
      `}</style>
    </div>
  );
}
