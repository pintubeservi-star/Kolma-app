'use client';
import React, { useState, useEffect } from 'react';

// ==========================================
// ICONOS SVG PROFESIONALES
// ==========================================
const IconAdd = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconSearch = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconHome = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#E31E24" : "none"} stroke={active ? "#E31E24" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconOrders = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#E31E24" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>;
const IconWallet = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#E31E24" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="12" y1="10" x2="12" y2="10"></line><line x1="2" y1="10" x2="22" y2="10"></line></svg>;
const IconProfile = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#E31E24" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconCart = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const IconClose = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconTrash = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2v2"></path></svg>;
const IconStar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const IconLock = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

export default function KolmaPremium() {
  // ESTADOS DE INVENTARIO (Shopify)
  const [productos, setProductos] = useState([]);
  const [colecciones, setColecciones] = useState([{ node: { id: 'all', title: 'Todas' } }]);
  const [loading, setLoading] = useState(true);
  
  // ESTADOS DEL USUARIO Y PEDIDOS
  const [user, setUser] = useState(null); 
  const [wallet, setWallet] = useState(0.00); 
  const [misPedidos, setMisPedidos] = useState([]); 
  
  // ESTADOS DE AUTENTICACIÓN (LOGIN, REGISTRO, RECUPERACIÓN)
  const [authView, setAuthView] = useState('login'); // 'login', 'register', 'recover'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  // ESTADOS DE LA UI
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('inicio');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [carrito, setCarrito] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProcessingPago, setIsProcessingPago] = useState(false);

  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN;

  // ==================================================================
  // 1. CARGAR PRODUCTOS DE SHOPIFY AL INICIAR
  // ==================================================================
  useEffect(() => {
    async function fetchShopifyData() {
      try {
        if (!domain || !token) {
          const mockData = [
            { node: { id: 1, productType: 'Despensa', title: 'Arroz Premium La Garza 10 Lbs', images: { edges: [{ node: { url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300' } }] }, variants: { edges: [{ node: { price: { amount: '450.00' } } }] } } },
            { node: { id: 2, productType: 'Lácteos', title: 'Leche Rica Entera 1 Litro', images: { edges: [{ node: { url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=300' } }] }, variants: { edges: [{ node: { price: { amount: '75.00' } } }] } } },
          ];
          setProductos(mockData);
          setColecciones([{ node: { id: 'all', title: 'Todas' } }, { node: { id: 'c1', title: 'Despensa' } }, { node: { id: 'c2', title: 'Lácteos' } }]);
          setLoading(false);
          return;
        }

        const response = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
          body: JSON.stringify({
            query: `{ products(first: 40) { edges { node { id title productType images(first: 1) { edges { node { url } } } variants(first: 1) { edges { node { price { amount } } } } } } } }`
          }),
        });

        const { data } = await response.json();

        if (data && data.products) {
          const fetchedProducts = data.products.edges;
          setProductos(fetchedProducts);

          const types = [...new Set(fetchedProducts.map(p => p.node.productType).filter(Boolean))];
          const dynamicCollections = [{ node: { id: 'all', title: 'Todas' } }, ...types.map((type, i) => ({ node: { id: `cat_${i}`, title: type } }))];
          if (dynamicCollections.length > 1) setColecciones(dynamicCollections);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error al conectar con Shopify:", error);
        setLoading(false);
      }
    }
    fetchShopifyData();
  }, [domain, token]);

  // ==================================================================
  // 2. SISTEMA DE AUTENTICACIÓN (LOGIN, REGISTRO, RECUPERAR)
  // ==================================================================
  const switchAuthView = (view) => {
    setAuthError('');
    setAuthSuccessMsg('');
    setAuthView(view);
  };

  const procesarLoginShopify = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccessMsg('');

    if (!domain || !token) {
      setTimeout(() => {
        setUser({ nombre: "Cliente Demo", telefono: "809-000-0000", direccion: "Cotuí, RD", email: loginEmail, customerToken: "demo_token" });
        setWallet(1850.50);
        setAuthLoading(false);
        setActiveTab('inicio');
      }, 1500);
      return;
    }

    try {
      const authRes = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
        body: JSON.stringify({
          query: `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
            customerAccessTokenCreate(input: $input) {
              customerAccessToken { accessToken }
              customerUserErrors { message }
            }
          }`,
          variables: { input: { email: loginEmail, password: loginPassword } }
        }),
      });

      const authData = await authRes.json();
      const authErrors = authData.data?.customerAccessTokenCreate?.customerUserErrors;

      if (authErrors && authErrors.length > 0) {
        setAuthError("Correo o contraseña incorrectos.");
        setAuthLoading(false);
        return;
      }

      const customerToken = authData.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
      if (!customerToken) throw new Error("No se pudo generar el token.");

      const customerRes = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
        body: JSON.stringify({
          query: `query { customer(customerAccessToken: "${customerToken}") { firstName lastName email phone defaultAddress { address1 city } } }`
        }),
      });

      const customerData = await customerRes.json();
      const customerInfo = customerData.data?.customer;

      if (customerInfo) {
        const fullName = `${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim() || customerInfo.email;
        setUser({
          nombre: fullName,
          email: customerInfo.email,
          telefono: customerInfo.phone || "Agrega tu teléfono en Shopify",
          direccion: customerInfo.defaultAddress ? `${customerInfo.defaultAddress.address1}, ${customerInfo.defaultAddress.city}` : "Sin dirección guardada",
          customerToken: customerToken
        });
        setWallet(1850.50); 
        setLoginEmail(''); setLoginPassword('');
        setActiveTab('inicio');
      } else {
        setAuthError("No pudimos extraer la información de tu cuenta.");
      }
    } catch (error) {
      console.error("Error en Auth:", error);
      setAuthError("Problema de conexión con Shopify. Intenta de nuevo.");
    }
    setAuthLoading(false);
  };

  const procesarRegistroShopify = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccessMsg('');

    if (!domain || !token) {
      setTimeout(() => {
        setAuthSuccessMsg("¡Cuenta creada con éxito! Iniciando sesión...");
        setTimeout(() => {
          setUser({ nombre: `${regFirstName} ${regLastName}`, telefono: regPhone, direccion: "Cotuí, RD", email: loginEmail, customerToken: "demo_token_new" });
          setWallet(500.00); // Bono de bienvenida simulado
          setAuthLoading(false);
          setActiveTab('inicio');
        }, 1500);
      }, 1500);
      return;
    }

    try {
      const authRes = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
        body: JSON.stringify({
          query: `mutation customerCreate($input: CustomerCreateInput!) {
            customerCreate(input: $input) {
              customer { id }
              customerUserErrors { message }
            }
          }`,
          variables: { input: { firstName: regFirstName, lastName: regLastName, email: loginEmail, password: loginPassword, phone: regPhone } }
        }),
      });

      const authData = await authRes.json();
      const authErrors = authData.data?.customerCreate?.customerUserErrors;

      if (authErrors && authErrors.length > 0) {
        setAuthError(authErrors[0].message);
        setAuthLoading(false);
        return;
      }

      // Registro exitoso, auto-login
      setAuthSuccessMsg("¡Cuenta creada! Iniciando sesión automáticamente...");
      await procesarLoginShopify(e); // Llama al login con las credenciales que acaba de crear

    } catch (error) {
      console.error("Error en Registro:", error);
      setAuthError("Problema de conexión al crear cuenta. Intenta de nuevo.");
      setAuthLoading(false);
    }
  };

  const procesarRecuperacionShopify = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccessMsg('');

    if (!domain || !token) {
      setTimeout(() => {
        setAuthSuccessMsg("Te hemos enviado un correo con instrucciones para restablecer tu contraseña.");
        setAuthLoading(false);
        setTimeout(() => switchAuthView('login'), 3000);
      }, 1500);
      return;
    }

    try {
      const authRes = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
        body: JSON.stringify({
          query: `mutation customerRecover($email: String!) {
            customerRecover(email: $email) {
              customerUserErrors { message }
            }
          }`,
          variables: { email: loginEmail }
        }),
      });

      const authData = await authRes.json();
      const authErrors = authData.data?.customerRecover?.customerUserErrors;

      if (authErrors && authErrors.length > 0) {
        setAuthError("No encontramos ninguna cuenta con ese correo.");
        setAuthLoading(false);
        return;
      }

      setAuthSuccessMsg("¡Listo! Revisa tu bandeja de entrada o spam para restablecer tu contraseña.");
      setTimeout(() => switchAuthView('login'), 4000);
      
    } catch (error) {
      console.error("Error en Recuperación:", error);
      setAuthError("Error de conexión. Intenta de nuevo.");
    }
    setAuthLoading(false);
  };

  const cerrarSesion = () => {
    setUser(null);
    setWallet(0);
    setAuthError('');
    setAuthSuccessMsg('');
    setAuthView('login');
    setActiveTab('inicio');
  };

  // ==================================================================
  // LÓGICA DEL CARRITO Y PAGOS
  // ==================================================================
  const agregarAlCarrito = (producto, e) => {
    e.stopPropagation(); 
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.node.id);
      if (existe) return prev.map(item => item.id === producto.node.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      return [...prev, { ...producto.node, cantidad: 1, precio: parseFloat(producto.node.variants.edges[0].node.price.amount) }];
    });
  };

  const removerDelCarrito = (id) => setCarrito(prev => prev.filter(item => item.id !== id));
  const totalCarrito = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const totalArticulos = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const procesarPago = () => {
    if (!user) {
      setIsCartOpen(false);
      setActiveTab('perfil'); 
      return;
    }
    setIsProcessingPago(true);
    setTimeout(() => {
      const nuevoPedido = {
        id: `KOL-${Math.floor(1000 + Math.random() * 9000)}`,
        total: totalCarrito + 50,
        articulos: totalArticulos,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estado: 'EN CAMINO'
      };
      setMisPedidos(prev => [nuevoPedido, ...prev]);
      setCarrito([]); 
      setIsProcessingPago(false);
      setIsCartOpen(false);
      setActiveTab('pedidos');
    }, 2000);
  };

  const transicionSuave = 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)';

  // ==========================================
  // VISTAS DE LA APLICACIÓN (PANTALLAS)
  // ==========================================

  // COMPONENTE DE AUTENTICACIÓN DINÁMICO
  const renderAuthForms = () => (
    <section style={{ maxWidth: '400px', margin: '0 auto', padding: '50px 25px', animation: 'fadeInUp 0.4s ease-out' }}>
      <div style={{ color: '#E31E24', display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <IconLock />
      </div>
      
      {authView === 'login' && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#111', marginBottom: '10px' }}>Bienvenido</h2>
          <p style={{ color: '#6B7280', marginBottom: '30px', fontSize: '0.95rem' }}>Ingresa para acceder a tus pedidos y beneficios.</p>
        </div>
      )}
      
      {authView === 'register' && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#111', marginBottom: '10px' }}>Crea tu Cuenta</h2>
          <p style={{ color: '#6B7280', marginBottom: '30px', fontSize: '0.95rem' }}>Únete a Kolma RD y recibe beneficios exclusivos.</p>
        </div>
      )}

      {authView === 'recover' && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#111', marginBottom: '10px' }}>Recuperar Acceso</h2>
          <p style={{ color: '#6B7280', marginBottom: '30px', fontSize: '0.95rem' }}>Te enviaremos un enlace seguro para restablecerla.</p>
        </div>
      )}

      {/* MENSAJES DE ERROR O ÉXITO GLOBALES */}
      {authError && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold', animation: 'fadeInUp 0.3s' }}>
          {authError}
        </div>
      )}
      {authSuccessMsg && (
        <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold', animation: 'fadeInUp 0.3s' }}>
          {authSuccessMsg}
        </div>
      )}

      {/* FORMULARIO DE INICIO DE SESIÓN */}
      {authView === 'login' && (
        <form onSubmit={procesarLoginShopify} style={{ textAlign: 'left', animation: 'fadeInUp 0.3s' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Correo Electrónico</label>
            <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required placeholder="tu@correo.com" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '1rem', outline: 'none', transition: transicionSuave }} onFocus={(e) => e.target.style.borderColor = '#E31E24'} onBlur={(e) => e.target.style.borderColor = '#D1D5DB'} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151' }}>Contraseña</label>
              <span onClick={() => switchAuthView('recover')} style={{ fontSize: '0.8rem', color: '#E31E24', fontWeight: 'bold', cursor: 'pointer' }}>¿Olvidaste tu contraseña?</span>
            </div>
            <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '1rem', outline: 'none', transition: transicionSuave }} onFocus={(e) => e.target.style.borderColor = '#E31E24'} onBlur={(e) => e.target.style.borderColor = '#D1D5DB'} />
          </div>
          <button type="submit" disabled={authLoading} style={{ width: '100%', backgroundColor: authLoading ? '#FCA5A5' : '#E31E24', color: '#FFF', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '1.1rem', cursor: authLoading ? 'wait' : 'pointer', boxShadow: authLoading ? 'none' : '0 8px 20px rgba(227,30,36,0.3)', transition: transicionSuave }}>
            {authLoading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
          <div style={{ marginTop: '25px', fontSize: '0.9rem', color: '#6B7280', textAlign: 'center' }}>
            ¿No tienes cuenta? <span onClick={() => switchAuthView('register')} style={{ color: '#E31E24', fontWeight: 'bold', cursor: 'pointer' }}>Regístrate aquí</span>
          </div>
        </form>
      )}

      {/* FORMULARIO DE REGISTRO */}
      {authView === 'register' && (
        <form onSubmit={procesarRegistroShopify} style={{ textAlign: 'left', animation: 'fadeInUp 0.3s' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Nombre</label>
              <input type="text" value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)} required placeholder="Ej. Juan" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '1rem', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#E31E24'} onBlur={(e) => e.target.style.borderColor = '#D1D5DB'} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Apellido</label>
              <input type="text" value={regLastName} onChange={(e) => setRegLastName(e.target.value)} required placeholder="Ej. Pérez" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '1rem', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#E31E24'} onBlur={(e) => e.target.style.borderColor = '#D1D5DB'} />
            </div>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Teléfono (Para Delivery)</label>
            <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="809-000-0000" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '1rem', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#E31E24'} onBlur={(e) => e.target.style.borderColor = '#D1D5DB'} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Correo Electrónico</label>
            <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required placeholder="tu@correo.com" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '1rem', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#E31E24'} onBlur={(e) => e.target.style.borderColor = '#D1D5DB'} />
          </div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Crea una Contraseña</label>
            <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required placeholder="Mínimo 5 caracteres" minLength="5" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '1rem', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#E31E24'} onBlur={(e) => e.target.style.borderColor = '#D1D5DB'} />
          </div>
          <button type="submit" disabled={authLoading} style={{ width: '100%', backgroundColor: authLoading ? '#9CA3AF' : '#111827', color: '#FFF', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '1.1rem', cursor: authLoading ? 'wait' : 'pointer', boxShadow: authLoading ? 'none' : '0 8px 20px rgba(0,0,0,0.2)', transition: transicionSuave }}>
            {authLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
          <div style={{ marginTop: '25px', fontSize: '0.9rem', color: '#6B7280', textAlign: 'center' }}>
            ¿Ya tienes cuenta? <span onClick={() => switchAuthView('login')} style={{ color: '#E31E24', fontWeight: 'bold', cursor: 'pointer' }}>Inicia Sesión</span>
          </div>
        </form>
      )}

      {/* FORMULARIO DE RECUPERACIÓN DE CONTRASEÑA */}
      {authView === 'recover' && (
        <form onSubmit={procesarRecuperacionShopify} style={{ textAlign: 'left', animation: 'fadeInUp 0.3s' }}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Correo Electrónico</label>
            <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required placeholder="tu@correo.com" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '1rem', outline: 'none', transition: transicionSuave }} onFocus={(e) => e.target.style.borderColor = '#E31E24'} onBlur={(e) => e.target.style.borderColor = '#D1D5DB'} />
          </div>
          <button type="submit" disabled={authLoading} style={{ width: '100%', backgroundColor: authLoading ? '#9CA3AF' : '#E31E24', color: '#FFF', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '1.1rem', cursor: authLoading ? 'wait' : 'pointer', transition: transicionSuave }}>
            {authLoading ? 'Enviando...' : 'Enviar Instrucciones'}
          </button>
          <div style={{ marginTop: '25px', fontSize: '0.9rem', color: '#6B7280', textAlign: 'center' }}>
            <span onClick={() => switchAuthView('login')} style={{ color: '#111', fontWeight: 'bold', cursor: 'pointer' }}>&larr; Volver a Inicio de Sesión</span>
          </div>
        </form>
      )}
    </section>
  );

  const renderInicio = () => (
    <>
      <section style={{ backgroundColor: '#000000', padding: '70px 25px', color: '#FFFFFF', position: 'relative', overflow: 'hidden', borderBottom: '1px solid #222' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80)', backgroundSize: 'cover', opacity: 0.15, mixBlendMode: 'luminosity', animation: 'subtlePan 30s linear infinite alternate' }}></div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(227,30,36,0.3) 0%, rgba(0,0,0,0.9) 100%)', zIndex: 1 }}></div>
        
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', position: 'relative', zIndex: 10, animation: 'fadeInUp 0.8s ease-out' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(227,30,36,0.2)', border: '1px solid rgba(227,30,36,0.5)', color: '#FF4D4D', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '800', marginBottom: '20px', animation: 'pulse 2.5s infinite', backdropFilter: 'blur(4px)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ENTREGA EN 45 MINUTOS
          </div>
          
          <h2 style={{ fontSize: '2.8rem', fontWeight: '900', margin: '0 0 25px 0', lineHeight: 1.1, letterSpacing: '-1.5px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            Llena tu nevera<br/>sin salir de casa.
          </h2>
          
          <div style={{ backgroundColor: '#1F2937', borderRadius: '12px', padding: '6px 15px', display: 'flex', alignItems: 'center', border: '1px solid #374151', width: '100%', maxWidth: '600px', transition: transicionSuave, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
               onFocus={(e) => e.currentTarget.style.borderColor = '#E31E24'}>
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

      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #F3F4F6', padding: '15px 0', position: 'sticky', top: '70px', zIndex: 90 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 25px', display: 'flex', overflowX: 'auto', gap: '12px', scrollbarWidth: 'none' }}>
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

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#111', margin: 0 }}>{categoriaActiva === 'Todas' ? 'Nuestros Pasillos' : categoriaActiva}</h3>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280', fontSize: '1.1rem', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #E31E24', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px' }}></div>
            Sincronizando inventario de Kolma...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '20px' }}>
            {productos
              .filter(p => categoriaActiva === 'Todas' || p.node.productType === categoriaActiva)
              .filter(p => p.node.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(({ node }, index) => (
              <div 
                key={node.id} 
                style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '15px', border: '1px solid #E5E7EB', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', transition: transicionSuave, cursor: 'pointer', animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both` }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(227,30,36,0.1)'; e.currentTarget.style.borderColor = '#FCA5A5'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                <div style={{ height: '130px', overflow: 'hidden', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={node.images.edges[0]?.node.url} style={{ maxWidth: '100%', maxHeight: '130px', objectFit: 'contain', borderRadius: '8px' }} alt={node.title} />
                </div>
                <h4 style={{ fontSize: '0.9rem', margin: '0 0 12px 0', color: '#374151', height: '38px', overflow: 'hidden', lineHeight: '1.3', fontWeight: '600' }}>{node.title}</h4>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: '900', fontSize: '1.25rem', color: '#111' }}>RD${parseFloat(node.variants.edges[0]?.node.price.amount).toFixed(0)}</span>
                  </div>
                  <button 
                    onClick={(e) => agregarAlCarrito({node}, e)}
                    style={{ backgroundColor: '#F9FAFB', color: '#E31E24', border: '2px solid #E31E24', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: transicionSuave, fontWeight: 'bold' }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#E31E24'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; e.currentTarget.style.color = '#E31E24'; }}>
                    <IconAdd />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );

  const renderPedidos = () => {
    if (!user) return renderAuthForms();

    return (
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 25px', animation: 'fadeInUp 0.4s ease-out' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#111', marginBottom: '30px' }}>Mis Pedidos</h2>
        
        {misPedidos.length === 0 ? (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '40px 20px', border: '1px solid #E5E7EB', boxShadow: '0 8px 20px rgba(0,0,0,0.04)', textAlign: 'center', color: '#6B7280' }}>
            Aún no tienes pedidos activos.
          </div>
        ) : (
          misPedidos.map((pedido, i) => (
            <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #E5E7EB', boxShadow: '0 8px 20px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #F3F4F6', paddingBottom: '15px' }}>
                <div>
                  <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800' }}>{pedido.estado}</span>
                  <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '5px' }}>Pedido #{pedido.id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '900', fontSize: '1.2rem', color: '#111' }}>RD$ {pedido.total.toFixed(2)}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Hoy, {pedido.hora}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#374151', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E31E24', animation: 'pulse 2s infinite' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold' }}>Llegando en ~45 minutos</span>
                  <div style={{ color: '#6B7280', fontSize: '0.85rem' }}>{pedido.articulos} Artículos • Pago Seguro</div>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    );
  };

  const renderWallet = () => {
    if (!user) return renderAuthForms();

    return (
      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 25px', animation: 'fadeInUp 0.4s ease-out' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#111', marginBottom: '30px' }}>Kolma Rewards</h2>
        
        <div style={{ background: 'linear-gradient(135deg, #1C1E26 0%, #000000 100%)', borderRadius: '20px', padding: '30px', color: '#FFF', boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', border: '1px solid #333' }}>
          <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'linear-gradient(to bottom right, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 40%)', transform: 'rotate(30deg)', pointerEvents: 'none' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px', position: 'relative', zIndex: 2 }}>
            <svg width="45" height="35" viewBox="0 0 45 35" fill="none">
              <rect width="45" height="35" rx="6" fill="url(#goldGradient)"/>
              <path d="M12 0v35M33 0v35M0 12h45M0 23h45" stroke="#B89B48" strokeWidth="1.5" opacity="0.6"/>
              <defs><linearGradient id="goldGradient" x1="0" y1="0" x2="45" y2="35" gradientUnits="userSpaceOnUse"><stop stopColor="#F9DB88" /><stop offset="1" stopColor="#D4AF37" /></linearGradient></defs>
            </svg>
            <div style={{ fontSize: '1.1rem', fontWeight: '900', fontStyle: 'italic', letterSpacing: '1px', color: '#D4AF37' }}>KOLMA <span style={{ color: '#FFF' }}>BLACK</span></div>
          </div>
          
          <div style={{ fontSize: '1.6rem', letterSpacing: '4px', fontFamily: '"Courier New", Courier, monospace', marginBottom: '25px', textShadow: '0 2px 4px rgba(0,0,0,0.5)', position: 'relative', zIndex: 2 }}>
            **** **** **** 8924
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 2 }}>
            <div>
              <div style={{ fontSize: '0.65rem', opacity: 0.6, letterSpacing: '1px', marginBottom: '4px' }}>TITULAR</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#E5E7EB' }}>{user.nombre}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.65rem', color: '#D4AF37', letterSpacing: '1px', marginBottom: '4px', fontWeight: 'bold' }}>SALDO DISPONIBLE</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#FFF' }}>RD$ {wallet.toLocaleString('es-DO', {minimumFractionDigits: 2})}</div>
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#4B5563', margin: '40px 0 15px' }}>Historial de Beneficios</h3>
        <div style={{ textAlign: 'center', color: '#6B7280', marginTop: '30px' }}>No hay movimientos recientes.</div>
      </section>
    );
  };

  const renderPerfil = () => {
    if (!user) return renderAuthForms();

    return (
      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 25px', animation: 'fadeInUp 0.4s ease-out' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#FEE2E2', border: '3px solid #E31E24', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E31E24', fontWeight: '900', fontSize: '2rem' }}>
            {user.nombre.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#111', margin: 0 }}>{user.nombre}</h2>
            <div style={{ color: '#6B7280', fontWeight: '500' }}>{user.email}</div>
            <div style={{ color: '#6B7280', fontWeight: '500' }}>{user.telefono}</div>
            <div style={{ color: '#D97706', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '5px' }}><IconStar /> Cliente VIP</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ color: '#E31E24' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
              <div>
                <div style={{ fontWeight: '700', color: '#111' }}>Dirección de Entrega</div>
                <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>{user.direccion}</div>
              </div>
            </div>
            <button style={{ color: '#E31E24', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Editar</button>
          </div>
        </div>
        
        <button onClick={cerrarSesion} style={{ marginTop: '30px', width: '100%', padding: '15px', border: '1px solid #FECACA', backgroundColor: '#FEF2F2', color: '#DC2626', fontWeight: '700', borderRadius: '12px', cursor: 'pointer', transition: transicionSuave }}>
          Cerrar Sesión
        </button>
      </section>
    );
  };

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#1F2937', paddingBottom: '100px', width: '100%', height: '100%', overflowY: 'auto' }}>
      
      {/* HEADER */}
      <header style={{ backgroundColor: '#FFFFFF', padding: '15px 25px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 20px rgba(227, 30, 36, 0.08)', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => setActiveTab('inicio')}>
            <div style={{ backgroundColor: '#E31E24', width: '8px', height: '28px', borderRadius: '4px' }}></div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: '#E31E24', letterSpacing: '-1.5px' }}>
              KOLMA<span style={{fontWeight: '300'}}>RD</span>
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {user ? (
              <div style={{ textAlign: 'right', display: 'none' }} className="desktop-wallet">
                <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: '700', letterSpacing: '0.5px' }}>CRÉDITO DISPONIBLE</div>
                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#E31E24' }}>RD$ {wallet.toLocaleString()}</div>
              </div>
            ) : (
              <button onClick={() => { switchAuthView('login'); setActiveTab('perfil'); }} style={{ background: 'none', border: 'none', color: '#E31E24', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', display: 'none' }} className="desktop-wallet">
                Iniciar Sesión
              </button>
            )}

            <button onClick={() => setIsCartOpen(true)} style={{ position: 'relative', background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '10px', borderRadius: '50%', cursor: 'pointer', color: '#111', transition: transicionSuave }}>
              <IconCart />
              {totalArticulos > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#E31E24', color: '#FFF', fontSize: '0.7rem', fontWeight: 'bold', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid #FFF', animation: 'pulse 2s infinite' }}>
                  {totalArticulos}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* VISTAS */}
      {activeTab === 'inicio' && renderInicio()}
      {activeTab === 'pedidos' && renderPedidos()}
      {activeTab === 'wallet' && renderWallet()}
      {activeTab === 'perfil' && renderPerfil()}

      {/* MODAL DEL CARRITO */}
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '400px', backgroundColor: '#FFF', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', zIndex: 2000, transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0, color: '#111' }}>Tu Pedido</h2>
          <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><IconClose /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {carrito.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '50px' }}><div style={{ opacity: 0.2, marginBottom: '15px' }}><IconCart /></div>Tu carrito está vacío.</div>
          ) : (
            carrito.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #F3F4F6', paddingBottom: '20px' }}>
                <div style={{ fontWeight: 'bold', color: '#E31E24', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: '6px', height: 'fit-content' }}>{item.cantidad}x</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem' }}>{item.title}</div>
                  <div style={{ color: '#E31E24', fontWeight: '800', marginTop: '5px' }}>RD$ {item.precio.toFixed(0)}</div>
                </div>
                <button onClick={() => removerDelCarrito(item.id)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}><IconTrash /></button>
              </div>
            ))
          )}
        </div>

        {carrito.length > 0 && (
          <div style={{ padding: '20px', borderTop: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#6B7280', fontSize: '0.9rem' }}>
              <span>Subtotal</span><span>RD$ {totalCarrito.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#6B7280', fontSize: '0.9rem' }}>
              <span>Costo de Envío</span><span>RD$ 50.00</span>
            </div>

            {user && wallet > 0 && (
              <div style={{ backgroundColor: '#000', borderRadius: '12px', padding: '12px', marginBottom: '20px', fontSize: '0.85rem', color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#D4AF37' }}><IconStar /></span> Kolma Black cubre este pedido.
              </div>
            )}

            <button onClick={procesarPago} disabled={isProcessingPago} style={{ width: '100%', backgroundColor: isProcessingPago ? '#9CA3AF' : '#E31E24', color: '#FFF', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: '800', fontSize: '1.1rem', cursor: isProcessingPago ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'space-between', boxShadow: isProcessingPago ? 'none' : '0 4px 15px rgba(227,30,36,0.3)', transition: transicionSuave }}>
              <span>{isProcessingPago ? 'Procesando...' : (user ? 'Confirmar Pedido' : 'Inicia Sesión para Pagar')}</span>
              {!isProcessingPago && <span>RD$ {(totalCarrito + 50).toFixed(2)}</span>}
            </button>
          </div>
        )}
      </div>
      
      {isCartOpen && <div onClick={() => setIsCartOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1999, backdropFilter: 'blur(2px)' }}></div>}

      {/* MENÚ INFERIOR */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(10px)', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 10px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))', zIndex: 1000, boxShadow: '0 -10px 25px rgba(0,0,0,0.06)' }}>
        <div onClick={() => setActiveTab('inicio')} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.7rem', color: activeTab === 'inicio' ? '#E31E24' : '#9CA3AF', fontWeight: '800', cursor: 'pointer', transition: transicionSuave }}>
          <IconHome active={activeTab === 'inicio'} /><span style={{ marginTop: '5px' }}>Inicio</span>
        </div>
        <div onClick={() => setActiveTab('pedidos')} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.7rem', color: activeTab === 'pedidos' ? '#E31E24' : '#9CA3AF', fontWeight: '800', cursor: 'pointer', transition: transicionSuave }}>
          <IconOrders active={activeTab === 'pedidos'} /><span style={{ marginTop: '5px' }}>Pedidos</span>
        </div>
        <div onClick={() => setActiveTab('wallet')} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.7rem', color: activeTab === 'wallet' ? '#E31E24' : '#9CA3AF', fontWeight: '800', cursor: 'pointer', transition: transicionSuave }}>
          <IconWallet active={activeTab === 'wallet'} /><span style={{ marginTop: '5px' }}>Wallet</span>
        </div>
        <div onClick={() => { switchAuthView('login'); setActiveTab('perfil'); }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.7rem', color: activeTab === 'perfil' ? '#E31E24' : '#9CA3AF', fontWeight: '800', cursor: 'pointer', transition: transicionSuave }}>
          <IconProfile active={activeTab === 'perfil'} /><span style={{ marginTop: '5px' }}>Perfil</span>
        </div>
      </nav>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        @keyframes subtlePan { 0% { background-position: 0% 50%; transform: scale(1); } 100% { background-position: 100% 50%; transform: scale(1.05); } }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
        @media (min-width: 768px) { .desktop-wallet { display: block !important; } }
      `}</style>
    </div>
  );
}
