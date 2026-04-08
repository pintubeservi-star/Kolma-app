'use client'
import React, { useState, useEffect } from 'react';

// ==========================================
// ICONOS SVG PROFESIONALES (Diseño Premium)
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
const IconEdit = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;

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
  const [carrito, setCarrito] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isMissingInfoOpen, setIsMissingInfoOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', password: '', direccion: '' });
  const [errorAuth, setErrorAuth] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // Credenciales de Entorno Originales (¡RESTABLECIDAS!)
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "q0q09e-cp.myshopify.com";
  const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || "c9bda45020488455d7fe2d8b7e22f352";

  // ==========================================
  // PERSISTENCIA Y CARGA INICIAL
  // ==========================================
  useEffect(() => {
    const token = localStorage.getItem('kolma_access_token');
    const savedName = localStorage.getItem('kolma_user_name');
    const savedEmail = localStorage.getItem('kolma_user_email');
    const savedAddress = localStorage.getItem('kolma_user_address');
    const savedPhone = localStorage.getItem('kolma_user_phone');

    if (token) {
      setUser({ nombre: savedName || "Cliente", email: savedEmail, direccion: savedAddress, telefono: savedPhone, id: token });
      setFormData(prev => ({ ...prev, nombre: savedName || '', email: savedEmail || '', direccion: savedAddress || '', telefono: savedPhone || '' }));
    }

    async function fetchData() {
      if(!domain || !accessToken) { setLoading(false); return; }
      try {
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
      } catch (e) { setLoading(false); }
    }
    fetchData();
  }, [domain, accessToken]);

  // ==========================================
  // LÓGICA AUTH Y PERFIL (Con Cloud Sync)
  // ==========================================
  const fixPhone = (tel) => {
    let clean = tel.replace(/\D/g, '');
    if (clean.length === 10) return `+1${clean}`;
    if (clean.length === 11 && clean.startsWith('1')) return `+${clean}`;
    return clean;
  };

  const saveUserData = (data) => {
    localStorage.setItem('kolma_user_name', data.nombre);
    localStorage.setItem('kolma_user_email', data.email);
    localStorage.setItem('kolma_user_phone', data.telefono);
    localStorage.setItem('kolma_user_address', data.direccion);
    setUser(data);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorAuth('');
    const shopifyUrl = `https://${domain}/api/2024-04/graphql.json`;
    const headers = { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': accessToken };

    try {
      if (authMode === 'register') {
        const tel = fixPhone(formData.telefono);
        if (tel.length < 11) throw new Error("Teléfono inválido (10 dígitos requeridos)");
        if (formData.direccion.length < 5) throw new Error("Por favor ingresa una dirección clara");
        
        const res = await fetch(shopifyUrl, {
          method: 'POST', headers,
          body: JSON.stringify({
            query: `mutation customerCreate($input: CustomerCreateInput!) { 
              customerCreate(input: $input) { customer { id firstName email phone } customerUserErrors { message } } 
            }`,
            variables: { input: { firstName: formData.nombre, email: formData.email, phone: tel, password: formData.password } }
          })
        });
        const { data } = await res.json();
        if (data.customerCreate.customerUserErrors.length) throw new Error(data.customerCreate.customerUserErrors[0].message);
        
        saveUserData({ ...formData, telefono: tel, id: data.customerCreate.customer.id });
        setAuthMode('login');
        setErrorAuth('¡Cuenta creada! Inicia sesión para entrar.');
      } else if (authMode === 'login') {
        const res = await fetch(shopifyUrl, {
          method: 'POST', headers,
          body: JSON.stringify({
            query: `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
              customerAccessTokenCreate(input: $input) { customerAccessToken { accessToken } customerUserErrors { message } }
            }`,
            variables: { input: { email: formData.email, password: formData.password } }
          })
        });
        const { data } = await res.json();
        if (data.customerAccessTokenCreate.customerUserErrors.length) throw new Error(data.customerAccessTokenCreate.customerUserErrors[0].message);
        
        const token = data.customerAccessTokenCreate.customerAccessToken.accessToken;
        
        // SINCRONIZACIÓN CON SHOPIFY (Trae los datos desde cualquier teléfono)
        const resInfo = await fetch(shopifyUrl, {
          method: 'POST', headers,
          body: JSON.stringify({
            query: `{ customer(customerAccessToken: "${token}") { firstName email phone defaultAddress { address1 } } }`
          })
        });
        const infoData = await resInfo.json();
        const c = infoData.data.customer;

        const completeUser = {
          id: token,
          nombre: c.firstName || formData.email.split('@')[0],
          email: c.email,
          telefono: c.phone || "",
          direccion: c.defaultAddress?.address1 || ""
        };

        localStorage.setItem('kolma_access_token', token);
        saveUserData(completeUser);
        setIsAuthOpen(false);
      } else if (authMode === 'recovery') {
        const res = await fetch(shopifyUrl, {
          method: 'POST', headers,
          body: JSON.stringify({ query: `mutation customerRecover($email: String!) { customerRecover(email: $email) { customerUserErrors { message } } }`, variables: { email: formData.email } })
        });
        const { data } = await res.json();
        if (data.customerRecover.customerUserErrors.length) throw new Error(data.customerRecover.customerUserErrors[0].message);
        setErrorAuth('Correo de recuperación enviado.');
        setTimeout(() => setAuthMode('login'), 3000);
      }
    } catch (err) { setErrorAuth(err.message); } finally { setIsSubmitting(false); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const tel = fixPhone(formData.telefono);
    const token = localStorage.getItem('kolma_access_token');

    // Guarda en la nube de Shopify
    if (token) {
      try {
        await fetch(`https://${domain}/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': accessToken },
          body: JSON.stringify({
            query: `mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
              customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) { customer { firstName phone } }
            }`,
            variables: { customerAccessToken: token, customer: { firstName: formData.nombre, phone: tel } }
          })
        });
      } catch (err) { console.error("Error al guardar en Shopify", err); }
    }

    const updatedUser = { ...user, ...formData, telefono: tel };
    saveUserData(updatedUser);
    setIsEditingProfile(false);
    setIsMissingInfoOpen(false);
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setFormData({ nombre: '', email: '', telefono: '', password: '', direccion: '' });
    setActiveTab('inicio');
  };

  // ==========================================
  // CARRITO Y PROCESAMIENTO DE ORDEN (Ruta Vercel)
  // ==========================================
  const agregarAlCarrito = (producto) => {
    const variantId = producto.node.variants.edges[0]?.node.id;
    setCarrito(prev => {
      const existe = prev.find(item => item.variantId === variantId);
      if (existe) return prev.map(item => item.variantId === variantId ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { id: producto.node.id, title: producto.node.title, price: parseFloat(producto.node.variants.edges[0]?.node.price.amount), image: producto.node.images.edges[0]?.node.url, variantId, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const totalCarrito = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const procesarCheckout = async () => {
    if (!user) { setIsCartOpen(false); setIsAuthOpen(true); return; }
    
    // Validación estricta para envíos en Cotuí
    if (!user.nombre || !user.telefono || !user.direccion || user.direccion.length < 5) {
      setIsCartOpen(false); 
      setIsMissingInfoOpen(true); 
      return;
    }

    setIsProcessingOrder(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: carrito, 
          customer: user,
          total: totalCarrito.toFixed(2)
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ ¡Pedido recibido con éxito!\nLo estaremos entregando en Cotuí en aprox. 45 minutos.");
        setCarrito([]); 
        setIsCartOpen(false);
      } else { 
        alert("Hubo un error al crear la orden. Intenta nuevamente."); 
      }
    } catch (e) { 
      alert("Error de conexión al servidor. Revisa tu internet."); 
    } finally { 
      setIsProcessingOrder(false); 
    }
  };

  // ==========================================
  // RENDER UI (Diseño Premium Exacto)
  // ==========================================
  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1F2937', paddingBottom: '100px', overflowX: 'hidden' }}>
      
      {/* HEADER PRINCIPAL */}
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
              <button onClick={() => setIsAuthOpen(true)} style={{ backgroundColor: '#E31E24', color: '#FFFFFF', border: 'none', padding: '10px 22px', borderRadius: '25px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' }}>Ingresar</button>
            ) : (
              <div onClick={() => setActiveTab('perfil')} style={{ cursor: 'pointer', width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#FEE2E2', border: '2px solid #E31E24', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E31E24', fontWeight: '900' }}>{user.nombre.charAt(0)}</div>
            )}
          </div>
        </div>
      </header>

      {/* VISTA INICIO */}
      {activeTab === 'inicio' && (
        <>
          {/* BANER OSCURO PREMIUM */}
          <section style={{ backgroundColor: '#000000', padding: '60px 25px', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(227,30,36,0.12) 0%, rgba(0,0,0,1) 100%)', zIndex: 1 }}></div>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', position: 'relative', zIndex: 10 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(227,30,36,0.15)', border: '1px solid rgba(227,30,36,0.4)', color: '#FF3B30', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '800', marginBottom: '20px' }}>
                ENTREGA EN 45 MINUTOS
              </div>
              <h2 style={{ fontSize: '2.8rem', fontWeight: '900', margin: '0 0 10px 0', lineHeight: 1.1 }}>El súper de Cotuí<br/>en 45 minutos.</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.8, margin: '0 0 25px 0' }}>Fresco, rápido y directo a tu puerta.</p>
              
              {/* BARRA DE BÚSQUEDA */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '10px 18px', display: 'flex', alignItems: 'center', marginTop: '10px', maxWidth: '320px', boxShadow: '0 8px 25px rgba(0,0,0,0.4)' }}>
                <div style={{ color: '#E31E24', display: 'flex', alignItems: 'center' }}><IconSearch /></div>
                <input 
                  type="text" 
                  placeholder="¿Qué necesitas hoy?" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 10px', fontSize: '1.05rem', color: '#111', background: 'transparent', fontWeight: '600' }} 
                />
              </div>
            </div>
          </section>

          {/* GRID DE PRODUCTOS (RESTABLECIDO) */}
          <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '12px' }}>
              {loading ? (
                <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '40px', fontWeight: 'bold', color: '#9CA3AF' }}>Cargando pasillos...</p>
              ) : productos.filter(p => p.node.title.toLowerCase().includes(searchTerm.toLowerCase())).map(({ node }) => (
                <div key={node.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '15px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <img src={node.images.edges[0]?.node.url} style={{ maxWidth: '100%', maxHeight: '120px', objectFit: 'contain' }} alt={node.title} />
                  </div>
                  <h4 style={{ fontSize: '0.85rem', margin: '0 0 10px 0', height: '38px', overflow: 'hidden', fontWeight: '700', color: '#1F2937', lineHeight: '1.3' }}>{node.title}</h4>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '900', fontSize: '1.1rem', color: '#111' }}>RD${parseFloat(node.variants.edges[0]?.node.price.amount).toFixed(0)}</span>
                    <button onClick={() => agregarAlCarrito({ node })} style={{ backgroundColor: '#fff', color: '#E31E24', border: '2px solid #E31E24', borderRadius: '12px', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
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
          <div style={{ background: 'linear-gradient(135deg, #E31E24 0%, #900a12 100%)', borderRadius: '24px', padding: '35px', color: '#fff', boxShadow: '0 12px 30px rgba(227,30,36,0.3)' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', opacity: 0.8 }}>SALDO ACUMULADO</p>
            <h3 style={{ margin: '15px 0', fontSize: '2.8rem', fontWeight: '900' }}>RD$ {wallet.toFixed(2)}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>{user ? user.nombre.toUpperCase() : 'INVITADO'}</p>
          </div>
        </section>
      )}

      {/* VISTA PERFIL */}
      {activeTab === 'perfil' && (
        <section style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 25px', animation: 'fadeIn 0.4s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontWeight: '900', fontSize: '1.8rem', margin: 0, color: '#111' }}>Mi Perfil</h2>
            {user && (
              <button onClick={handleLogout} style={{ color: '#E31E24', background: '#FEE2E2', border: 'none', padding: '8px 15px', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconLogout /> Cerrar Sesión
              </button>
            )}
          </div>

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '25px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', position: 'relative' }}>
                {!isEditingProfile && (
                  <button onClick={() => setIsEditingProfile(true)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#E31E24', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700', fontSize: '0.85rem' }}>
                    <IconEdit /> Editar
                  </button>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#E31E24', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: '900' }}>
                    {user.nombre.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>{user.nombre}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280' }}>Cliente Kolma RD</p>
                  </div>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: '800', color: '#9CA3AF' }}>NOMBRE</label>
                      <input name="nombre" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', marginTop: '5px', fontSize: '1rem' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: '800', color: '#9CA3AF' }}>TELÉFONO</label>
                      <input name="telefono" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', marginTop: '5px', fontSize: '1rem' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: '800', color: '#9CA3AF' }}>DIRECCIÓN (COTUÍ)</label>
                      <textarea name="direccion" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', marginTop: '5px', fontSize: '1rem', height: '80px', resize: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" disabled={isSubmitting} style={{ flex: 1, backgroundColor: '#E31E24', color: '#fff', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</button>
                      <button type="button" onClick={() => setIsEditingProfile(false)} style={{ flex: 1, backgroundColor: '#F3F4F6', color: '#4B5563', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '15px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#9CA3AF' }}>CORREO ELECTRÓNICO</span>
                      <p style={{ margin: '5px 0 0 0', fontWeight: '600', color: '#111' }}>{user.email}</p>
                    </div>
                    <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '15px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#9CA3AF' }}>TELÉFONO</span>
                      <p style={{ margin: '5px 0 0 0', fontWeight: '600', color: '#111' }}>{user.telefono || 'No registrado'}</p>
                    </div>
                    <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '15px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#9CA3AF' }}>DIRECCIÓN DE ENTREGA</span>
                      <p style={{ margin: '5px 0 0 0', fontWeight: '600', color: '#111', lineHeight: '1.4' }}>{user.direccion || 'No registrada'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #eee' }}>
              <div style={{ backgroundColor: '#F3F4F6', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <IconProfile active={false} />
              </div>
              <h3 style={{ fontWeight: '800', fontSize: '1.2rem', marginBottom: '10px' }}>¡Hola! Únete a Kolma</h3>
              <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '25px' }}>Regístrate para
