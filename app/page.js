'use client'
import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 1. ICONOS SVG PROFESIONALES (Diseño Premium)
// ==========================================
const IconAdd = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconMinus = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconTrash = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const IconSearch = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>;
const IconHome = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#E31E24" : "none"} stroke={active ? "#E31E24" : "#9CA3AF"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconTruck = ({ active, width="24", height="24", color }) => <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color || (active ? "#E31E24" : "#9CA3AF")} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconOrders = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#E31E24" : "#9CA3AF"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const IconProfile = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#E31E24" : "#9CA3AF"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconCart = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const IconClose = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconLogout = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const IconEdit = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const IconSuccess = () => <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const IconWhatsApp = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
const IconChevronLeft = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const IconClock = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconShieldCheck = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>;

// ==========================================
// COMPONENTE DE MAPA REAL
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
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 4000, backgroundColor: '#F8F9FB', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', zIndex: 4002, padding: '20px 24px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #F3F4F6' }}>
        <button onClick={cerrarMapa} style={{ position: 'absolute', left: '24px', padding: '8px', background: '#F3F4F6', borderRadius: '50%', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconChevronLeft />
        </button>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <p style={{ margin: 0, fontSize: '10px', fontWeight: '900', color: '#E31E24', textTransform: 'uppercase', letterSpacing: '2px' }}>Kolma En Vivo</p>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#1E293B' }}>Cotuí, RD</p>
        </div>
      </nav>

      <div style={{ position: 'relative', height: '55vh', width: '100%', paddingTop: '80px', zIndex: 4001 }}>
        <div id="kolma-map" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#F3F4F6', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '32px', left: '24px', right: '24px', zIndex: 4002, background: 'white', padding: '24px', borderRadius: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#E31E24', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <IconClock />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '10px', color: '#9CA3AF', fontWeight: 'bold', textTransform: 'uppercase' }}>Estado Real</p>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#111' }}>{pedido.shipdayMsg || pedido.estado || 'Buscando...'}</p>
            </div>
          </div>
          <IconShieldCheck />
        </div>
      </div>

      <main style={{ flex: 1, padding: '24px', zIndex: 4001, backgroundColor: '#F8F9FB', position: 'relative' }}>
        <div style={{ background: 'white', padding: '32px', borderRadius: '48px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ background: '#FEF2F2', padding: '24px', borderRadius: '32px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #FEE2E2' }}>
            <IconTruck width="36" height="36" color="#E31E24" />
            <div>
              <p style={{ margin: 0, fontWeight: '900', color: '#0F172A', fontSize: '18px' }}>Kolma Delivery</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#E31E24', fontWeight: 'bold' }}>Orden #{pedido.id}</p>
            </div>
          </div>
          
          {(pedido.driverName || pedido.eta) && (
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '16px', backgroundColor: '#F3F4F6', backgroundImage: 'url(https://i.pravatar.cc/150?u=kolma_driver)', backgroundSize: 'cover' }}></div>
                <div>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#111' }}>{pedido.driverName || 'Repartidor'}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '600', color: '#6B7280' }}>Llega en {pedido.eta ? `${pedido.eta} min` : '...'}</p>
                </div>
              </div>
              {pedido.driverPhone && (
                <a href={`tel:${pedido.driverPhone}`} style={{ padding: '12px', background: '#111', borderRadius: '16px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </a>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  // ==========================================
  // 2. ESTADOS GLOBALES DE LA APLICACIÓN
  // ==========================================
  
  // Productos y Categorías
  const [productos, setProductos] = useState([]);
  const [colecciones, setColecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorShopify, setErrorShopify] = useState(''); 
  const [categoriaActiva, setCategoriaActiva] = useState('Todas'); 
  const [searchTerm, setSearchTerm] = useState('');
  
  // Novedad: Producto ampliado para mejor visión
  const [productoAmpliado, setProductoAmpliado] = useState(null);

  // Navegación
  const [activeTab, setActiveTab] = useState('inicio'); 
  
  // Usuario y Perfil
  const [user, setUser] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Autenticación
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [errorAuth, setErrorAuth] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Formulario de Usuario
  const [formData, setFormData] = useState({ 
    nombre: '', 
    email: '', 
    telefono: '', 
    password: '', 
    direccion: '' 
  });
  
  // Carrito y Checkout
  const [carrito, setCarrito] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart | payment
  const [metodoPago, setMetodoPago] = useState('efectivo'); // efectivo | tarjeta
  const [cupon, setCupon] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [isMissingInfoOpen, setIsMissingInfoOpen] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Pedidos y Mapa
  const [pedidoActual, setPedidoActual] = useState(null);
  const [verMapaPremium, setVerMapaPremium] = useState(false);

  // Credenciales Shopify
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "q0q09e-cp.myshopify.com";
  const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || "c9bda45020488455d7fe2d8b7e22f352";

  // ==========================================
  // 3. EFECTO DE CARGA INICIAL (Mount)
  // ==========================================
  useEffect(() => {
    const token = localStorage.getItem('kolma_access_token');
    const savedName = localStorage.getItem('kolma_user_name');
    const savedEmail = localStorage.getItem('kolma_user_email');
    const savedAddress = localStorage.getItem('kolma_user_address');
    const savedPhone = localStorage.getItem('kolma_user_phone');
    const savedOrder = localStorage.getItem('kolma_last_order'); 

    if (token) {
      setUser({ 
        id: token,
        nombre: savedName || "Cliente", 
        email: savedEmail, 
        direccion: savedAddress || "", 
        telefono: savedPhone || "" 
      });
      setFormData(prev => ({ 
        ...prev, 
        nombre: savedName || '', 
        email: savedEmail || '', 
        direccion: savedAddress || '', 
        telefono: savedPhone || '' 
      }));
    }

    if (savedOrder) {
      try { 
        setPedidoActual(JSON.parse(savedOrder)); 
      } catch(e) {
        console.error("Error leyendo pedido anterior");
      }
    }

    async function fetchData() {
      if(!domain || !accessToken) { 
        setErrorShopify("Faltan las credenciales de Shopify.");
        setLoading(false); 
        return; 
      }
      
      try {
        const res = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'X-Shopify-Storefront-Access-Token': accessToken 
          },
          body: JSON.stringify({ 
            query: `{ 
              collections(first: 20) { 
                edges { node { id title } } 
              }
              products(first: 50) { 
                edges { 
                  node { 
                    id 
                    title 
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
        
        if (errors) { 
          setErrorShopify("Error conectando con Shopify: " + errors[0].message); 
          setLoading(false); 
          return; 
        }

        if(data?.collections) {
          setColecciones([{node: {id: 'all', title: 'Todas'}}, ...data.collections.edges]);
        }
        
        if(data?.products) {
          setProductos(data.products.edges);
        }
        
        setLoading(false);
      } catch (e) { 
        setErrorShopify("Error de red conectando a la tienda."); 
        setLoading(false); 
      }
    }
    fetchData();
  }, [domain, accessToken]);

  // ==========================================
  // RADAR DE SHIPDAY (Auto-Refresh de Estatus)
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
              const pedidoEntregado = { 
                ...pedidoActual, 
                estado: 'Entregado',
                entregadoAt: Date.now()
              };
              setPedidoActual(pedidoEntregado);
              localStorage.setItem('kolma_last_order', JSON.stringify(pedidoEntregado));
              return;
           }

           let nuevoEstado = pedidoActual.estado;
           if (['UNASSIGNED', 'ACCEPTED', 'PENDING'].includes(statusRaw)) nuevoEstado = 'Preparando';
           if (['ASSIGNED', 'STARTED', 'PICKED_UP', 'READY_TO_DELIVER', 'ACTIVE', 'ON_THE_WAY', 'ARRIVED'].includes(statusRaw)) nuevoEstado = 'En camino';

           const nuevaTrackingUrl = data.trackingUrl || pedidoActual.trackingUrl;

           const pedidoActualizado = { ...pedidoActual, estado: nuevoEstado, trackingUrl: nuevaTrackingUrl, shipdayMsg: statusRaw };

           if (info.driver_location) {
             pedidoActualizado.driverLat = info.driver_location.lat;
             pedidoActualizado.driverLng = info.driver_location.lng;
           }
           if (info.driver_name) pedidoActualizado.driverName = info.driver_name;
           if (info.driver_phone) pedidoActualizado.driverPhone = info.driver_phone;
           if (info.eta) pedidoActualizado.eta = info.eta;

           setPedidoActual(pedidoActualizado);
           localStorage.setItem('kolma_last_order', JSON.stringify(pedidoActualizado));
        }
      } catch(e) {
        console.error("Error consultando estatus", e);
      }
    }, 10000); 

    return () => clearInterval(rastreador);
  }, [pedidoActual]);

  // ==========================================
  // TEMPORIZADOR DE 1 HORA PARA FACTURA
  // ==========================================
  useEffect(() => {
    if (pedidoActual?.estado === 'Entregado' && pedidoActual.entregadoAt) {
      const revisarExpiracion = setInterval(() => {
        const tiempoPasado = Date.now() - pedidoActual.entregadoAt;
        const unaHoraEnMilisegundos = 3600000; 
        
        if (tiempoPasado >= unaHoraEnMilisegundos) {
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
  // 4. LÓGICA DE USUARIOS Y AUTENTICACIÓN
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
    setIsSubmitting(true);
    setErrorAuth('');
    
    const shopifyUrl = `https://${domain}/api/2024-04/graphql.json`;
    const headers = { 
      'Content-Type': 'application/json', 
      'X-Shopify-Storefront-Access-Token': accessToken 
    };

    try {
      if (authMode === 'register') {
        const telefonoValido = formatPhone(formData.telefono);
        if (telefonoValido.length < 11) throw new Error("Por favor, ingresa un teléfono válido de 10 dígitos.");
        if (formData.direccion.length < 5) throw new Error("Por favor, ingresa una dirección completa en Cotuí.");
        
        const registerResponse = await fetch(shopifyUrl, {
          method: 'POST', 
          headers,
          body: JSON.stringify({
            query: `mutation customerCreate($input: CustomerCreateInput!) { 
              customerCreate(input: $input) { 
                customer { id firstName lastName email phone } 
                customerUserErrors { message } 
              } 
            }`,
            variables: { 
              input: { 
                firstName: formData.nombre, 
                lastName: formData.direccion, 
                email: formData.email, 
                phone: telefonoValido, 
                password: formData.password 
              } 
            }
          })
        });
        
        const { data } = await registerResponse.json();
        if (data.customerCreate.customerUserErrors.length > 0) {
          throw new Error(data.customerCreate.customerUserErrors[0].message);
        }
        
        setAuthMode('login');
        setErrorAuth('¡Cuenta creada con éxito! Por favor, inicia sesión.');
      } 
      else if (authMode === 'login') {
        const loginResponse = await fetch(shopifyUrl, {
          method: 'POST', 
          headers,
          body: JSON.stringify({
            query: `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
              customerAccessTokenCreate(input: $input) { 
                customerAccessToken { accessToken } 
                customerUserErrors { message } 
              }
            }`,
            variables: { 
              input: { 
                email: formData.email, 
                password: formData.password 
              } 
            }
          })
        });
        
        const { data } = await loginResponse.json();
        if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
          throw new Error(data.customerAccessTokenCreate.customerUserErrors[0].message);
        }
        
        const userToken = data.customerAccessTokenCreate.customerAccessToken.accessToken;
        
        const profileResponse = await fetch(shopifyUrl, {
          method: 'POST', 
          headers,
          body: JSON.stringify({
            query: `{ 
              customer(customerAccessToken: "${userToken}") { 
                firstName 
                lastName 
                email 
                phone 
              } 
            }`
          })
        });
        
        const profileData = await profileResponse.json();
        const customerInfo = profileData.data.customer;

        const completeUser = {
          id: userToken,
          nombre: customerInfo.firstName || formData.email.split('@')[0],
          email: customerInfo.email,
          telefono: customerInfo.phone || "",
          direccion: customerInfo.lastName || "" 
        };

        localStorage.setItem('kolma_access_token', userToken);
        persistUserData(completeUser);
        setIsAuthOpen(false);
      }
    } catch (err) { 
      setErrorAuth(err.message); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const telefonoValido = formatPhone(formData.telefono);
    const token = localStorage.getItem('kolma_access_token');

    try {
      if (token) {
        await fetch(`https://${domain}/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'X-Shopify-Storefront-Access-Token': accessToken 
          },
          body: JSON.stringify({
            query: `mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
              customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) { 
                customer { firstName lastName phone } 
              }
            }`,
            variables: { 
              customerAccessToken: token, 
              customer: { 
                firstName: formData.nombre, 
                lastName: formData.direccion, 
                phone: telefonoValido 
              } 
            }
          })
        });
      }
      
      const updatedUser = { 
        ...user, 
        nombre: formData.nombre, 
        telefono: telefonoValido, 
        direccion: formData.direccion 
      };
      
      persistUserData(updatedUser);
      setIsEditingProfile(false);
      setIsMissingInfoOpen(false);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setPedidoActual(null);
    setFormData({ nombre: '', email: '', telefono: '', password: '', direccion: '' });
    setActiveTab('inicio');
  };

  // ==========================================
  // 5. LÓGICA DE CARRITO INTERACTIVO
  // ==========================================
  const agregarAlCarrito = (producto) => {
    const variantId = producto.node.variants.edges[0]?.node.id;
    
    setCarrito(prevCarrito => {
      const productoExistente = prevCarrito.find(item => item.variantId === variantId);
      
      if (productoExistente) {
        return prevCarrito.map(item => 
          item.variantId === variantId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      
      return [
        ...prevCarrito, 
        { 
          id: producto.node.id, 
          title: producto.node.title, 
          price: parseFloat(producto.node.variants.edges[0]?.node.price.amount), 
          image: producto.node.images.edges[0]?.node.url, 
          variantId, 
          quantity: 1 
        }
      ];
    });
    
    setIsCartOpen(true);
    setCheckoutStep('cart');
    // Si se añadió desde la vista ampliada, cerramos el modal
    setProductoAmpliado(null); 
  };

  const modificarCantidad = (variantId, cambio) => {
    setCarrito(prevCarrito => {
      return prevCarrito.map(item => {
        if (item.variantId === variantId) {
          const nuevaCantidad = item.quantity + cambio;
          if (nuevaCantidad <= 0) return null;
          return { ...item, quantity: nuevaCantidad };
        }
        return item;
      }).filter(item => item !== null); 
    });
  };

  const calcularSubtotal = () => {
    return carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calcularTotalFinal = () => {
    const subtotal = calcularSubtotal();
    return subtotal - descuentoAplicado;
  };

  // ==========================================
  // 6. LÓGICA DE CHECKOUT Y PEDIDOS
  // ==========================================
  const avanzarAPago = () => {
    if (!user) { 
      setIsCartOpen(false); 
      setIsAuthOpen(true); 
      return; 
    }
    if (!user.nombre || !user.telefono || !user.direccion || user.direccion.length < 5) {
      setIsCartOpen(false); 
      setIsMissingInfoOpen(true); 
      return;
    }
    setCheckoutStep('payment'); 
  };

  const aplicarCupon = () => {
    if (cupon.toUpperCase() === 'KOLMA10') {
      setDescuentoAplicado(calcularSubtotal() * 0.10);
      alert("¡Cupón del 10% aplicado exitosamente!");
    } else {
      alert("Cupón inválido o expirado.");
      setDescuentoAplicado(0);
    }
  };

  const finalizarPedido = async () => {
    setIsProcessingOrder(true);
    
    const totalVenta = calcularTotalFinal();
    
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: carrito, 
          customer: user, 
          total: totalVenta.toFixed(2),
          metodoPago: metodoPago,
          descuento: descuentoAplicado.toFixed(2)
        })
      });
      
      const data = await res.json();
      
      if(!data.success) {
        throw new Error("El servidor falló al procesar");
      }
      
      const nuevoPedido = { 
        id: data.orderId,
        trackingUrl: data.trackingUrl, 
        items: [...carrito], 
        subtotal: calcularSubtotal(),
        descuento: descuentoAplicado,
        total: totalVenta, 
        fecha: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(), 
        estado: 'Recibido',
        metodo: metodoPago
      };

      setPedidoActual(nuevoPedido);
      localStorage.setItem('kolma_last_order', JSON.stringify(nuevoPedido));
      
      setCarrito([]); 
      setCupon('');
      setDescuentoAplicado(0);
      setIsCartOpen(false);
      setCheckoutStep('cart');
      
      setShowSuccessModal(true);
      
    } catch (e) { 
      alert("Error de conexión. Por favor revisa tu internet e intenta nuevamente."); 
    } finally { 
      setIsProcessingOrder(false); 
    }
  };

  // ==========================================
  // 7. RENDERIZADO DE LA INTERFAZ DE USUARIO
  // ==========================================
  return (
    <div 
      style={{ 
        backgroundColor: '#F9FAFB', 
        minHeight: '100vh', 
        fontFamily: 'system-ui, -apple-system, sans-serif', 
        color: '#1F2937', 
        paddingBottom: '100px', 
        overflowX: 'hidden' 
      }}
    >
      {/* ------------------------------------------- */}
      {/* MODAL: VISTA AMPLIADA DE PRODUCTO (Corta Visión) */}
      {/* ------------------------------------------- */}
      {productoAmpliado && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5000, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.2s' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '500px', borderRadius: '32px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <button onClick={() => setProductoAmpliado(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <IconClose />
            </button>
            <div style={{ padding: '40px 20px', backgroundColor: '#F9FAFB', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '250px' }}>
              <img src={productoAmpliado.node.images.edges[0]?.node.url} style={{ width: '100%', maxHeight: '350px', objectFit: 'contain' }} alt={productoAmpliado.node.title} />
            </div>
            <div style={{ padding: '35px 25px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '2rem', fontWeight: '900', color: '#111', lineHeight: '1.2' }}>{productoAmpliado.node.title}</h3>
              <p style={{ margin: '0 0 30px 0', fontSize: '2.5rem', fontWeight: '900', color: '#E31E24' }}>
                RD${parseFloat(productoAmpliado.node.variants.edges[0]?.node.price.amount).toFixed(0)}
              </p>
              <button onClick={() => agregarAlCarrito(productoAmpliado)} style={{ width: '100%', padding: '24px', backgroundColor: '#E31E24', color: '#fff', border: 'none', borderRadius: '24px', fontSize: '1.4rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 8px 25px rgba(227,30,36,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
                <IconCart /> AÑADIR A LA CANASTA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDERIZAR MAPA PREMIUM A PANTALLA COMPLETA SI ESTÁ ACTIVO */}
      {verMapaPremium && pedidoActual && (
        <TrackingKolma 
          pedido={pedidoActual} 
          cerrarMapa={() => setVerMapaPremium(false)} 
        />
      )}

      {/* MODAL 1: CONFIRMACIÓN DE PEDIDO EXITOSO */}
      {showSuccessModal && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.85)', 
            zIndex: 4000, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backdropFilter: 'blur(8px)' 
          }}
        >
          <div 
            style={{ 
              backgroundColor: '#fff', 
              padding: '40px 30px', 
              borderRadius: '24px', 
              width: '90%', 
              maxWidth: '400px', 
              textAlign: 'center', 
              animation: 'fadeIn 0.4s ease-out' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
              <IconSuccess />
            </div>
            <h2 style={{ margin: '0 0 15px 0', fontWeight: '900', color: '#111', fontSize: '2rem' }}>
              ¡Pedido Confirmado!
            </h2>
            <p style={{ color: '#4B5563', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '35px' }}>
              Tu orden <strong>#{pedidoActual?.id}</strong> ha sido recibida correctamente. Ya la estamos preparando para enviarla a tu dirección en Cotuí.
            </p>
            <button 
              onClick={() => { 
                setShowSuccessModal(false); 
                setActiveTab('pedidos'); 
              }} 
              style={{ 
                backgroundColor: '#E31E24', 
                color: '#fff', 
                width: '100%', 
                padding: '18px', 
                borderRadius: '15px', 
                border: 'none', 
                fontWeight: '900', 
                fontSize: '1.1rem', 
                cursor: 'pointer', 
                boxShadow: '0 8px 20px rgba(227,30,36,0.3)',
                transition: 'transform 0.2s'
              }}
            >
              Ver Estatus de mi Pedido
            </button>
          </div>
        </div>
      )}

      {/* CABECERA (HEADER) PRINCIPAL */}
      <header 
        style={{ 
          backgroundColor: '#FFFFFF', 
          padding: '15px 25px', 
          position: 'sticky', 
          top: 0, 
          zIndex: 100, 
          boxShadow: '0 4px 20px rgba(227, 30, 36, 0.08)', 
          borderBottom: '1px solid #F3F4F6' 
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div 
            onClick={() => setActiveTab('inicio')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <div style={{ backgroundColor: '#E31E24', width: '8px', height: '28px', borderRadius: '4px' }}></div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: '#E31E24', letterSpacing: '-1.5px' }}>
              KOLMA<span style={{fontWeight: '300'}}>RD</span>
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div 
              onClick={() => setIsCartOpen(true)} 
              style={{ position: 'relative', cursor: 'pointer', color: '#111', padding: '5px' }}
            >
              <IconCart />
              {carrito.length > 0 && (
                <span 
                  style={{ 
                    position: 'absolute', 
                    top: '-2px', 
                    right: '-5px', 
                    backgroundColor: '#E31E24', 
                    color: '#fff', 
                    fontSize: '0.7rem', 
                    fontWeight: 'bold', 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '2px solid #fff'
                  }}
                >
                  {carrito.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </div>

            {!user ? (
              <button 
                onClick={() => setIsAuthOpen(true)} 
                style={{ 
                  backgroundColor: '#E31E24', 
                  color: '#FFFFFF', 
                  border: 'none', 
                  padding: '10px 24px', 
                  borderRadius: '25px', 
                  fontWeight: '800', 
                  fontSize: '0.9rem', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(227,30,36,0.2)'
                }}
              >
                Ingresar
              </button>
            ) : (
              <div 
                onClick={() => setActiveTab('perfil')} 
                style={{ 
                  cursor: 'pointer', 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  backgroundColor: '#FEE2E2', 
                  border: '2px solid #E31E24', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#E31E24', 
                  fontWeight: '900',
                  fontSize: '1.2rem'
                }}
              >
                {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'K'}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ------------------------------------------- */}
      {/* VISTA 1: INICIO (Catálogo y Categorías) */}
      {/* ------------------------------------------- */}
      {activeTab === 'inicio' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          
          <section style={{ padding: '20px 20px 0 20px' }}>
            <div 
              style={{ 
                backgroundColor: '#E31E24', 
                borderRadius: '24px', 
                padding: '25px', 
                color: '#FFFFFF', 
                position: 'relative', 
                overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(227,30,36,0.25)'
              }}
            >
              <div style={{ position: 'relative', zIndex: 10 }}>
                <h2 style={{ fontSize: '1.9rem', fontWeight: '900', lineHeight: '1.15', margin: '0 0 8px 0' }}>
                  Calidad Premium<br />al mejor precio
                </h2>
                <p style={{ margin: 0, color: '#FEE2E2', fontSize: '0.9rem', fontWeight: '600', maxWidth: '220px' }}>
                  Los productos más frescos de Cotuí, directo a tu casa.
                </p>
                
                <div 
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '16px', 
                    padding: '12px 18px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginTop: '20px', 
                    maxWidth: '100%',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                  }}
                >
                  <div style={{ color: '#E31E24', display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    <IconSearch />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Buscar productos..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={{ 
                      flex: 1, border: 'none', outline: 'none', fontSize: '1.05rem', color: '#111', fontWeight: '600', background: 'transparent' 
                    }} 
                  />
                </div>
              </div>

              <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.15, pointerEvents: 'none' }}>
                <svg width="160" height="160" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
              </div>
            </div>
          </section>

          <section style={{ maxWidth: '1200px', margin: '25px auto 0', padding: '0 20px' }}>
            <div 
              style={{ 
                display: 'flex', 
                overflowX: 'auto', 
                gap: '12px', 
                paddingBottom: '15px', 
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {colecciones.map((col, index) => (
                <button 
                  key={index} 
                  onClick={() => setCategoriaActiva(col.node.title)}
                  style={{ 
                    padding: '12px 24px', 
                    borderRadius: '30px', 
                    whiteSpace: 'nowrap', 
                    fontWeight: '800', 
                    fontSize: '0.95rem', 
                    border: categoriaActiva === col.node.title ? 'none' : '1px solid #E5E7EB', 
                    backgroundColor: categoriaActiva === col.node.title ? '#E31E24' : '#FFFFFF', 
                    color: categoriaActiva === col.node.title ? '#FFFFFF' : '#4B5563', 
                    cursor: 'pointer', 
                    boxShadow: categoriaActiva === col.node.title ? '0 6px 15px rgba(227,30,36,0.25)' : '0 2px 5px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {col.node.title}
                </button>
              ))}
            </div>
          </section>

          <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            
            {errorShopify && (
              <div 
                style={{ 
                  backgroundColor: '#FEF2F2', 
                  border: '1px solid #FCA5A5', 
                  color: '#991B1B', 
                  padding: '20px', 
                  borderRadius: '15px', 
                  textAlign: 'center', 
                  marginBottom: '20px' 
                }}
              >
                <h3 style={{ margin: '0 0 10px 0', fontWeight: '900' }}>Aviso de Conexión</h3>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>{errorShopify}</p>
              </div>
            )}

            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
                gap: '15px' 
              }}
            >
              {loading && !errorShopify ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px' }}>
                  <div className="loader" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #E31E24', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                  <p style={{ fontWeight: '800', color: '#9CA3AF', fontSize: '1.1rem' }}>Cargando pasillos...</p>
                </div>
              ) : productos.filter(p => {
                const coincideBusqueda = p.node.title.toLowerCase().includes(searchTerm.toLowerCase());
                const coincideCategoria = categoriaActiva === 'Todas' || p.node.collections.edges.some(c => c.node.title === categoriaActiva);
                return coincideBusqueda && coincideCategoria;
              }).map(({ node }) => (
                <div 
                  key={node.id} 
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '20px', 
                    padding: '15px', 
                    border: '1px solid #F3F4F6', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <div 
                    onClick={() => setProductoAmpliado({ node })} // SE AÑADE A LA IMAGEN/TITULO PARA ABRIR MODAL
                    style={{ cursor: 'pointer' }}
                  >
                    <div 
                      style={{ 
                        height: '130px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        marginBottom: '15px',
                        padding: '10px'
                      }}
                    >
                      <img 
                        src={node.images.edges[0]?.node.url} 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                        alt={node.title} 
                      />
                    </div>
                    
                    <h4 
                      style={{ 
                        fontSize: '0.9rem', 
                        margin: '0 0 12px 0', 
                        height: '40px', 
                        overflow: 'hidden', 
                        fontWeight: '800', 
                        color: '#1F2937', 
                        lineHeight: '1.4' 
                      }}
                    >
                      {node.title}
                    </h4>
                  </div>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '900', fontSize: '1.15rem', color: '#111' }}>
                      RD${parseFloat(node.variants.edges[0]?.node.price.amount).toFixed(0)}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Evitar que abra el modal si le da directo al +
                        agregarAlCarrito({ node })
                      }} 
                      style={{ 
                        backgroundColor: '#fff', 
                        color: '#E31E24', 
                        border: '2px solid #E31E24', 
                        borderRadius: '12px', 
                        width: '40px', 
                        height: '40px', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        boxShadow: '0 2px 5px rgba(227,30,36,0.1)'
                      }}
                    >
                      <IconAdd />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ------------------------------------------- */}
      {/* VISTA 2: MIS PEDIDOS (ACTUALIZADO DINÁMICO) */}
      {/* ------------------------------------------- */}
      {activeTab === 'pedidos' && (
        <section style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 25px', animation: 'fadeIn 0.3s' }}>
          
          {pedidoActual ? (
            <div 
              style={{ 
                backgroundColor: '#fff', 
                borderRadius: '32px', 
                padding: '35px', 
                border: '1px solid #E5E7EB', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)' 
              }}
            >
              {/* CABECERA COMÚN */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dashed #F3F4F6', paddingBottom: '20px', marginBottom: '25px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: '800', letterSpacing: '1px' }}>{pedidoActual.estado === 'Finalizado' ? 'FACTURA' : 'NÚMERO DE ORDEN'}</span>
                  <p style={{ margin: '5px 0 0 0', fontWeight: '900', fontSize: '1.4rem', color: '#111' }}>#{pedidoActual.id}</p>
                  
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', color: '#E31E24', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.2rem' }}>⏰</span> {
                      pedidoActual.fecha && (pedidoActual.fecha.includes('AM') || pedidoActual.fecha.includes('PM'))
                      ? pedidoActual.fecha 
                      : new Date().toLocaleString("es-DO", { timeZone: "America/Santo_Domingo", hour: 'numeric', minute: 'numeric', hour12: true, day: '2-digit', month: '2-digit' })
                    }
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: '800', letterSpacing: '1px' }}>ESTATUS</span>
                  <div style={{ 
                    backgroundColor: pedidoActual.estado === 'Finalizado' ? '#F3F4F6' : (pedidoActual.estado === 'Entregado' ? '#DCFCE7' : '#FEF2F2'), 
                    color: pedidoActual.estado === 'Finalizado' ? '#4B5563' : (pedidoActual.estado === 'Entregado' ? '#16A34A' : '#E31E24'), 
                    padding: '8px 16px', 
                    borderRadius: '12px', 
                    fontWeight: '900', 
                    fontSize: '0.9rem', 
                    marginTop: '8px', 
                    display: 'inline-block'
                  }}>
                    {pedidoActual.estado.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* ANIMACIONES DINÁMICAS BASADAS EN ESTADO REAL */}
              {pedidoActual.estado === 'Finalizado' ? (
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', backgroundColor: '#DCFCE7', borderRadius: '50%', marginBottom: '15px' }}><IconSuccess /></div>
                  <h3 style={{ margin: 0, color: '#16A34A', fontWeight: '900', fontSize: '1.2rem' }}>Pedido Completado</h3>
                  <p style={{ margin: '5px 0 0 0', color: '#6B7280', fontSize: '0.9rem' }}>Este pedido ha sido entregado y cerrado.</p>
                </div>
              ) : pedidoActual.estado === 'Entregado' ? (
                <div style={{ textAlign: 'center', marginBottom: '30px', animation: 'fadeIn 0.5s' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', backgroundColor: '#DCFCE7', borderRadius: '50%', marginBottom: '15px', border: '5px solid #BBF7D0' }}><IconSuccess /></div>
                  <h3 style={{ margin: 0, color: '#16A34A', fontWeight: '900', fontSize: '1.4rem' }}>¡Disfruta tu pedido!</h3>
                  <p style={{ margin: '5px 0 0 0', color: '#6B7280', fontSize: '0.9rem' }}>Entregado en tu dirección.</p>
                </div>
              ) : pedidoActual.estado === 'En camino' ? (
                <div style={{ textAlign: 'center', marginBottom: '30px', animation: 'fadeIn 0.5s' }}>
                  <div className="truck-animation" style={{ width: '80px', height: '80px', margin: '0 auto 15px', backgroundColor: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #E31E24' }}>
                    <IconTruck active={true} />
                  </div>
                  <h3 style={{ margin: 0, color: '#111', fontWeight: '900', fontSize: '1.4rem' }}>¡Va en camino!</h3>
                  <p style={{ margin: '5px 0 15px 0', color: '#E31E24', fontSize: '0.95rem', fontWeight: '700' }}>{pedidoActual.shipdayMsg || 'Asignado al repartidor'}</p>
                  
                  <button onClick={() => setVerMapaPremium(true)} style={{ width: '100%', backgroundColor: '#111', color: '#fff', padding: '18px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
                    📍 Ver en el Mapa
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', marginBottom: '30px', animation: 'fadeIn 0.5s' }}>
                  <div className="pulse-box" style={{ width: '80px', height: '80px', margin: '0 auto 15px', backgroundColor: '#FFF5F5', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #E31E24', boxShadow: '0 0 0 8px rgba(227, 30, 36, 0.1)' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E31E24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  </div>
                  <h3 style={{ margin: 0, color: '#111', fontWeight: '900', fontSize: '1.4rem' }}>Preparando pedido...</h3>
                  <p style={{ margin: '5px 0 0 0', color: '#6B7280', fontSize: '0.95rem', fontWeight: '600' }}>Estamos empacando tus productos en tienda.</p>
                  <p style={{ margin: '5px 0 0 0', color: '#9CA3AF', fontSize: '0.8rem', fontStyle: 'italic' }}>{pedidoActual.shipdayMsg || 'Esperando repartidor'}</p>
                </div>
              )}

              {/* --- RESUMEN DE PRODUCTOS COMÚN --- */}
              <div style={{ marginBottom: '20px', backgroundColor: '#F9FAFB', padding: '25px', borderRadius: '24px' }}>
                <p style={{ fontSize: '1rem', color: '#111', fontWeight: '900', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconOrders active={true} /> Resumen de tu compra
                </p>
                {pedidoActual.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', marginBottom: '12px', color: '#4B5563' }}>
                    <span style={{ fontWeight: '600' }}>
                      <b style={{ color: '#E31E24', fontWeight: '900', marginRight: '8px' }}>{item.quantity}x</b> {item.title}
                    </span>
                    <span style={{ fontWeight: '900', color: '#111' }}>RD${(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
                
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '900', color: '#111', fontSize: '1.2rem' }}>TOTAL PAGADO</span>
                    <span style={{ fontWeight: '900', fontSize: '1.8rem', color: '#E31E24' }}>RD$ {pedidoActual.total.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              {/* WHATSAPP OCULTO SI YA ES FACTURA CERRADA */}
              {pedidoActual.estado !== 'Finalizado' && (
                <div style={{ marginTop: '20px' }}>
                  <a href={`https://wa.me/18298558779?text=Hola,%20necesito%20ayuda%20con%20mi%20pedido%20de%20KolmaRD%20%23${pedidoActual.id}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#25D366', color: '#fff', textDecoration: 'none', padding: '16px', borderRadius: '16px', fontWeight: '900', fontSize: '1.05rem', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)', transition: 'transform 0.2s' }}>
                    <IconWhatsApp /> Escribir a Soporte
                  </a>
                </div>
              )}

              <div style={{ textAlign: 'center', borderTop: '1px solid #F3F4F6', paddingTop: '20px', marginTop: '20px' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: '900', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                  Método: {pedidoActual.metodo === 'efectivo' ? 'Efectivo al recibir' : 'Pago Online'}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 30px', backgroundColor: '#fff', borderRadius: '32px', border: '1px solid #E5E7EB' }}>
              <div style={{ backgroundColor: '#FEE2E2', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', color: '#E31E24' }}>
                <IconTruck active={true} />
              </div>
              <h3 style={{ margin: '0 0 15px 0', color: '#111', fontWeight: '900', fontSize: '1.6rem' }}>¿Qué pediremos hoy?</h3>
              <p style={{ fontSize: '1.1rem', color: '#6B7280', marginBottom: '35px' }}>
                Tus pedidos aparecerán aquí para que los sigas en tiempo real.
              </p>
              <button 
                onClick={() => setActiveTab('inicio')} 
                style={{ backgroundColor: '#111', color: '#fff', padding: '20px 40px', borderRadius: '20px', border: 'none', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                Ir a la tienda
              </button>
            </div>
          )}
        </section>
      )}

      {/* ------------------------------------------- */}
      {/* VISTA 3: PERFIL DE USUARIO */}
      {/* ------------------------------------------- */}
      {activeTab === 'perfil' && (
        <section style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 25px', animation: 'fadeIn 0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontWeight: '900', fontSize: '2rem', margin: '0', color: '#111' }}>Mi Perfil</h2>
            {user && (
              <button 
                onClick={handleLogout} 
                style={{ 
                  color: '#E31E24', 
                  background: '#FEE2E2', 
                  border: 'none', 
                  padding: '10px 18px', 
                  borderRadius: '12px', 
                  fontWeight: '800', 
                  fontSize: '0.9rem', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}
              >
                <IconLogout /> Salir
              </button>
            )}
          </div>

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div 
                style={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '24px', 
                  padding: '30px', 
                  border: '1px solid #E5E7EB', 
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)', 
                  position: 'relative' 
                }}
              >
                {!isEditingProfile && (
                  <button 
                    onClick={() => setIsEditingProfile(true)} 
                    style={{ 
                      position: 'absolute', 
                      top: '25px', 
                      right: '25px', 
                      background: '#F9FAFB', 
                      border: '1px solid #E5E7EB', 
                      color: '#111', 
                      padding: '8px 16px', 
                      borderRadius: '12px', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      fontWeight: '800', 
                      fontSize: '0.85rem' 
                    }}
                  >
                    <IconEdit /> Editar
                  </button>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                  <div 
                    style={{ 
                      width: '75px', 
                      height: '75px', 
                      borderRadius: '50%', 
                      backgroundColor: '#E31E24', 
                      color: '#fff', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '2.2rem', 
                      fontWeight: '900',
                      boxShadow: '0 4px 10px rgba(227,30,36,0.3)'
                    }}
                  >
                    {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'K'}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', color: '#111' }}>
                      {user.nombre || 'Cliente Kolma'}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', color: '#6B7280', fontWeight: '600' }}>
                      {user.email}
                    </p>
                  </div>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#9CA3AF', letterSpacing: '0.5px' }}>NOMBRE COMPLETO</label>
                      <input 
                        name="nombre" 
                        value={formData.nombre} 
                        onChange={e => setFormData({...formData, nombre: e.target.value})} 
                        required 
                        style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #E5E7EB', marginTop: '8px', fontSize: '1rem', fontWeight: '600' }} 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#9CA3AF', letterSpacing: '0.5px' }}>TELÉFONO (WHATSAPP)</label>
                      <input 
                        name="telefono" 
                        value={formData.telefono} 
                        onChange={e => setFormData({...formData, telefono: e.target.value})} 
                        required 
                        style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #E5E7EB', marginTop: '8px', fontSize: '1rem', fontWeight: '600' }} 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#9CA3AF', letterSpacing: '0.5px' }}>DIRECCIÓN DE ENTREGA EN COTUÍ</label>
                      <textarea 
                        name="direccion" 
                        value={formData.direccion} 
                        onChange={e => setFormData({...formData, direccion: e.target.value})} 
                        required 
                        style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #E5E7EB', marginTop: '8px', fontSize: '1rem', fontWeight: '600', height: '100px', resize: 'none' }} 
                      />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                      <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        style={{ flex: 1, backgroundColor: '#E31E24', color: '#fff', padding: '16px', borderRadius: '14px', border: 'none', fontWeight: '900', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(227,30,36,0.2)' }}
                      >
                        {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsEditingProfile(false)} 
                        style={{ flex: 1, backgroundColor: '#F3F4F6', color: '#111', padding: '16px', borderRadius: '14px', border: 'none', fontWeight: '900', fontSize: '1rem', cursor: 'pointer' }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#F9FAFB', padding: '25px', borderRadius: '16px', border: '1px solid #F3F4F6' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#9CA3AF', letterSpacing: '0.5px' }}>TELÉFONO DE CONTACTO</span>
                      <p style={{ margin: '5px 0 0 0', fontWeight: '800', color: '#111', fontSize: '1.1rem' }}>
                        {user.telefono || <span style={{ color: '#E31E24', fontSize: '0.9rem' }}>⚠️ Falta agregar teléfono</span>}
                      </p>
                    </div>
                    <div style={{ borderTop: '2px dashed #E5E7EB', paddingTop: '20px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#9CA3AF', letterSpacing: '0.5px' }}>DIRECCIÓN DE ENTREGA (COTUÍ)</span>
                      <p style={{ margin: '5px 0 0 0', fontWeight: '800', color: '#111', fontSize: '1.1rem', lineHeight: '1.4' }}>
                        {user.direccion || <span style={{ color: '#E31E24', fontSize: '0.9rem' }}>⚠️ Falta agregar dirección</span>}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 25px', backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ backgroundColor: '#FEE2E2', width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', color: '#E31E24' }}>
                <IconProfile active={true} />
              </div>
              <h3 style={{ fontWeight: '900', fontSize: '1.5rem', margin: '0 0 15px 0', color: '#111' }}>
                Crea tu cuenta Kolma
              </h3>
              <p style={{ color: '#6B7280', fontSize: '1.05rem', margin: '0 0 30px 0', lineHeight: '1.5' }}>
                Regístrate hoy para guardar tu dirección, gestionar tus pedidos y comprar en segundos.
              </p>
              <button 
                onClick={() => { setAuthMode('register'); setIsAuthOpen(true); }} 
                style={{ backgroundColor: '#E31E24', color: '#fff', width: '100%', padding: '18px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 6px 15px rgba(227,30,36,0.25)' }}
              >
                Comenzar Registro
              </button>
            </div>
          )}
        </section>
      )}

      {/* ------------------------------------------- */}
      {/* DRAWER LATERAL: CARRITO Y CHECKOUT PASO A PASO */}
      {/* ------------------------------------------- */}
      {isCartOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, right: 0, bottom: 0, left: 0, 
            backgroundColor: 'rgba(0,0,0,0.6)', 
            zIndex: 3000, 
            display: 'flex', 
            justifyContent: 'flex-end', 
            backdropFilter: 'blur(5px)' 
          }}
        >
          <div 
            style={{ 
              backgroundColor: '#fff', 
              width: '100%', 
              maxWidth: '450px', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
            }}
          >
            <div 
              style={{ 
                padding: '25px', 
                borderBottom: '1px solid #F3F4F6', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                backgroundColor: '#fff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {checkoutStep === 'payment' && (
                  <button 
                    onClick={() => setCheckoutStep('cart')} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#9CA3AF', padding: '0 10px 0 0' }}
                  >
                    ←
                  </button>
                )}
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.5rem', color: '#111' }}>
                  {checkoutStep === 'cart' ? 'Tu Canasta' : 'Pago y Envío'}
                </h3>
              </div>
              <div 
                onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }} 
                style={{ cursor: 'pointer', backgroundColor: '#F3F4F6', padding: '8px', borderRadius: '50%', display: 'flex' }}
              >
                <IconClose />
              </div>
            </div>
            
            <div 
              style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '25px', 
                backgroundColor: checkoutStep === 'cart' ? '#fff' : '#F9FAFB' 
              }}
            >
              
              {/* === PASO 1: LISTA DEL CARRITO === */}
              {checkoutStep === 'cart' && (
                carrito.length === 0 ? (
                  <div style={{ textAlign: 'center', marginTop: '80px', color: '#9CA3AF' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                      <IconCart />
                    </div>
                    <h3 style={{ color: '#111', fontWeight: '900' }}>Canasta Vacía</h3>
                    <p style={{ marginTop: '10px', fontWeight: '600' }}>Agrega productos del súper para comenzar.</p>
                  </div>
                ) : (
                  <div>
                    {carrito.map((item, i) => (
                      <div 
                        key={i} 
                        style={{ 
                          display: 'flex', 
                          gap: '15px', 
                          marginBottom: '20px', 
                          alignItems: 'center', 
                          borderBottom: '1px solid #F3F4F6', 
                          paddingBottom: '20px' 
                        }}
                      >
                        <img 
                          src={item.image} 
                          style={{ width: '70px', height: '70px', objectFit: 'contain', border: '1px solid #F3F4F6', borderRadius: '14px', padding: '5px' }} 
                          alt="" 
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontWeight: '800', color: '#111', lineHeight: '1.3' }}>{item.title}</h4>
                          <p style={{ margin: 0, color: '#E31E24', fontWeight: '900', fontSize: '1.1rem' }}>
                            RD${item.price.toFixed(2)}
                          </p>
                        </div>
                        
                        <div 
                          style={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '10px'
                          }}
                        >
                          <div 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              backgroundColor: '#F3F4F6', 
                              borderRadius: '20px', 
                              padding: '4px' 
                            }}
                          >
                            <button 
                              onClick={() => modificarCantidad(item.variantId, -1)} 
                              style={{ 
                                background: 'none', border: 'none', cursor: 'pointer', 
                                color: item.quantity === 1 ? '#E31E24' : '#111', 
                                width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
                                backgroundColor: item.quantity === 1 ? '#FEE2E2' : 'transparent'
                              }}
                            >
                              {item.quantity === 1 ? <IconTrash /> : <IconMinus />}
                            </button>
                            
                            <span style={{ fontWeight: '900', width: '25px', textAlign: 'center', fontSize: '1rem', color: '#111' }}>
                              {item.quantity}
                            </span>
                            
                            <button 
                              onClick={() => modificarCantidad(item.variantId, 1)} 
                              style={{ 
                                background: '#fff', border: 'none', cursor: 'pointer', color: '#111', 
                                width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                              }}
                            >
                              <IconAdd />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* === PASO 2: SELECCIÓN DE PAGO Y CUPÓN === */}
              {checkoutStep === 'payment' && (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  
                  <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '25px', border: '1px solid #E5E7EB', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ margin: 0, fontWeight: '900', color: '#111', fontSize: '1.1rem' }}>Enviar a:</h4>
                      <span onClick={() => {setIsCartOpen(false); setActiveTab('perfil')}} style={{ color: '#E31E24', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer' }}>Cambiar</span>
                    </div>
                    <p style={{ margin: '0 0 5px 0', fontWeight: '800', color: '#4B5563' }}>{user.nombre}</p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#6B7280', lineHeight: '1.4' }}>{user.direccion}</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#6B7280', fontWeight: '700' }}>Cel: {user.telefono}</p>
                  </div>

                  <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '25px', border: '1px solid #E5E7EB', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                    <h4 style={{ margin: '0 0 15px 0', fontWeight: '900', color: '#111', fontSize: '1.1rem' }}>Código de Descuento</h4>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="text" 
                        placeholder="Ej. KOLMA10" 
                        value={cupon} 
                        onChange={e => setCupon(e.target.value)} 
                        style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '2px solid #F3F4F6', textTransform: 'uppercase', fontWeight: '700', fontSize: '1rem' }} 
                      />
                      <button 
                        onClick={aplicarCupon}
                        disabled={!cupon}
                        style={{ backgroundColor: cupon ? '#111' : '#E5E7EB', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '12px', fontWeight: '900', cursor: cupon ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>

                  <h4 style={{ margin: '0 0 15px 0', fontWeight: '900', fontSize: '1.1rem', color: '#111' }}>Método de Pago</h4>
                  
                  <div 
                    onClick={() => setMetodoPago('efectivo')} 
                    style={{ 
                      backgroundColor: '#fff', 
                      border: metodoPago === 'efectivo' ? '2px solid #E31E24' : '1px solid #E5E7EB', 
                      borderRadius: '16px', 
                      padding: '18px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '15px', 
                      marginBottom: '15px', 
                      cursor: 'pointer', 
                      transition: 'all 0.2s',
                      boxShadow: metodoPago === 'efectivo' ? '0 4px 15px rgba(227,30,36,0.1)' : 'none'
                    }}
                  >
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: metodoPago === 'efectivo' ? '6px solid #E31E24' : '2px solid #D1D5DB', transition: 'all 0.2s' }}></div>
                    <div>
                      <p style={{ margin: 0, fontWeight: '900', fontSize: '1.05rem', color: '#111' }}>Pago contra entrega</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#6B7280', fontWeight: '600' }}>Paga en efectivo al recibir tu pedido en Cotuí.</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => setMetodoPago('tarjeta')} 
                    style={{ 
                      backgroundColor: '#fff', 
                      border: metodoPago === 'tarjeta' ? '2px solid #E31E24' : '1px solid #E5E7EB', 
                      borderRadius: '16px', 
                      padding: '18px', 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '15px', 
                      cursor: 'pointer', 
                      transition: 'all 0.2s',
                      opacity: metodoPago === 'tarjeta' ? 1 : 0.7
                    }}
                  >
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: metodoPago === 'tarjeta' ? '6px solid #E31E24' : '2px solid #D1D5DB', marginTop: '2px' }}></div>
                    <div>
                      <p style={{ margin: 0, fontWeight: '900', fontSize: '1.05rem', color: '#111' }}>Tarjeta de Crédito / Débito</p>
                      {metodoPago === 'tarjeta' && (
                        <div style={{ marginTop: '10px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', padding: '10px 12px', borderRadius: '8px' }}>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#991B1B', fontWeight: '800', lineHeight: '1.4' }}>
                            ⚠️ Opción no disponible temporalmente. Por favor, selecciona Pago contra entrega.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div 
              style={{ 
                padding: '25px', 
                borderTop: '1px solid #E5E7EB', 
                background: '#fff',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
              }}
            >
              {checkoutStep === 'payment' && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#6B7280', fontWeight: '600' }}>
                    <span>Subtotal</span>
                    <span>RD$ {calcularSubtotal().toFixed(2)}</span>
                  </div>
                  {descuentoAplicado > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#22C55E', fontWeight: '800' }}>
                      <span>Descuento</span>
                      <span>- RD$ {descuentoAplicado.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#6B7280', fontWeight: '600' }}>
                    <span>Delivery (Cotuí)</span>
                    <span style={{ color: '#22C55E', fontWeight: '800' }}>GRATIS</span>
                  </div>
                  <div style={{ borderTop: '1px dashed #E5E7EB', margin: '12px 0' }}></div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontWeight: '900', fontSize: '1.2rem', color: '#111' }}>
                  {checkoutStep === 'cart' ? 'Total Estimado' : 'Total a Pagar'}
                </span>
                <span style={{ fontWeight: '900', fontSize: '1.6rem', color: '#E31E24' }}>
                  RD$ {calcularTotalFinal().toFixed(2)}
                </span>
              </div>
              
              {checkoutStep === 'cart' ? (
                <button 
                  onClick={avanzarAPago} 
                  disabled={carrito.length === 0}
                  style={{ 
                    width: '100%', 
                    backgroundColor: carrito.length === 0 ? '#E5E7EB' : '#E31E24', 
                    color: carrito.length === 0 ? '#9CA3AF' : '#fff', 
                    padding: '18px', 
                    borderRadius: '16px', 
                    border: 'none', 
                    fontWeight: '900', 
                    fontSize: '1.15rem', 
                    cursor: carrito.length === 0 ? 'not-allowed' : 'pointer',
                    boxShadow: carrito.length > 0 ? '0 6px 20px rgba(227,30,36,0.25)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  CONTINUAR AL PAGO
                </button>
              ) : (
                <button 
                  onClick={finalizarPedido} 
                  disabled={isProcessingOrder || metodoPago === 'tarjeta'}
                  style={{ 
                    width: '100%', 
                    backgroundColor: (isProcessingOrder || metodoPago === 'tarjeta') ? '#E5E7EB' : '#E31E24', 
                    color: (isProcessingOrder || metodoPago === 'tarjeta') ? '#9CA3AF' : '#fff', 
                    padding: '18px', 
                    borderRadius: '16px', 
                    border: 'none', 
                    fontWeight: '900', 
                    fontSize: '1.15rem', 
                    cursor: (isProcessingOrder || metodoPago === 'tarjeta') ? 'not-allowed' : 'pointer', 
                    boxShadow: (isProcessingOrder || metodoPago === 'tarjeta') ? 'none' : '0 6px 20px rgba(227,30,36,0.25)',
                    transition: 'all 0.2s'
                  }}
                >
                  {isProcessingOrder ? 'PROCESANDO...' : 'CONFIRMAR PEDIDO'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------- */}
      {/* MODALES ADICIONALES (Login y Datos Faltantes) */}
      {/* ------------------------------------------- */}
      {isMissingInfoOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <div style={{ backgroundColor: '#fff', padding: '35px 30px', borderRadius: '24px', width: '90%', maxWidth: '400px', animation: 'fadeIn 0.3s' }}>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', color: '#111', marginBottom: '15px' }}>Datos de Envío</h3>
            <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: '1.5', marginBottom: '25px', fontWeight: '500' }}>Para entregar tu pedido en Cotuí, necesitamos que completes esta información.</p>
            
            <form 
              onSubmit={(e) => { 
                handleUpdateProfile(e); 
                if (formData.telefono.length >= 10 && formData.direccion.length >= 5) {
                  setCheckoutStep('payment'); 
                }
              }} 
              style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
            >
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#9CA3AF' }}>TELÉFONO</label>
                <input 
                  placeholder="Ej: 8090000000" required 
                  style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #E5E7EB', fontSize: '1rem', marginTop: '5px', fontWeight: '600' }} 
                  value={formData.telefono} 
                  onChange={e => setFormData({...formData, telefono: e.target.value})} 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#9CA3AF' }}>DIRECCIÓN EN COTUÍ</label>
                <textarea 
                  placeholder="Sector, calle, casa..." required 
                  style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #E5E7EB', height: '90px', resize: 'none', fontSize: '1rem', marginTop: '5px', fontWeight: '600' }} 
                  value={formData.direccion} 
                  onChange={e => setFormData({...formData, direccion: e.target.value})} 
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                style={{ backgroundColor: '#E31E24', color: '#fff', padding: '18px', borderRadius: '14px', border: 'none', fontWeight: '900', fontSize: '1.1rem', marginTop: '10px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(227,30,36,0.2)' }}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar y Continuar'}
              </button>
              <button 
                type="button" 
                onClick={() => setIsMissingInfoOpen(false)} 
                style={{ color: '#9CA3AF', background: 'none', border: 'none', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', padding: '10px' }}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {isAuthOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ backgroundColor: '#fff', padding: '40px 30px', borderRadius: '24px', width: '90%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto', animation: 'fadeIn 0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', color: '#111' }}>
                {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h3>
              <div onClick={() => setIsAuthOpen(false)} style={{ cursor: 'pointer', backgroundColor: '#F3F4F6', padding: '8px', borderRadius: '50%', display: 'flex' }}>
                <IconClose />
              </div>
            </div>
            
            <form onSubmit={handleAuthentication} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {authMode === 'register' && (
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#9CA3AF' }}>NOMBRE COMPLETO</label>
                  <input 
                    placeholder="Ej: Juan Pérez" required 
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #E5E7EB', marginTop: '5px', fontSize: '1rem', fontWeight: '600' }} 
                    onChange={e => setFormData({...formData, nombre: e.target.value})} 
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#9CA3AF' }}>CORREO ELECTRÓNICO</label>
                <input 
                  type="email" placeholder="correo@ejemplo.com" required 
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #E5E7EB', marginTop: '5px', fontSize: '1rem', fontWeight: '600' }} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                />
              </div>
              
              {authMode === 'register' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#9CA3AF' }}>TELÉFONO</label>
                    <div style={{ display: 'flex', border: '2px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden', marginTop: '5px' }}>
                      <div style={{ background: '#F9FAFB', padding: '14px', fontWeight: '900', borderRight: '2px solid #E5E7EB', color: '#4B5563' }}>+1</div>
                      <input 
                        placeholder="8090000000" required 
                        style={{ width: '100%', padding: '14px', border: 'none', fontSize: '1rem', fontWeight: '600', outline: 'none' }} 
                        onChange={e => setFormData({...formData, telefono: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#9CA3AF' }}>DIRECCIÓN EN COTUÍ</label>
                    <input 
                      placeholder="Sector, calle, número..." required 
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #E5E7EB', marginTop: '5px', fontSize: '1rem', fontWeight: '600' }} 
                      onChange={e => setFormData({...formData, direccion: e.target.value})} 
                    />
                  </div>
                </>
              )}

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#9CA3AF' }}>CONTRASEÑA</label>
                <input 
                  type="password" placeholder="Mínimo 6 caracteres" required 
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #E5E7EB', marginTop: '5px', fontSize: '1rem', fontWeight: '600' }} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                />
              </div>

              {errorAuth && (
                <div style={{ backgroundColor: '#FEF2F2', padding: '12px', borderRadius: '10px', border: '1px solid #FCA5A5', marginTop: '5px' }}>
                  <p style={{ margin: 0, color: '#991B1B', fontSize: '0.85rem', fontWeight: '800' }}>⚠️ {errorAuth}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting} 
                style={{ width: '100%', backgroundColor: '#E31E24', color: '#fff', padding: '18px', borderRadius: '14px', border: 'none', fontWeight: '900', fontSize: '1.1rem', marginTop: '10px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(227,30,36,0.2)' }}
              >
                {isSubmitting ? 'Procesando...' : authMode === 'login' ? 'ENTRAR' : 'CREAR CUENTA'}
              </button>
            </form>

            <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.95rem', borderTop: '2px dashed #E5E7EB', paddingTop: '20px' }}>
              {authMode === 'login' ? (
                <p style={{ margin: 0, color: '#4B5563', fontWeight: '600' }}>
                  ¿No tienes cuenta? <span onClick={() => setAuthMode('register')} style={{ color: '#E31E24', fontWeight: '900', cursor: 'pointer', padding: '5px' }}>Regístrate aquí</span>
                </p>
              ) : (
                <p style={{ margin: 0, color: '#4B5563', fontWeight: '600' }}>
                  ¿Ya tienes cuenta? <span onClick={() => setAuthMode('login')} style={{ color: '#E31E24', fontWeight: '900', cursor: 'pointer', padding: '5px' }}>Inicia Sesión</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------- */}
      {/* MENÚ DE NAVEGACIÓN INFERIOR (Botón Flotante) */}
      {/* ------------------------------------------- */}
      <nav 
        style={{ 
          position: 'fixed', bottom: 0, left: 0, right: 0, 
          backgroundColor: '#FFFFFF', 
          borderTop: '1px solid #E5E7EB',
          boxShadow: '0 -10px 25px rgba(0,0,0,0.05)', 
          zIndex: 1000, 
          paddingBottom: 'env(safe-area-inset-bottom)' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '75px', position: 'relative' }}>
          
          {/* 1. Pedidos */}
          <div 
            onClick={() => setActiveTab('pedidos')} 
            style={{ width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeTab === 'pedidos' ? '#E31E24' : '#94A3B8', transition: 'color 0.2s' }}
          >
            <IconTruck active={activeTab === 'pedidos'} />
            <span style={{ fontSize: '0.65rem', fontWeight: activeTab === 'pedidos' ? '900' : '700', marginTop: '4px' }}>Pedidos</span>
          </div>

          {/* 2. Canasta */}
          <div 
            onClick={() => setIsCartOpen(true)} 
            style={{ width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#94A3B8', position: 'relative' }}
          >
            <div style={{ position: 'relative' }}>
              <IconOrders active={false} />
              {carrito.length > 0 && (
                <span style={{ position: 'absolute', top: '-6px', right: '-10px', backgroundColor: '#E31E24', color: '#fff', fontSize: '0.65rem', fontWeight: '900', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                  {carrito.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: '700', marginTop: '4px' }}>Canasta</span>
          </div>

          {/* 3. Inicio (BOTÓN FLOTANTE CENTRAL) */}
          <div style={{ width: '25%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={() => setActiveTab('inicio')} 
              style={{ 
                position: 'absolute', 
                top: '-25px', 
                backgroundColor: activeTab === 'inicio' ? '#E31E24' : '#111111', 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                border: '6px solid #F9FAFB', 
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)', 
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </button>
            <span style={{ position: 'absolute', bottom: '10px', fontSize: '0.65rem', fontWeight: activeTab === 'inicio' ? '900' : '700', color: activeTab === 'inicio' ? '#E31E24' : '#94A3B8' }}>
              Inicio
            </span>
          </div>

          {/* 4. Perfil */}
          <div 
            onClick={() => setActiveTab('perfil')} 
            style={{ width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeTab === 'perfil' ? '#E31E24' : '#94A3B8', transition: 'color 0.2s' }}
          >
            <IconProfile active={activeTab === 'perfil'} />
            <span style={{ fontSize: '0.65rem', fontWeight: activeTab === 'perfil' ? '900' : '700', marginTop: '4px' }}>Perfil</span>
          </div>

        </div>
      </nav>

      <style jsx global>{`
        @keyframes slideInRight { 
          0% { transform: translateX(100%); } 
          100% { transform: translateX(0); } 
        }
        @keyframes slideUp { 
          0% { transform: translateY(100%); } 
          100% { transform: translateY(0); } 
        }
        @keyframes fadeIn { 
          0% { opacity: 0; transform: translateY(10px); } 
          100% { opacity: 1; transform: translateY(0); } 
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseAnim { 
          0% { box-shadow: 0 0 0 0 rgba(227, 30, 36, 0.4); transform: scale(1); } 
          50% { box-shadow: 0 0 0 15px rgba(227, 30, 36, 0); transform: scale(1.05); } 
          100% { box-shadow: 0 0 0 0 rgba(227, 30, 36, 0); transform: scale(1); } 
        }
        .pulse-box { animation: pulseAnim 2s infinite ease-in-out; }
        @keyframes driveAnim { 
          0% { transform: translateX(-10px); } 
          50% { transform: translateX(10px); } 
          100% { transform: translateX(-10px); } 
        }
        .truck-animation { animation: driveAnim 2s infinite; }
        ::-webkit-scrollbar { 
          width: 0px; 
          height: 0px; 
          background: transparent; 
        }
        input::placeholder, textarea::placeholder { 
          color: #9CA3AF; 
          opacity: 0.7; 
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: #E31E24 !important;
        }
      `}</style>
    </div>
  );
}
