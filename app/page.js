"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

// --- ICONOGRAFÍA NATIVA ---
const Icons = {
  ShoppingBag: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Search: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Plus: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5v14M5 12h14"/></svg>,
  Minus: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/></svg>,
  User: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Truck: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10Z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>,
  ArrowLeft: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  MapPinned: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"/><circle cx="12" cy="8" r="2"/><path d="M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.3 0 .6.2.8s.5.2.8.1l6-2c.3-.1.6-.1.9-.1h3.141"/></svg>,
  CheckCircle2: ({ size = 24, color = "currentColor", className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
  X: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Mail: ({ size = 20, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Lock: ({ size = 20, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Eye: ({ size = 18, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: ({ size = 18, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
  LogOut: ({ size = 18, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  ChevronDown: ({ size = 20, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>,
  FileText: ({ size = 20, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
  Banknote: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>,
  CreditCard: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>,
};

const COTUI_CENTER = [19.0531, -70.1491];
const STANDARD_SHIPPING_COST = 50;

// Imágenes de categorías mapeadas para un look profesional
const CATEGORY_IMAGES = {
  'Todos': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
  'Bebidas': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80',
  'Snacks': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80',
  'Carnes': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80',
  'Frutas': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80',
  'Lácteos': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80',
  'default': 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=400&q=80'
};

const CotuiMap = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapRef.current) {
      const L = window.L;
      if (L) {
        const map = L.map('map-tracking', { 
          zoomControl: false, attributionControl: false, dragging: false, touchZoom: false, scrollWheelZoom: false, doubleClickZoom: false
        }).setView(COTUI_CENTER, 15);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);
        
        const motoristaIcon = L.divIcon({
          className: 'custom-motorista transition-all duration-1000 ease-linear',
          html: `<div class="w-12 h-12 bg-red-600 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center text-xl z-50">🛵</div>`,
          iconSize: [48, 48], iconAnchor: [24, 24]
        });

        L.marker(COTUI_CENTER, { 
          icon: L.divIcon({ 
            html: `<div class="w-5 h-5 bg-black rounded-full border-[3px] border-white shadow-md relative"><div class="absolute inset-0 rounded-full border border-black animate-ping"></div></div>`, 
            className: '', iconSize: [20, 20] 
          }) 
        }).addTo(map);

        const startPos = [19.058, -70.141];
        markerRef.current = L.marker(startPos, { icon: motoristaIcon }).addTo(map);
        mapRef.current = map;

        let currentLat = startPos[0];
        let currentLng = startPos[1];
        
        const moveInterval = setInterval(() => {
          if (!markerRef.current) return;
          const diffLat = COTUI_CENTER[0] - currentLat;
          const diffLng = COTUI_CENTER[1] - currentLng;
          
          if (Math.abs(diffLat) > 0.0001 || Math.abs(diffLng) > 0.0001) {
            currentLat += diffLat * 0.05;
            currentLng += diffLng * 0.05;
            markerRef.current.setLatLng([currentLat, currentLng]);
          } else {
            clearInterval(moveInterval);
          }
        }, 1000);

        return () => clearInterval(moveInterval);
      }
    }
  }, []);
  return <div id="map-tracking" className="w-full h-full" />;
};

const SkeletonCard = () => (
  <div className="flex bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm relative mb-4 animate-pulse">
    <div className="w-32 h-32 bg-gray-200 flex-shrink-0"></div>
    <div className="p-3 flex flex-col justify-between flex-1">
      <div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-100 rounded w-full mb-1"></div>
        <div className="h-3 bg-gray-100 rounded w-2/3"></div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-1/3 mt-2"></div>
    </div>
  </div>
);

export default function KolmaRD() {
  const [view, setView] = useState('home'); 
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', address: '', phone: '' });
  const [toast, setToast] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderNotes, setOrderNotes] = useState('');
  const [cartBump, setCartBump] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = 'data:application/manifest+json,' + encodeURIComponent(JSON.stringify({
        name: "KolmaRD Express",
        short_name: "KolmaRD",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#dc2626",
        icons: [
          { src: "https://via.placeholder.com/192/dc2626/FFFFFF?text=K", sizes: "192x192", type: "image/png" },
          { src: "https://via.placeholder.com/512/dc2626/FFFFFF?text=K", sizes: "512x512", type: "image/png" }
        ]
      }));
      document.head.appendChild(link);
      const themeMeta = document.createElement('meta');
      themeMeta.name = 'theme-color';
      themeMeta.content = '#ffffff';
      document.head.appendChild(themeMeta);
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register'; 
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('kolmard_user', JSON.stringify(data.user));
        setView('home');
        showToast(authMode === 'login' ? 'Bienvenido de nuevo' : 'Cuenta creada correctamente');
      } else {
        showToast(data.error || 'Verifica tus credenciales');
      }
    } catch (error) {
      showToast('Sin conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css'; link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js'; script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        document.head.appendChild(script);
      }
      const savedUser = localStorage.getItem('kolmard_user');
      const savedCart = localStorage.getItem('kolmard_cart');
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedCart) setCart(JSON.parse(savedCart));
      await fetchProducts();
    };
    initApp();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.data?.products) {
        const formatted = json.data.products.edges
          .filter(({ node }) => !node.tags?.some(tag => tag.toLowerCase() === 'pos'))
          .map(({ node }) => {
            const rawVariants = node.variants?.edges || [];
            const variants = rawVariants.length > 0 ? rawVariants.map(v => ({
              id: v.node.id,
              title: v.node.title !== "Default Title" ? v.node.title : "Unidad",
              price: parseFloat(v.node.price?.amount || 0)
            })) : [{ id: node.id, title: "Unidad", price: 0 }];

            return {
              id: node.id,
              name: node.title,
              price: variants[0].price,
              variants: variants,
              img: node.images?.edges?.[0]?.node?.url || 'https://via.placeholder.com/600/f3f4f6/cccccc?text=Fresco',
              category: node.collections?.edges?.[0]?.node?.title || node.productType || 'Otros',
              description: node.description || 'Producto fresco de alta calidad, listo para ser enviado a tu domicilio.'
            };
          });
        setProducts(formatted);
      }
    } catch (e) { 
        console.error("Error fetching inventory", e);
    } finally { 
        setLoading(false); 
    }
  };

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const triggerCartBump = () => {
    setCartBump(true);
    setTimeout(() => setCartBump(false), 300);
  };

  const addToCart = useCallback((p, specificVariant = null) => {
    const finalPrice = specificVariant ? specificVariant.price : p.price;
    const variantTitle = specificVariant ? specificVariant.title : p.variants[0].title;
    const cartItemId = `${p.id}-${variantTitle}`;

    setCart(curr => {
      const ex = curr.find(i => i.cartItemId === cartItemId);
      const n = ex 
        ? curr.map(i => i.cartItemId === cartItemId ? { ...i, qty: i.qty + 1 } : i) 
        : [...curr, { ...p, cartItemId, price: finalPrice, qty: 1, selectedVariantTitle: variantTitle }];
      localStorage.setItem('kolmard_cart', JSON.stringify(n));
      return n;
    });
    showToast(`${p.name} agregado`);
    triggerCartBump();
  }, [showToast]);

  const updateQty = useCallback((cartItemId, delta) => {
    setCart(curr => {
      const n = curr.map(i => {
        if (i.cartItemId === cartItemId) {
          return { ...i, qty: Math.max(0, i.qty + delta) };
        }
        return i;
      }).filter(i => i.qty > 0);
      localStorage.setItem('kolmard_cart', JSON.stringify(n));
      return n;
    });
    triggerCartBump();
  }, []);

  const subtotal = useMemo(() => cart.reduce((acc, i) => acc + (i.price * i.qty), 0), [cart]);
  const total = useMemo(() => subtotal + STANDARD_SHIPPING_COST, [subtotal]);
  
  const realCategories = useMemo(() => {
    const cats = products.map(p => p.category);
    return [...new Set(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => (activeCategory === 'Todos' || p.category === activeCategory) && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, activeCategory, searchTerm]);

  const totalItemsInCart = useMemo(() => cart.reduce((acc, item) => acc + item.qty, 0), [cart]);

  const HomeView = () => (
    <div className="pb-32 animate-fade-in w-full bg-white">
      
      {/* CARRUSEL DE CATEGORÍAS POPULARES */}
      {!searchTerm && (
        <div className="bg-white pt-2 pb-6">
          <div className="flex overflow-x-auto no-scrollbar space-x-4 px-4 snap-x">
            <div 
              onClick={() => setActiveCategory('Todos')}
              className="snap-start min-w-[90px] max-w-[90px] flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className={`w-[80px] h-[80px] rounded-[20px] overflow-hidden mb-2 border-[3px] transition-colors ${activeCategory === 'Todos' ? 'border-red-600' : 'border-transparent'}`}>
                <img src={CATEGORY_IMAGES['Todos']} className="w-full h-full object-cover" alt="Todos" />
              </div>
              <span className={`text-[12px] font-bold ${activeCategory === 'Todos' ? 'text-red-600' : 'text-gray-700'}`}>Todos</span>
            </div>
            {realCategories.map(c => (
              <div 
                key={c} 
                onClick={() => setActiveCategory(c)}
                className="snap-start min-w-[90px] max-w-[90px] flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
              >
                <div className={`w-[80px] h-[80px] rounded-[20px] overflow-hidden mb-2 border-[3px] transition-colors ${activeCategory === c ? 'border-red-600' : 'border-transparent'}`}>
                  <img src={CATEGORY_IMAGES[c] || CATEGORY_IMAGES['default']} className="w-full h-full object-cover" alt={c} />
                </div>
                <span className={`text-[12px] font-bold text-center line-clamp-1 ${activeCategory === c ? 'text-red-600' : 'text-gray-700'}`}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEED DE PRODUCTOS (Agrupado/Filtrado) */}
      <div className="bg-[#f3f4f6] px-4 py-4 min-h-screen">
        <h3 className="font-bold text-gray-900 text-lg mb-4">
          {searchTerm ? 'Resultados de búsqueda' : (activeCategory === 'Todos' ? 'Explorar' : activeCategory)}
        </h3>
        
        <div className="flex flex-col">
          {filteredProducts.map(p => (
            <div key={p.id} onClick={() => { setSelectedProduct(p); setSelectedVariant(p.variants[0]); }} className="flex bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm relative mb-4 cursor-pointer active:scale-[0.98] transition-transform">
              <div className="w-32 h-32 bg-gray-50 flex-shrink-0 p-2">
                 <img src={p.img} className="w-full h-full object-contain mix-blend-multiply" alt={p.name} />
              </div>
              <div className="p-3 flex flex-col justify-between flex-1">
                 <div>
                    <h4 className="font-bold text-gray-900 text-[15px] line-clamp-1 leading-tight">{p.name}</h4>
                    <p className="text-[12px] text-gray-500 line-clamp-2 mt-1 leading-snug">{p.description}</p>
                 </div>
                 <span className="font-bold text-gray-900 text-[16px] mt-2">RD$ {p.price}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="absolute bottom-2 right-2 bg-gray-100 text-red-600 rounded-full w-9 h-9 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors shadow-sm">
                <Icons.Plus size={20} />
              </button>
            </div>
          ))}
          {filteredProducts.length === 0 && (
             <div className="text-center py-16 bg-white rounded-[20px]">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"><Icons.Search size={24}/></div>
               <p className="text-gray-900 font-bold text-lg">No encontramos resultados</p>
               <p className="text-gray-500 text-sm">Prueba buscando otra palabra clave.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-white text-gray-900 font-sans selection:bg-red-100 overflow-x-hidden max-w-[480px] mx-auto shadow-[0_0_50px_rgba(0,0,0,0.1)] relative border-x border-gray-50 flex flex-col">
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] animate-fade-in w-fit max-w-[90%]">
          <div className="bg-gray-900 text-white px-5 py-3 rounded-full shadow-2xl flex items-center space-x-3 backdrop-blur-md">
            <Icons.CheckCircle2 color="#ffffff" size={18} />
            <span className="text-[13px] font-bold tracking-wide whitespace-nowrap">{toast}</span>
          </div>
        </div>
      )}

      {/* HEADER TIPO PEDIDOS YA */}
      {view !== 'tracking' && view !== 'login' && view !== 'profile' && (
        <header className="bg-white px-4 pt-4 pb-3 sticky top-0 z-50 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="flex flex-col cursor-pointer group" onClick={() => { setView('home'); setSearchTerm(''); setActiveCategory('Todos'); window.scrollTo(0,0); }}>
              <span className="text-red-600 text-[11px] font-bold uppercase tracking-widest">Entregar en</span>
              <div className="flex items-center text-gray-900 font-bold text-[15px] group-hover:text-red-600 transition-colors">
                {user?.address || "Selecciona tu ubicación"} <Icons.ChevronDown className="ml-1 text-red-600" size={16}/>
              </div>
            </div>
            {user ? (
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-black font-bold text-[15px] cursor-pointer hover:bg-gray-200 transition-colors" onClick={()=>setView('profile')}>{user.firstName[0]}</div>
            ) : (
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors" onClick={()=>setView('login')}><Icons.User size={18}/></div>
            )}
          </div>
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
            <input 
              type="text" 
              className="w-full bg-[#f3f4f6] rounded-xl py-3 pl-10 pr-10 text-[14px] font-medium outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition-all placeholder:text-gray-500" 
              placeholder="Buscar restaurantes, supermercados..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={()=>setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900">
                <Icons.X size={18}/>
              </button>
            )}
          </div>
        </header>
      )}

      <main className="flex-1 bg-[#f3f4f6]">
        {loading ? (
          <div className="bg-[#f3f4f6] px-4 pt-4 w-full min-h-screen">
             {[1,2,3,4,5].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="animate-fade-in w-full h-full bg-[#f3f4f6]">
            {view === 'home' && <HomeView />}

            {/* VISTA CHECKOUT LISTA LIMPIA */}
            {view === 'checkout' && (
              <div className="bg-[#f3f4f6] min-h-screen pb-40">
                <div className="bg-white px-4 pt-4 pb-4 sticky top-0 z-40 shadow-sm flex items-center">
                  <button onClick={() => setView('home')} className="text-gray-900 mr-4"><Icons.ArrowLeft size={24}/></button>
                  <h2 className="text-lg font-bold text-gray-900">Resumen del pedido</h2>
                </div>
                
                <div className="px-4 pt-4 space-y-4">
                  {cart.length === 0 ? (
                      <div className="py-20 flex flex-col items-center text-center bg-white rounded-[24px]">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4"><Icons.ShoppingBag size={40}/></div>
                        <p className="text-lg font-bold text-gray-900 mb-1">Aún no tienes productos</p>
                        <p className="text-gray-500 text-sm mb-6">Encuentra tus favoritos y agrégalos aquí.</p>
                        <button onClick={() => setView('home')} className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold text-[15px] shadow-sm active:scale-95 transition-transform">Ver supermercado</button>
                      </div>
                  ) : (
                    <>
                      {/* Lista de productos */}
                      <div className="bg-white rounded-[24px] p-4 shadow-sm space-y-4">
                        {cart.map(item => (
                          <div key={item.cartItemId} className="flex items-start border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                              <div className="w-[60px] h-[60px] bg-gray-50 rounded-xl p-1 mr-3 flex-shrink-0 border border-gray-100">
                                <img src={item.img} className="w-full h-full object-contain mix-blend-multiply" alt={item.name} />
                              </div>
                              <div className="flex-1 pr-2">
                                  <h4 className="text-[14px] font-bold text-gray-900 leading-snug line-clamp-2">{item.name}</h4>
                                  <p className="text-[12px] text-gray-500 mt-1">{item.selectedVariantTitle}</p>
                                  <span className="text-[15px] font-bold text-gray-900 block mt-1">RD$ {item.price * item.qty}</span>
                              </div>
                              <div className="flex flex-col items-center justify-center">
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => updateQty(item.cartItemId, -1)} className="w-8 h-8 rounded-full bg-gray-100 text-red-600 flex items-center justify-center hover:bg-gray-200 transition-colors"><Icons.Minus size={16} /></button>
                                    <span className="w-4 text-center text-[14px] font-bold">{item.qty}</span>
                                    <button onClick={() => updateQty(item.cartItemId, 1)} className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"><Icons.Plus size={16} /></button>
                                </div>
                              </div>
                          </div>
                        ))}
                      </div>

                      {/* Notas */}
                      <div className="bg-white rounded-[24px] p-4 shadow-sm">
                        <div className="flex items-center text-gray-900 font-bold mb-2">
                           <Icons.FileText size={18} className="mr-2 text-gray-400"/> Agregar nota
                        </div>
                        <textarea 
                          className="w-full bg-gray-50 rounded-xl p-3 text-[13px] outline-none border border-transparent focus:border-gray-200 resize-none placeholder:text-gray-400" 
                          placeholder="Ej: Empacar bolsas separadas, tocar el timbre..." 
                          rows="2"
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                        ></textarea>
                      </div>

                      {/* Pagos */}
                      <div className="bg-white rounded-[24px] p-4 shadow-sm space-y-3">
                        <h3 className="text-[16px] font-bold text-gray-900">Método de pago</h3>
                        <div className="space-y-2">
                          <div onClick={() => setPaymentMethod('cash')} className={`flex items-center p-3 rounded-xl border ${paymentMethod === 'cash' ? 'border-red-600 bg-red-50/30' : 'border-gray-100 bg-white'}`}>
                            <Icons.Banknote size={24} className={paymentMethod === 'cash' ? 'text-red-600' : 'text-gray-400'}/>
                            <div className="flex-1 ml-3">
                              <p className="font-bold text-[14px] text-gray-900">Efectivo / Transferencia</p>
                              <p className="text-[12px] text-gray-500">Pagas al recibir</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-red-600' : 'border-gray-300'}`}>
                              {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                            </div>
                          </div>
                          <div className="flex items-center p-3 rounded-xl border border-gray-100 bg-gray-50 opacity-50">
                            <Icons.CreditCard size={24} className="text-gray-400"/>
                            <div className="flex-1 ml-3">
                              <p className="font-bold text-[14px] text-gray-500">Tarjeta débito/crédito</p>
                              <p className="text-[11px] text-gray-400 font-medium">Próximamente</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Resumen */}
                      <div className="bg-white rounded-[24px] p-5 shadow-sm space-y-2">
                          <div className="flex justify-between text-gray-600 text-[14px]"><span>Subtotal</span><span>RD$ {subtotal}</span></div>
                          <div className="flex justify-between text-gray-600 text-[14px]"><span>Costo de envío</span><span>RD$ {STANDARD_SHIPPING_COST}</span></div>
                          <div className="flex justify-between text-gray-900 font-bold text-[18px] pt-3 border-t border-gray-100 mt-2"><span>Total a pagar</span><span>RD$ {total}</span></div>
                      </div>
                      
                      <button onClick={() => {
                          if (!user) { setView('login'); showToast("Inicia sesión para pedir"); return; }
                          setView('tracking'); setCart([]); localStorage.removeItem('kolmard_cart'); window.scrollTo(0,0);
                      }} className="w-full bg-red-600 text-white h-[56px] rounded-xl font-bold text-[16px] shadow-sm active:scale-[0.98] transition-transform">
                        Confirmar pedido
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* VISTA ÓRDENES */}
            {view === 'orders' && (
              <div className="bg-[#f3f4f6] min-h-screen">
                <div className="bg-white px-4 pt-4 pb-4 sticky top-0 z-40 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900">Mis Pedidos</h2>
                </div>
                <div className="p-4">
                  <div onClick={() => setView('tracking')} className="bg-white p-4 rounded-[20px] shadow-sm cursor-pointer active:scale-[0.98] transition-transform">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                          <div className="bg-gray-100 w-12 h-12 flex items-center justify-center rounded-xl text-gray-900"><Icons.ShoppingBag size={20} /></div>
                          <div>
                            <span className="text-[14px] font-bold text-gray-900 block">Supermercado KolmaRD</span>
                            <span className="text-[12px] text-gray-500">Hoy • 15:30</span>
                          </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-[13px] font-bold text-gray-900 flex justify-between"><span>Estado</span> <span className="text-red-600">En camino</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PERFIL & LOGIN */}
            {view === 'profile' || view === 'login' ? (user ? (
              <div className="bg-[#f3f4f6] min-h-screen">
                <div className="bg-white px-4 pt-4 pb-4 sticky top-0 z-40 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900">Mi Perfil</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="bg-white p-6 rounded-[24px] flex items-center space-x-4 shadow-sm">
                    <div className="w-16 h-16 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center text-2xl font-bold">{(user.firstName || "K")[0]}</div>
                    <div>
                      <h2 className="text-[18px] font-bold text-gray-900">{user.firstName}</h2>
                      <p className="text-gray-500 text-[13px]">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-[24px] shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex items-center space-x-4">
                      <Icons.MapPinned className="text-gray-400" size={24} />
                      <div className="flex flex-col">
                        <span className="text-[12px] text-gray-500 font-medium">Dirección de entrega</span>
                        <span className="font-bold text-[14px] text-gray-900">{user.address || "Cotuí, Centro"}</span>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => { setUser(null); localStorage.removeItem('kolmard_user'); setView('home'); }} className="w-full py-4 text-red-600 font-bold text-[15px] bg-white rounded-[24px] shadow-sm flex items-center justify-center space-x-2">
                    <Icons.LogOut size={20} /><span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white min-h-screen px-4 pt-10">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{authMode === 'login' ? 'Hola, ingresa a tu cuenta' : 'Crea tu cuenta'}</h2>
                  <p className="text-gray-500 text-[14px]">Para pedir más rápido y rastrear tus órdenes.</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {authMode === 'register' && (
                    <div className="bg-gray-50 rounded-xl flex items-center px-4 py-3 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition-all">
                      <Icons.User size={20} className="text-gray-400 mr-3" />
                      <input type="text" placeholder="Nombre completo" className="bg-transparent text-[14px] font-medium w-full outline-none" value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} required />
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-xl flex items-center px-4 py-3 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition-all">
                    <Icons.Mail size={20} className="text-gray-400 mr-3" />
                    <input type="email" placeholder="Correo electrónico" className="bg-transparent text-[14px] font-medium w-full outline-none" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="bg-gray-50 rounded-xl flex items-center px-4 py-3 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition-all">
                    <Icons.Lock size={20} className="text-gray-400 mr-3" />
                    <input type={showPassword ? "text" : "password"} placeholder="Contraseña" className="bg-transparent text-[14px] font-medium w-full outline-none" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} required />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-900 ml-2">
                      {showPassword ? <Icons.EyeOff size={20}/> : <Icons.Eye size={20}/>}
                    </button>
                  </div>
                  
                  <button type="submit" className="w-full h-[50px] bg-red-600 text-white rounded-xl font-bold text-[15px] active:scale-[0.98] transition-transform mt-6 flex items-center justify-center">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Continuar'}
                  </button>
                </form>

                <div className="text-center mt-6">
                  <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-[14px] font-bold text-red-600">
                    {authMode === 'login' ? 'Crear una cuenta nueva' : 'Ya tengo cuenta'}
                  </button>
                </div>
              </div>
            )) : null}
          </div>
        )}
      </main>

      {/* RASTREO MAPA ESTILO PEDIDOS YA (BOTTOM SHEET) */}
      {view === 'tracking' && (
        <div className="fixed inset-0 z-[180] bg-gray-100 flex flex-col max-w-[480px] mx-auto overflow-hidden">
          <div className="absolute top-10 left-4 z-30">
            <button onClick={() => setView('orders')} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-900 active:scale-90 transition-transform">
              <Icons.ArrowLeft size={20} />
            </button>
          </div>
          
          <div className="flex-1 w-full relative z-10"><CotuiMap /></div>
          
          <div className="bg-white rounded-t-3xl p-6 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] relative z-20 -mt-6 flex flex-col">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5"></div>
            
            <h2 className="text-[22px] font-bold text-gray-900 mb-1">Llegando en 15 min</h2>
            <p className="text-gray-500 text-[14px] mb-5">Tu pedido está en camino a tu domicilio</p>
            
            {/* Barra de progreso */}
            <div className="flex space-x-1 mb-6">
               <div className="h-1.5 flex-1 bg-red-600 rounded-full"></div>
               <div className="h-1.5 flex-1 bg-red-600 rounded-full"></div>
               <div className="h-1.5 flex-1 bg-gray-200 rounded-full relative overflow-hidden">
                  <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-red-600 animate-pulse"></div>
               </div>
            </div>
            
            <div className="bg-gray-50 rounded-[16px] p-4 flex items-center border border-gray-100">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl mr-4 shadow-sm">🛵</div>
               <div className="flex-1">
                 <p className="font-bold text-[14px] text-gray-900">Repartidor KolmaRD</p>
                 <p className="text-[12px] text-gray-500">Vehículo rojo • Cotuí</p>
               </div>
               <button className="bg-white text-red-600 w-10 h-10 rounded-full flex items-center justify-center shadow-sm border border-gray-100"><Icons.MapPinned size={18}/></button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE PRODUCTO LIGERO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-end sm:items-center sm:justify-center animate-fade-in p-0 sm:p-4">
          <div className="bg-white w-full max-w-[480px] mx-auto rounded-t-[24px] sm:rounded-[24px] overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[85vh]">
            <div className="relative h-64 w-full bg-white p-6 flex items-center justify-center shrink-0 border-b border-gray-100">
              <img src={selectedProduct.img} className="w-full h-full object-contain" alt={selectedProduct.name} />
              <button onClick={() => { setSelectedProduct(null); setSelectedVariant(null); }} className="absolute top-4 right-4 bg-gray-100 text-gray-900 p-2 rounded-full"><Icons.X size={20} /></button>
            </div>
            <div className="p-5 bg-white overflow-y-auto">
              <h2 className="text-[18px] font-bold text-gray-900 mb-1">{selectedProduct.name}</h2>
              <p className="text-gray-500 text-[13px] mb-4 leading-relaxed">{selectedProduct.description}</p>
              
              <div className="mb-6 space-y-2">
                {selectedProduct.variants && selectedProduct.variants.map(variant => (
                  <div 
                    key={variant.id} 
                    onClick={() => setSelectedVariant(variant)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${selectedVariant?.id === variant.id ? 'border-red-600 bg-red-50/20' : 'border-gray-200 bg-white'}`}
                  >
                    <span className="font-bold text-[14px] text-gray-900">{variant.title}</span>
                    <div className="flex items-center">
                      <span className="font-bold text-[14px] text-gray-900 mr-3">RD$ {variant.price}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedVariant?.id === variant.id ? 'border-red-600' : 'border-gray-300'}`}>
                        {selectedVariant?.id === variant.id && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => { addToCart(selectedProduct, selectedVariant); setSelectedProduct(null); setSelectedVariant(null); }} className="w-full bg-red-600 text-white h-[50px] rounded-xl font-bold text-[15px] active:scale-[0.98] transition-transform flex items-center justify-center">
                Agregar • RD$ {selectedVariant?.price || selectedProduct.price}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER NAVEGACIÓN BOTTOM */}
      {view !== 'tracking' && view !== 'checkout' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center z-[150] max-w-[480px] mx-auto pb-4 shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
          <button onClick={() => { setView('home'); window.scrollTo(0,0); }} className={`flex flex-col items-center space-y-1 p-2 ${view === 'home' ? 'text-red-600' : 'text-gray-400'}`}>
            <Icons.ShoppingBag size={24} />
            <span className="text-[10px] font-bold">Inicio</span>
          </button>
          
          <button onClick={() => { setView('orders'); window.scrollTo(0,0); }} className={`flex flex-col items-center space-y-1 p-2 ${view === 'orders' ? 'text-red-600' : 'text-gray-400'}`}>
            <Icons.Truck size={24} />
            <span className="text-[10px] font-bold">Pedidos</span>
          </button>

          <button onClick={() => { setView(user ? 'profile' : 'login'); window.scrollTo(0,0); }} className={`flex flex-col items-center space-y-1 p-2 ${view === 'profile' || view === 'login' ? 'text-red-600' : 'text-gray-400'}`}>
            <Icons.User size={24} />
            <span className="text-[10px] font-bold">Perfil</span>
          </button>
        </nav>
      )}

      {/* BOTON FLOTANTE DE CARRITO (PEDIDOS YA STYLE) */}
      {view !== 'checkout' && view !== 'tracking' && totalItemsInCart > 0 && (
        <div className={`fixed bottom-20 left-4 right-4 z-[140] max-w-[448px] mx-auto transition-transform duration-300 ${cartBump ? 'scale-105' : 'scale-100 animate-slide-up'}`}>
          <button onClick={() => setView('checkout')} className="w-full bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg flex justify-between items-center active:scale-[0.98] transition-transform">
            <div className="bg-red-700 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold">{totalItemsInCart}</div>
            <span className="font-bold text-[15px]">Ver tu pedido</span>
            <span className="font-bold text-[15px]">RD$ {total}</span>
          </button>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { 
          font-family: 'Inter', sans-serif; 
          -webkit-tap-highlight-color: transparent; 
          background-color: #f3f4f6; 
          display: flex;
          justify-content: center;
          margin: 0;
          padding: 0;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .leaflet-container { height: 100%; width: 100%; font-family: 'Inter', sans-serif; }
        
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes slide-up { 0% { transform: translateY(100%); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
}
