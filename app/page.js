'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Analytics } from "@vercel/analytics/react"

// ==========================================
// 1. ICONOS PREMIUM (SVG) PWA OPTIMIZED
// ==========================================
const Icons = {
  Add: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Minus: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Trash: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>,
  Home: ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#E31E24" : "none"} stroke={active ? "#E31E24" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  Truck: ({ active, color }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color || (active ? "#E31E24" : "#9CA3AF")} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>,
  Profile: ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#E31E24" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Cart: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>,
  Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Success: () => <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
  Fire: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#E31E24" stroke="#E31E24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.2 22a7.1 7.1 0 0 1-7.1-7.1c0-3.3 2.5-6.4 5.3-8.8.4-.3.9-.7 1.4-1.1.2-.2.3-.5.1-.7-.1-.2-.4-.3-.6-.2-3.1 1.6-5.8 4.2-7.4 7.2-.2.4-.6.6-1 .4-.4-.2-.5-.6-.3-1C7.8 7 11.6 3.6 15.6 2c.4-.2.8.1.9.5.3 2.1 1.5 3.9 3.2 5.2 1.7 1.2 2.8 3.1 2.8 5.2A7.1 7.1 0 0 1 15.2 22z"></path></svg>,
  Shield: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
  Star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
  Location: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  ChevronLeft: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>,
  Money: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
};

// ==========================================
// 2. CONFIGURACIÓN, UTILIDADES Y NEUROMARKETING
// ==========================================
const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "q0q09e-cp.myshopify.com";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || "c9bda45020488455d7fe2d8b7e22f352";

const formatTime = (secs) => {
  const h = Math.floor(secs / 3600).toString().padStart(2, '0');
  const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const getCategoryEmoji = (title) => {
  const t = title.toLowerCase();
  if (t.includes('todas')) return '✨';
  if (t.includes('carne') || t.includes('pollo')) return '🥩';
  if (t.includes('lacteo') || t.includes('queso') || t.includes('leche')) return '🥛';
  if (t.includes('bebida') || t.includes('jugo')) return '🥤';
  if (t.includes('limpieza') || t.includes('hogar')) return '🧼';
  if (t.includes('licor') || t.includes('cerveza') || t.includes('vino')) return '🍷';
  if (t.includes('pan') || t.includes('harina')) return '🍞';
  if (t.includes('fruta') || t.includes('vegetal')) return '🥑';
  if (t.includes('snack') || t.includes('dulce')) return '🍫';
  if (t.includes('cuidado') || t.includes('personal')) return '🧴';
  if (t.includes('bebé') || t.includes('baby')) return '🍼';
  return '🛍️'; 
};

// ==========================================
// 3. MAPA DE TRACKING EN VIVO (SHIPDAY INTEGRATION)
// ==========================================
const LiveTrackingMap = ({ order, onClose }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initMap = () => {
      const L = window.L;
      if (!L || mapRef.current) return;

      // Coordenadas Cotuí
      const cotuiCoords = [19.0528, -70.1435];
      mapRef.current = L.map('live-map', { zoomControl: false, attributionControl: false }).setView(cotuiCoords, 16);
      
      // Estilo de mapa claro y premium tipo Uber
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(mapRef.current);

      const driverHtml = `<div style="background-color: #E31E24; width: 45px; height: 45px; border-radius: 50%; border: 4px solid white; box-shadow: 0 5px 15px rgba(227,30,36,0.5); display: flex; align-items: center; justify-content: center; animation: pulseDriver 2s infinite;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                          </div>`;
      
      const driverIcon = L.divIcon({ className: 'custom-driver-pin', html: driverHtml, iconSize: [45, 45], iconAnchor: [22, 22] });
      markerRef.current = L.marker(cotuiCoords, { icon: driverIcon, zIndexOffset: 1000 }).addTo(mapRef.current);
    };

    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    } else { initMap(); }
  }, []);

  useEffect(() => {
    // Si llegan coordenadas de la API Shipday, mover el marcador
    if (order?.driverLat && order?.driverLng && markerRef.current) {
      const pos = [order.driverLat, order.driverLng];
      markerRef.current.setLatLng(pos);
      if (mapRef.current) mapRef.current.panTo(pos, { animate: true, duration: 1.5 });
    }
  }, [order?.driverLat, order?.driverLng]);

  return (
    <div className="modal-overlay" style={{ zIndex: 4000, display: 'flex', flexDirection: 'column', backgroundColor: '#000' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 'env(safe-area-inset-top, 40px)', left: '20px', width: '45px', height: '45px', background: '#fff', borderRadius: '50%', border: 'none', zIndex: 4002, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <Icons.ChevronLeft />
      </button>

      {/* Contenedor del Mapa */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '45%', zIndex: 4000 }}>
        <div id="live-map" style={{ width: '100%', height: '100%', backgroundColor: '#E5E7EB' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))', zIndex: 4001 }} />
      </div>

      {/* Panel Inferior de Shipday */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', backgroundColor: '#fff', zIndex: 4002, borderRadius: '32px 32px 0 0', padding: '25px', boxShadow: '0 -10px 40px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '40px', height: '5px', backgroundColor: '#E5E7EB', borderRadius: '3px', margin: '0 auto 20px' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '900', color: '#111' }}>{order.eta ? `Llega en ${order.eta} min` : 'En camino a Cotuí'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '15px', color: '#E31E24', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-dot"></span> {order.shipdayMsg || 'Conectando con repartidor...'}
            </p>
          </div>
          <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', padding: '8px 12px', borderRadius: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '900', color: '#111' }}>#{order.id.slice(-5)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', marginBottom: '30px' }}>
          <div style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: '#E31E24' }} />
          <div className="shimmer-bar" style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: order.driverName ? '#E31E24' : '#E5E7EB' }} />
          <div style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: order.estado === 'Entregado' ? '#E31E24' : '#E5E7EB' }} />
        </div>

        {order.driverName ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '20px', borderRadius: '24px', border: '1px solid #F3F4F6', boxShadow: '0 8px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#E5E7EB', backgroundImage: 'url(https://i.pravatar.cc/150?u=kolma_driver)', backgroundSize: 'cover', border: '3px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}></div>
              <div>
                <p style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#111' }}>{order.driverName}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                  <Icons.Shield /><span style={{ fontSize: '13px', fontWeight: '700', color: '#6B7280' }}>Repartidor Kolma</span>
                </div>
              </div>
            </div>
            {order.driverPhone && (
              <a href={`tel:${order.driverPhone}`} style={{ width: '48px', height: '48px', background: '#111', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </a>
            )}
          </div>
        ) : (
           <div style={{ display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#FEF2F2', padding: '20px', borderRadius: '24px', border: '1px solid #FCA5A5' }}>
              <div className="loader" style={{ width: '30px', height: '30px', border: '4px solid #FCA5A5', borderTop: '4px solid #E31E24', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <div>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#991B1B' }}>Buscando a tu repartidor...</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '600', color: '#B91C1C' }}>Empacando orden y calculando ruta.</p>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. COMPONENTE PRINCIPAL (PWA APP)
// ==========================================
export default function App() {
  // Estado Global - UI & Navegación
  const [activeTab, setActiveTab] = useState('inicio');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [showProductModal, setShowProductModal] = useState(null);
  
  // Estado Global - Data (Shopify)
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado Global - Usuario & Auth
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('register');
  const [authForm, setAuthForm] = useState({ nombre: '', email: '', password: '', telefono: '', direccion: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado Global - Carrito & Checkout
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart'); 
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  
  // Estado Global - Órdenes & Shipday
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [showSuccessBlast, setShowSuccessBlast] = useState(false);
  
  // ------------------------------------------
  // BANNER DINÁMICO (Urgencia -> Expira -> Oferta Regular)
  // ------------------------------------------
  const [bannerTimer, setBannerTimer] = useState(120); // 2 Minutos de prueba para que veas el cambio
  const [bannerState, setBannerState] = useState('urgency'); 
  
  useEffect(() => {
    if (bannerTimer > 0) {
      const timerId = setInterval(() => setBannerTimer(prev => prev - 1), 1000);
      return () => clearInterval(timerId);
    } else {
      setBannerState('regular'); // Cambio automático de estado
    }
  }, [bannerTimer]);

  // ------------------------------------------
  // INICIALIZACIÓN: SHOPIFY FETCH & LOCAL STORAGE
  // ------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem('kolma_token');
    if (token) {
      setUser({
        id: token,
        nombre: localStorage.getItem('kolma_name') || 'Cliente',
        email: localStorage.getItem('kolma_email'),
        telefono: localStorage.getItem('kolma_phone') || '',
        direccion: localStorage.getItem('kolma_address') || ''
      });
      const savedOrders = JSON.parse(localStorage.getItem('kolma_orders') || '[]');
      setOrders(savedOrders);
      if (savedOrders.length > 0) {
        const last = savedOrders[savedOrders.length - 1];
        if (last.estado !== 'Finalizado') setCurrentOrder(last);
      }
    }

    const fetchShopify = async () => {
      try {
        const res = await fetch(`https://${DOMAIN}/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN },
          body: JSON.stringify({
            query: `{ 
              collections(first: 20) { edges { node { id title } } }
              products(first: 50) { edges { node { id title tags collections(first: 5) { edges { node { title } } } images(first: 1) { edges { node { url } } } variants(first: 1) { edges { node { id price { amount } compareAtPrice { amount } } } } } } } 
            }`
          })
        });
        const { data } = await res.json();
        
        if (data.collections) setCollections([{node: {id: 'all', title: 'Todas'}}, ...data.collections.edges]);
        if (data.products) {
          const processedProds = data.products.edges.map(p => {
            const price = parseFloat(p.node.variants.edges[0].node.price.amount);
            if (!p.node.variants.edges[0].node.compareAtPrice) {
              p.node.variants.edges[0].node.compareAtPrice = { amount: (price * 1.3).toFixed(2) }; // Anclaje Falso +30%
            }
            // Generación determinista para neuromarketing
            const hash = p.node.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            p.neuroStats = { views: (hash % 20) + 3, stock: (hash % 10) === 0 ? 2 : null, sold: (hash % 50) + 10 };
            return p;
          });
          setProducts(processedProds);
        }
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchShopify();
  }, []);

  // ------------------------------------------
  // LÓGICA DE SHIPDAY POLLING (Real API Connection Simulator)
  // ------------------------------------------
  useEffect(() => {
    if (!currentOrder || ['Entregado', 'Finalizado'].includes(currentOrder.estado)) return;
    
    // Polling cada 10 segundos al endpoint que creaste (ej. /api/status)
    const tracker = setInterval(async () => {
      try {
        // Asumiendo que tu ruta Next.js actúa de Proxy a Shipday:
        const res = await fetch(`/api/status?id=${currentOrder.id}&t=${Date.now()}`);
        const data = await res.json();
        
        if (data.success && data.status_route) {
          const info = data.status_route;
          const status = info.status.toUpperCase();
          
          if (['ALREADY_DELIVERED', 'SUCCESSFUL', 'DELIVERED', 'COMPLETED'].includes(status)) {
            clearInterval(tracker);
            updateOrderStatus(currentOrder.id, 'Entregado', info, 'Orden Entregada. ¡Disfruta!');
            return;
          }
          
          let newStatus = currentOrder.estado;
          if (['UNASSIGNED', 'ACCEPTED', 'PENDING'].includes(status)) newStatus = 'Preparando';
          if (['ASSIGNED', 'STARTED', 'PICKED_UP', 'ACTIVE', 'ON_THE_WAY'].includes(status)) newStatus = 'En camino';
          
          let msg = status === 'STARTED' ? 'Repartidor en camino al comercio' : status === 'PICKED_UP' ? 'Orden recogida, en ruta a ti' : 'Preparando orden';
          
          updateOrderStatus(currentOrder.id, newStatus, info, msg);
        }
      } catch(e) { console.error("Error Polling Shipday", e); }
    }, 10000);
    return () => clearInterval(tracker);
  }, [currentOrder]);

  const updateOrderStatus = (id, status, shipdayData, rawMsg = '') => {
    const updated = { ...currentOrder, estado: status, shipdayMsg: rawMsg || status };
    if (shipdayData?.driver_location) {
      updated.driverLat = shipdayData.driver_location.lat;
      updated.driverLng = shipdayData.driver_location.lng;
    }
    if (shipdayData?.driver_name) updated.driverName = shipdayData.driver_name;
    if (shipdayData?.driver_phone) updated.driverPhone = shipdayData.driver_phone;
    if (shipdayData?.eta) updated.eta = shipdayData.eta;

    setCurrentOrder(updated);
    setOrders(prev => {
      const newOrders = prev.map(o => o.id === id ? updated : o);
      localStorage.setItem('kolma_orders', JSON.stringify(newOrders));
      return newOrders;
    });
  };

  // ------------------------------------------
  // FUNCIONES DE CARRITO
  // ------------------------------------------
  const addToCart = (product) => {
    const variant = product.node.variants.edges[0].node;
    setCart(prev => {
      const existing = prev.find(item => item.variantId === variant.id);
      if (existing) return prev.map(item => item.variantId === variant.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, {
        id: product.node.id, title: product.node.title, 
        price: parseFloat(variant.price.amount), originalPrice: parseFloat(variant.compareAtPrice.amount),
        image: product.node.images.edges[0]?.node.url, variantId: variant.id, quantity: 1
      }];
    });
    setShowProductModal(null);
    const cartBtn = document.getElementById('main-cart-btn');
    if (cartBtn) { cartBtn.classList.add('pop-cart-anim'); setTimeout(()=>cartBtn.classList.remove('pop-cart-anim'), 300); }
  };

  const updateCartQty = (id, delta) => setCart(prev => prev.map(i => i.variantId === id ? { ...i, quantity: i.quantity + delta } : i).filter(i => i.quantity > 0));
  const getSubtotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ------------------------------------------
  // FLUJO DE CHECKOUT Y AUTENTICACIÓN
  // ------------------------------------------
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const mockToken = 'kolma_' + Math.random().toString(36).substr(2);
      const userData = {
        id: mockToken, nombre: authForm.nombre || authForm.email.split('@')[0],
        email: authForm.email, telefono: authForm.telefono, direccion: authForm.direccion || 'Cotuí'
      };
      localStorage.setItem('kolma_token', mockToken);
      localStorage.setItem('kolma_name', userData.nombre);
      localStorage.setItem('kolma_email', userData.email);
      localStorage.setItem('kolma_phone', userData.telefono);
      localStorage.setItem('kolma_address', userData.direccion);
      
      setUser(userData);
      setIsAuthModalOpen(false);
      setIsSubmitting(false);
      if (isCartOpen && checkoutStep === 'cart') setCheckoutStep('shipping');
    }, 1000);
  };

  const placeOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      // AQUÍ: Deberías hacer fetch POST a tu '/api/order' para inyectar en Shipday
      const newOrder = {
        id: 'KOL-' + Math.floor(10000 + Math.random() * 90000), // Este id lo debes reemplazar por el que devuelva Shipday
        items: [...cart], total: getSubtotal(),
        estado: 'Recibido', fecha: new Date().toLocaleString('es-DO'),
        metodoPago: paymentMethod
      };
      
      setCurrentOrder(newOrder);
      const newHistory = [...orders, newOrder];
      setOrders(newHistory);
      localStorage.setItem('kolma_orders', JSON.stringify(newHistory));
      
      setCart([]); setIsSubmitting(false); setIsCartOpen(false); setCheckoutStep('cart'); setShowSuccessBlast(true); setActiveTab('pedidos');
    }, 1500);
  };

  const logout = () => { localStorage.clear(); setUser(null); setOrders([]); setCurrentOrder(null); setActiveTab('inicio'); };

  // ------------------------------------------
  // RENDER UI: MAIN APP
  // ------------------------------------------
  return (
    <div style={{ backgroundColor: '#F8F9FB', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111' }}>
      
      {/* PWA HEADER (Sticky con soporte Safe Area) */}
      <header style={{ backgroundColor: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #F3F4F6', paddingTop: 'env(safe-area-inset-top)' }}>
        
        {/* BANNER DINÁMICO */}
        {bannerState === 'urgency' ? (
          <div style={{ backgroundColor: '#E31E24', color: '#fff', padding: '6px', textAlign: 'center', fontSize: '11px', fontWeight: '900', letterSpacing: '1px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.5s' }}>
            <Icons.Fire /> PIDE AHORA Y NO PAGUES ENVÍO. EXPIRA EN: {formatTime(bannerTimer)}
          </div>
        ) : (
          <div style={{ backgroundColor: '#111', color: '#fff', padding: '6px', textAlign: 'center', fontSize: '11px', fontWeight: '900', letterSpacing: '1px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.5s' }}>
            ⭐️ CLUB KOLMA: ENVÍOS GRATIS EN COTUÍ AL REGISTRARTE
          </div>
        )}

        <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 onClick={() => setActiveTab('inicio')} style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#E31E24', cursor: 'pointer', letterSpacing: '-1.5px' }}>KOLMA<span style={{color: '#111', fontWeight: '300'}}>RD</span></h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F3F4F6', padding: '6px 10px', borderRadius: '10px', gap: '6px' }}>
                <Icons.Location /> <span style={{ fontSize: '12px', fontWeight: '800' }}>Cotuí</span>
              </div>
            ) : (
              <button onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }} style={{ backgroundColor: '#E31E24', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}>Ingresar</button>
            )}
            
            <div id="main-cart-btn" onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer', backgroundColor: '#111', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
              <Icons.Cart />
              {cartItemCount > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#E31E24', color: '#fff', fontSize: '10px', fontWeight: '900', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #111' }}>{cartItemCount}</span>}
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ paddingBottom: '120px' }}>
        
        {/* === VISTA INICIO === */}
        {activeTab === 'inicio' && (
          <div className="view-fade-in">
            <div style={{ padding: '15px 20px', backgroundColor: '#fff', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F8F9FB', borderRadius: '14px', padding: '12px 16px', border: '1px solid #E5E7EB' }}>
                <Icons.Search />
                <input type="text" placeholder="Busca productos, marcas..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 1, border: 'none', background: 'transparent', marginLeft: '10px', fontSize: '16px', fontWeight: '600', color: '#111', outline: 'none' }} />
              </div>
            </div>

            {!searchTerm && (
              <div style={{ padding: '20px 20px 0' }}>
                <div className="hide-scroll" style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px' }}>
                  {collections.map((col) => {
                    const isActive = activeCategory === col.node.title;
                    return (
                      <button key={col.node.id} onClick={() => setActiveCategory(col.node.title)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <div style={{ width: '65px', height: '65px', borderRadius: '20px', backgroundColor: isActive ? '#E31E24' : '#fff', border: isActive ? 'none' : '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', transition: 'all 0.2s', boxShadow: isActive ? '0 8px 20px rgba(227,30,36,0.3)' : '0 2px 8px rgba(0,0,0,0.02)', transform: isActive ? 'translateY(-3px)' : 'none' }}>
                          {getCategoryEmoji(col.node.title)}
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: isActive ? '900' : '700', marginTop: '8px', color: isActive ? '#E31E24' : '#6B7280' }}>
                          {col.node.title === 'Todas' ? 'Ver Todo' : col.node.title}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '900', margin: '0 0 20px 0' }}>{searchTerm ? 'Resultados' : 'Para ti en Cotuí'}</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <div key={i} style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '15px', border: '1px solid #F3F4F6' }}>
                      <div className="skeleton-anim" style={{ height: '120px', borderRadius: '16px', marginBottom: '15px' }}></div>
                      <div className="skeleton-anim" style={{ height: '15px', width: '80%', borderRadius: '8px', marginBottom: '8px' }}></div>
                      <div className="skeleton-anim" style={{ height: '24px', width: '50%', borderRadius: '8px' }}></div>
                    </div>
                  ))
                ) : (
                  products.filter(p => !p.node.tags.includes('pos') && (activeCategory === 'Todas' || p.node.collections.edges.some(c => c.node.title === activeCategory)) && p.node.title.toLowerCase().includes(searchTerm.toLowerCase())).map(({ node, neuroStats }) => (
                    <div key={node.id} onClick={() => setShowProductModal({ node, neuroStats })} className="product-card" style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '12px', border: '1px solid #F3F4F6', position: 'relative', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', cursor: 'pointer' }}>
                      
                      {neuroStats.stock && <span className="pulse-bg-red" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2, backgroundColor: '#FEF2F2', color: '#E31E24', padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: '900', border: '1px solid #FCA5A5' }}>¡Solo {neuroStats.stock}!</span>}

                      <div style={{ backgroundColor: '#F8F9FB', borderRadius: '16px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
                        <img src={node.images.edges[0]?.node.url} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} alt={node.title} loading="lazy" />
                      </div>
                      
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                          <Icons.Star /> <span style={{ fontSize: '11px', fontWeight: '900', color: '#4B5563' }}>4.9</span>
                        </div>
                        <h4 style={{ fontSize: '13px', fontWeight: '800', margin: '0 0 8px 0', lineHeight: '1.3', height: '34px', overflow: 'hidden', color: '#111' }}>{node.title}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <div>
                            <span style={{ fontSize: '11px', textDecoration: 'line-through', color: '#9CA3AF', fontWeight: '700', display: 'block' }}>RD${parseFloat(node.variants.edges[0].node.compareAtPrice.amount).toFixed(0)}</span>
                            <span style={{ fontWeight: '900', fontSize: '18px', color: '#E31E24' }}>RD${parseFloat(node.variants.edges[0].node.price.amount).toFixed(0)}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); addToCart({ node }); }} style={{ backgroundColor: '#111', color: '#fff', width: '38px', height: '38px', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                            <Icons.Add />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* DIRECTRIZ MARCA: Llegamos a Cotuí */}
            <div style={{ backgroundColor: '#111', padding: '40px 20px', textAlign: 'center', color: '#fff', marginTop: '20px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 10px 0', color: '#E31E24' }}>Llegamos a Cotuí</h2>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#9CA3AF', margin: '0 0 20px 0' }}>Kolma llegó a Cotuí. El supermercado en tu bolsillo.</p>
              <div style={{ width: '40px', height: '4px', backgroundColor: '#E31E24', margin: '0 auto', borderRadius: '2px' }}></div>
            </div>
          </div>
        )}

        {/* === VISTA PEDIDOS === */}
        {activeTab === 'pedidos' && (
          <div className="view-fade-in" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 20px 0' }}>Mis Órdenes</h2>
            
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '32px', border: '1px solid #F3F4F6' }}>
                <div style={{ backgroundColor: '#FEE2E2', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#E31E24' }}><Icons.Truck /></div>
                <h3 style={{ margin: '0 0 10px 0', fontWeight: '900', fontSize: '22px' }}>Aún no has pedido</h3>
                <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '25px', fontWeight: '600' }}>Haz tu pedido y míralo llegar en vivo por el mapa.</p>
                <button onClick={() => setActiveTab('inicio')} style={{ backgroundColor: '#E31E24', color: '#fff', padding: '16px 30px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(227,30,36,0.3)' }}>Comprar ahora</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {currentOrder && currentOrder.estado !== 'Finalizado' && (
                  <div style={{ backgroundColor: '#fff', borderRadius: '32px', padding: '25px', border: '2px solid #E31E24', boxShadow: '0 10px 30px rgba(227,30,36,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <div>
                        <span style={{ backgroundColor: '#FEF2F2', color: '#E31E24', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '900' }}>EN PROCESO</span>
                        <h3 style={{ margin: '10px 0 5px 0', fontSize: '24px', fontWeight: '900' }}>{currentOrder.estado}</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#6B7280', fontWeight: '600' }}>ID: {currentOrder.id}</p>
                      </div>
                      <div className="pulse-driver" style={{ backgroundColor: '#111', width: '50px', height: '50px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Icons.Truck /></div>
                    </div>

                    <button onClick={() => setIsTrackingOpen(true)} style={{ width: '100%', backgroundColor: '#111', color: '#fff', padding: '16px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
                      📍 Ver en el Mapa
                    </button>
                  </div>
                )}

                <h4 style={{ margin: '10px 0 0 0', fontSize: '18px', fontWeight: '900' }}>Historial</h4>
                {orders.slice().reverse().map(order => (
                  <div key={order.id} style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '20px', border: '1px solid #F3F4F6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '14px' }}><Icons.Cart /></div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '900' }}>Kolma Supermercado</h4>
                          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#9CA3AF', fontWeight: '600' }}>{order.fecha} • {order.items.length} prod.</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>RD${order.total.toFixed(0)}</p>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: order.estado === 'Finalizado' || order.estado === 'Entregado' ? '#16A34A' : '#E31E24' }}>{order.estado.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === VISTA PERFIL === */}
        {activeTab === 'perfil' && (
          <div className="view-fade-in" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 25px 0' }}>Mi Cuenta</h2>
            
            {!user ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#fff', borderRadius: '32px', border: '1px solid #F3F4F6' }}>
                <h3 style={{ margin: '0 0 10px 0', fontWeight: '900', fontSize: '22px' }}>Regístrate en Kolma</h3>
                <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '30px', fontWeight: '600' }}>Guarda tu dirección en Cotuí y pide en un clic.</p>
                <button onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }} style={{ backgroundColor: '#111', color: '#fff', padding: '18px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', width: '100%', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>Crear Cuenta o Ingresar</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '32px', padding: '30px', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '900' }}>
                    {user.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '900' }}>{user.nombre}</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '14px', color: '#6B7280', fontWeight: '600' }}>{user.email}</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#111', fontWeight: '800' }}>📞 {user.telefono}</p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#fff', borderRadius: '32px', border: '1px solid #F3F4F6', padding: '25px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '900', color: '#9CA3AF' }}>MI DIRECCIÓN (COTUÍ)</h4>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', lineHeight: '1.4' }}>{user.direccion}</p>
                </div>

                <button onClick={logout} style={{ backgroundColor: '#FEF2F2', color: '#E31E24', padding: '18px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>Cerrar Sesión</button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* COMPONENTES FLOTANTES (MODALES, CARRITO, TRACKING) */}
      
      {/* 1. Modal de Producto */}
      {showProductModal && (
        <div className="modal-overlay" style={{ zIndex: 5000, display: 'flex', alignItems: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-content" style={{ backgroundColor: '#fff', width: '100%', borderRadius: '32px 32px 0 0', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
              <button onClick={() => setShowProductModal(null)} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.Close /></button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img src={showProductModal.node.images.edges[0]?.node.url} style={{ height: '220px', objectFit: 'contain' }} alt="" />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ backgroundColor: '#FEF2F2', color: '#E31E24', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '900' }}>🔥 {showProductModal.neuroStats.views} viéndolo ahora</span>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 15px 0', lineHeight: '1.2' }}>{showProductModal.node.title}</h2>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '30px', padding: '15px', backgroundColor: '#F9FAFB', borderRadius: '16px' }}>
              <span style={{ fontSize: '32px', fontWeight: '900', color: '#111', lineHeight: '1' }}>RD${parseFloat(showProductModal.node.variants.edges[0].node.price.amount).toFixed(0)}</span>
              <span style={{ fontSize: '18px', textDecoration: 'line-through', color: '#9CA3AF', fontWeight: '700' }}>${parseFloat(showProductModal.node.variants.edges[0].node.compareAtPrice.amount).toFixed(0)}</span>
            </div>
            
            <button onClick={() => addToCart(showProductModal)} style={{ width: '100%', backgroundColor: '#E31E24', color: '#fff', padding: '20px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '18px', cursor: 'pointer', boxShadow: '0 8px 25px rgba(227,30,36,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <Icons.Cart /> Agregar al Carrito
            </button>
          </div>
        </div>
      )}

      {/* 2. Drawer del Carrito */}
      {isCartOpen && (
        <div className="modal-overlay" style={{ zIndex: 6000, display: 'flex', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}>
          <div className="cart-sidebar" style={{ backgroundColor: '#fff', width: '100%', maxWidth: '420px', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '24px 0 0 24px' }}>
            
            <div style={{ padding: '25px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {checkoutStep !== 'cart' && <button onClick={() => setCheckoutStep(checkoutStep === 'payment' ? 'shipping' : 'cart')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Icons.ChevronLeft /></button>}
                <h2 style={{ margin: 0, fontWeight: '900', fontSize: '24px' }}>{checkoutStep === 'cart' ? 'Tu Canasta' : checkoutStep === 'shipping' ? 'Envío' : 'Checkout'}</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.Close /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '25px', backgroundColor: '#F9FAFB' }}>
              {checkoutStep === 'cart' && (
                cart.length === 0 ? (
                  <div style={{ textAlign: 'center', marginTop: '80px' }}>
                    <div style={{ backgroundColor: '#fff', width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', color: '#9CA3AF' }}><Icons.Cart /></div>
                    <h3 style={{ fontWeight: '900', fontSize: '20px' }}>Canasta vacía</h3>
                  </div>
                ) : (
                  <>
                    <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #E5E7EB' }}>
                      <p style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '900', display: 'flex', justifyContent: 'space-between' }}>
                        {getSubtotal() >= 1500 ? <span style={{ color: '#16A34A' }}>¡Envío GRATIS!</span> : <span>Faltan RD${1500 - getSubtotal()} para envío GRATIS</span>}
                      </p>
                      <div style={{ height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, (getSubtotal() / 1500) * 100)}%`, height: '100%', backgroundColor: getSubtotal() >= 1500 ? '#16A34A' : '#E31E24', transition: 'width 0.3s' }} />
                      </div>
                    </div>

                    {cart.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '15px', backgroundColor: '#fff', padding: '15px', borderRadius: '20px', border: '1px solid #F3F4F6' }}>
                        <img src={item.image} style={{ width: '65px', height: '65px', objectFit: 'contain', backgroundColor: '#F8F9FB', borderRadius: '14px', padding: '5px' }} alt="" />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '800' }}>{item.title}</h4>
                          <p style={{ margin: 0, color: '#E31E24', fontWeight: '900', fontSize: '16px' }}>RD${item.price.toFixed(0)}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: '12px', padding: '4px', border: '1px solid #E5E7EB' }}>
                          <button onClick={() => updateCartQty(item.variantId, -1)} style={{ background: 'none', border: 'none', color: '#111', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{item.quantity === 1 ? <Icons.Trash /> : <Icons.Minus />}</button>
                          <span style={{ fontWeight: '900', width: '22px', textAlign: 'center', fontSize: '14px' }}>{item.quantity}</span>
                          <button onClick={() => updateCartQty(item.variantId, 1)} style={{ background: '#fff', border: 'none', color: '#111', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}><Icons.Add /></button>
                        </div>
                      </div>
                    ))}
                  </>
                )
              )}

              {checkoutStep === 'shipping' && (
                <div className="view-fade-in">
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '900' }}>Confirma tu dirección</h3>
                  <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '25px', border: '2px solid #E31E24' }}>
                    <p style={{ margin: '0 0 5px 0', fontWeight: '900', fontSize: '16px' }}>{user?.nombre}</p>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6B7280', fontWeight: '600' }}>{user?.direccion}</p>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '800' }}>📞 {user?.telefono}</p>
                  </div>
                </div>
              )}

              {checkoutStep === 'payment' && (
                <div className="view-fade-in">
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '900' }}>Método de Pago</h3>
                  <div onClick={() => setPaymentMethod('efectivo')} style={{ backgroundColor: '#fff', border: paymentMethod === 'efectivo' ? '2px solid #111' : '1px solid #E5E7EB', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: paymentMethod === 'efectivo' ? '7px solid #111' : '2px solid #D1D5DB' }}></div>
                    <div style={{ backgroundColor: '#F3F4F6', padding: '10px', borderRadius: '12px' }}><Icons.Money /></div>
                    <div>
                      <h4 style={{ margin: 0, fontWeight: '900', fontSize: '16px' }}>Efectivo al recibir</h4>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Total y Botón Checkout */}
            <div style={{ padding: '25px', backgroundColor: '#fff', boxShadow: '0 -10px 30px rgba(0,0,0,0.05)', borderRadius: '32px 32px 0 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontWeight: '900', fontSize: '20px', color: '#111' }}>Total Final</span>
                <span style={{ fontWeight: '900', fontSize: '32px', color: '#E31E24' }}>RD${getSubtotal().toFixed(0)}</span>
              </div>
              
              {checkoutStep === 'cart' && (
                <button onClick={() => { if(cart.length > 0) { user ? setCheckoutStep('shipping') : setIsAuthModalOpen(true) } }} style={{ width: '100%', backgroundColor: cart.length === 0 ? '#E5E7EB' : '#111', color: '#fff', padding: '20px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '18px', cursor: cart.length > 0 ? 'pointer' : 'not-allowed', boxShadow: cart.length > 0 ? '0 8px 25px rgba(0,0,0,0.2)' : 'none' }}>
                  Proceder al Checkout
                </button>
              )}
              {checkoutStep === 'shipping' && (
                <button onClick={() => setCheckoutStep('payment')} style={{ width: '100%', backgroundColor: '#111', color: '#fff', padding: '20px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '18px', cursor: 'pointer', boxShadow: '0 8px 25px rgba(0,0,0,0.2)' }}>Continuar a Pago</button>
              )}
              {checkoutStep === 'payment' && (
                <button onClick={placeOrder} disabled={isSubmitting} style={{ width: '100%', backgroundColor: '#E31E24', color: '#fff', padding: '20px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '18px', cursor: isSubmitting ? 'not-allowed' : 'pointer', boxShadow: '0 8px 25px rgba(227,30,36,0.3)' }}>
                  {isSubmitting ? 'Procesando...' : 'Confirmar Orden'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal de Autenticación */}
      {isAuthModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 7000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="modal-content" style={{ backgroundColor: '#fff', padding: '40px 30px', borderRadius: '32px', width: '90%', maxWidth: '420px', position: 'relative' }}>
            <button onClick={() => setIsAuthModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icons.Close /></button>
            
            <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 10px 0' }}>{authMode === 'login' ? 'Bienvenido' : 'Únete a Kolma'}</h2>
            <p style={{ color: '#6B7280', fontSize: '15px', fontWeight: '600', marginBottom: '30px' }}>{authMode === 'login' ? 'Inicia sesión para pedir.' : 'Crea tu cuenta y guarda tu dirección en Cotuí.'}</p>

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {authMode === 'register' && <input placeholder="Nombre completo" required style={{ padding: '18px', borderRadius: '16px', border: '2px solid #E5E7EB', fontSize: '16px', fontWeight: '600', backgroundColor: '#F9FAFB' }} onChange={e => setAuthForm({...authForm, nombre: e.target.value})} />}
              <input type="email" placeholder="Correo electrónico" required style={{ padding: '18px', borderRadius: '16px', border: '2px solid #E5E7EB', fontSize: '16px', fontWeight: '600', backgroundColor: '#F9FAFB' }} onChange={e => setAuthForm({...authForm, email: e.target.value})} />
              {authMode === 'register' && (
                <>
                  <input placeholder="Teléfono (Ej: 809...)" required style={{ padding: '18px', borderRadius: '16px', border: '2px solid #E5E7EB', fontSize: '16px', fontWeight: '600', backgroundColor: '#F9FAFB' }} onChange={e => setAuthForm({...authForm, telefono: e.target.value})} />
                  <textarea placeholder="Dirección completa en Cotuí" required style={{ padding: '18px', borderRadius: '16px', border: '2px solid #E5E7EB', fontSize: '16px', fontWeight: '600', backgroundColor: '#F9FAFB', height: '80px', resize: 'none' }} onChange={e => setAuthForm({...authForm, direccion: e.target.value})} />
                </>
              )}
              <input type="password" placeholder="Contraseña" required style={{ padding: '18px', borderRadius: '16px', border: '2px solid #E5E7EB', fontSize: '16px', fontWeight: '600', backgroundColor: '#F9FAFB' }} onChange={e => setAuthForm({...authForm, password: e.target.value})} />
              
              <button type="submit" disabled={isSubmitting} style={{ width: '100%', backgroundColor: '#111', color: '#fff', padding: '20px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '18px', cursor: 'pointer', marginTop: '10px' }}>
                {isSubmitting ? 'Cargando...' : authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </button>
            </form>
            <div style={{ marginTop: '25px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#6B7280' }}>
                {authMode === 'login' ? '¿No tienes cuenta?' : '¿Ya eres miembro?'} 
                <span onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} style={{ color: '#E31E24', fontWeight: '900', marginLeft: '5px', cursor: 'pointer' }}>
                  {authMode === 'login' ? 'Regístrate aquí' : 'Inicia Sesión'}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Mapa Shipday Fullscreen Overlay */}
      {isTrackingOpen && currentOrder && <LiveTrackingMap order={currentOrder} onClose={() => setIsTrackingOpen(false)} />}

      {/* 5. Modal de Éxito de Compra */}
      {showSuccessBlast && (
        <div className="modal-overlay" style={{ zIndex: 8000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', flexDirection: 'column', textAlign: 'center', padding: '20px' }}>
          <div className="success-pop" style={{ marginBottom: '30px' }}><Icons.Success /></div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#111', margin: '0 0 15px 0' }}>¡Pedido Confirmado!</h1>
          <p style={{ fontSize: '18px', color: '#6B7280', fontWeight: '600', maxWidth: '400px', margin: '0 0 40px 0' }}>Preparamos tus productos para enviarlos a Cotuí.</p>
          <button onClick={() => setShowSuccessBlast(false)} style={{ backgroundColor: '#111', color: '#fff', padding: '20px 40px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '18px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>Ver Seguimiento</button>
        </div>
      )}

      {/* NAV INFERIOR PWA NATIVA */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(10px)', borderTop: '1px solid #F3F4F6', zIndex: 100, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '70px', maxWidth: '600px', margin: '0 auto' }}>
          <div onClick={() => setActiveTab('inicio')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', width: '33%' }}>
            <Icons.Home active={activeTab === 'inicio'} />
            <span style={{ fontSize: '11px', fontWeight: '800', marginTop: '6px', color: activeTab === 'inicio' ? '#E31E24' : '#9CA3AF' }}>Tienda</span>
          </div>
          <div onClick={() => setActiveTab('pedidos')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', width: '33%' }}>
            <Icons.Truck active={activeTab === 'pedidos'} />
            <span style={{ fontSize: '11px', fontWeight: '800', marginTop: '6px', color: activeTab === 'pedidos' ? '#E31E24' : '#9CA3AF' }}>Pedidos</span>
          </div>
          <div onClick={() => setActiveTab('perfil')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', width: '33%' }}>
            <Icons.Profile active={activeTab === 'perfil'} />
            <span style={{ fontSize: '11px', fontWeight: '800', marginTop: '6px', color: activeTab === 'perfil' ? '#E31E24' : '#9CA3AF' }}>Cuenta</span>
          </div>
        </div>
      </nav>

      <style jsx global>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { margin: 0; padding: 0; background-color: #F8F9FB; overscroll-behavior-y: none; }
        input, textarea, button { font-family: inherit; }
        input:focus, textarea:focus { outline: none; border-color: #111 !important; }
        
        .view-fade-in { animation: fadeIn 0.4s ease-out; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; }
        .modal-content { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .cart-sidebar { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        
        .product-card:active { transform: scale(0.98); }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes popCartAnim { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
        @keyframes successPop { 0% { transform: scale(0); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }
        @keyframes pulseRed { 0% { box-shadow: 0 0 0 0 rgba(227,30,36,0.4); } 70% { box-shadow: 0 0 0 8px rgba(227,30,36,0); } 100% { box-shadow: 0 0 0 0 rgba(227,30,36,0); } }
        @keyframes pulseDriver { 0% { box-shadow: 0 0 0 0 rgba(227,30,36,0.6); } 70% { box-shadow: 0 0 0 20px rgba(227,30,36,0); } 100% { box-shadow: 0 0 0 0 rgba(227,30,36,0); } }
        @keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: calc(200px + 100%) 0; } }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .pop-cart-anim { animation: popCartAnim 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .success-pop { animation: successPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .pulse-bg-red { animation: pulseRed 2s infinite; }
        .pulse-driver { animation: pulseDriver 2s infinite; }
        .pulse-dot { display: inline-block; width: 8px; height: 8px; background-color: #E31E24; border-radius: 50%; animation: pulseRed 1.5s infinite; }
        .skeleton-anim { background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        .shimmer-bar { background: linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        .loader { border: 4px solid #f3f3f3; border-top: 4px solid #E31E24; border-radius: 50%; animation: spin 1s linear infinite; }
      `}</style>
      <Analytics />
    </div>
  );
}
