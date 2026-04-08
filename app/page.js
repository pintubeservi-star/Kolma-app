'use client'
import React, { useState, useEffect } from 'react';

// ==========================================
// ICONOS SVG PROFESIONALES (Diseño Premium)
// ==========================================
const IconAdd = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconSearch = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>;
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

  const domain = "q0q09e-cp.myshopify.com";
  const accessToken = "c9bda45020488455d7fe2d8b7e22f352";

  // ==========================================
  // CARGA INICIAL (Cloud Sync al entrar)
  // ==========================================
  useEffect(() => {
    const token = localStorage.getItem('kolma_access_token');
    const savedName = localStorage.getItem('kolma_user_name');
    const savedEmail = localStorage.getItem('kolma_user_email');
    const savedAddress = localStorage.getItem('kolma_user_address');
    const savedPhone = localStorage.getItem('kolma_user_phone');

    if (token) {
      setUser({ 
        nombre: savedName || "Cliente", 
        email: savedEmail, 
        direccion: savedAddress || "", 
        telefono: savedPhone || "", 
        id: token 
      });
      setFormData(prev => ({ 
        ...prev, 
        nombre: savedName || '', 
        email: savedEmail || '', 
        direccion: savedAddress || '', 
        telefono: savedPhone || '' 
      }));
    }

    async function fetchProducts() {
      try {
        const res = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': accessToken },
          body: JSON.stringify({ 
            query: `{ products(first: 40) { edges { node { id title images(first: 1) { edges { node { url } } } variants(first: 1) { edges { node { id price { amount } } } } } } } }` 
          }),
        });
        const { data } = await res.json();
        if(data?.products) setProductos(data.products.edges);
        setLoading(false);
      } catch (e) { setLoading(false); }
    }
    fetchProducts();
  }, []);

  // ==========================================
  // LÓGICA DE DATOS (Guardado en Shopify Cloud)
  // ==========================================
  const fixPhone = (tel) => {
    let clean = tel.replace(/\D/g, '');
    if (clean.length === 10) return `+1${clean}`;
    if (clean.length === 11 && clean.startsWith('1')) return `+${clean}`;
    return clean;
  };

  const saveUserData = (data) => {
    localStorage.setItem('kolma_user_name', data.nombre || "");
    localStorage.setItem('kolma_user_email', data.email || "");
    localStorage.setItem('kolma_user_phone', data.telefono || "");
    localStorage.setItem('kolma_user_address', data.direccion || "");
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
        setAuthMode('login');
        setErrorAuth('¡Cuenta creada! Inicia sesión ahora.');
      } 
      
      else if (authMode === 'login') {
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

        // SINCRONIZACIÓN CLOUD: Bajamos los datos de Shopify al nuevo teléfono
        const resInfo = await fetch(shopifyUrl, {
          method: 'POST', headers,
          body: JSON.stringify({
            query: `{ customer(customerAccessToken: "${token}") { firstName email phone defaultAddress { address1 } } }`
          })
        });
        const info = await resInfo.json();
        const c = info.data.customer;

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
      }
    } catch (err) { setErrorAuth(err.message); } finally { setIsSubmitting(false); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const tel = fixPhone(formData.telefono);
    const token = localStorage.getItem('kolma_access_token');

    try {
      // Guardamos en Shopify para que aparezca en otros teléfonos
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

      saveUserData({ ...user, nombre: formData.nombre, telefono: tel, direccion: formData.direccion });
      setIsEditingProfile(false);
      setIsMissingInfoOpen(false);
    } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setFormData({ nombre: '', email: '', telefono: '', password: '', direccion: '' });
    setActiveTab('inicio');
  };

  // ==========================================
  // CARRITO Y PAGO (Vercel Route)
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
    if (!user.nombre || !user.telefono || !user.direccion || user.direccion.length < 5) {
      setIsCartOpen(false); setIsMissingInfoOpen(true); return;
    }
    setIsProcessingOrder(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: carrito, customer: user, total: totalCarrito.toFixed(2) })
      });
      if (res.ok) {
        alert("✅ ¡Pedido recibido!\nLo entregamos en Cotuí en unos 45 mins.");
        setCarrito([]); setIsCartOpen(false);
      }
    } catch (e) { alert("Error de conexión."); } finally { setIsProcessingOrder(false); }
  };

  // ==========================================
  // RENDER UI
  // ==========================================
  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#1F2937', paddingBottom: '100px', overflowX: 'hidden' }}>
      
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
          <section style={{ backgroundColor: '#000000', padding: '60px 25px', color: '#FFFFFF', position: 'relative' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0 0 10px 0' }}>El súper de Cotuí<br/>en 45 minutos.</h2>
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '10px 18px', display: 'flex', alignItems: 'center', marginTop: '20px', maxWidth: '320px' }}>
                <IconSearch /><input type="text" placeholder="¿Qué necesitas?" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 10px' }} />
              </div>
            </div>
          </section>
          <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
              {productos.filter(p => p.node.title.toLowerCase().includes(searchTerm.toLowerCase())).map(({ node }) => (
                <div key={node.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '15px', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
                  <img src={node.images.edges[0]?.node.url} style={{ width: '100%', height: '100px', objectFit: 'contain' }} alt="" />
                  <h4 style={{ fontSize: '0.8rem', margin: '10px 0', height: '35px', overflow: 'hidden' }}>{node.title}</h4>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '900' }}>RD${parseFloat(node.variants.edges[0]?.node.price.amount).toFixed(0)}</span>
                    <button onClick={() => agregarAlCarrito({ node })} style={{ border: '2px solid #E31E24', color: '#E31E24', background: 'none', borderRadius: '10px', width: '32px', height: '32px' }}>+</button>
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
          <h2 style={{ fontWeight: '900', fontSize: '1.8rem' }}>Mi Billetera</h2>
          <div style={{ background: 'linear-gradient(135deg, #E31E24 0%, #900a12 100%)', borderRadius: '24px', padding: '35px', color: '#fff' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>SALDO ACUMULADO</p>
            <h3 style={{ margin: '15px 0', fontSize: '2.8rem', fontWeight: '900' }}>RD$ {wallet.toFixed(2)}</h3>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{user ? user.nombre.toUpperCase() : 'INVITADO'}</p>
          </div>
        </section>
      )}

      {/* VISTA PERFIL */}
      {activeTab === 'perfil' && (
        <section style={{ maxWidth: '500px', margin: '0 auto', padding: '30px' }}>
          <h2 style={{ fontWeight: '900' }}>Mi Perfil</h2>
          {user ? (
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '25px', border: '1px solid #eee' }}>
              {!isEditingProfile && <button onClick={() => setIsEditingProfile(true)} style={{ float: 'right', color: '#E31E24', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Editar</button>}
              <h3 style={{ margin: '0 0 20px 0' }}>Hola, {user.nombre}</h3>
              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input placeholder="Nombre" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} />
                  <input placeholder="WhatsApp" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} />
                  <textarea placeholder="Dirección Cotuí" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', height: '80px' }} />
                  <button type="submit" style={{ backgroundColor: '#E31E24', color: '#fff', padding: '12px', borderRadius: '10px', border: 'none' }}>{isSubmitting ? '...' : 'Guardar'}</button>
                </form>
              ) : (
                <>
                  <p><strong>WhatsApp:</strong> {user.telefono || "No registrado"}</p>
                  <p><strong>Dirección:</strong> {user.direccion || "No registrada"}</p>
                  <button onClick={handleLogout} style={{ width: '100%', marginTop: '20px', color: '#E31E24', background: '#FEE2E2', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>Salir</button>
                </>
              )}
            </div>
          ) : <div style={{ textAlign: 'center' }}><button onClick={() => setIsAuthOpen(true)} style={{ backgroundColor: '#E31E24', color: '#fff', padding: '14px 30px', borderRadius: '15px', border: 'none', cursor: 'pointer' }}>Iniciar Sesión</button></div>}
        </section>
      )}

      {/* MODALES */}
      {isAuthOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '35px', borderRadius: '24px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{ fontWeight: '900' }}>{authMode === 'login' ? 'Entrar' : 'Registro'}</h3>
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {authMode === 'register' && <input placeholder="Nombre" required style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} onChange={e => setFormData({...formData, nombre: e.target.value})} />}
              <input type="email" placeholder="Email" required style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input type="password" placeholder="Pass" required style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} onChange={e => setFormData({...formData, password: e.target.value})} />
              {errorAuth && <p style={{ color: '#E31E24', fontSize: '0.8rem' }}>{errorAuth}</p>}
              <button type="submit" style={{ backgroundColor: '#E31E24', color: '#fff', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>{isSubmitting ? '...' : 'ACEPTAR'}</button>
            </form>
            <p onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} style={{ textAlign: 'center', marginTop: '20px', color: '#E31E24', fontWeight: 'bold', cursor: 'pointer' }}>Cambiar a {authMode === 'login' ? 'Registro' : 'Login'}</p>
          </div>
        </div>
      )}

      {isMissingInfoOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '24px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{ color: '#E31E24', fontWeight: '900' }}>Datos Delivery</h3>
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input placeholder="WhatsApp" required style={{ padding: '14px', borderRadius: '12px', border: '1px solid #ddd' }} value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
              <textarea placeholder="Dirección Cotuí" required style={{ padding: '14px', borderRadius: '12px', border: '1px solid #ddd', height: '80px' }} value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
              <button type="submit" style={{ backgroundColor: '#111', color: '#fff', padding: '16px', borderRadius: '15px', border: 'none', cursor: 'pointer' }}>Confirmar Datos</button>
            </form>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '400px', height: '100%', padding: '20px' }}>
            <h3 onClick={() => setIsCartOpen(false)} style={{ cursor: 'pointer', float: 'right' }}>X</h3>
            <h3 style={{ fontWeight: '900' }}>Canasta</h3>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {carrito.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                  <img src={item.image} style={{ width: '40px', height: '40px' }} alt="" />
                  <div><p style={{ margin: 0, fontSize: '0.9rem' }}>{item.title}</p><p style={{ margin: 0, fontWeight: 'bold' }}>RD${item.price} x{item.quantity}</p></div>
                </div>
              ))}
            </div>
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
              <p style={{ fontWeight: '900', fontSize: '1.2rem' }}>Total: RD$ {totalCarrito.toFixed(2)}</p>
              <button onClick={procesarCheckout} disabled={isProcessingOrder || carrito.length === 0} style={{ width: '100%', backgroundColor: '#E31E24', color: '#fff', padding: '18px', borderRadius: '15px', border: 'none', cursor: 'pointer' }}>PAGAR PEDIDO</button>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-around', height: '75px', zIndex: 1000, paddingTop: '10px' }}>
        <div onClick={() => setActiveTab('inicio')} style={{ textAlign: 'center', color: activeTab === 'inicio' ? '#E31E24' : '#9CA3AF', flex: 1, cursor: 'pointer' }}><IconHome active={activeTab === 'inicio'} /></div>
        <div onClick={() => setIsCartOpen(true)} style={{ textAlign: 'center', color: '#9CA3AF', flex: 1, cursor: 'pointer' }}><IconOrders active={false} /></div>
        <div onClick={() => setActiveTab('wallet')} style={{ textAlign: 'center', color: activeTab === 'wallet' ? '#E31E24' : '#9CA3AF', flex: 1, cursor: 'pointer' }}><IconWallet active={activeTab === 'wallet'} /></div>
        <div onClick={() => setActiveTab('perfil')} style={{ textAlign: 'center', color: activeTab === 'perfil' ? '#E31E24' : '#9CA3AF', flex: 1, cursor: 'pointer' }}><IconProfile active={activeTab === 'perfil'} /></div>
      </nav>
    </div>
  );
}
