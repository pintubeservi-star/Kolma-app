"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

// --- ICONOGRAFÍA PREMIUM (Minimalista, trazos limpios, sin relleno) ---
const Icons = {
  ShoppingBag: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Search: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Plus: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5v14M5 12h14"/></svg>,
  Minus: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/></svg>,
  User: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Truck: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10Z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>,
  ArrowLeft: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  MapPinned: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"/><circle cx="12" cy="8" r="2"/><path d="M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.3 0 .6.2.8s.5.2.8.1l6-2c.3-.1.6-.1.9-.1h3.141"/></svg>,
  CheckCircle2: ({ size = 24, color = "currentColor", className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
  X: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Mail: ({ size = 20, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Lock: ({ size = 20, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Eye: ({ size = 18, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: ({ size = 18, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
  LogOut: ({ size = 18, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Banknote: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>,
  CreditCard: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>,
  Gift: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>,
  Flame: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  ChevronDown: ({ size = 20, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
};

const COTUI_CENTER = [19.0531, -70.1491];
const FREE_SHIPPING_THRESHOLD = 500;
const STANDARD_SHIPPING_COST = 50;
const MARGIN_PROTECTION = 0.8; // 20% margin protection logic limit

// --- COMPONENTE MAPA PREMIUM (Tracking fluido simulado) ---
const CotuiMap = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapRef.current) {
      const L = window.L;
      if (L) {
        const map = L.map('map-tracking', { 
          zoomControl: false, 
          attributionControl: false,
          dragging: false,
          touchZoom: false,
          scrollWheelZoom: false,
          doubleClickZoom: false
        }).setView(COTUI_CENTER, 15);

        // Mapa estilo claro premium (Light all)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
        
        const motoristaIcon = L.divIcon({
          className: 'custom-motorista transition-all duration-1000 ease-linear',
          html: `<div class="w-12 h-12 bg-black rounded-full border-[3px] border-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] flex items-center justify-center text-xl z-50 transform">🛵</div>`,
          iconSize: [48, 48], iconAnchor: [24, 24]
        });

        // Punto de destino (Casa del cliente)
        L.marker(COTUI_CENTER, { 
          icon: L.divIcon({ 
            html: `<div class="w-6 h-6 bg-black rounded-full border-[3px] border-white shadow-md relative"><div class="absolute inset-0 rounded-full border-2 border-black animate-ping"></div></div>`, 
            className: '', 
            iconSize: [24, 24] 
          }) 
        }).addTo(map);

        // Punto inicial (Repartidor) un poco alejado
        const startPos = [19.058, -70.141];
        markerRef.current = L.marker(startPos, { icon: motoristaIcon }).addTo(map);
        mapRef.current = map;

        // Simulación de movimiento fluido hacia el centro
        let currentLat = startPos[0];
        let currentLng = startPos[1];
        
        const moveInterval = setInterval(() => {
          if (!markerRef.current) return;
          const diffLat = COTUI_CENTER[0] - currentLat;
          const diffLng = COTUI_CENTER[1] - currentLng;
          
          if (Math.abs(diffLat) > 0.0001 || Math.abs(diffLng) > 0.0001) {
            currentLat += diffLat * 0.05; // Mueve un 5% de la distancia cada tick
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

// --- SKELETON LOADERS ---
const ProductSkeleton = () => (
  <div className="flex items-center bg-white border-b border-gray-100 py-5 w-full animate-pulse">
    <div className="flex-1 pr-4">
      <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-100 rounded-md w-full mb-2"></div>
      <div className="h-3 bg-gray-100 rounded-md w-2/3 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
    </div>
    <div className="w-[110px] h-[110px] bg-gray-100 rounded-[16px] flex-shrink-0"></div>
  </div>
);

const HomeSkeleton = () => (
  <div className="space-y-6 pt-4 w-full">
    <div className="h-[220px] bg-gray-100 rounded-[24px] animate-pulse w-full"></div>
    <div className="flex space-x-3 overflow-hidden">
      {[1,2,3,4].map(i => <div key={i} className="h-10 w-24 bg-gray-100 rounded-full animate-pulse flex-shrink-0"></div>)}
    </div>
    <div className="flex flex-col">
      {[1,2,3,4].map(i => <ProductSkeleton key={i} />)}
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
  const [selectedVariant, setSelectedVariant] = useState(null); // Para tamaños/pesos
  const [authMode, setAuthMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', address: '', phone: '' });
  const [toast, setToast] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cartBump, setCartBump] = useState(false); // Animación del carrito

  // --- REGISTRO PWA Y MANIFEST ---
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
        theme_color: "#000000",
        icons: [
          { src: "https://via.placeholder.com/192/000000/FFFFFF?text=K", sizes: "192x192", type: "image/png" },
          { src: "https://via.placeholder.com/512/000000/FFFFFF?text=K", sizes: "512x512", type: "image/png" }
        ]
      }));
      document.head.appendChild(link);
      
      const themeMeta = document.createElement('meta');
      themeMeta.name = 'theme-color';
      themeMeta.content = '#000000';
      document.head.appendChild(themeMeta);
    }
  }, []);

  // --- AUTENTICACIÓN ---
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

  // --- INICIALIZACIÓN ---
  useEffect(() => {
    const initApp = async () => {
      // Inyectar Leaflet CSS/JS
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

      // Cargar datos locales
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
            // Simulando múltiples variantes para la experiencia de usuario si existen en el futuro
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
              collection: node.tags?.some(tag => tag.toLowerCase().includes('oferta')) ? 'Ofertas' : 'General',
              description: node.description || 'Producto fresco, empacado y listo para entregar en minutos a tu ubicación en Cotuí.'
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

  const addToCart = useCallback((p, isFlashSale = false, specificVariant = null) => {
    // Calculo respetando margen (no menos del costo base protegido)
    const basePrice = specificVariant ? specificVariant.price : p.price;
    const finalPrice = isFlashSale ? parseFloat((basePrice * 0.9).toFixed(2)) : basePrice; 
    const variantTitle = specificVariant ? specificVariant.title : p.variants[0].title;
    const cartItemId = `${p.id}-${variantTitle}-${isFlashSale}`;

    setCart(curr => {
      const ex = curr.find(i => i.cartItemId === cartItemId);
      const n = ex 
        ? curr.map(i => i.cartItemId === cartItemId ? { ...i, qty: i.qty + 1 } : i) 
        : [...curr, { 
            ...p, 
            cartItemId,
            price: finalPrice, 
            qty: 1, 
            isFlashSale, 
            selectedVariantTitle: variantTitle 
          }];
      localStorage.setItem('kolmard_cart', JSON.stringify(n));
      return n;
    });
    showToast(`${p.name} agregado a tu canasta`);
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

  // --- MEMOIZATION & PERFORMANCE ---
  const subtotal = useMemo(() => cart.reduce((acc, i) => acc + (i.price * i.qty), 0), [cart]);
  const shipping = useMemo(() => subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST, [subtotal]);
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);
  const percentToFreeShipping = useMemo(() => Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100), [subtotal]);

  const realCategories = useMemo(() => {
    const cats = products.map(p => p.category);
    return ['Todos', ...new Set(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => (activeCategory === 'Todos' || p.category === activeCategory) && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, activeCategory, searchTerm]);

  const flashOffers = useMemo(() => products.filter(p => p.collection === 'Ofertas'), [products]);
  
  const upsellingProducts = useMemo(() => {
    return products.filter(p => p.price <= 200 && !cart.some(c => c.id === p.id)).slice(0, 5);
  }, [products, cart]);

  const totalItemsInCart = useMemo(() => cart.reduce((acc, item) => acc + item.qty, 0), [cart]);

  // --- VISTAS ---
  const HomeView = () => (
    <div className="space-y-0 pb-32 animate-fade-in w-full">
      
      {/* BANNER PRINCIPAL NEGRO ELEGANTE */}
      {!searchTerm && (
        <div className="bg-black text-white rounded-[24px] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.15)] relative overflow-hidden mb-8">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-gray-800 rounded-full blur-[60px] opacity-60"></div>
          <div className="relative z-10">
            <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border border-white/20 mb-4 inline-block">
              Solo en Cotuí
            </span>
            <h2 className="text-4xl font-black leading-[1.1] tracking-tighter mb-2">
              Todo fresco.<br/>En minutos.
            </h2>
            <p className="text-gray-400 text-sm font-medium">Precios reales, calidad premium.</p>
          </div>
        </div>
      )}

      {/* SECCIÓN OFERTAS (Carrusel) */}
      {!searchTerm && flashOffers.length > 0 && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Icons.Flame className="text-black" size={24} />
              <h2 className="text-2xl font-black text-black tracking-tight">Ofertas Exclusivas</h2>
            </div>
            <button onClick={() => setView('offers')} className="text-sm font-bold text-gray-500 hover:text-black transition-colors">Ver todas</button>
          </div>

          <div className="flex space-x-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 -mx-4 px-4">
            {flashOffers.slice(0,6).map(p => {
              const flashPrice = parseFloat((p.price * 0.9).toFixed(2));
              return (
                <div key={p.id} className="snap-start min-w-[150px] max-w-[150px] bg-white border border-gray-100 rounded-[20px] p-3 flex flex-col shadow-sm active:scale-[0.98] transition-transform cursor-pointer" onClick={() => {
                  setSelectedProduct({...p, originalPrice: p.price, price: flashPrice});
                  setSelectedVariant(p.variants[0]);
                }}>
                  <div className="bg-gray-50 rounded-[12px] p-2 mb-3 aspect-square relative flex items-center justify-center">
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider z-10 shadow-sm">-10%</span>
                    <img src={p.img} className="w-full h-full object-contain mix-blend-multiply" alt={p.name} />
                  </div>
                  <h4 className="text-[13px] font-bold text-gray-900 line-clamp-2 leading-tight mb-2 flex-1">{p.name}</h4>
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <span className="text-gray-400 text-[11px] line-through block">RD$ {p.price}</span>
                      <span className="text-black font-black text-[16px]">RD$ {flashPrice}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(p, true); }} className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-md"><Icons.Plus size={16}/></button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* STICKY CATEGORY PILLS */}
      <div className="sticky top-[125px] z-40 bg-white/95 backdrop-blur-xl -mx-4 px-4 py-3 border-b border-gray-100 flex space-x-2 overflow-x-auto no-scrollbar shadow-[0_10px_20px_rgba(255,255,255,0.9)]">
        {realCategories.map(c => (
          <button 
            key={c} 
            onClick={() => { setActiveCategory(c); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
            className={`px-5 py-2.5 rounded-full text-[14px] font-bold whitespace-nowrap transition-all duration-300 ${activeCategory === c ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* FEED DE PRODUCTOS TIPO UBER EATS */}
      <div className="flex flex-col pt-2">
        {filteredProducts.map(p => (
          <div key={p.id} onClick={() => { setSelectedProduct(p); setSelectedVariant(p.variants[0]); }} className="flex items-center bg-white border-b border-gray-100 py-5 cursor-pointer active:opacity-60 transition-opacity group">
            <div className="flex-1 pr-4">
              <h4 className="text-[16px] font-bold text-gray-900 leading-tight mb-1 group-hover:text-red-600 transition-colors">{p.name}</h4>
              <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed mb-3">{p.description}</p>
              <span className="text-[16px] font-black text-gray-900">RD$ {p.price}</span>
            </div>
            <div className="relative w-[110px] h-[110px] bg-gray-50 rounded-[16px] flex-shrink-0 border border-gray-100/50 p-1 overflow-hidden">
                <img src={p.img} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" alt={p.name}/>
                <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="absolute bottom-1 right-1 bg-white text-black w-9 h-9 rounded-full flex items-center justify-center shadow-md border border-gray-100 hover:bg-gray-50 transition-colors"><Icons.Plus size={20}/></button>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
           <div className="text-center py-16">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"><Icons.Search size={24}/></div>
             <p className="text-gray-900 font-bold text-lg">Sin resultados</p>
             <p className="text-gray-500 text-sm">Intenta buscar con otra palabra.</p>
           </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-white text-gray-900 font-sans selection:bg-gray-200 overflow-x-hidden max-w-[480px] mx-auto shadow-[0_0_50px_rgba(0,0,0,0.1)] relative border-x border-gray-50 flex flex-col">
      
      {/* TOAST SYSTEM FRONT */}
      {toast && (
        <div className="fixed top-[140px] left-1/2 -translate-x-1/2 z-[300] animate-fade-in w-fit max-w-[90%]">
          <div className="bg-black text-white px-5 py-3 rounded-full shadow-2xl flex items-center space-x-3 backdrop-blur-md">
            <Icons.CheckCircle2 color="#ffffff" size={18} />
            <span className="text-[13px] font-bold tracking-wide whitespace-nowrap">{toast}</span>
          </div>
        </div>
      )}

      {/* HEADER BUSCADOR STICKY PREMIUM */}
      {view !== 'tracking' && view !== 'login' && view !== 'profile' && (
        <header className="sticky top-0 z-[100] bg-white pt-5 pb-4 px-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <div onClick={() => { setView('home'); setSearchTerm(''); setActiveCategory('Todos'); window.scrollTo(0,0); }} className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-10 h-10 bg-red-600 rounded-[12px] flex items-center justify-center text-white font-black text-xl shadow-md">K</div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center mb-0.5">Entregar en <Icons.MapPinned size={10} className="ml-1 text-black"/></span>
                <span className="text-[15px] font-black text-black flex items-center group-hover:text-red-600 transition-colors">{user?.address || "Cotuí, Centro"} <Icons.ChevronDown size={14} className="ml-1 text-gray-400"/></span>
              </div>
            </div>
            {user ? (
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-black font-black text-[15px] cursor-pointer hover:bg-gray-200 transition-colors" onClick={()=>setView('profile')}>{user.firstName[0]}</div>
            ) : (
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors" onClick={()=>setView('login')}><Icons.User size={18}/></div>
            )}
          </div>
          
          <div className="relative group">
            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
            <input 
                type="text" 
                placeholder="Busca frescos, bebidas, snacks..." 
                className="w-full bg-gray-100 py-3.5 pl-12 pr-4 rounded-[16px] text-[14px] font-bold outline-none focus:bg-white focus:ring-2 focus:ring-black/5 transition-all border border-transparent shadow-inner placeholder:font-medium placeholder:text-gray-500" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
            {searchTerm && (
              <button onClick={()=>setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                <Icons.X size={16}/>
              </button>
            )}
          </div>
        </header>
      )}

      <main className="px-4 flex-1 pb-24">
        {loading ? (
          <HomeSkeleton />
        ) : (
          <div className="animate-fade-in w-full h-full">
            {view === 'home' && <HomeView />}

            {/* VISTA OFERTAS */}
            {view === 'offers' && (
              <div className="pt-4 pb-32 space-y-6">
                <div className="flex items-center space-x-3">
                    <button onClick={() => setView('home')} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 text-black transition-colors"><Icons.ArrowLeft size={20}/></button>
                    <h2 className="text-2xl font-black text-black">Ofertas Exclusivas</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {flashOffers.map(p => {
                      const flashPrice = parseFloat((p.price * 0.9).toFixed(2));
                      return (
                        <div key={p.id} onClick={() => { setSelectedProduct({...p, originalPrice: p.price, price: flashPrice}); setSelectedVariant(p.variants[0]); }} className="bg-white p-3 rounded-[20px] border border-gray-100 shadow-sm flex flex-col active:scale-[0.98] transition-transform cursor-pointer">
                            <div className="bg-gray-50 rounded-[12px] p-2 mb-3 aspect-square flex items-center justify-center relative">
                              <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider z-10">-10%</span>
                              <img src={p.img} className="w-full h-full object-contain mix-blend-multiply" alt={p.name} />
                            </div>
                            <h4 className="text-[13px] font-bold text-gray-900 line-clamp-2 mb-1 leading-tight">{p.name}</h4>
                            <div className="mt-auto">
                              <p className="text-gray-400 line-through text-[11px]">RD$ {p.price}</p>
                              <div className="flex items-center justify-between mt-0.5">
                                <p className="text-red-600 font-black text-[16px]">RD$ {flashPrice}</p>
                                <button onClick={(e) => { e.stopPropagation(); addToCart(p, true); }} className="bg-gray-100 text-black w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"><Icons.Plus size={14}/></button>
                              </div>
                            </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {/* VISTA CHECKOUT (FRICCIÓN CERO, ROBUSTA) */}
            {view === 'checkout' && (
              <div className="pt-4 pb-40 space-y-6">
                <div className="flex items-center space-x-3 pb-2 border-b border-gray-50">
                  <button onClick={() => setView('home')} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 text-black transition-colors"><Icons.ArrowLeft size={20}/></button>
                  <h2 className="text-2xl font-black text-black">Tu Pedido</h2>
                </div>
                
                {/* BARRA DE ENVIO GRATIS DINÁMICA */}
                {cart.length > 0 && (
                  <div className="bg-white p-4 rounded-[16px] border border-gray-100 shadow-sm">
                    <p className="text-[13px] font-bold text-gray-900 mb-3 flex items-center">
                      <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center mr-3 shadow-sm"><Icons.Gift size={14}/></div>
                      {subtotal >= FREE_SHIPPING_THRESHOLD ? '¡Tienes envío gratis desbloqueado!' : `Agrega RD$ ${FREE_SHIPPING_THRESHOLD - subtotal} para Envío Gratis`}
                    </p>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                      <div className="h-full bg-black rounded-full transition-all duration-700 ease-out" style={{width: `${percentToFreeShipping}%`}} />
                    </div>
                  </div>
                )}

                <div className="space-y-0">
                  {cart.length === 0 ? (
                      <div className="py-20 flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6"><Icons.ShoppingBag size={48}/></div>
                        <p className="text-xl font-black text-gray-900 mb-2">Canasta vacía</p>
                        <p className="text-gray-500 text-sm mb-8 px-8">No tienes productos en tu pedido. Agrega tus favoritos para continuar.</p>
                        <button onClick={() => setView('home')} className="bg-black text-white px-8 py-4 rounded-[16px] font-bold text-[15px] shadow-lg shadow-black/20 active:scale-95 transition-transform">Comenzar a comprar</button>
                      </div>
                  ) : (
                      <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                        {cart.map(item => (
                          <div key={item.cartItemId} className="flex items-start p-4 hover:bg-gray-50 transition-colors">
                              <div className="w-[72px] h-[72px] bg-white rounded-[12px] p-1.5 mr-4 border border-gray-100 flex-shrink-0 relative">
                                {item.isFlashSale && <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">OFERTA</div>}
                                <img src={item.img} className="w-full h-full object-contain mix-blend-multiply" alt={item.name} />
                              </div>
                              <div className="flex-1 pr-2 pt-1">
                                  <h4 className="text-[14px] font-bold text-gray-900 line-clamp-2 leading-snug mb-1">{item.name}</h4>
                                  <p className="text-[11px] text-gray-500 font-medium mb-2">{item.selectedVariantTitle}</p>
                                  <span className="text-[15px] font-black text-black block">RD$ {item.price * item.qty}</span>
                              </div>
                              <div className="flex flex-col items-end justify-between h-full pt-1">
                                <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200/50 shadow-inner">
                                    <button onClick={() => updateQty(item.cartItemId, -1)} className="w-8 h-8 flex items-center justify-center text-gray-700 bg-white rounded-full shadow-sm hover:text-black transition-colors"><Icons.Minus size={14} /></button>
                                    <span className="w-7 text-center text-[13px] font-bold">{item.qty}</span>
                                    <button onClick={() => updateQty(item.cartItemId, 1)} className="w-8 h-8 flex items-center justify-center text-white bg-black rounded-full shadow-sm transition-colors"><Icons.Plus size={14} /></button>
                                </div>
                              </div>
                          </div>
                        ))}
                      </div>
                  )}
                </div>

                {/* UPSELLING (Aumentar el ticket) */}
                {cart.length > 0 && subtotal < FREE_SHIPPING_THRESHOLD && upsellingProducts.length > 0 && (
                  <div className="py-2">
                    <h3 className="text-[16px] font-black text-gray-900 mb-4 px-1">Completa tu pedido</h3>
                    <div className="flex space-x-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-4">
                      {upsellingProducts.map(p => (
                        <div key={p.id} className="min-w-[130px] bg-white border border-gray-100 rounded-[16px] p-2.5 flex flex-col cursor-pointer active:scale-[0.98] transition-transform shadow-sm" onClick={() => { setSelectedProduct(p); setSelectedVariant(p.variants[0]); }}>
                          <div className="bg-gray-50 rounded-[10px] p-2 mb-2 aspect-square flex items-center justify-center">
                            <img src={p.img} className="max-w-full max-h-full object-contain mix-blend-multiply" alt={p.name} />
                          </div>
                          <p className="text-[12px] font-bold text-gray-900 line-clamp-2 leading-tight mb-2 flex-1">{p.name}</p>
                          <div className="flex justify-between items-center mt-auto">
                            <span className="font-black text-[13px] text-gray-900">RD$ {p.price}</span>
                            <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="bg-gray-100 hover:bg-black hover:text-white text-black w-7 h-7 rounded-full flex items-center justify-center transition-colors"><Icons.Plus size={14}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECCIÓN DE PAGO Y RESUMEN */}
                {cart.length > 0 && (
                  <div className="space-y-6 pt-2">
                    
                    <div className="bg-white border border-gray-100 rounded-[20px] p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[16px] font-black text-gray-900">Entregar en</h3>
                        {user && <span className="text-red-600 text-[12px] font-bold cursor-pointer" onClick={()=>setView('profile')}>Editar</span>}
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-black text-white p-2.5 rounded-full"><Icons.MapPinned size={18}/></div>
                        <div>
                          <p className="font-bold text-[14px] text-gray-900">{user?.address || "Cotuí, Centro"}</p>
                          <p className="text-[12px] text-gray-500 mt-0.5">{user?.phone || "Añade un teléfono en tu perfil"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-[16px] font-black text-gray-900 px-1">Método de Pago</h3>
                      <div className="grid gap-3">
                        <div onClick={() => setPaymentMethod('cash')} className={`flex items-center p-4 rounded-[16px] border-2 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-black bg-gray-50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                          <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center mr-4 transition-colors ${paymentMethod === 'cash' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}><Icons.Banknote size={24} /></div>
                          <div className="flex-1">
                            <p className="font-bold text-[15px] text-gray-900">Contra entrega</p>
                            <p className="text-[12px] text-gray-500 mt-0.5 font-medium">Efectivo o transferencia al recibir</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-black' : 'border-gray-200'}`}>
                            {paymentMethod === 'cash' && <div className="w-3 h-3 bg-black rounded-full" />}
                          </div>
                        </div>

                        <div className="flex items-center p-4 rounded-[16px] border-2 border-gray-50 bg-gray-50/50 opacity-60 cursor-not-allowed">
                          <div className="w-12 h-12 rounded-[12px] bg-gray-200 flex items-center justify-center mr-4 text-gray-400"><Icons.CreditCard size={24} /></div>
                          <div className="flex-1">
                            <p className="font-bold text-[15px] text-gray-500">Tarjeta (Próximamente)</p>
                            <p className="text-[11px] text-red-500 font-bold tracking-wide mt-0.5">NO DISPONIBLE</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-[20px] space-y-3 border border-gray-100">
                        <div className="flex justify-between text-gray-600 text-[14px] font-medium"><span>Subtotal</span><span>RD$ {subtotal}</span></div>
                        <div className="flex justify-between text-gray-600 text-[14px] font-medium"><span>Costo de entrega</span><span className={shipping === 0 ? "text-black font-black" : ""}>{shipping === 0 ? 'Gratis' : `RD$ ${shipping}`}</span></div>
                        <div className="flex justify-between text-black font-black text-[22px] pt-4 border-t border-gray-200 mt-2"><span>Total</span><span>RD$ {total}</span></div>
                    </div>
                    
                    <button onClick={() => {
                        if (!user) { setView('login'); showToast("Inicia sesión para pedir"); return; }
                        setView('tracking'); setCart([]); localStorage.removeItem('kolmard_cart'); window.scrollTo(0,0);
                    }} className="w-full bg-red-600 hover:bg-red-700 text-white h-[64px] rounded-[16px] font-black text-[17px] shadow-[0_10px_25px_rgba(220,38,38,0.3)] active:scale-[0.98] transition-all flex items-center justify-center tracking-wide">
                      Realizar Pedido • RD$ {total}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* VISTA ÓRDENES ACTIVAS */}
            {view === 'orders' && (
              <div className="pt-4 space-y-6 pb-24">
                <h2 className="text-2xl font-black text-black">Mis Pedidos</h2>
                <div onClick={() => setView('tracking')} className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black"></div>
                  <div className="flex justify-between items-start mb-5 pl-2">
                    <div className="flex items-center space-x-4">
                        <div className="bg-gray-50 w-12 h-12 flex items-center justify-center rounded-[12px] text-black"><Icons.Truck size={24} /></div>
                        <div>
                          <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest block mb-0.5">En progreso</span>
                          <span className="text-[16px] font-bold text-gray-900 leading-tight">Pedido KolmaRD</span>
                          <p className="text-[12px] text-gray-500 mt-1">Llegando a tu ubicación</p>
                        </div>
                    </div>
                    <span className="bg-black text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center shadow-sm">En Camino</span>
                  </div>
                  <div className="pl-2">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                      <div className="h-full bg-black rounded-full w-[70%] relative overflow-hidden">
                         <div className="absolute inset-0 bg-white/20 animate-[shimmer_1.5s_infinite]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PERFIL & LOGIN */}
            {view === 'profile' || view === 'login' ? (user ? (
              <div className="pt-6 space-y-8 pb-32">
                <div className="bg-black p-6 rounded-[24px] flex items-center space-x-5 shadow-[0_15px_30px_rgba(0,0,0,0.15)] text-white">
                  <div className="w-20 h-20 bg-white text-black rounded-[20px] flex items-center justify-center text-3xl font-black shadow-inner">{(user.firstName || "K")[0]}</div>
                  <div>
                    <h2 className="text-[22px] font-black tracking-tight leading-tight mb-1">{user.firstName}</h2>
                    <p className="text-white/60 text-[13px] font-medium">{user.email}</p>
                    <span className="inline-block mt-3 bg-white/10 border border-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">Miembro Premium</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-black text-[18px] text-gray-900 px-1">Configuración</h3>
                  
                  <div className="bg-white border border-gray-100 p-4 rounded-[20px] shadow-sm flex items-center space-x-4">
                    <div className="bg-gray-50 p-3 rounded-full text-black"><Icons.MapPinned size={22} /></div>
                    <div className="flex flex-col flex-1">
                      <span className="text-[12px] font-bold text-gray-500">Dirección Guardada</span>
                      <span className="font-bold text-[15px] text-gray-900">{user.address || "Cotuí, Centro"}</span>
                    </div>
                    <button className="text-gray-400 hover:text-black"><Icons.Plus size={20}/></button>
                  </div>

                  <div className="bg-white border border-gray-100 p-4 rounded-[20px] shadow-sm flex items-center space-x-4">
                    <div className="bg-gray-50 p-3 rounded-full text-black"><Icons.User size={22} /></div>
                    <div className="flex flex-col flex-1">
                      <span className="text-[12px] font-bold text-gray-500">Teléfono</span>
                      <span className="font-bold text-[15px] text-gray-900">{user.phone || "No registrado"}</span>
                    </div>
                    <button className="text-gray-400 hover:text-black"><Icons.Plus size={20}/></button>
                  </div>
                </div>

                <button onClick={() => { setUser(null); localStorage.removeItem('kolmard_user'); setView('home'); }} className="w-full py-5 text-gray-500 font-bold text-[15px] bg-white border border-gray-200 hover:bg-gray-50 hover:text-black rounded-[20px] flex items-center justify-center space-x-3 transition-colors mt-8 shadow-sm">
                  <Icons.LogOut size={20} /><span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="pt-8 space-y-8">
                <div className="text-left mb-10">
                  <div className="w-16 h-16 bg-black rounded-[16px] flex items-center justify-center text-white text-3xl font-black mb-6 shadow-lg">K</div>
                  <h2 className="text-4xl font-black text-gray-900 leading-[1.1] tracking-tighter">{authMode === 'login' ? 'Bienvenido\nde vuelta.' : 'Comienza a\ncomprar.'}</h2>
                  <p className="text-gray-500 text-[15px] mt-3 font-medium">Ingresa para disfrutar de entregas súper rápidas en Cotuí.</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {authMode === 'register' && (
                    <div className="bg-white rounded-[16px] flex items-center px-5 py-4 border-2 border-gray-100 focus-within:border-black transition-all shadow-sm">
                      <Icons.User size={20} className="text-gray-400 mr-3" />
                      <input type="text" placeholder="Nombre completo" className="bg-transparent text-[15px] font-bold w-full outline-none text-gray-900 placeholder:font-medium placeholder:text-gray-400" value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} required />
                    </div>
                  )}
                  <div className="bg-white rounded-[16px] flex items-center px-5 py-4 border-2 border-gray-100 focus-within:border-black transition-all shadow-sm">
                    <Icons.Mail size={20} className="text-gray-400 mr-3" />
                    <input type="email" placeholder="Correo electrónico" className="bg-transparent text-[15px] font-bold w-full outline-none text-gray-900 placeholder:font-medium placeholder:text-gray-400" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="bg-white rounded-[16px] flex items-center px-5 py-4 border-2 border-gray-100 focus-within:border-black transition-all shadow-sm">
                    <Icons.Lock size={20} className="text-gray-400 mr-3" />
                    <input type={showPassword ? "text" : "password"} placeholder="Contraseña" className="bg-transparent text-[15px] font-bold w-full outline-none text-gray-900 placeholder:font-medium placeholder:text-gray-400" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} required />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="text-gray-400 hover:text-black ml-2 transition-colors">
                      {showPassword ? <Icons.EyeOff size={20}/> : <Icons.Eye size={20}/>}
                    </button>
                  </div>
                  
                  <button type="submit" className="w-full h-[64px] bg-black text-white rounded-[16px] font-black text-[16px] shadow-[0_10px_20px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-transform mt-8 flex items-center justify-center tracking-wide">
                    {loading ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div> : (authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')}
                  </button>
                </form>

                <div className="text-center pt-6 border-t border-gray-100">
                  <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-[14px] font-bold text-gray-500 hover:text-black transition-colors">
                    {authMode === 'login' ? '¿No tienes cuenta? Regístrate aquí' : 'Ya tengo cuenta. Entrar'}
                  </button>
                </div>
              </div>
            )) : null}
          </div>
        )}
      </main>

      {/* RASTREO MAPA INMERSIVO */}
      {view === 'tracking' && (
        <div className="fixed inset-0 z-[180] bg-white flex flex-col animate-fade-in max-w-[480px] mx-auto shadow-2xl">
          <div className="absolute top-12 left-4 right-4 z-30 flex justify-between items-center pointer-events-none">
            <button onClick={() => setView('orders')} className="w-12 h-12 bg-white rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.1)] flex items-center justify-center text-black active:scale-90 transition-transform pointer-events-auto border border-gray-100">
              <Icons.ArrowLeft size={24} />
            </button>
            <div className="bg-black text-white px-5 py-2.5 rounded-full shadow-lg font-black text-[11px] uppercase tracking-widest pointer-events-auto flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div> Live Tracker
            </div>
          </div>
          
          <div className="flex-1 w-full relative z-10"><CotuiMap /></div>
          
          <div className="bg-white rounded-t-[40px] px-8 pt-8 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.15)] relative z-20 -mt-10 border-t border-gray-100">
            <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-1">Tiempo de llegada</p>
                <h3 className="text-5xl font-black text-black tracking-tighter leading-none">12 <span className="text-2xl text-gray-400 font-bold">min</span></h3>
              </div>
              <div className="bg-black text-white p-4 rounded-[20px] shadow-lg relative">
                <Icons.CheckCircle2 size={32} />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-[24px] p-5 flex items-center border border-gray-100">
               <div className="w-14 h-14 bg-white rounded-[16px] shadow-sm flex items-center justify-center text-2xl mr-4 border border-gray-100">🛵</div>
               <div className="flex-1">
                 <p className="font-black text-[16px] text-gray-900 leading-tight">Tu motorista</p>
                 <p className="text-[13px] text-gray-500 font-medium mt-0.5">En ruta hacia tu domicilio</p>
               </div>
               <div className="bg-gray-200 text-gray-600 w-10 h-10 rounded-full flex items-center justify-center"><Icons.MapPinned size={18}/></div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE PRODUCTO PREMIUM (CON VARIANTES) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end sm:items-center sm:justify-center animate-fade-in p-0 sm:p-4">
          <div className="bg-white w-full max-w-[480px] mx-auto rounded-t-[32px] sm:rounded-[24px] overflow-hidden shadow-[0_-20px_60px_rgba(0,0,0,0.3)] animate-slide-up flex flex-col max-h-[90vh]">
            <div className="relative h-[35vh] min-h-[220px] w-full bg-gray-50 p-8 flex items-center justify-center shrink-0 border-b border-gray-100">
              <img src={selectedProduct.img} className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" alt={selectedProduct.name} />
              <button onClick={() => { setSelectedProduct(null); setSelectedVariant(null); }} className="absolute top-6 right-6 bg-white border border-gray-100 text-black p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10"><Icons.X size={20} /></button>
            </div>
            <div className="p-6 bg-white shrink-0 relative z-10 overflow-y-auto">
              <h2 className="text-[22px] font-black text-gray-900 leading-tight mb-2 pr-4">{selectedProduct.name}</h2>
              <div className="flex items-end mb-4">
                <span className="text-black font-black text-[26px] tracking-tight mr-3">RD$ {selectedVariant?.price || selectedProduct.price}</span>
                {selectedProduct.originalPrice && <span className="text-[14px] text-gray-400 line-through mb-1">RD$ {selectedProduct.originalPrice}</span>}
              </div>
              <p className="text-gray-500 text-[14px] mb-6 leading-relaxed font-medium">{selectedProduct.description}</p>
              
              {/* SELECTOR DE VARIANTES */}
              {selectedProduct.variants && selectedProduct.variants.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-[14px] font-black text-gray-900 mb-3">Opciones</h3>
                  <div className="space-y-2">
                    {selectedProduct.variants.map(variant => (
                      <div 
                        key={variant.id} 
                        onClick={() => setSelectedVariant(variant)}
                        className={`flex items-center justify-between p-4 rounded-[16px] border-2 cursor-pointer transition-colors ${selectedVariant?.id === variant.id ? 'border-black bg-gray-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                      >
                        <span className="font-bold text-[14px] text-gray-900">{variant.title}</span>
                        <div className="flex items-center">
                          <span className="font-black text-[14px] text-gray-900 mr-3">RD$ {variant.price}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedVariant?.id === variant.id ? 'border-black' : 'border-gray-300'}`}>
                            {selectedVariant?.id === variant.id && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => { addToCart(selectedProduct, !!selectedProduct.originalPrice, selectedVariant); setSelectedProduct(null); setSelectedVariant(null); }} className="w-full bg-red-600 hover:bg-red-700 text-white h-[64px] rounded-[16px] font-black text-[16px] shadow-[0_15px_30px_rgba(220,38,38,0.25)] active:scale-[0.98] transition-transform flex items-center justify-center tracking-wide">
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER NAVEGACIÓN BOTTOM */}
      {view !== 'tracking' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-6 pt-3 pb-8 flex justify-between items-center z-[150] max-w-[480px] mx-auto shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
          <button onClick={() => { setView('home'); window.scrollTo(0,0); }} className={`flex flex-col items-center space-y-1.5 transition-colors relative ${view === 'home' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}>
            <Icons.ShoppingBag size={24} />
            <span className="text-[10px] font-black tracking-widest uppercase">Inicio</span>
            {view === 'home' && <span className="absolute -bottom-3 w-1 h-1 bg-black rounded-full"></span>}
          </button>
          
          <button onClick={() => { setView('offers'); window.scrollTo(0,0); }} className={`flex flex-col items-center space-y-1.5 transition-colors relative ${view === 'offers' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}>
            <Icons.Flame size={24} />
            <span className="text-[10px] font-black tracking-widest uppercase">Ofertas</span>
            {view === 'offers' && <span className="absolute -bottom-3 w-1 h-1 bg-black rounded-full"></span>}
          </button>

          <button onClick={() => { setView('orders'); window.scrollTo(0,0); }} className={`flex flex-col items-center space-y-1.5 transition-colors relative ${view === 'orders' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}>
            <Icons.Truck size={24} />
            <span className="text-[10px] font-black tracking-widest uppercase">Pedidos</span>
            {view === 'orders' && <span className="absolute -bottom-3 w-1 h-1 bg-black rounded-full"></span>}
          </button>

          <button onClick={() => { setView(user ? 'profile' : 'login'); window.scrollTo(0,0); }} className={`flex flex-col items-center space-y-1.5 transition-colors relative ${view === 'profile' || view === 'login' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}>
            <Icons.User size={24} />
            <span className="text-[10px] font-black tracking-widest uppercase">Perfil</span>
            {(view === 'profile' || view === 'login') && <span className="absolute -bottom-3 w-1 h-1 bg-black rounded-full"></span>}
          </button>
        </nav>
      )}

      {/* BOTON FLOTANTE DE CARRITO PREMIUM */}
      {view !== 'checkout' && view !== 'tracking' && totalItemsInCart > 0 && (
        <div className={`fixed bottom-28 left-0 right-0 z-[140] px-4 max-w-[480px] mx-auto transition-transform duration-300 ${cartBump ? 'scale-105' : 'scale-100 animate-slide-up'}`}>
          <button onClick={() => setView('checkout')} className="w-full bg-black text-white p-4 rounded-[20px] shadow-[0_15px_30px_rgba(0,0,0,0.25)] flex justify-between items-center active:scale-[0.98] transition-transform">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-black border border-white/10">{totalItemsInCart}</div>
              <span className="font-black text-[15px] tracking-wide">Ver pedido</span>
            </div>
            <span className="font-black text-[16px] bg-white text-black px-4 py-2.5 rounded-full shadow-sm">RD$ {total}</span>
          </button>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { 
          font-family: 'Inter', sans-serif; 
          -webkit-tap-highlight-color: transparent; 
          background-color: #f3f4f6; /* Fondo gris para desktop, contenedor blanco en el centro */
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
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        
        .animate-fade-in { animation: fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
