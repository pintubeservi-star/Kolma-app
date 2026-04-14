'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Analytics } from "@vercel/analytics/react"

// ==========================================
// 1. ICONOS SVG PROFESIONALES (Diseño Premium)
// ==========================================
const IconAdd = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconMinus = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconTrash = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const IconSearch = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>;
const IconHome = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#000" : "none"} stroke={active ? "#000" : "#9CA3AF"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconTruck = ({ active, width="24", height="24", color }) => <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color || (active ? "#000" : "#9CA3AF")} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconOrders = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#000" : "#9CA3AF"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const IconProfile = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#000" : "#9CA3AF"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconCart = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const IconClose = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconLogout = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const IconEdit = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const IconSuccess = () => <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const IconWhatsApp = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
const IconChevronLeft = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const IconClock = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconHeart = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const IconStar = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="#111" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;

// ==========================================
// FUNCIÓN PARA ASIGNAR EMOJIS CON LÓGICA
// ==========================================
const obtenerEmojiCategoria = (titulo) => {
  const t = titulo.toLowerCase();
  if (t === 'todas' || t === 'todo') return '⭐';
  if (t.includes('carne') || t.includes('embutido') || t.includes('pollo')) return '🥩';
  if (t.includes('lacteo') || t.includes('lácteo') || t.includes('queso') || t.includes('leche')) return '🥛';
  if (t.includes('bebida') || t.includes('jugo') || t.includes('refresco')) return '🥤';
  if (t.includes('limpieza') || t.includes('hogar') || t.includes('detergente')) return '🧼';
  if (t.includes('licor') || t.includes('alcohol') || t.includes('cerveza') || t.includes('vino')) return '🍷';
  if (t.includes('pan') || t.includes('harina') || t.includes('repostería')) return '🍞';
  if (t.includes('fruta') || t.includes('vegetal') || t.includes('verdura')) return '🥑';
  if (t.includes('snack') || t.includes('picadera') || t.includes('dulce')) return '🍫';
  if (t.includes('despensa') || t.includes('salsa') || t.includes('grano')) return '🥫';
  if (t.includes('cuidado') || t.includes('personal') || t.includes('belleza')) return '🧴';
  if (t.includes('bebé') || t.includes('infantil')) return '🍼';
  if (t.includes('mascota') || t.includes('animal')) return '🐕';
  return '🛍️'; // Por defecto
};

const OFFERS = [
  { id: 1, title: 'Orgullo de Cotuí', subtitle: 'Siempre lo más fresco de nuestra tierra', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800', bg: '#000000', tag: 'LOCAL' },
  { id: 2, title: 'Reserva Exclusiva', subtitle: 'Elegancia y distinción en cada copa', img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800', bg: '#111111', tag: 'PREMIUM' },
  { id: 3, title: 'Hogar Impecable', subtitle: 'Limpieza profunda y frescura', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', bg: '#1F2937', tag: 'HOGAR' }
];

// ==========================================
// COMPONENTE DE MAPA TIPO UBER EATS
// ==========================================
const TrackingKolma = ({ pedido, cerrarMapa }) => {
  const leafletMap = useRef(null);
  const markerRef = useRef(null);
  const userMarkerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initMap = () => {
      const L = window.L;
      if (!L || leafletMap.current) return;

      // Coordenadas base (Centro de Cotuí)
      const cotuiCoords = [19.0528, -70.1435];

      leafletMap.current = L.map('kolma-map', { 
        zoomControl: false, 
        attributionControl: false 
      }).setView(cotuiCoords, 16);

      // Mapa estilo claro premium
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(leafletMap.current);

      // Icono Repartidor (Punto negro Uber Style)
      const deliveryIcon = L.divIcon({
        className: 'custom-driver-icon',
        html: `<div style="background-color: #000; width: 30px; height: 30px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
              </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      // Icono Destino (Casa)
      const homeIcon = L.divIcon({
        className: 'custom-home-icon',
        html: `<div style="background-color: #E31E24; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(227,30,36,0.4);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      markerRef.current = L.marker(cotuiCoords, { icon: deliveryIcon, zIndexOffset: 1000 }).addTo(leafletMap.current);
      // Simular casa cercana
      userMarkerRef.current = L.marker([19.0550, -70.1400], { icon: homeIcon }).addTo(leafletMap.current);
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
      if (leafletMap.current) leafletMap.current.panTo(newPos, { animate: true, duration: 1 });
    }
  }, [pedido.driverLat, pedido.driverLng]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 4000, backgroundColor: '#000', display: 'flex', flexDirection: 'column' }}>
      {/* Botón Volver Flotante */}
      <button onClick={cerrarMapa} style={{ position: 'absolute', top: '50px', left: '20px', width: '45px', height: '45px', background: '#fff', borderRadius: '50%', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4002, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <IconChevronLeft />
      </button>

      {/* Contenedor del Mapa (Arriba) */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '40%', zIndex: 4000 }}>
        <div id="kolma-map" style={{ width: '100%', height: '100%', backgroundColor: '#E5E7EB' }} />
        {/* Sombra difuminada para unir mapa con la tarjeta */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))', zIndex: 4001 }} />
      </div>

      {/* Bottom Sheet - Detalles del viaje (Estilo Uber) */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', backgroundColor: '#fff', zIndex: 4002, borderRadius: '32px 32px 0 0', padding: '24px', boxShadow: '0 -10px 40px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ width: '40px', height: '5px', backgroundColor: '#E5E7EB', borderRadius: '3px', margin: '0 auto 20px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#111' }}>
              {pedido.eta ? `Llega en ${pedido.eta} min` : 'En camino'}
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6B7280', fontWeight: '600' }}>
              {pedido.shipdayMsg === 'STARTED' ? 'El repartidor va hacia ti' : 'Preparando y asignando ruta...'}
            </p>
          </div>
          <div style={{ backgroundColor: '#F3F4F6', padding: '10px 15px', borderRadius: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#111' }}>Orden #{pedido.id}</span>
          </div>
        </div>

        {/* Barra de progreso */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '30px' }}>
          <div style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: '#000' }} />
          <div style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: pedido.driverName ? '#000' : '#E5E7EB' }} />
          <div style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: pedido.estado === 'Entregado' ? '#000' : '#E5E7EB' }} />
        </div>

        {(pedido.driverName) ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8F9FB', padding: '15px', borderRadius: '24px', border: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '55px', height: '55px', borderRadius: '50%', backgroundColor: '#E5E7EB', backgroundImage: 'url(https://i.pravatar.cc/150?u=kolma_driver)', backgroundSize: 'cover', border: '2px solid #fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}></div>
              <div>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#111' }}>{pedido.driverName}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <IconStar /><span style={{ fontSize: '12px', fontWeight: '800', color: '#6B7280' }}>4.9 • Repartidor Kolma</span>
                </div>
              </div>
            </div>
            {pedido.driverPhone && (
              <a href={`tel:${pedido.driverPhone}`} style={{ width: '45px', height: '45px', background: '#000', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </a>
            )}
          </div>
        ) : (
           <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#F8F9FB', padding: '15px', borderRadius: '24px', border: '1px solid #F3F4F6' }}>
              <div style={{ width: '55px', height: '55px', borderRadius: '50%', backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="loader" style={{ width: '20px', height: '20px', border: '3px solid #ccc', borderTop: '3px solid #000', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#111' }}>Buscando repartidor</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>Tu orden está lista en tienda</p>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  // ==========================================
  // 2. ESTADOS GLOBALES DE LA APLICACIÓN
  // ==========================================
  
  const [productos, setProductos] = useState([]);
  const [colecciones, setColecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorShopify, setErrorShopify] = useState(''); 
  const [categoriaActiva, setCategoriaActiva] = useState('Todas'); 
  const [searchTerm, setSearchTerm] = useState('');
  
  const [productoAmpliado, setProductoAmpliado] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  const [activeTab, setActiveTab] = useState('inicio'); 
  const [user, setUser] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [errorAuth, setErrorAuth] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({ 
    nombre: '', email: '', telefono: '', password: '', direccion: '' 
  });
  
  const [carrito, setCarrito] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [cupon, setCupon] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [isMissingInfoOpen, setIsMissingInfoOpen] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [pedidoActual, setPedidoActual] = useState(null);
  const [verMapaPremium, setVerMapaPremium] = useState(false);

  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "q0q09e-cp.myshopify.com";
  const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || "c9bda45020488455d7fe2d8b7e22f352";

  // ==========================================
  // 3. EFECTOS (Mount & Timers)
  // ==========================================
  useEffect(() => {
    const timer = setInterval(() => setCurrentBanner(prev => (prev + 1) % OFFERS.length), 5000);
    return () => clearInterval(timer);
  }, []);

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
        ...prev, nombre: savedName || '', email: savedEmail || '', 
        direccion: savedAddress || '', telefono: savedPhone || '' 
      }));
    }

    if (savedOrder) {
      try { setPedidoActual(JSON.parse(savedOrder)); } 
      catch(e) { console.error("Error leyendo pedido anterior"); }
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
        if (errors) { setErrorShopify("Error conectando con Shopify: " + errors[0].message); setLoading(false); return; }

        if(data?.collections) setColecciones([{node: {id: 'all', title: 'Todas'}}, ...data.collections.edges]);
        if(data?.products) setProductos(data.products.edges);
        setLoading(false);
      } catch (e) { setErrorShopify("Error de red conectando a la tienda."); setLoading(false); }
    }
    fetchData();
  }, [domain, accessToken]);

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

           const nuevaTrackingUrl = data.trackingUrl || pedidoActual.trackingUrl;
           const pedidoActualizado = { ...pedidoActual, estado: nuevoEstado, trackingUrl: nuevaTrackingUrl, shipdayMsg: statusRaw };

           if (info.driver_location) { pedidoActualizado.driverLat = info.driver_location.lat; pedidoActualizado.driverLng = info.driver_location.lng; }
           if (info.driver_name) pedidoActualizado.driverName = info.driver_name;
           if (info.driver_phone) pedidoActualizado.driverPhone = info.driver_phone;
           if (info.eta) pedidoActualizado.eta = info.eta;

           setPedidoActual(pedidoActualizado);
           localStorage.setItem('kolma_last_order', JSON.stringify(pedidoActualizado));
        }
      } catch(e) { console.error("Error consultando estatus", e); }
    }, 10000); 
    return () => clearInterval(rastreador);
  }, [pedidoActual]);

  // ==========================================
  // 4. LÓGICA DE USUARIOS
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
    const headers = { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': accessToken };

    try {
      if (authMode === 'register') {
        const telefonoValido = formatPhone(formData.telefono);
        if (telefonoValido.length < 11) throw new Error("Ingresa un teléfono válido de 10 dígitos.");
        if (formData.direccion.length < 5) throw new Error("Ingresa una dirección completa en Cotuí.");
        const registerResponse = await fetch(shopifyUrl, {
          method: 'POST', headers,
          body: JSON.stringify({
            query: `mutation customerCreate($input: CustomerCreateInput!) { customerCreate(input: $input) { customer { id firstName lastName email phone } customerUserErrors { message } } }`,
            variables: { input: { firstName: formData.nombre, lastName: formData.direccion, email: formData.email, phone: telefonoValido, password: formData.password } }
          })
        });
        const { data } = await registerResponse.json();
        if (data.customerCreate.customerUserErrors.length > 0) throw new Error(data.customerCreate.customerUserErrors[0].message);
        
        setAuthMode('login');
        setErrorAuth('¡Cuenta creada con éxito! Inicia sesión.');
      } else {
        const loginResponse = await fetch(shopifyUrl, {
          method: 'POST', headers,
          body: JSON.stringify({
            query: `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) { customerAccessTokenCreate(input: $input) { customerAccessToken { accessToken } customerUserErrors { message } } }`,
            variables: { input: { email: formData.email, password: formData.password } }
          })
        });
        const { data } = await loginResponse.json();
        if (data.customerAccessTokenCreate.customerUserErrors.length > 0) throw new Error(data.customerAccessTokenCreate.customerUserErrors[0].message);
        
        const userToken = data.customerAccessTokenCreate.customerAccessToken.accessToken;
        const profileResponse = await fetch(shopifyUrl, {
          method: 'POST', headers,
          body: JSON.stringify({ query: `{ customer(customerAccessToken: "${userToken}") { firstName lastName email phone } }` })
        });
        const profileData = await profileResponse.json();
        const customerInfo = profileData.data.customer;

        persistUserData({
          id: userToken, nombre: customerInfo.firstName || formData.email.split('@')[0], email: customerInfo.email,
          telefono: customerInfo.phone || "", direccion: customerInfo.lastName || "" 
        });
        localStorage.setItem('kolma_access_token', userToken);
        setIsAuthOpen(false);
      }
    } catch (err) { setErrorAuth(err.message); } finally { setIsSubmitting(false); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const telefonoValido = formatPhone(formData.telefono);
    const token = localStorage.getItem('kolma_access_token');
    try {
      if (token) {
        await fetch(`https://${domain}/api/2024-04/graphql.json`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': accessToken },
          body: JSON.stringify({
            query: `mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) { customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) { customer { firstName lastName phone } } }`,
            variables: { customerAccessToken: token, customer: { firstName: formData.nombre, lastName: formData.direccion, phone: telefonoValido } }
          })
        });
      }
      persistUserData({ ...user, nombre: formData.nombre, telefono: telefonoValido, direccion: formData.direccion });
      setIsEditingProfile(false); setIsMissingInfoOpen(false);
    } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
  };

  const handleLogout = () => {
    localStorage.clear(); setUser(null); setPedidoActual(null);
    setFormData({ nombre: '', email: '', telefono: '', password: '', direccion: '' });
    setActiveTab('inicio');
  };

  // ==========================================
  // 5. LÓGICA DE CARRITO
  // ==========================================
  const agregarAlCarrito = (producto) => {
    const variantId = producto.node.variants.edges[0]?.node.id;
    setCarrito(prev => {
      const existe = prev.find(item => item.variantId === variantId);
      if (existe) return prev.map(item => item.variantId === variantId ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { id: producto.node.id, title: producto.node.title, price: parseFloat(producto.node.variants.edges[0]?.node.price.amount), image: producto.node.images.edges[0]?.node.url, variantId, quantity: 1 }];
    });
    setIsCartOpen(true); setCheckoutStep('cart'); setProductoAmpliado(null); 
  };

  const modificarCantidad = (variantId, cambio) => {
    setCarrito(prev => prev.map(item => item.variantId === variantId ? { ...item, quantity: item.quantity + cambio } : item).filter(item => item.quantity > 0));
  };
  const calcularSubtotal = () => carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const calcularTotalFinal = () => calcularSubtotal() - descuentoAplicado;

  const avanzarAPago = () => {
    if (!user) { setIsCartOpen(false); setIsAuthOpen(true); return; }
    if (!user.nombre || !user.telefono || !user.direccion || user.direccion.length < 5) { setIsCartOpen(false); setIsMissingInfoOpen(true); return; }
    setCheckoutStep('payment'); 
  };

  const aplicarCupon = () => {
    if (cupon.toUpperCase() === 'KOLMA10') { setDescuentoAplicado(calcularSubtotal() * 0.10); alert("¡Cupón del 10% aplicado!"); } 
    else { alert("Cupón inválido"); setDescuentoAplicado(0); }
  };

  const finalizarPedido = async () => {
    setIsProcessingOrder(true);
    const totalVenta = calcularTotalFinal();
    try {
      const res = await fetch('/api/order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: carrito, customer: user, total: totalVenta.toFixed(2), metodoPago, descuento: descuentoAplicado.toFixed(2) })
      });
      const data = await res.json();
      if(!data.success) throw new Error("Error en servidor");
      
      const nuevoPedido = { 
        id: data.orderId, trackingUrl: data.trackingUrl, items: [...carrito], subtotal: calcularSubtotal(),
        descuento: descuentoAplicado, total: totalVenta, fecha: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(), 
        estado: 'Recibido', metodo: metodoPago
      };
      setPedidoActual(nuevoPedido); localStorage.setItem('kolma_last_order', JSON.stringify(nuevoPedido));
      
      setCarrito([]); setCupon(''); setDescuentoAplicado(0); setIsCartOpen(false); setCheckoutStep('cart'); setShowSuccessModal(true);
    } catch (e) { alert("Error de conexión. Intenta nuevamente."); } finally { setIsProcessingOrder(false); }
  };

  // ==========================================
  // RENDER UI
  // ==========================================
  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111', paddingBottom: '100px', overflowX: 'hidden' }}>
      
      {/* MODAL VISTA AMPLIADA */}
      {productoAmpliado && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5000, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', backdropFilter: 'blur(5px)', animation: 'fadeIn 0.2s' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '500px', borderRadius: '32px 32px 0 0', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 -10px 40px rgba(0,0,0,0.2)' }}>
            <button onClick={() => setProductoAmpliado(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
              <IconClose />
            </button>
            <div style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '250px' }}>
              <img src={productoAmpliado.node.images.edges[0]?.node.url} style={{ width: '100%', maxHeight: '250px', objectFit: 'contain' }} alt={productoAmpliado.node.title} />
            </div>
            <div style={{ padding: '25px', textAlign: 'left', borderTop: '1px solid #F3F4F6' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.6rem', fontWeight: '900', color: '#111', lineHeight: '1.2' }}>{productoAmpliado.node.title}</h3>
              <p style={{ margin: '0 0 25px 0', fontSize: '1.8rem', fontWeight: '900', color: '#000' }}>RD${parseFloat(productoAmpliado.node.variants.edges[0]?.node.price.amount).toFixed(0)}</p>
              <button onClick={() => agregarAlCarrito(productoAmpliado)} style={{ width: '100%', padding: '20px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                <IconAdd /> Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {verMapaPremium && pedidoActual && <TrackingKolma pedido={pedidoActual} cerrarMapa={() => setVerMapaPremium(false)} />}

      {/* MODAL ÉXITO */}
      {showSuccessModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div style={{ backgroundColor: '#fff', padding: '40px 30px', borderRadius: '24px', width: '90%', maxWidth: '400px', textAlign: 'center', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}><IconSuccess /></div>
            <h2 style={{ margin: '0 0 15px 0', fontWeight: '900', color: '#111', fontSize: '1.8rem' }}>Orden Confirmada</h2>
            <p style={{ color: '#4B5563', fontSize: '1rem', lineHeight: '1.6', marginBottom: '35px' }}>Tu orden <strong>#{pedidoActual?.id}</strong> se está preparando.</p>
            <button onClick={() => { setShowSuccessModal(false); setActiveTab('pedidos'); }} style={{ backgroundColor: '#000', color: '#fff', width: '100%', padding: '18px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer' }}>
              Ver estado de mi orden
            </button>
          </div>
        </div>
      )}

      {/* HEADER (Uber Eats Style) */}
      <header style={{ backgroundColor: '#fff', padding: '15px 20px', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div onClick={() => setActiveTab('inicio')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', color: '#000', letterSpacing: '-1px' }}>Kolma<span style={{color: '#E31E24'}}>.</span></h1>
          </div>
          
          <div style={{ backgroundColor: '#F3F4F6', borderRadius: '20px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
             <span style={{ fontSize: '14px', fontWeight: '800', color: '#000' }}>Cotuí, RD</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer', backgroundColor: '#000', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <IconCart />
              {carrito.length > 0 && (
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', backgroundColor: '#E31E24', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #000' }}>
                  {carrito.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* VISTA 1: INICIO ESTÉTICA PREMIUM */}
      {activeTab === 'inicio' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          
          <section style={{ padding: '15px 20px 0 20px' }}>
            <div style={{ backgroundColor: '#F3F4F6', borderRadius: '16px', padding: '12px 16px', display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ color: '#000', marginRight: '10px' }}><IconSearch /></div>
              <input type="text" placeholder="Buscar comida, supermercado..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', color: '#111', fontWeight: '600', background: 'transparent' }} />
            </div>

            {!searchTerm && (
              <div style={{ overflow: 'hidden', borderRadius: '24px', height: '180px', position: 'relative', marginBottom: '25px' }}>
                <div style={{ display: 'flex', transition: 'transform 0.5s ease-in-out', transform: `translateX(-${currentBanner * 100}%)`, height: '100%' }}>
                  {OFFERS.map(offer => (
                    <div key={offer.id} style={{ minWidth: '100%', height: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: offer.bg, opacity: 0.6, mixBlendMode: 'multiply', zIndex: 1 }} />
                      <img src={offer.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={offer.title} />
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2, padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '900', margin: '0 0 5px 0', lineHeight: '1.1' }}>{offer.title}</h2>
                        <p style={{ color: '#E5E7EB', fontSize: '14px', fontWeight: '600', margin: 0 }}>{offer.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {!searchTerm && (
            <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
              <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                {colecciones.map((col) => {
                  const isActive = categoriaActiva === col.node.title;
                  const emoji = obtenerEmojiCategoria(col.node.title);
                  return (
                    <button key={col.node.id} onClick={() => setCategoriaActiva(col.node.title)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px', border: 'none', background: 'none', cursor: 'pointer', outline: 'none' }}>
                      <div style={{ width: '65px', height: '65px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', backgroundColor: isActive ? '#000' : '#F3F4F6', transition: 'all 0.2s' }}>
                        {emoji}
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: isActive ? '900' : '600', marginTop: '8px', color: isActive ? '#000' : '#6B7280' }}>
                        {col.node.title === 'Todas' ? 'Todo' : col.node.title}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#111', margin: '0 0 15px 0' }}>Recomendado para ti</h3>
            {errorShopify && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '20px', borderRadius: '15px', textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>{errorShopify}</p>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
              {loading && !errorShopify ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px' }}>
                  <div className="loader" style={{ width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #000', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                </div>
              ) : productos.filter(p => {
                if (p.node.tags && p.node.tags.some(tag => tag.toLowerCase() === 'pos')) return false;
                const coincideBusqueda = p.node.title.toLowerCase().includes(searchTerm.toLowerCase());
                const coincideCategoria = categoriaActiva === 'Todas' || p.node.collections.edges.some(c => c.node.title === categoriaActiva);
                return coincideBusqueda && coincideCategoria;
              }).map(({ node }) => (
                <div key={node.id} style={{ borderRadius: '16px', display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => setProductoAmpliado({ node })}>
                  <div style={{ backgroundColor: '#F8F9FB', borderRadius: '16px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px', position: 'relative', marginBottom: '10px' }}>
                    <img src={node.images.edges[0]?.node.url} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} alt={node.title} />
                    <button onClick={(e) => { e.stopPropagation(); agregarAlCarrito({ node }) }} style={{ position: 'absolute', bottom: '-15px', right: '10px', backgroundColor: '#000', color: '#fff', width: '35px', height: '35px', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                      <IconAdd />
                    </button>
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#111', margin: '0 0 4px 0', lineHeight: '1.2' }}>{node.title}</h4>
                  <span style={{ fontWeight: '900', fontSize: '15px', color: '#000' }}>RD${parseFloat(node.variants.edges[0]?.node.price.amount).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* VISTA 2: PEDIDOS (Estilo Uber) */}
      {activeTab === 'pedidos' && (
        <section style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', animation: 'fadeIn 0.3s' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 20px 0' }}>Tus Órdenes</h2>
          
          {pedidoActual ? (
            <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '20px', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                 <div style={{ backgroundColor: '#000', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <IconTruck active={true} color="#fff" />
                 </div>
                 <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>Kolma Supermercado</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '14px', color: '#6B7280', fontWeight: '600' }}>Orden #{pedidoActual.id}</p>
                 </div>
              </div>

              {/* Status Visual Tracker */}
              <div style={{ marginBottom: '25px' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '900', color: pedidoActual.estado === 'Entregado' || pedidoActual.estado === 'Finalizado' ? '#16A34A' : '#000' }}>
                  {pedidoActual.estado === 'En camino' ? 'En camino hacia ti' : 
                   pedidoActual.estado === 'Entregado' || pedidoActual.estado === 'Finalizado' ? 'Entregado' : 
                   'Preparando tu orden'}
                </p>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: '#000' }} />
                  <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: (pedidoActual.estado === 'En camino' || pedidoActual.estado === 'Entregado' || pedidoActual.estado === 'Finalizado') ? '#000' : '#E5E7EB' }} />
                  <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: (pedidoActual.estado === 'Entregado' || pedidoActual.estado === 'Finalizado') ? '#16A34A' : '#E5E7EB' }} />
                </div>
              </div>

              {pedidoActual.estado === 'En camino' && (
                <button onClick={() => setVerMapaPremium(true)} style={{ width: '100%', backgroundColor: '#F3F4F6', color: '#000', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                  Ver ruta en vivo
                </button>
              )}

              <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '20px' }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '900' }}>Detalles</h4>
                {pedidoActual.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ backgroundColor: '#F3F4F6', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: '900' }}>{item.quantity}</div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#4B5563', flex: 1 }}>{item.title}</span>
                    <span style={{ fontWeight: '800', fontSize: '14px' }}>RD${(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #E5E7EB' }}>
                  <span style={{ fontWeight: '900', fontSize: '16px' }}>Total</span>
                  <span style={{ fontWeight: '900', fontSize: '18px' }}>RD$ {pedidoActual.total.toFixed(0)}</span>
                </div>
              </div>

            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <IconOrders active={false} />
              <h3 style={{ margin: '15px 0 10px 0', fontWeight: '900', fontSize: '20px' }}>No hay órdenes activas</h3>
              <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '25px' }}>Tus pedidos recientes aparecerán aquí.</p>
              <button onClick={() => setActiveTab('inicio')} style={{ backgroundColor: '#000', color: '#fff', padding: '15px 30px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '1rem', cursor: 'pointer' }}>Comenzar a comprar</button>
            </div>
          )}
        </section>
      )}

      {/* VISTA 3: PERFIL (Estilo Minimalista) */}
      {activeTab === 'perfil' && (
        <section style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', animation: 'fadeIn 0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontWeight: '900', fontSize: '28px', margin: '0', color: '#111' }}>Cuenta</h2>
            {user && (
              <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', fontWeight: '800', fontSize: '14px', cursor: 'pointer', color: '#E31E24' }}>
                Cerrar Sesión
              </button>
            )}
          </div>
          
          {user ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#F3F4F6', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '900' }}>
                  {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#111' }}>{user.nombre || 'Usuario'}</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '14px', color: '#6B7280', fontWeight: '600' }}>{user.email}</p>
                </div>
                <button onClick={() => setIsEditingProfile(!isEditingProfile)} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <IconEdit />
                </button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input placeholder="Nombre" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '16px', fontWeight: '600' }} />
                  <input placeholder="Teléfono" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} required style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '16px', fontWeight: '600' }} />
                  <textarea placeholder="Dirección de entrega" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} required style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '16px', fontWeight: '600', height: '80px', resize: 'none' }} />
                  <button type="submit" disabled={isSubmitting} style={{ backgroundColor: '#000', color: '#fff', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>
                    Guardar Cambios
                  </button>
                </form>
              ) : (
                <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '20px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase' }}>Teléfono</p>
                    <p style={{ margin: '5px 0 0 0', fontWeight: '700', fontSize: '16px' }}>{user.telefono || 'No especificado'}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase' }}>Direcciones Guardadas</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                      <div style={{ backgroundColor: '#000', color: '#fff', padding: '10px', borderRadius: '50%' }}><IconHome active={true} /></div>
                      <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', lineHeight: '1.4' }}>{user.direccion || 'No hay dirección guardada'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ backgroundColor: '#F3F4F6', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><IconProfile active={false} /></div>
              <h3 style={{ fontWeight: '900', fontSize: '20px', margin: '0 0 10px 0' }}>Inicia sesión</h3>
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 25px 0' }}>Guarda tus direcciones y haz pedidos más rápido.</p>
              <button onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }} style={{ backgroundColor: '#000', color: '#fff', width: '100%', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>Continuar</button>
            </div>
          )}
        </section>
      )}

      {/* DRAWER LATERAL: CARRITO */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(2px)' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '400px', height: '100%', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {checkoutStep === 'payment' && <button onClick={() => setCheckoutStep('cart')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#000', padding: '0 10px 0 0' }}>←</button>}
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '20px' }}>{checkoutStep === 'cart' ? 'Tu Carrito' : 'Detalles de Pago'}</h3>
              </div>
              <div onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }} style={{ cursor: 'pointer', backgroundColor: '#F3F4F6', padding: '8px', borderRadius: '50%', display: 'flex' }}><IconClose /></div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {checkoutStep === 'cart' && (
                carrito.length === 0 ? (
                  <div style={{ textAlign: 'center', marginTop: '60px', color: '#9CA3AF' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><IconCart /></div>
                    <h3 style={{ color: '#111', fontWeight: '900', fontSize: '18px' }}>Tu carrito está vacío</h3>
                    <p style={{ marginTop: '10px', fontWeight: '600', fontSize: '14px' }}>Agrega productos para comenzar un pedido.</p>
                  </div>
                ) : (
                  <div>
                    {carrito.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                        <img src={item.image} style={{ width: '60px', height: '60px', objectFit: 'contain', backgroundColor: '#F8F9FB', borderRadius: '12px', padding: '5px' }} alt="" />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700', color: '#111' }}>{item.title}</h4>
                          <p style={{ margin: 0, color: '#000', fontWeight: '900', fontSize: '14px' }}>RD${item.price.toFixed(0)}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: '20px', padding: '2px' }}>
                          <button onClick={() => modificarCantidad(item.variantId, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.quantity === 1 ? <IconTrash /> : <IconMinus />}
                          </button>
                          <span style={{ fontWeight: '900', width: '20px', textAlign: 'center', fontSize: '14px' }}>{item.quantity}</span>
                          <button onClick={() => modificarCantidad(item.variantId, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconAdd /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {checkoutStep === 'payment' && (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  <div style={{ marginBottom: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ margin: 0, fontWeight: '900', fontSize: '16px' }}>Entregar a</h4>
                    </div>
                    <div style={{ backgroundColor: '#F8F9FB', borderRadius: '12px', padding: '15px', border: '1px solid #F3F4F6' }}>
                      <p style={{ margin: '0 0 5px 0', fontWeight: '800', fontSize: '15px' }}>{user.nombre}</p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>{user.direccion}</p>
                    </div>
                  </div>
                  
                  <h4 style={{ margin: '0 0 15px 0', fontWeight: '900', fontSize: '16px' }}>Pago</h4>
                  <div onClick={() => setMetodoPago('efectivo')} style={{ border: metodoPago === 'efectivo' ? '2px solid #000' : '1px solid #E5E7EB', borderRadius: '12px', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px', cursor: 'pointer' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: metodoPago === 'efectivo' ? '6px solid #000' : '2px solid #D1D5DB' }}></div>
                    <span style={{ fontWeight: '700', fontSize: '15px' }}>Efectivo al recibir</span>
                  </div>
                  <div onClick={() => setMetodoPago('tarjeta')} style={{ border: metodoPago === 'tarjeta' ? '2px solid #000' : '1px solid #E5E7EB', borderRadius: '12px', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', opacity: 0.6 }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #D1D5DB' }}></div>
                    <span style={{ fontWeight: '700', fontSize: '15px' }}>Tarjeta (No disponible)</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '20px', borderTop: '1px solid #E5E7EB', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontWeight: '800', fontSize: '16px' }}>Total</span>
                <span style={{ fontWeight: '900', fontSize: '24px', color: '#000' }}>RD$ {calcularTotalFinal().toFixed(0)}</span>
              </div>
              {checkoutStep === 'cart' ? (
                <button onClick={avanzarAPago} disabled={carrito.length === 0} style={{ width: '100%', backgroundColor: carrito.length === 0 ? '#E5E7EB' : '#000', color: carrito.length === 0 ? '#9CA3AF' : '#fff', padding: '18px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: carrito.length === 0 ? 'not-allowed' : 'pointer' }}>
                  Ir a pagar
                </button>
              ) : (
                <button onClick={finalizarPedido} disabled={isProcessingOrder || metodoPago === 'tarjeta'} style={{ width: '100%', backgroundColor: (isProcessingOrder || metodoPago === 'tarjeta') ? '#E5E7EB' : '#000', color: (isProcessingOrder || metodoPago === 'tarjeta') ? '#9CA3AF' : '#fff', padding: '18px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: (isProcessingOrder || metodoPago === 'tarjeta') ? 'not-allowed' : 'pointer' }}>
                  {isProcessingOrder ? 'Procesando...' : 'Hacer pedido'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL FALTAN DATOS */}
      {isMissingInfoOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '24px', width: '90%', maxWidth: '400px', animation: 'fadeIn 0.2s' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: '900' }}>Detalles de entrega</h3>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>Necesitamos tu dirección en Cotuí para enviar la orden.</p>
            <form onSubmit={(e) => { handleUpdateProfile(e); if (formData.telefono.length >= 10 && formData.direccion.length >= 5) setCheckoutStep('payment'); }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input placeholder="Teléfono (Ej: 8090000000)" required style={{ padding: '15px', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '16px', background: '#F9FAFB' }} value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
              <textarea placeholder="Sector, calle, casa..." required style={{ padding: '15px', borderRadius: '12px', border: '1px solid #E5E7EB', height: '80px', resize: 'none', fontSize: '16px', background: '#F9FAFB' }} value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
              <button type="submit" disabled={isSubmitting} style={{ backgroundColor: '#000', color: '#fff', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px', marginTop: '10px', cursor: 'pointer' }}>Continuar</button>
              <button type="button" onClick={() => setIsMissingInfoOpen(false)} style={{ color: '#000', background: 'none', border: 'none', fontWeight: '700', fontSize: '14px', cursor: 'pointer', padding: '5px' }}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AUTH */}
      {isAuthOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 3000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto', animation: 'slideUp 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '900' }}>{authMode === 'login' ? 'Bienvenido' : 'Crear Cuenta'}</h3>
              <div onClick={() => setIsAuthOpen(false)} style={{ cursor: 'pointer', backgroundColor: '#F3F4F6', padding: '8px', borderRadius: '50%', display: 'flex' }}><IconClose /></div>
            </div>
            <form onSubmit={handleAuthentication} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {authMode === 'register' && (
                <input placeholder="Nombre completo" required style={{ padding: '15px', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '16px' }} onChange={e => setFormData({...formData, nombre: e.target.value})} />
              )}
              <input type="email" placeholder="Correo electrónico" required style={{ padding: '15px', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '16px' }} onChange={e => setFormData({...formData, email: e.target.value})} />
              {authMode === 'register' && (
                <>
                  <input placeholder="Teléfono (809...)" required style={{ padding: '15px', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '16px' }} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                  <input placeholder="Dirección en Cotuí" required style={{ padding: '15px', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '16px' }} onChange={e => setFormData({...formData, direccion: e.target.value})} />
                </>
              )}
              <input type="password" placeholder="Contraseña" required style={{ padding: '15px', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '16px' }} onChange={e => setFormData({...formData, password: e.target.value})} />
              
              {errorAuth && <div style={{ backgroundColor: '#FEF2F2', padding: '10px', borderRadius: '8px' }}><p style={{ margin: 0, color: '#991B1B', fontSize: '14px', fontWeight: '700' }}>{errorAuth}</p></div>}
              
              <button type="submit" disabled={isSubmitting} style={{ backgroundColor: '#000', color: '#fff', padding: '18px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px', marginTop: '10px', cursor: 'pointer' }}>
                {isSubmitting ? 'Cargando...' : authMode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            </form>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              {authMode === 'login' ? (
                <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>¿Nuevo en Kolma? <span onClick={() => setAuthMode('register')} style={{ color: '#000', fontWeight: '900', cursor: 'pointer' }}>Crea tu cuenta</span></p>
              ) : (
                <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>¿Ya tienes cuenta? <span onClick={() => setAuthMode('login')} style={{ color: '#000', fontWeight: '900', cursor: 'pointer' }}>Inicia sesión</span></p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NAVEGACIÓN INFERIOR (Estilo Minimalista) */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTop: '1px solid #F3F4F6', zIndex: 1000, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '65px' }}>
          <div onClick={() => setActiveTab('inicio')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeTab === 'inicio' ? '#000' : '#9CA3AF' }}>
            <IconHome active={activeTab === 'inicio'} />
            <span style={{ fontSize: '10px', fontWeight: '800', marginTop: '4px' }}>Inicio</span>
          </div>
          <div onClick={() => setActiveTab('pedidos')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeTab === 'pedidos' ? '#000' : '#9CA3AF' }}>
            <IconTruck active={activeTab === 'pedidos'} />
            <span style={{ fontSize: '10px', fontWeight: '800', marginTop: '4px' }}>Órdenes</span>
          </div>
          <div onClick={() => setActiveTab('perfil')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeTab === 'perfil' ? '#000' : '#9CA3AF' }}>
            <IconProfile active={activeTab === 'perfil'} />
            <span style={{ fontSize: '10px', fontWeight: '800', marginTop: '4px' }}>Cuenta</span>
          </div>
        </div>
      </nav>

      <style jsx global>{`
        @keyframes slideInRight { 0% { transform: translateX(100%); } 100% { transform: translateX(0); } }
        @keyframes slideUp { 0% { transform: translateY(100%); } 100% { transform: translateY(0); } }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 0px; height: 0px; background: transparent; }
        input::placeholder, textarea::placeholder { color: #9CA3AF; }
        input:focus, textarea:focus { outline: none; border-color: #000 !important; }
      `}</style>
      <Analytics />
    </div>
  );
}
