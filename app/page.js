'use client'
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { 
  Search, ShoppingCart, MapPin, ChevronRight, Home, Grid, 
  Heart, User, Plus, Minus, Star, Clock, Tag, X, ShoppingBag, 
  Sparkles, Wine, ArrowRight, BadgePercent, Trash2, Truck, 
  CheckCircle, LogOut, Edit2, ShieldCheck, Phone
} from 'lucide-react';

// ==========================================
// 1. LOGO Y COMPONENTES VISUALES
// ==========================================
const KolmaLogo = ({ className }) => (
  <svg viewBox="0 0 200 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 10H50C65 10 75 20 75 30C75 40 65 50 50 50H20V10Z" fill="white" />
    <path d="M28 18V42H48C56 42 62 36 62 30C62 24 56 18 48 18H28Z" fill="#E11D48" />
    <text x="85" y="42" fill="white" fontSize="32" fontWeight="900" fontFamily="system-ui, sans-serif">KOLMA</text>
  </svg>
);

const OFFERS = [
  {
    id: 1,
    title: 'Orgullo de Cotuí',
    subtitle: 'Siempre lo más fresco de nuestra tierra',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    color: 'from-red-600 to-rose-700',
    tag: 'LOCAL'
  },
  {
    id: 2,
    title: 'Reserva Exclusiva',
    subtitle: 'Elegancia y distinción en cada copa',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
    color: 'from-slate-900 to-red-900',
    tag: 'PREMIUM',
    icon: <Wine className="w-5 h-5 text-amber-400" />
  },
  {
    id: 3,
    title: 'Hogar Impecable',
    subtitle: 'Productos Kolma: Limpieza profunda y frescura',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    color: 'from-blue-600 to-red-600',
    tag: 'PRODUCTOS',
    isBravo: true
  }
];

// ==========================================
// COMPONENTE DE MAPA REAL (Leaflet)
// ==========================================
const TrackingKolma = ({ pedido, cerrarMapa }) => {
  const leafletMap = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initMap = () => {
      const L = window.L;
      if (!L || leafletMap.current) return;

      leafletMap.current = L.map('kolma-map', { zoomControl: false, attributionControl: false }).setView([19.0528, -70.1435], 15);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(leafletMap.current);

      const deliveryIcon = L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color: #dc2626; padding: 10px; border-radius: 15px; border: 3px solid white; box-shadow: 0 4px 15px rgba(220,38,38,0.4);">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
              </div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      markerRef.current = L.marker([19.0528, -70.1435], { icon: deliveryIcon }).addTo(leafletMap.current);
    };

    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    } else {
      initMap();
    }
  }, []);

  useEffect(() => {
    if (pedido.driverLat && markerRef.current) {
      const newPos = [pedido.driverLat, pedido.driverLng];
      markerRef.current.setLatLng(newPos);
      if (leafletMap.current) leafletMap.current.panTo(newPos);
    }
  }, [pedido.driverLat, pedido.driverLng]);

  return (
    <div className="fixed inset-0 z-[4000] bg-[#F8F9FB] flex flex-col">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl z-[4002] px-6 py-4 flex items-center border-b border-slate-100">
        <button onClick={cerrarMapa} className="absolute left-6 p-2 bg-slate-100 rounded-full flex items-center justify-center">
          <ArrowRight className="w-5 h-5 text-slate-800 rotate-180" />
        </button>
        <div className="text-center w-full">
          <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Kolma En Vivo</p>
          <p className="text-sm font-bold text-slate-800">Cotuí, RD</p>
        </div>
      </nav>

      <div className="relative h-[55vh] w-full pt-20 z-[4001]">
        <div id="kolma-map" className="absolute inset-0 bg-slate-100 z-0" />
        <div className="absolute bottom-8 left-6 right-6 z-[4002] bg-white p-6 rounded-[2rem] shadow-xl flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Estado Real</p>
              <p className="text-xl font-black text-slate-900">{pedido.shipdayMsg || pedido.estado || 'Buscando...'}</p>
            </div>
          </div>
          <ShieldCheck className="w-8 h-8 text-green-500" />
        </div>
      </div>

      <main className="flex-1 p-6 z-[4001] bg-[#F8F9FB] relative">
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="bg-red-50 p-6 rounded-[2rem] flex items-center gap-5 border border-red-100">
            <Truck className="w-10 h-10 text-red-600" />
            <div>
              <p className="font-black text-slate-900 text-lg">Kolma Delivery</p>
              <p className="text-sm text-red-600 font-bold">Orden #{pedido.id}</p>
            </div>
          </div>
          
          {(pedido.driverName || pedido.eta) && (
            <div className="mt-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 bg-[url('https://i.pravatar.cc/150?u=kolma_driver')] bg-cover"></div>
                <div>
                  <p className="text-lg font-black text-slate-900">{pedido.driverName || 'Repartidor'}</p>
                  <p className="text-xs font-bold text-slate-500">Llega en {pedido.eta ? `${pedido.eta} min` : '...'}</p>
                </div>
              </div>
              {pedido.driverPhone && (
                <a href={`tel:${pedido.driverPhone}`} className="p-3 bg-slate-900 rounded-2xl text-white flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </a>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// ==========================================
// APLICACIÓN PRINCIPAL
// ==========================================
const App = () => {
  // --- Estados de Diseño y UI ---
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  
  // --- Estados de Datos Shopify ---
  const [productos, setProductos] = useState([]);
  const [colecciones, setColecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorShopify, setErrorShopify] = useState(''); 
  const [categoriaActiva, setCategoriaActiva] = useState('Todas'); 
  const [productoAmpliado, setProductoAmpliado] = useState(null);

  // --- Estados de Usuario y Auth ---
  const [user, setUser] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [errorAuth, setErrorAuth] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    nombre: '', email: '', telefono: '', password: '', direccion: '' 
  });
  
  // --- Estados de Carrito y Checkout ---
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart'); 
  const [metodoPago, setMetodoPago] = useState('efectivo'); 
  const [cupon, setCupon] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [isMissingInfoOpen, setIsMissingInfoOpen] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // --- Estados de Pedidos y Mapa ---
  const [pedidoActual, setPedidoActual] = useState(null);
  const [verMapaPremium, setVerMapaPremium] = useState(false);

  // --- Credenciales ---
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "q0q09e-cp.myshopify.com";
  const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || "c9bda45020488455d7fe2d8b7e22f352";

  // ==========================================
  // EFECTO 1: Carga Inicial (Shopify + Auth URL)
  // ==========================================
  useEffect(() => {
    // Detectar si el link pide abrir registro
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('auth') === 'register') {
        setAuthMode('register');
        setIsAuthOpen(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    const token = localStorage.getItem('kolma_access_token');
    const savedName = localStorage.getItem('kolma_user_name');
    const savedEmail = localStorage.getItem('kolma_user_email');
    const savedAddress = localStorage.getItem('kolma_user_address');
    const savedPhone = localStorage.getItem('kolma_user_phone');
    const savedOrder = localStorage.getItem('kolma_last_order'); 

    if (token) {
      setUser({ 
        id: token, nombre: savedName || "Cliente", email: savedEmail, 
        direccion: savedAddress || "", telefono: savedPhone || "" 
      });
      setFormData(prev => ({ 
        ...prev, nombre: savedName || '', email: savedEmail || '', 
        direccion: savedAddress || '', telefono: savedPhone || '' 
      }));
    }

    if (savedOrder) {
      try { setPedidoActual(JSON.parse(savedOrder)); } catch(e) {}
    }

    async function fetchData() {
      if(!domain || !accessToken) { 
        setErrorShopify("Faltan las credenciales de Shopify.");
        setLoading(false); return; 
      }
      try {
        const res = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': accessToken },
          body: JSON.stringify({ 
            query: `{ 
              collections(first: 20) { edges { node { id title } } }
              products(first: 50) { 
                edges { 
                  node { 
                    id title tags 
                    collections(first: 5) { edges { node { title } } } 
                    images(first: 1) { edges { node { url } } } 
                    variants(first: 1) { edges { node { id price { amount } } } } 
                  } 
                } 
              } 
            }` 
          }),
        });
        
        const { data, errors } = await res.json();
        if (errors) { setErrorShopify("Error conectando con Shopify"); setLoading(false); return; }

        if(data?.collections) {
          setColecciones([{node: {id: 'all', title: 'Todas'}}, ...data.collections.edges]);
        }
        if(data?.products) {
          setProductos(data.products.edges);
        }
        setLoading(false);
      } catch (e) { 
        setErrorShopify("Error de red conectando a la tienda."); setLoading(false); 
      }
    }
    fetchData();

    // Timer Banners
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % OFFERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [domain, accessToken]);

  // ==========================================
  // EFECTO 2: Radar de Shipday (Auto-Refresh)
  // ==========================================
  useEffect(() => {
    if (!pedidoActual || ['Entregado', 'Finalizado'].includes(pedidoActual.estado)) return;
    const rastreador = setInterval(async () => {
      try {
        const res = await fetch(`/api/status?id=${pedidoActual.id}&t=${Date.now()}`);
        const data = await res.json();
        
        if (data.success && data.status_route) {
           const info = data.status_route;
           const statusRaw = info.status.toUpperCase();
           
           if (['ALREADY_DELIVERED', 'SUCCESSFUL', 'DELIVERED', 'COMPLETED', 'DONE'].includes(statusRaw)) {
              clearInterval(rastreador); 
              const pedidoEntregado = { ...pedidoActual, estado: 'Entregado', entregadoAt: Date.now() };
              setPedidoActual(pedidoEntregado);
              localStorage.setItem('kolma_last_order', JSON.stringify(pedidoEntregado));
              return;
           }

           let nuevoEstado = pedidoActual.estado;
           if (['UNASSIGNED', 'ACCEPTED', 'PENDING'].includes(statusRaw)) nuevoEstado = 'Preparando';
           if (['ASSIGNED', 'STARTED', 'PICKED_UP', 'READY_TO_DELIVER', 'ACTIVE', 'ON_THE_WAY', 'ARRIVED'].includes(statusRaw)) nuevoEstado = 'En camino';

           const pedidoActualizado = { 
             ...pedidoActual, 
             estado: nuevoEstado, 
             trackingUrl: data.trackingUrl || pedidoActual.trackingUrl, 
             shipdayMsg: statusRaw,
             driverLat: info.driver_location?.lat || pedidoActual.driverLat,
             driverLng: info.driver_location?.lng || pedidoActual.driverLng,
             driverName: info.driver_name || pedidoActual.driverName,
             driverPhone: info.driver_phone || pedidoActual.driverPhone,
             eta: info.eta || pedidoActual.eta
           };

           setPedidoActual(pedidoActualizado);
           localStorage.setItem('kolma_last_order', JSON.stringify(pedidoActualizado));
        }
      } catch(e) {}
    }, 10000); 
    return () => clearInterval(rastreador);
  }, [pedidoActual]);

  // ==========================================
  // EFECTO 3: Expiración de Factura (1 Hora)
  // ==========================================
  useEffect(() => {
    if (pedidoActual?.estado === 'Entregado' && pedidoActual.entregadoAt) {
      const revisarExpiracion = setInterval(() => {
        if (Date.now() - pedidoActual.entregadoAt >= 3600000) {
          const pedidoFinalizado = { ...pedidoActual, estado: 'Finalizado' };
          setPedidoActual(pedidoFinalizado);
          localStorage.setItem('kolma_last_order', JSON.stringify(pedidoFinalizado));
          clearInterval(revisarExpiracion);
        }
      }, 60000);
      return () => clearInterval(revisarExpiracion);
    }
  }, [pedidoActual]);


  // ==========================================
  // LÓGICA DE USUARIOS
  // ==========================================
  const formatPhone = (tel) => {
    let clean = tel.replace(/\D/g, '');
    if (clean.length === 10) return `+1${clean}`;
    if (clean.length === 11 && clean.startsWith('1')) return `+${clean}`;
    return clean;
  };

  const persistUserData = (data) => {
    localStorage.setItem('kolma_user_name', data.nombre || "");
    localStorage.setItem('kolma_user_email', data.email || "");
    localStorage.setItem('kolma_user_phone', data.telefono || "");
    localStorage.setItem('kolma_user_address', data.direccion || "");
    setUser(data);
  };

  const handleAuthentication = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); setErrorAuth('');
    const shopifyUrl = `https://${domain}/api/2024-04/graphql.json`;
    const headers = { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': accessToken };

    try {
      if (authMode === 'register') {
        const telefonoValido = formatPhone(formData.telefono);
        if (telefonoValido.length < 11) throw new Error("Ingresa un teléfono válido de 10 dígitos.");
        if (formData.direccion.length < 5) throw new Error("Ingresa una dirección completa en Cotuí.");
        
        const res = await fetch(shopifyUrl, {
          method: 'POST', headers,
          body: JSON.stringify({
            query: `mutation customerCreate($input: CustomerCreateInput!) { customerCreate(input: $input) { customerUserErrors { message } } }`,
            variables: { input: { firstName: formData.nombre, lastName: formData.direccion, email: formData.email, phone: telefonoValido, password: formData.password } }
          })
        });
        const { data } = await res.json();
        if (data.customerCreate.customerUserErrors.length > 0) throw new Error(data.customerCreate.customerUserErrors[0].message);
        
        setAuthMode('login');
        setErrorAuth('¡Cuenta creada! Inicia sesión.');
      } else {
        const loginRes = await fetch(shopifyUrl, {
          method: 'POST', headers,
          body: JSON.stringify({
            query: `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) { customerAccessTokenCreate(input: $input) { customerAccessToken { accessToken } customerUserErrors { message } } }`,
            variables: { input: { email: formData.email, password: formData.password } }
          })
        });
        const { data } = await loginRes.json();
        if (data.customerAccessTokenCreate.customerUserErrors.length > 0) throw new Error(data.customerAccessTokenCreate.customerUserErrors[0].message);
        
        const token = data.customerAccessTokenCreate.customerAccessToken.accessToken;
        const profileRes = await fetch(shopifyUrl, {
          method: 'POST', headers,
          body: JSON.stringify({ query: `{ customer(customerAccessToken: "${token}") { firstName lastName email phone } }` })
        });
        const profileData = await profileRes.json();
        const c = profileData.data.customer;

        persistUserData({ id: token, nombre: c.firstName || formData.email.split('@')[0], email: c.email, telefono: c.phone || "", direccion: c.lastName || "" });
        localStorage.setItem('kolma_access_token', token);
        setIsAuthOpen(false);
      }
    } catch (err) { setErrorAuth(err.message); } 
    finally { setIsSubmitting(false); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('kolma_access_token');
    try {
      if (token) {
        await fetch(`https://${domain}/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': accessToken },
          body: JSON.stringify({
            query: `mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) { customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) { customer { firstName } } }`,
            variables: { customerAccessToken: token, customer: { firstName: formData.nombre, lastName: formData.direccion, phone: formatPhone(formData.telefono) } }
          })
        });
      }
      persistUserData({ ...user, nombre: formData.nombre, telefono: formatPhone(formData.telefono), direccion: formData.direccion });
      setIsEditingProfile(false); setIsMissingInfoOpen(false);
    } catch (err) {} finally { setIsSubmitting(false); }
  };

  const handleLogout = () => {
    localStorage.clear(); setUser(null); setPedidoActual(null);
    setFormData({ nombre: '', email: '', telefono: '', password: '', direccion: '' });
    setActiveTab('home');
  };

  // ==========================================
  // LÓGICA DE CARRITO Y CHECKOUT
  // ==========================================
  const addToCart = (product) => {
    const variantId = product.node ? product.node.variants.edges[0]?.node.id : product.variantId;
    const price = product.node ? parseFloat(product.node.variants.edges[0]?.node.price.amount) : product.price;
    const title = product.node ? product.node.title : product.title;
    const img = product.node ? product.node.images.edges[0]?.node.url : product.img;
    const id = product.node ? product.node.id : product.id;

    setCart(prev => {
      const existing = prev.find(item => item.variantId === variantId);
      if (existing) return prev.map(item => item.variantId === variantId ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { id, title, price, img, variantId, qty: 1 }];
    });
    setIsCartOpen(true);
    setCheckoutStep('cart');
    setProductoAmpliado(null);
  };

  const updateQty = (variantId, delta) => {
    setCart(prev => prev.map(item => item.variantId === variantId ? { ...item, qty: Math.max(0, item.qty + delta) } : item).filter(item => item.qty > 0));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalFinal = cartTotal - descuentoAplicado;

  const avanzarAPago = () => {
    if (!user) { setIsCartOpen(false); setIsAuthOpen(true); return; }
    if (!user.nombre || !user.telefono || !user.direccion || user.direccion.length < 5) {
      setIsCartOpen(false); setIsMissingInfoOpen(true); return;
    }
    setCheckoutStep('payment'); 
  };

  const finalizarPedido = async () => {
    setIsProcessingOrder(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cart.map(i => ({...i, quantity: i.qty})), 
          customer: user, total: totalFinal.toFixed(2), metodoPago, descuento: descuentoAplicado.toFixed(2) 
        })
      });
      const data = await res.json();
      if(!data.success) throw new Error("Error en servidor");
      
      const nuevoPedido = { 
        id: data.orderId, trackingUrl: data.trackingUrl, items: cart.map(i => ({...i, quantity: i.qty})), 
        subtotal: cartTotal, descuento: descuentoAplicado, total: totalFinal, 
        fecha: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(), 
        estado: 'Recibido', metodo: metodoPago
      };
      setPedidoActual(nuevoPedido);
      localStorage.setItem('kolma_last_order', JSON.stringify(nuevoPedido));
      
      setCart([]); setCupon(''); setDescuentoAplicado(0); setIsCartOpen(false); setCheckoutStep('cart');
      setShowSuccessModal(true);
    } catch (e) { alert("Error de conexión."); } finally { setIsProcessingOrder(false); }
  };

  // ==========================================
  // FILTRADO DE PRODUCTOS 
  // ==========================================
  const filteredProducts = useMemo(() => {
    return productos.filter(p => {
      // Ocultar productos con etiqueta POS
      if (p.node.tags && p.node.tags.some(tag => tag.toLowerCase() === 'pos')) return false;
      const matchSearch = p.node.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoriaActiva === 'Todas' || p.node.collections.edges.some(c => c.node.title === categoriaActiva);
      return matchSearch && matchCat;
    });
  }, [productos, searchQuery, categoriaActiva]);

  // Colecciones destacadas para la UI
  const displaySections = colecciones.filter(c => c.node.title !== 'Todas').slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FFFBFB] pb-32 font-sans text-slate-900 overflow-x-hidden">
      
      {/* ------------------------------------------- */}
      {/* MODALES FLOTANTES (Éxito, Producto, Auth, Info) */}
      {/* ------------------------------------------- */}
      {verMapaPremium && pedidoActual && (
        <TrackingKolma pedido={pedidoActual} cerrarMapa={() => setVerMapaPremium(false)} />
      )}

      {productoAmpliado && (
        <div className="fixed inset-0 z-[5000] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden relative shadow-2xl flex flex-col">
            <button onClick={() => setProductoAmpliado(null)} className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full z-10 hover:bg-slate-200 transition-colors">
              <X className="w-6 h-6 text-slate-600" />
            </button>
            <div className="bg-slate-50 p-8 flex justify-center items-center min-h-[250px]">
              <img src={productoAmpliado.node.images.edges[0]?.node.url} className="w-full max-h-[300px] object-contain drop-shadow-xl" alt={productoAmpliado.node.title} />
            </div>
            <div className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-black text-slate-800 leading-tight">{productoAmpliado.node.title}</h3>
              <p className="text-4xl font-black text-red-600">
                RD${parseFloat(productoAmpliado.node.variants.edges[0]?.node.price.amount).toFixed(0)}
              </p>
              <button onClick={() => addToCart(productoAmpliado)} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4">
                <ShoppingCart className="w-6 h-6" /> Añadir a la Canasta
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[5000] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 text-center animate-in zoom-in duration-300">
            <div className="flex justify-center mb-6"><CheckCircle className="w-20 h-20 text-green-500" /></div>
            <h2 className="text-2xl font-black text-slate-800 mb-4">¡Pedido Confirmado!</h2>
            <p className="text-slate-500 font-medium mb-8">Tu orden #{pedidoActual?.id} ha sido recibida y la estamos preparando para Cotuí.</p>
            <button onClick={() => { setShowSuccessModal(false); setActiveTab('pedidos'); }} className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-lg shadow-lg hover:bg-red-700 transition-colors">
              Ver Estatus
            </button>
          </div>
        </div>
      )}

      {isMissingInfoOpen && (
        <div className="fixed inset-0 z-[5000] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8">
            <h3 className="text-2xl font-black text-slate-800 mb-2">Datos de Envío</h3>
            <p className="text-slate-500 mb-6 font-medium">Completa tu info para entregar en Cotuí.</p>
            <form onSubmit={(e) => { handleUpdateProfile(e); if (formData.telefono.length >= 10 && formData.direccion.length >= 5) setCheckoutStep('payment'); }} className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-400">TELÉFONO</label>
                <input required value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-red-500" placeholder="Ej: 8090000000" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400">DIRECCIÓN EN COTUÍ</label>
                <textarea required value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-red-500 h-24 resize-none" placeholder="Sector, calle..." />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-red-600 text-white font-black rounded-xl shadow-lg shadow-red-600/20">{isSubmitting ? 'Guardando...' : 'Continuar al Pago'}</button>
                <button type="button" onClick={() => setIsMissingInfoOpen(false)} className="w-full py-4 text-slate-400 font-bold mt-2">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAuthOpen && (
        <div className="fixed inset-0 z-[5000] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-800">{authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</h3>
              <button onClick={() => setIsAuthOpen(false)} className="p-2 bg-slate-100 rounded-full"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleAuthentication} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="text-xs font-black text-slate-400">NOMBRE</label>
                  <input required onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-red-500" />
                </div>
              )}
              <div>
                <label className="text-xs font-black text-slate-400">CORREO</label>
                <input type="email" required onChange={e => setFormData({...formData, email: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-red-500" />
              </div>
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="text-xs font-black text-slate-400">TELÉFONO</label>
                    <input required onChange={e => setFormData({...formData, telefono: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400">DIRECCIÓN (COTUÍ)</label>
                    <input required onChange={e => setFormData({...formData, direccion: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-red-500" />
                  </div>
                </>
              )}
              <div>
                <label className="text-xs font-black text-slate-400">CONTRASEÑA</label>
                <input type="password" required onChange={e => setFormData({...formData, password: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-red-500" />
              </div>
              
              {errorAuth && <div className="p-3 bg-red-50 border border-red-200 rounded-xl"><p className="text-red-600 text-xs font-bold">{errorAuth}</p></div>}
              
              <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-4 bg-red-600 text-white font-black rounded-xl shadow-lg shadow-red-600/20">
                {isSubmitting ? 'Procesando...' : authMode === 'login' ? 'ENTRAR' : 'REGISTRARSE'}
              </button>
            </form>
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              {authMode === 'login' ? (
                <p className="text-sm font-bold text-slate-500">¿No tienes cuenta? <span onClick={() => setAuthMode('register')} className="text-red-600 cursor-pointer">Regístrate</span></p>
              ) : (
                <p className="text-sm font-bold text-slate-500">¿Ya tienes cuenta? <span onClick={() => setAuthMode('login')} className="text-red-600 cursor-pointer">Inicia Sesión</span></p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------- */}
      {/* CARRITO LATERAL (Con Checkout Integrado) */}
      {/* ------------------------------------------- */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isCartOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsCartOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-3">
              {checkoutStep === 'payment' && (
                <button onClick={() => setCheckoutStep('cart')} className="p-1 hover:bg-slate-100 rounded-lg"><ArrowRight className="w-5 h-5 rotate-180 text-slate-500"/></button>
              )}
              <h3 className="text-xl font-black text-slate-800">{checkoutStep === 'cart' ? 'Tu Canasta' : 'Pago y Envío'}</h3>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50">
            {checkoutStep === 'cart' ? (
              cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm"><ShoppingCart className="w-10 h-10 text-slate-300" /></div>
                  <p className="font-black text-lg text-slate-800">Canasta Vacía</p>
                  <p className="font-medium text-slate-500 mt-2">Agrega lo mejor de Cotuí para empezar.</p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {cart.map(item => (
                    <div key={item.variantId} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.img} alt={item.title} className="w-full h-full object-contain p-2" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm leading-tight text-slate-800 line-clamp-2">{item.title}</h4>
                          <p className="text-sm text-red-600 font-black mt-1">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                            <button onClick={() => updateQty(item.variantId, -1)} className="w-7 h-7 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-md"><Minus className="w-3 h-3" /></button>
                            <span className="w-8 text-center text-xs font-black">{item.qty}</span>
                            <button onClick={() => updateQty(item.variantId, 1)} className="w-7 h-7 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-md"><Plus className="w-3 h-3" /></button>
                          </div>
                          <button onClick={() => updateQty(item.variantId, -item.qty)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              // PASO DE PAGO
              <div className="p-6 space-y-6 animate-in slide-in-from-right-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-black text-slate-800">Enviar a:</h4>
                    <span onClick={() => {setIsCartOpen(false); setActiveTab('profile')}} className="text-red-600 text-xs font-black cursor-pointer">CAMBIAR</span>
                  </div>
                  <p className="font-bold text-slate-700">{user.nombre}</p>
                  <p className="text-sm text-slate-500 mt-1">{user.direccion}</p>
                  <p className="text-sm text-slate-500 mt-1 font-medium">Cel: {user.telefono}</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <h4 className="font-black text-slate-800 mb-3">Código de Descuento</h4>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Ej. KOLMA10" value={cupon} onChange={e => setCupon(e.target.value)} className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold outline-none focus:border-red-300 uppercase text-sm" />
                    <button onClick={() => { if(cupon.toUpperCase() === 'KOLMA10') { setDescuentoAplicado(cartTotal*0.10); alert("¡Cupón aplicado!"); } else { alert("Cupón inválido"); setDescuentoAplicado(0); } }} disabled={!cupon} className="bg-slate-900 text-white px-5 rounded-xl font-black text-xs uppercase disabled:opacity-50">Aplicar</button>
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-slate-800 mb-3 pl-1">Método de Pago</h4>
                  <div onClick={() => setMetodoPago('efectivo')} className={`bg-white p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-4 transition-all mb-3 ${metodoPago === 'efectivo' ? 'border-red-600 shadow-md' : 'border-slate-100'}`}>
                    <div className={`w-5 h-5 rounded-full border-4 ${metodoPago === 'efectivo' ? 'border-red-600' : 'border-slate-200'}`} />
                    <div>
                      <p className="font-black text-slate-800">Efectivo al recibir</p>
                      <p className="text-xs text-slate-500 font-medium">Paga en tu puerta en Cotuí.</p>
                    </div>
                  </div>
                  <div onClick={() => setMetodoPago('tarjeta')} className={`bg-white p-4 rounded-2xl border-2 cursor-pointer flex items-start gap-4 transition-all opacity-70 ${metodoPago === 'tarjeta' ? 'border-red-600' : 'border-slate-100'}`}>
                    <div className={`w-5 h-5 rounded-full border-4 mt-1 ${metodoPago === 'tarjeta' ? 'border-red-600' : 'border-slate-200'}`} />
                    <div>
                      <p className="font-black text-slate-800">Tarjeta / Online</p>
                      {metodoPago === 'tarjeta' && <p className="text-xs font-bold text-red-600 mt-2 bg-red-50 p-2 rounded-lg">⚠️ Opción no disponible por ahora. Elige efectivo.</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] z-10">
            {checkoutStep === 'payment' && (
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm font-medium text-slate-500"><span>Subtotal</span><span>RD$ {cartTotal.toFixed(2)}</span></div>
                {descuentoAplicado > 0 && <div className="flex justify-between text-sm font-black text-green-500"><span>Descuento</span><span>- RD$ {descuentoAplicado.toFixed(2)}</span></div>}
                <div className="flex justify-between text-sm font-medium text-slate-500"><span>Delivery</span><span className="font-black text-green-500">GRATIS</span></div>
                <div className="border-t border-slate-100 pt-2 mt-2"></div>
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-black text-slate-800">{checkoutStep === 'cart' ? 'Total' : 'Total a Pagar'}</span>
              <span className="text-2xl font-black text-red-600">RD$ {totalFinal.toFixed(2)}</span>
            </div>
            
            {checkoutStep === 'cart' ? (
              <button onClick={avanzarAPago} disabled={cart.length === 0} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-200 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-600/20 active:scale-95 transition-all uppercase tracking-widest text-xs">
                Continuar al Pago
              </button>
            ) : (
              <button onClick={finalizarPedido} disabled={isProcessingOrder || metodoPago === 'tarjeta'} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-200 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-600/20 active:scale-95 transition-all uppercase tracking-widest text-xs">
                {isProcessingOrder ? 'PROCESANDO...' : 'CONFIRMAR PEDIDO'}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ------------------------------------------- */}
      {/* HEADER PRINCIPAL */}
      {/* ------------------------------------------- */}
      <header className="sticky top-0 z-[60] bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-xl mx-auto px-4 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20" onClick={() => setActiveTab('home')}>
                <ShoppingBag className="text-white w-7 h-7" />
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">Entregar en</span>
                <div className="flex items-center gap-1 cursor-pointer">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span className="text-sm font-black text-slate-800">{user?.direccion ? "Cotuí (Guardada)" : "Cotuí, RD"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveTab('profile')} className="w-10 h-10 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-50 font-black">
                {user ? user.nombre.charAt(0).toUpperCase() : <User className="w-5 h-5"/>}
              </button>
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {setSearchQuery(e.target.value); if(e.target.value && activeTab !== 'search') setActiveTab('search');}}
              placeholder="Buscar frutas, vinos, limpieza..." 
              className="w-full bg-slate-50 border-2 border-slate-100 focus:border-red-500/20 focus:bg-white rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </header>

      {/* ------------------------------------------- */}
      {/* VISTAS PRINCIPALES */}
      {/* ------------------------------------------- */}
      <main className="max-w-xl mx-auto px-4 py-6 space-y-10">
        
        {/* VISTA 1: HOME O SEARCH */}
        {(activeTab === 'home' || activeTab === 'search') && (
          <div className="space-y-10 animate-in fade-in">
            
            {/* BANNERS DINÁMICOS (Solo en Home sin busqueda) */}
            {activeTab === 'home' && !searchQuery && (
              <section className="relative overflow-hidden rounded-[2.5rem] shadow-2xl shadow-slate-200 h-[220px]">
                <div className="flex transition-transform duration-1000 ease-in-out h-full" style={{ transform: `translateX(-${currentBanner * 100}%)` }}>
                  {OFFERS.map((offer) => (
                    <div key={offer.id} className="min-w-full relative h-full group">
                      <div className={`absolute inset-0 bg-gradient-to-tr ${offer.color} mix-blend-multiply opacity-80 z-10 transition-opacity`} />
                      <img src={offer.image} alt={offer.title} className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110" />
                      <div className="absolute inset-0 p-8 flex flex-col justify-center text-white z-20 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/30">
                            {offer.tag}
                          </span>
                        </div>
                        {offer.isBravo ? (
                          <div className="space-y-3">
                            <div className="bg-white/90 p-2 rounded-xl w-fit shadow-lg"><KolmaLogo className="h-6 w-auto" /></div>
                            <h2 className="text-xl font-black leading-tight max-w-[260px] drop-shadow-lg">{offer.subtitle}</h2>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <h2 className="text-3xl font-black leading-none drop-shadow-lg">{offer.title}</h2>
                            <p className="text-sm font-medium text-white/90 max-w-[250px] leading-tight italic drop-shadow-md">{offer.subtitle}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                  {OFFERS.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${currentBanner === i ? 'w-6 bg-white' : 'w-2 bg-white/40'}`} />
                  ))}
                </div>
              </section>
            )}

            {/* CATEGORÍAS */}
            {activeTab === 'home' && !searchQuery && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-black text-xl text-slate-800 tracking-tight">Categorías</h3>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
                  {colecciones.map((col, index) => (
                    <button key={col.node.id} onClick={() => setCategoriaActiva(col.node.title)} className="group flex flex-col items-center gap-2 min-w-[80px]">
                      <div className={`w-[70px] h-[70px] rounded-[2rem] flex items-center justify-center text-xl shadow-sm transition-all border-2 ${categoriaActiva === col.node.title ? 'bg-red-600 border-red-600 text-white shadow-red-200 -translate-y-1' : 'bg-white border-slate-100 text-slate-600 group-hover:border-red-200'}`}>
                        {index % 3 === 0 ? '🥑' : index % 3 === 1 ? '🥩' : '🥤'}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${categoriaActiva === col.node.title ? 'text-red-600' : 'text-slate-500'}`}>{col.node.title === 'Todas' ? 'Todo' : col.node.title}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* ERROR O LOADING */}
            {loading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-red-600 rounded-full animate-spin mb-4"></div>
                <p className="font-black text-slate-400">Cargando pasillos...</p>
              </div>
            ) : errorShopify ? (
              <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 text-center">
                <p className="font-black text-red-600">{errorShopify}</p>
              </div>
            ) : (
              // GRID DE PRODUCTOS
              <div className="space-y-10">
                {displaySections.map((col, sectionIdx) => {
                  const sectionProducts = filteredProducts.filter(p => p.node.collections.edges.some(c => c.node.title === col.node.title));
                  if (sectionProducts.length === 0) return null;

                  return (
                    <section key={col.node.id}>
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-6 rounded-full ${sectionIdx === 0 ? 'bg-orange-500' : sectionIdx === 1 ? 'bg-blue-500' : 'bg-red-600'}`} />
                          <h3 className="font-black text-xl text-slate-800 tracking-tight">{col.node.title}</h3>
                        </div>
                      </div>

                      {sectionIdx === 1 ? (
                        // Horizontal Scroll para la segunda sección (Estilo "Bodega" del diseño nuevo)
                        <div className="flex gap-5 overflow-x-auto pb-6 no-scrollbar -mx-4 px-4">
                          {sectionProducts.map(({node}) => (
                            <div key={node.id} className="min-w-[180px] w-[180px] bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                              <div onClick={() => setProductoAmpliado({node})} className="relative mb-4 aspect-[4/5] bg-[#F8F9FB] rounded-[1.5rem] overflow-hidden cursor-pointer flex items-center justify-center p-4">
                                <img src={node.images.edges[0]?.url} alt={node.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" />
                                <div className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-sm"><Heart className="w-3.5 h-3.5 text-slate-300" /></div>
                              </div>
                              <h4 className="font-black text-xs text-slate-800 mb-2 leading-tight line-clamp-2 h-8">{node.title}</h4>
                              <div className="flex items-center justify-between mt-auto pt-2">
                                <span className="text-lg font-black text-slate-900">${parseFloat(node.variants.edges[0]?.node.price.amount).toFixed(0)}</span>
                                <button onClick={(e) => { e.stopPropagation(); addToCart({node}); }} className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-all active:scale-90 shadow-md">
                                  <Plus className="w-5 h-5"/>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        // Grid 2 columnas para el resto
                        <div className="grid grid-cols-2 gap-4">
                          {sectionProducts.map(({node}) => (
                            <div key={node.id} className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                              <div onClick={() => setProductoAmpliado({node})} className="relative mb-4 aspect-square bg-[#F8F9FB] rounded-[1.5rem] overflow-hidden cursor-pointer flex items-center justify-center p-4">
                                <img src={node.images.edges[0]?.url} alt={node.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" />
                                <div className="absolute bottom-3 left-3 bg-red-600 text-white text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest shadow-md">
                                  {node.tags[0] || 'Top'}
                                </div>
                              </div>
                              <div className="flex flex-col flex-1">
                                <div className="flex items-center gap-1 mb-1.5">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span className="text-[10px] font-bold text-slate-400">4.8</span>
                                </div>
                                <h4 className="text-xs font-black text-slate-800 line-clamp-2 mb-2 leading-tight">{node.title}</h4>
                                <div className="flex items-center justify-between mt-auto pt-2">
                                  <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-400 uppercase leading-none">Precio</span>
                                    <span className="text-lg font-black text-slate-900">${parseFloat(node.variants.edges[0]?.node.price.amount).toFixed(0)}</span>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); addToCart({node}); }} className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all active:scale-90 shadow-sm">
                                    <Plus className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            )}

            {/* BANNER CLUB KOLMA */}
            {activeTab === 'home' && !searchQuery && (
              <section className="bg-slate-900 rounded-[2.5rem] p-8 overflow-hidden relative group border-2 border-red-600/30 mt-8">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-red-600/20 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-150" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-[0.2em]">
                    <BadgePercent className="w-4 h-4" />
                    <span>Ahorro Inteligente</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white font-black text-3xl leading-none tracking-tight">Club Kolma Premium</h4>
                    <p className="text-red-500 font-bold text-sm">Ofertas exclusivas en Cotuí</p>
                  </div>
                  <button onClick={() => {if(!user) setIsAuthOpen(true)}} className="bg-red-600 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-red-900/40 active:scale-95 transition-transform uppercase text-xs tracking-widest flex items-center gap-2 mt-4">
                    <Sparkles className="w-4 h-4" /> Unirme y Ahorrar
                  </button>
                </div>
              </section>
            )}
          </div>
        )}

        {/* VISTA 2: MIS PEDIDOS (Tracker) */}
        {activeTab === 'pedidos' && (
          <div className="animate-in fade-in space-y-6">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Mis Pedidos</h2>
            {pedidoActual ? (
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-start border-b-2 border-dashed border-slate-100 pb-6 mb-6">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pedidoActual.estado === 'Finalizado' ? 'Factura' : 'Orden'}</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">#{pedidoActual.id}</p>
                    <div className="flex items-center gap-2 mt-2 text-red-600 font-black text-xs bg-red-50 w-fit px-3 py-1.5 rounded-lg">
                      <Clock className="w-3.5 h-3.5" /> {pedidoActual.fecha.includes('AM') || pedidoActual.fecha.includes('PM') ? pedidoActual.fecha : new Date().toLocaleString()}
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest ${pedidoActual.estado === 'Finalizado' ? 'bg-slate-100 text-slate-500' : pedidoActual.estado === 'Entregado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {pedidoActual.estado}
                  </div>
                </div>

                {/* ANIMACIONES SEGÚN ESTADO */}
                <div className="text-center py-6">
                  {pedidoActual.estado === 'Finalizado' ? (
                    <>
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-10 h-10 text-slate-400" /></div>
                      <h3 className="text-xl font-black text-slate-800">Pedido Cerrado</h3>
                    </>
                  ) : pedidoActual.estado === 'Entregado' ? (
                    <>
                      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-8 border-green-100"><CheckCircle className="w-10 h-10 text-green-500" /></div>
                      <h3 className="text-xl font-black text-green-600">¡Disfruta tu pedido!</h3>
                    </>
                  ) : pedidoActual.estado === 'En camino' ? (
                    <>
                      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-200 animate-bounce"><Truck className="w-10 h-10 text-red-600" /></div>
                      <h3 className="text-xl font-black text-slate-900">¡Va en camino!</h3>
                      <button onClick={() => setVerMapaPremium(true)} className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2">
                        <MapPin className="w-4 h-4"/> Ver Mapa en Vivo
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-orange-200"><ShoppingBag className="w-10 h-10 text-orange-500" /></div>
                      <h3 className="text-xl font-black text-slate-900">Preparando pedido...</h3>
                      <p className="text-sm font-bold text-slate-500 mt-2">{pedidoActual.shipdayMsg || 'Empacando en tienda'}</p>
                    </>
                  )}
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 mt-4 border border-slate-100">
                  <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2"><ShoppingBag className="w-4 h-4"/> Resumen</h4>
                  {pedidoActual.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm mb-3">
                      <span className="font-bold text-slate-600"><span className="text-red-600 font-black mr-2">{item.quantity}x</span>{item.title}</span>
                      <span className="font-black text-slate-900">${(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between items-center">
                    <span className="font-black text-slate-800">TOTAL</span>
                    <span className="text-xl font-black text-red-600">RD$ {pedidoActual.total.toFixed(0)}</span>
                  </div>
                </div>

                {pedidoActual.estado !== 'Finalizado' && (
                  <a href={`https://wa.me/18298558779?text=Hola,%20ayuda%20con%20pedido%20%23${pedidoActual.id}`} target="_blank" rel="noopener noreferrer" className="mt-6 w-full py-4 bg-[#25D366] text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-95 transition-all">
                    WhatsApp Soporte
                  </a>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6"><Truck className="w-10 h-10 text-slate-300" /></div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Sin pedidos activos</h3>
                <p className="text-slate-500 font-medium mb-8">Tus envíos en Cotuí aparecerán aquí.</p>
                <button onClick={() => setActiveTab('home')} className="bg-slate-900 text-white font-black py-4 px-8 rounded-2xl">Ir a Comprar</button>
              </div>
            )}
          </div>
        )}

        {/* VISTA 3: PERFIL */}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Mi Perfil</h2>
              {user && (
                <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-red-100 transition-colors">
                  <LogOut className="w-4 h-4"/> Salir
                </button>
              )}
            </div>

            {user ? (
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative">
                {!isEditingProfile && (
                  <button onClick={() => setIsEditingProfile(true)} className="absolute top-8 right-8 bg-slate-50 p-3 rounded-xl hover:bg-slate-100 transition-colors">
                    <Edit2 className="w-5 h-5 text-slate-600" />
                  </button>
                )}
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-red-600 text-white rounded-[1.5rem] flex items-center justify-center text-3xl font-black shadow-lg shadow-red-600/20">
                    {user.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{user.nombre}</h3>
                    <p className="font-bold text-slate-400">{user.email}</p>
                  </div>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div><label className="text-xs font-black text-slate-400">NOMBRE</label><input value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 rounded-xl font-bold border-2 border-transparent focus:border-red-200 outline-none" required /></div>
                    <div><label className="text-xs font-black text-slate-400">TELÉFONO</label><input value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 rounded-xl font-bold border-2 border-transparent focus:border-red-200 outline-none" required /></div>
                    <div><label className="text-xs font-black text-slate-400">DIRECCIÓN</label><textarea value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 rounded-xl font-bold border-2 border-transparent focus:border-red-200 outline-none h-24 resize-none" required /></div>
                    <div className="flex gap-4 pt-2">
                      <button type="submit" className="flex-1 bg-red-600 text-white py-4 rounded-xl font-black">Guardar</button>
                      <button type="button" onClick={() => setIsEditingProfile(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-black">Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono</span>
                      <p className="font-black text-slate-800 text-lg">{user.telefono || 'No registrado'}</p>
                    </div>
                    <div className="border-t border-slate-200 pt-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dirección (Cotuí)</span>
                      <p className="font-black text-slate-800 text-base leading-tight mt-1">{user.direccion || 'No registrada'}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] p-10 text-center border border-slate-100 shadow-sm flex flex-col items-center">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6"><User className="w-10 h-10 text-red-600" /></div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Crea tu cuenta</h3>
                <p className="text-slate-500 font-medium mb-8">Guarda tus datos para pedir rápido en Cotuí.</p>
                <button onClick={() => { setAuthMode('register'); setIsAuthOpen(true); }} className="w-full bg-red-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-600/20 active:scale-95 transition-all">Registrarse</button>
                <button onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }} className="w-full bg-slate-50 text-slate-800 font-black py-4 rounded-2xl mt-3 active:scale-95 transition-all">Iniciar Sesión</button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* ------------------------------------------- */}
      {/* MENÚ INFERIOR (Bottom Navigation) */}
      {/* ------------------------------------------- */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] w-[92%] max-w-lg">
        <div className="bg-white/90 backdrop-blur-2xl border border-white/60 px-2 py-3 rounded-[2.5rem] flex items-center justify-around shadow-[0_20px_40px_-15px_rgba(225,29,72,0.15)]">
          <NavItem icon={<Home />} label="Inicio" active={activeTab === 'home'} onClick={() => {setActiveTab('home'); setSearchQuery('');}} />
          <NavItem icon={<Grid />} label="Catálogo" active={activeTab === 'search'} onClick={() => setActiveTab('search')} />
          
          <div className="relative -top-8 px-1">
            <button onClick={() => setIsCartOpen(true)} className="bg-red-600 w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-[0_12px_24px_-8px_rgba(225,29,72,0.5)] active:scale-90 hover:rotate-3 transition-all border-[4px] border-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <ShoppingBag className="text-white w-7 h-7" />
              {cartCount > 0 && (
                <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-red-600 shadow-md">
                  {cartCount}
                </div>
              )}
            </button>
          </div>

          <NavItem icon={<Truck />} label="Pedidos" active={activeTab === 'pedidos'} onClick={() => setActiveTab('pedidos')} />
          <NavItem icon={<User />} label="Perfil" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </div>
      </nav>

      {/* VERCEL ANALYTICS */}
      <Analytics />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: #FFFBFB; letter-spacing: -0.01em; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

// Subcomponente de Navegación
const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 transition-all active:scale-95 relative py-1 px-4 rounded-2xl group outline-none">
    <div className={`relative w-9 h-9 flex items-center justify-center rounded-[1.2rem] transition-all duration-300 ${active ? 'bg-red-50 text-red-600 shadow-inner' : 'text-slate-400 group-hover:bg-slate-50 group-hover:text-slate-600'}`}>
      {React.cloneElement(icon, { strokeWidth: active ? 2.5 : 2, className: `w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : ''}` })}
    </div>
    <span className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${active ? 'text-red-600' : 'text-slate-300'}`}>
      {label}
    </span>
    {active && <div className="absolute -bottom-1 w-1 h-1 bg-red-600 rounded-full shadow-[0_0_8px_rgba(225,29,72,0.6)]" />}
  </button>
);

