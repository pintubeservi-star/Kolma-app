"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

// --- ICONOGRAFÍA SVG NATIVA PREMIUN ---
const Icons = {
  ShoppingBag: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Search: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Plus: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5v14M5 12h14"/></svg>,
  Minus: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/></svg>,
  User: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Tag: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>,
  Truck: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10Z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>,
  ArrowLeft: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  MapPinned: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"/><circle cx="12" cy="8" r="2"/><path d="M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.3 0 .6.2.8s.5.2.8.1l6-2c.3-.1.6-.1.9-.1h3.141"/></svg>,
  CheckCircle2: ({ size = 24, color = "currentColor", className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
  Sparkles: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  X: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Mail: ({ size = 20, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Lock: ({ size = 20, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Eye: ({ size = 18, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: ({ size = 18, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
  LogOut: ({ size = 18, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  CreditCard: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>,
  Banknote: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>,
  Timer: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Gift: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>
};

const COTUI_CENTER = [19.0531, -70.1491];
const FREE_SHIPPING_THRESHOLD = 500;
const STANDARD_SHIPPING_COST = 50;

const CotuiMap = () => {
  const mapRef = useRef(null);
  useEffect(() => {
    if (typeof window !== 'undefined' && !mapRef.current) {
      const L = window.L;
      if (L) {
        const map = L.map('map-tracking', { zoomControl: false, attributionControl: false }).setView(COTUI_CENTER, 15);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);
        const motoristaIcon = L.divIcon({
          className: 'custom-motorista',
          html: `<div class="w-10 h-10 bg-black rounded-full border-[3px] border-white shadow-[0_8px_16px_rgba(0,0,0,0.2)] flex items-center justify-center animate-bounce text-lg">🛵</div>`,
          iconSize: [40, 40], iconAnchor: [20, 20]
        });
        L.marker([19.055, -70.145], { icon: motoristaIcon }).addTo(map);
        L.marker(COTUI_CENTER, { icon: L.divIcon({ html: `<div class="w-5 h-5 bg-red-600 rounded-full border-[3px] border-white shadow-md"></div>`, className: '', iconSize: [20, 20] }) }).addTo(map);
        mapRef.current = map;
      }
    }
  }, []);
  return <div id="map-tracking" className="w-full h-full grayscale-[0.1]" />;
};

export default function KolmaRD() {
  const [view, setView] = useState('home'); 
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', address: '', phone: '' });
  const [toast, setToast] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hora para ofertas fugaces

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 3600), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
        showToast(authMode === 'login' ? '¡Hola de nuevo!' : 'Cuenta lista para comprar');
      } else {
        showToast(data.error || 'Verifica tus datos');
      }
    } catch (error) {
      showToast('Sin conexión. Revisa tu internet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => fetchProducts();
    document.head.appendChild(script);

    const savedUser = localStorage.getItem('kolmard_user');
    const savedCart = localStorage.getItem('kolmard_cart');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.data?.products) {
        const formatted = json.data.products.edges
          .filter(({ node }) => !node.tags?.some(tag => tag.toLowerCase() === 'pos'))
          .map(({ node }) => ({
            id: node.id,
            name: node.title,
            price: parseFloat(node.variants?.edges?.[0]?.node?.price?.amount || 0),
            img: node.images?.edges?.[0]?.node?.url || 'https://via.placeholder.com/600',
            category: node.collections?.edges?.[0]?.node?.title || node.productType || 'Otros',
            collection: node.tags?.some(tag => tag.toLowerCase().includes('oferta')) ? 'Ofertas' : 'General',
            description: node.description || 'Calidad garantizada KolmaRD.'
          }));
        setProducts(formatted);
      }
    } catch (e) { 
        showToast('Error sincronizando inventario');
    } finally { 
        setLoading(false); 
    }
  };

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const addToCart = useCallback((p, isFlashSale = false) => {
    const finalPrice = isFlashSale ? (p.price * 0.9).toFixed(2) : p.price; // 10% descuento real respetando margen
    setCart(curr => {
      const ex = curr.find(i => i.id === p.id && i.isFlashSale === isFlashSale);
      const n = ex 
        ? curr.map(i => i.id === p.id && i.isFlashSale === isFlashSale ? { ...i, qty: i.qty + 1 } : i) 
        : [...curr, { ...p, price: parseFloat(finalPrice), qty: 1, isFlashSale }];
      localStorage.setItem('kolmard_cart', JSON.stringify(n));
      return n;
    });
    showToast(`Agregaste ${p.name}`);
  }, [showToast]);

  const updateQty = useCallback((id, isFlashSale, delta) => {
    setCart(curr => {
      const n = curr.map(i => {
        if (i.id === id && i.isFlashSale === isFlashSale) {
          return { ...i, qty: Math.max(0, i.qty + delta) };
        }
        return i;
      }).filter(i => i.qty > 0);
      localStorage.setItem('kolmard_cart', JSON.stringify(n));
      return n;
    });
  }, []);

  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const total = subtotal + shipping;
  const percentToFreeShipping = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const realCategories = useMemo(() => {
    const cats = products.map(p => p.category);
    return ['Todos', ...new Set(cats)];
  }, [products]);

  // Selección inteligente para Upselling (productos baratos de alto margen)
  const upsellingProducts = useMemo(() => {
    return products.filter(p => p.price <= 150 && !cart.some(c => c.id === p.id)).slice(0, 3);
  }, [products, cart]);

  const HomeView = () => (
    <div className="space-y-8 pb-32 animate-fade-in">
      {!searchTerm && (
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative z-10 flex flex-col items-start h-full justify-between min-h-[140px]">
            <div>
              <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 mb-3 flex items-center w-fit">
                <Icons.Sparkles size={12} className="mr-1.5 text-red-400" /> Entrega Express
              </span>
              <h2 className="text-white text-3xl font-extrabold leading-[1.1] tracking-tight">
                El súper,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">más rápido.</span>
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* OFERTAS FUGACES - FOMO & URGENCY */}
      {!searchTerm && products.filter(p => p.collection === 'Ofertas').length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-end px-1">
            <div className="flex items-center space-x-2">
              <div className="bg-red-100 p-1.5 rounded-lg text-red-600 animate-pulse"><Icons.Timer size={20}/></div>
              <h3 className="font-extrabold text-xl text-gray-900 tracking-tight">Ofertas Fugaces</h3>
            </div>
            <div className="bg-black text-white px-3 py-1 rounded-lg text-sm font-bold shadow-md">
              {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x">
            {products.filter(p => p.collection === 'Ofertas').slice(0,6).map(p => {
              const flashPrice = (p.price * 0.9).toFixed(2); // 10% off
              return (
                <div key={p.id} className="snap-start min-w-[160px] bg-white p-3 rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative flex flex-col active:scale-[0.98] transition-transform">
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-full z-10 shadow-sm">-10% HOY</div>
                  <div className="relative rounded-[16px] overflow-hidden mb-3 bg-gray-50 aspect-square flex items-center justify-center p-2 group cursor-pointer" onClick={() => setSelectedProduct({...p, price: flashPrice, originalPrice: p.price})}>
                    <img src={p.img} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight mb-2 flex-1">{p.name}</h4>
                  <div className="flex justify-between items-end mt-auto">
                    <div>
                      <span className="text-[10px] text-gray-400 line-through block">RD$ {p.price}</span>
                      <span className="text-red-600 font-extrabold text-base leading-none">RD$ {flashPrice}</span>
                    </div>
                    <button onClick={() => addToCart(p, true)} className="bg-black hover:bg-gray-800 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors"><Icons.ShoppingBag size={16}/></button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* NAVEGACIÓN CATEGORÍAS */}
      <div className="sticky top-[76px] bg-white/90 backdrop-blur-xl z-40 -mx-4 px-4 py-3 border-b border-gray-50 flex space-x-2 overflow-x-auto no-scrollbar">
        {realCategories.map(c => (
          <button 
            key={c} 
            onClick={() => setActiveCategory(c)} 
            className={`px-5 py-2.5 rounded-2xl text-[13px] font-bold whitespace-nowrap transition-all duration-300 ${activeCategory === c ? 'bg-black text-white shadow-lg shadow-black/20 scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* FEED DE PRODUCTOS TIPO PEDIDOSYA */}
      <div className="flex flex-col space-y-5 pt-2">
        {products.filter(p => (activeCategory === 'Todos' || p.category === activeCategory) && p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
          <div key={p.id} onClick={() => setSelectedProduct(p)} className="flex items-center bg-white p-0 cursor-pointer group border-b border-gray-100 pb-5 active:opacity-60 transition-opacity">
            <div className="flex-1 pr-5">
              <h4 className="text-base font-bold text-gray-900 leading-snug mb-1.5 group-hover:text-red-600 transition-colors">{p.name}</h4>
              <p className="text-[13px] text-gray-500 mb-3 line-clamp-2 leading-relaxed">{p.description}</p>
              <div className="flex items-center">
                <span className="text-base font-extrabold text-gray-900">RD$ {p.price}</span>
              </div>
            </div>
            <div className="relative w-[110px] h-[110px] rounded-[20px] bg-gray-50 flex-shrink-0 border border-gray-100 overflow-hidden">
                <img src={p.img} className="w-full h-full object-contain p-2 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="absolute -bottom-1 -right-1 bg-white text-black w-10 h-10 rounded-tl-2xl flex items-center justify-center shadow-[-4px_-4px_10px_rgba(0,0,0,0.05)] border-t border-l border-gray-100 hover:bg-gray-50 transition-colors"><Icons.Plus size={20}/></button>
            </div>
          </div>
        ))}
        {products.length === 0 && !loading && (
           <div className="text-center py-20 text-gray-400 font-medium">No se encontraron productos.</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-red-200 overflow-x-hidden max-w-[480px] mx-auto shadow-[0_0_40px_rgba(0,0,0,0.05)] relative bg-clip-padding border-x border-gray-50">
      
      {/* TOAST PREMIUM */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-fade-in w-[90%] max-w-[400px]">
          <div className="bg-[#1a1a1a] text-white px-5 py-4 rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center space-x-3 border border-white/10 backdrop-blur-xl">
            <div className="bg-green-500/20 p-1.5 rounded-full"><Icons.CheckCircle2 color="#4ade80" size={20} /></div>
            <span className="text-[13px] font-bold tracking-wide">{toast}</span>
          </div>
        </div>
      )}

      {/* HEADER TIPO APP */}
      {view !== 'tracking' && view !== 'login' && view !== 'profile' && (
        <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-2xl px-4 pt-4 pb-3 border-b border-gray-100/50">
          <div className="flex items-center justify-between mb-4">
            <div onClick={() => setView('home')} className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-10 h-10 bg-black rounded-[14px] flex items-center justify-center text-white font-black text-xl shadow-md group-hover:bg-red-600 transition-colors">K</div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest flex items-center mb-0.5"><Icons.MapPinned size={12} className="mr-1"/> Entregar en</span>
                <span className="text-[15px] font-extrabold text-gray-900 flex items-center tracking-tight">{user?.address || "Cotuí, Centro"} <Icons.Search size={14} className="ml-1 text-gray-400 rotate-90"/></span>
              </div>
            </div>
            {user && <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm cursor-pointer hover:bg-gray-200" onClick={()=>setView('profile')}>{user.firstName[0]}</div>}
          </div>
          <div className="relative group">
            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={20} />
            <input 
                type="text" 
                placeholder="Busca en KolmaRD..." 
                className="w-full bg-gray-100/80 py-3.5 pl-12 pr-4 rounded-[20px] text-[14px] font-bold outline-none focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all border border-transparent shadow-inner" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </header>
      )}

      <main className="px-4 h-full">
        {loading ? (
          <div className="flex flex-col space-y-6 pt-10">
             <div className="h-40 bg-gray-100 rounded-3xl animate-pulse"></div>
             <div className="flex space-x-3 overflow-hidden"><div className="h-10 w-24 bg-gray-100 rounded-full animate-pulse"/><div className="h-10 w-32 bg-gray-100 rounded-full animate-pulse"/></div>
             {[1,2,3].map(i => (
               <div key={i} className="flex space-x-4 items-center">
                 <div className="flex-1 space-y-3"><div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"/><div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse"/></div>
                 <div className="w-[110px] h-[110px] bg-gray-100 rounded-[20px] animate-pulse"/>
               </div>
             ))}
          </div>
        ) : (
          <div className="animate-fade-in">
            {view === 'home' && <HomeView />}
            
            {/* VISTA: OFERTAS (TODO EL FEED) */}
            {view === 'offers' && (
              <div className="pt-6 pb-32 space-y-6">
                <div className="flex items-center space-x-4">
                    <button onClick={() => setView('home')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"><Icons.ArrowLeft size={20}/></button>
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Todas las Ofertas</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {products.filter(p => p.collection === 'Ofertas').map(p => (
                        <div key={p.id} onClick={() => setSelectedProduct(p)} className="bg-white p-3.5 rounded-[24px] border border-gray-100 shadow-sm flex flex-col active:scale-95 transition-all cursor-pointer">
                            <div className="bg-gray-50 rounded-[16px] p-3 mb-4 aspect-square flex items-center justify-center relative">
                              <span className="absolute top-2 left-2 bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider z-10">Oferta</span>
                              <img src={p.img} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <h4 className="text-[13px] font-bold text-gray-900 line-clamp-2 mb-1.5 leading-tight">{p.name}</h4>
                            <div className="mt-auto flex items-center justify-between">
                              <p className="text-red-600 font-extrabold text-[15px]">RD$ {p.price}</p>
                              <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="bg-red-50 text-red-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"><Icons.Plus size={16}/></button>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            )}

            {/* VISTA: CHECKOUT PREMIUM CON INCENTIVOS */}
            {view === 'checkout' && (
              <div className="pt-6 pb-40 space-y-6">
                <div className="flex items-center space-x-4 pb-2">
                  <button onClick={() => setView('home')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"><Icons.ArrowLeft size={20}/></button>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Tu Canasta</h2>
                </div>
                
                {/* INCENTIVO DE ENVIO GRATIS */}
                {cart.length > 0 && (
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-[20px] border border-red-100 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-white p-2 rounded-full shadow-sm text-red-500"><Icons.Gift size={18}/></div>
                      <div className="flex-1">
                        <p className="text-[13px] font-bold text-gray-900 leading-tight">
                          {subtotal >= FREE_SHIPPING_THRESHOLD ? '¡Tienes Envío Gratis!' : `Te faltan RD$ ${FREE_SHIPPING_THRESHOLD - subtotal} para Envío Gratis`}
                        </p>
                        <p className="text-[11px] text-gray-500">Beneficio exclusivo KolmaRD</p>
                      </div>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500" style={{width: `${percentToFreeShipping}%`}} />
                    </div>
                  </div>
                )}

                <div className="space-y-1 bg-white rounded-[24px] border border-gray-100 p-2 shadow-sm">
                  {cart.length === 0 ? (
                      <div className="py-16 flex flex-col items-center text-gray-400">
                        <div className="bg-gray-50 p-6 rounded-full mb-4"><Icons.ShoppingBag size={48} className="opacity-30"/></div>
                        <p className="text-lg font-bold text-gray-900 mb-1">Tu canasta está vacía</p>
                        <p className="text-sm">Agrega productos para continuar</p>
                        <button onClick={() => setView('home')} className="mt-6 bg-black text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md active:scale-95">Explorar productos</button>
                      </div>
                  ) : (
                      cart.map(item => (
                        <div key={`${item.id}-${item.isFlashSale}`} className="flex items-center p-3 hover:bg-gray-50 rounded-[16px] transition-colors">
                            <div className="w-16 h-16 bg-white rounded-[14px] p-1.5 mr-4 flex-shrink-0 border border-gray-100 shadow-sm relative">
                              {item.isFlashSale && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white"></span>}
                              <img src={item.img} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <div className="flex-1 pr-2">
                                <h4 className="text-[13px] font-bold text-gray-900 line-clamp-2 leading-tight mb-1">{item.name}</h4>
                                <span className="text-[14px] font-extrabold text-red-600 block">RD$ {item.price * item.qty}</span>
                            </div>
                            <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200/50">
                                <button onClick={() => updateQty(item.id, item.isFlashSale, -1)} className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-white rounded-full transition-colors"><Icons.Minus size={16} /></button>
                                <span className="w-6 text-center text-[13px] font-extrabold">{item.qty}</span>
                                <button onClick={() => updateQty(item.id, item.isFlashSale, 1)} className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-white rounded-full transition-colors shadow-sm"><Icons.Plus size={16} /></button>
                            </div>
                        </div>
                      ))
                  )}
                </div>

                {/* SUGERENCIAS DE UPSELLING */}
                {cart.length > 0 && subtotal < FREE_SHIPPING_THRESHOLD && upsellingProducts.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-[15px] font-extrabold text-gray-900 px-1">Completa para envío gratis</h3>
                    <div className="flex space-x-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
                      {upsellingProducts.map(p => (
                        <div key={p.id} className="min-w-[130px] bg-white border border-gray-100 rounded-[20px] p-2 flex flex-col shadow-sm">
                          <div className="bg-gray-50 rounded-[14px] p-2 mb-2 aspect-square flex items-center justify-center cursor-pointer" onClick={() => setSelectedProduct(p)}>
                            <img src={p.img} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                          </div>
                          <p className="text-[11px] font-bold text-gray-900 line-clamp-1 mb-1">{p.name}</p>
                          <div className="flex justify-between items-center mt-auto">
                            <span className="font-extrabold text-[12px]">RD$ {p.price}</span>
                            <button onClick={() => addToCart(p)} className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center"><Icons.Plus size={12}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {cart.length > 0 && (
                  <div className="space-y-6 pt-2">
                    {/* METODOS DE PAGO */}
                    <div className="space-y-3">
                      <h3 className="text-[18px] font-extrabold text-gray-900 px-1">Método de Pago</h3>
                      <div className="grid gap-3">
                        <div onClick={() => setPaymentMethod('cash')} className={`flex items-center p-4 rounded-[20px] border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'cash' ? 'border-black bg-gray-50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                          <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center mr-4 transition-colors ${paymentMethod === 'cash' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}><Icons.Banknote size={24} /></div>
                          <div className="flex-1">
                            <p className="font-extrabold text-[15px] text-gray-900 leading-tight">Pago contra entrega</p>
                            <p className="text-[12px] text-gray-500 mt-0.5">Efectivo o transferencia al recibir</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'cash' ? 'border-black' : 'border-gray-300'}`}>
                            {paymentMethod === 'cash' && <div className="w-3 h-3 bg-black rounded-full" />}
                          </div>
                        </div>

                        <div className="flex items-center p-4 rounded-[20px] border-2 border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed">
                          <div className="w-12 h-12 rounded-[14px] bg-gray-200 flex items-center justify-center mr-4 text-gray-400"><Icons.CreditCard size={24} /></div>
                          <div className="flex-1">
                            <p className="font-extrabold text-[15px] text-gray-500 leading-tight">Pago con tarjeta</p>
                            <p className="text-[11px] font-bold text-red-500 mt-0.5 tracking-wide">NO DISPONIBLE AÚN</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RESUMEN */}
                    <div className="bg-gray-50 p-5 rounded-[24px] space-y-3 border border-gray-100">
                        <div className="flex justify-between text-gray-600 text-[14px] font-medium"><span>Subtotal</span><span>RD$ {subtotal}</span></div>
                        <div className="flex justify-between text-gray-600 text-[14px] font-medium"><span>Costo de envío</span><span className={shipping === 0 ? "text-green-600 font-extrabold" : ""}>{shipping === 0 ? '¡Gratis!' : `RD$ ${shipping}`}</span></div>
                        <div className="flex justify-between text-gray-900 font-black text-[22px] pt-4 border-t border-gray-200 mt-2"><span>Total</span><span>RD$ {total}</span></div>
                    </div>
                    
                    <button onClick={() => {
                        if (!user) { setView('login'); showToast("Inicia sesión para pedir"); return; }
                        setView('tracking');
                        setCart([]); localStorage.removeItem('kolmard_cart');
                    }} className="w-full bg-black hover:bg-gray-900 text-white h-[60px] rounded-[20px] font-extrabold text-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-all flex items-center justify-center group overflow-hidden relative">
                      <span className="relative z-10 flex items-center">Hacer Pedido <Icons.ArrowLeft className="ml-2 rotate-180 group-hover:translate-x-1 transition-transform" size={18}/></span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* VISTA: ÓRDENES Y RASTREO (ESTILO UBER) */}
            {view === 'orders' && (
              <div className="pt-6 space-y-6 pb-32">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Mis Pedidos</h2>
                <div onClick={() => setView('tracking')} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600"></div>
                  <div className="flex justify-between items-start mb-5 pl-2">
                    <div className="flex items-center space-x-4">
                        <div className="bg-red-50 w-12 h-12 flex items-center justify-center rounded-[14px] text-red-600"><Icons.Truck size={24} /></div>
                        <div>
                          <span className="text-[11px] font-extrabold uppercase text-gray-400 tracking-wider block mb-0.5">En curso</span>
                          <span className="text-[16px] font-bold text-gray-900 leading-tight">Pedido de hoy</span>
                          <p className="text-[12px] text-gray-500 mt-1">Llegando a Cotuí Centro</p>
                        </div>
                    </div>
                    <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center"><div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>En Camino</span>
                  </div>
                  <div className="pl-2">
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
                      <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full w-[70%] relative">
                         <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-l from-white/30 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase">
                      <span>Preparado</span>
                      <span className="text-red-600">En ruta</span>
                      <span>Entregado</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VISTA: PERFIL / LOGIN PREMIUM */}
            {view === 'profile' || view === 'login' ? (user ? (
              <div className="pt-8 space-y-8 pb-32 px-2">
                <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 flex items-center space-x-5 shadow-sm">
                  <div className="w-20 h-20 bg-black rounded-[24px] flex items-center justify-center text-white text-3xl font-black shadow-lg">{(user.firstName || "K")[0]}</div>
                  <div>
                    <h2 className="text-[22px] font-extrabold text-gray-900 tracking-tight leading-tight mb-1">{user.firstName}</h2>
                    <p className="text-gray-500 text-[13px] font-medium">{user.email}</p>
                    <span className="inline-block mt-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Cliente Frecuente</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-extrabold text-[16px] text-gray-900 px-2">Mis Datos</h3>
                  <div className="bg-white border border-gray-100 p-5 rounded-[24px] shadow-sm flex items-start space-x-4">
                    <div className="bg-gray-50 p-2.5 rounded-full"><Icons.MapPinned className="text-gray-900" size={20} /></div>
                    <div className="flex flex-col pt-1">
                      <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">Dirección Activa</span>
                      <span className="font-bold text-[14px] text-gray-900 leading-tight">{user.address || "Cotuí, Centro"}</span>
                    </div>
                  </div>
                </div>

                <button onClick={() => { setUser(null); localStorage.removeItem('kolmard_user'); setView('home'); }} className="w-full py-5 text-red-600 font-extrabold text-[14px] bg-red-50 hover:bg-red-100 border border-red-100 rounded-[24px] flex items-center justify-center space-x-2 transition-colors mt-8">
                  <Icons.LogOut size={18} /><span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="pt-10 px-2 space-y-8">
                <div className="flex flex-col text-left mb-8">
                  <div className="w-16 h-16 bg-black rounded-[20px] flex items-center justify-center text-white text-3xl font-black mb-5 shadow-lg shadow-black/20">K</div>
                  <h2 className="text-3xl font-extrabold text-gray-900 leading-tight tracking-tight">{authMode === 'login' ? 'Inicia sesión\npara comprar' : 'Únete a\nKolmaRD'}</h2>
                  <p className="text-gray-500 text-[14px] mt-2 font-medium">Entregas rápidas y ofertas en Cotuí.</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {authMode === 'register' && (
                    <div className="bg-gray-50 rounded-[20px] flex items-center px-5 py-4 border-2 border-transparent focus-within:border-black focus-within:bg-white transition-all shadow-inner">
                      <Icons.User size={20} className="text-gray-400 mr-3" />
                      <input type="text" placeholder="Nombre completo" className="bg-transparent text-[14px] font-bold w-full outline-none text-gray-900 placeholder:font-medium placeholder:text-gray-400" value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} required />
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-[20px] flex items-center px-5 py-4 border-2 border-transparent focus-within:border-black focus-within:bg-white transition-all shadow-inner">
                    <Icons.Mail size={20} className="text-gray-400 mr-3" />
                    <input type="email" placeholder="Correo electrónico" className="bg-transparent text-[14px] font-bold w-full outline-none text-gray-900 placeholder:font-medium placeholder:text-gray-400" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="bg-gray-50 rounded-[20px] flex items-center px-5 py-4 border-2 border-transparent focus-within:border-black focus-within:bg-white transition-all shadow-inner">
                    <Icons.Lock size={20} className="text-gray-400 mr-3" />
                    <input type={showPassword ? "text" : "password"} placeholder="Contraseña" className="bg-transparent text-[14px] font-bold w-full outline-none text-gray-900 placeholder:font-medium placeholder:text-gray-400" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} required />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-900 ml-2 transition-colors">
                      {showPassword ? <Icons.EyeOff size={20}/> : <Icons.Eye size={20}/>}
                    </button>
                  </div>
                  
                  <button type="submit" className="w-full h-[60px] bg-black text-white rounded-[20px] font-extrabold text-[15px] shadow-[0_10px_20px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-transform mt-8 flex items-center justify-center">
                    {loading ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div> : (authMode === 'login' ? 'Entrar ahora' : 'Crear cuenta')}
                  </button>
                </form>

                <div className="text-center pt-4 border-t border-gray-100">
                  <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-[13px] font-bold text-gray-500 hover:text-black transition-colors">
                    {authMode === 'login' ? '¿Nuevo aquí? Crea una cuenta' : 'Ya tengo cuenta. Iniciar sesión'}
                  </button>
                </div>
              </div>
            )) : null}
          </div>
        )}
      </main>

      {/* RASTREO MAPA PREMIUM UBER EATS STYLE */}
      {view === 'tracking' && (
        <div className="fixed inset-0 z-[180] bg-white flex flex-col animate-fade-in max-w-[480px] mx-auto relative shadow-2xl">
          <div className="absolute top-12 left-4 right-4 z-30 flex justify-between items-center pointer-events-none">
            <button onClick={() => setView('orders')} className="w-12 h-12 bg-white rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.15)] flex items-center justify-center text-black active:scale-90 transition-transform pointer-events-auto">
              <Icons.ArrowLeft size={24} />
            </button>
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md font-extrabold text-[12px] uppercase tracking-widest text-gray-900 pointer-events-auto border border-gray-100">Rastreo en vivo</div>
          </div>
          
          <div className="flex-1 w-full relative z-10"><CotuiMap /></div>
          
          <div className="bg-white rounded-t-[40px] px-8 pt-8 pb-10 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] relative z-20 -mt-8 border-t border-gray-100">
            <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-[13px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Llegada estimada</p>
                <h3 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">12 <span className="text-xl text-gray-500 font-bold">min</span></h3>
              </div>
              <div className="bg-red-50 text-red-600 p-4 rounded-[20px] relative">
                <Icons.CheckCircle2 size={32} />
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full border-2 border-white animate-ping"></div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-[24px] p-5 flex items-center border border-gray-100">
               <div className="w-14 h-14 bg-white rounded-[16px] shadow-sm flex items-center justify-center text-2xl mr-4 border border-gray-100">🛵</div>
               <div className="flex-1">
                 <p className="font-extrabold text-[15px] text-gray-900 leading-tight">Repartidor KolmaRD</p>
                 <p className="text-[13px] text-gray-500 font-medium mt-0.5">Camino a tu dirección</p>
               </div>
               <div className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"><Icons.MapPinned size={18}/></div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE PRODUCTO PREMIUM */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-end sm:items-center sm:justify-center animate-fade-in p-0 sm:p-4">
          <div className="bg-white w-full max-w-[480px] mx-auto rounded-t-[40px] sm:rounded-[32px] overflow-hidden shadow-[0_-20px_60px_rgba(0,0,0,0.2)] animate-slide-up flex flex-col max-h-[90vh]">
            <div className="relative h-[40vh] min-h-[250px] w-full bg-gray-50/50 p-8 flex items-center justify-center shrink-0">
              <img src={selectedProduct.img} className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" alt={selectedProduct.name} />
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 bg-white text-gray-900 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"><Icons.X size={20} /></button>
            </div>
            <div className="p-8 bg-white shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] relative z-10 overflow-y-auto">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-[22px] font-extrabold text-gray-900 leading-tight pr-4">{selectedProduct.name}</h2>
                <div className="text-right shrink-0">
                  {selectedProduct.originalPrice && <span className="text-[12px] text-gray-400 line-through block">RD$ {selectedProduct.originalPrice}</span>}
                  <span className="text-red-600 font-black text-[24px] tracking-tight">RD$ {selectedProduct.price}</span>
                </div>
              </div>
              <p className="text-gray-500 text-[14px] mb-8 leading-relaxed font-medium">{selectedProduct.description}</p>
              <button onClick={() => { addToCart(selectedProduct, !!selectedProduct.originalPrice); setSelectedProduct(null); }} className="w-full bg-black text-white h-[64px] rounded-[24px] font-extrabold text-[16px] shadow-[0_15px_30px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-transform flex items-center justify-center space-x-2">
                <span>Agregar al carrito</span> <span className="opacity-50">•</span> <span>RD$ {selectedProduct.price}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER NAV PREMIUM APP */}
      {view !== 'tracking' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-gray-100/50 px-6 pt-3 pb-8 flex justify-between items-center z-[150] max-w-[480px] mx-auto shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <button onClick={()=>setView('home')} className={`flex flex-col items-center space-y-1.5 transition-colors relative ${view === 'home' ? 'text-black' : 'text-gray-400'}`}>
            <Icons.ShoppingBag size={26} />
            <span className="text-[10px] font-extrabold tracking-wide">Inicio</span>
            {view === 'home' && <span className="absolute -bottom-3 w-1 h-1 bg-black rounded-full"></span>}
          </button>
          
          <button onClick={()=>setView('offers')} className={`flex flex-col items-center space-y-1.5 transition-colors relative ${view === 'offers' ? 'text-black' : 'text-gray-400'}`}>
            <Icons.Tag size={26} />
            <span className="text-[10px] font-extrabold tracking-wide">Ofertas</span>
            {view === 'offers' && <span className="absolute -bottom-3 w-1 h-1 bg-black rounded-full"></span>}
          </button>

          <button onClick={()=>setView('orders')} className={`flex flex-col items-center space-y-1.5 transition-colors relative ${view === 'orders' ? 'text-black' : 'text-gray-400'}`}>
            <Icons.Truck size={26} />
            <span className="text-[10px] font-extrabold tracking-wide">Pedidos</span>
            {view === 'orders' && <span className="absolute -bottom-3 w-1 h-1 bg-black rounded-full"></span>}
          </button>

          <button onClick={() => setView(user ? 'profile' : 'login')} className={`flex flex-col items-center space-y-1.5 transition-colors relative ${view === 'profile' || view === 'login' ? 'text-black' : 'text-gray-400'}`}>
            <Icons.User size={26} />
            <span className="text-[10px] font-extrabold tracking-wide">Perfil</span>
            {(view === 'profile' || view === 'login') && <span className="absolute -bottom-3 w-1 h-1 bg-black rounded-full"></span>}
          </button>
        </nav>
      )}

      {/* BOTON FLOTANTE DE CARRITO PREMIUM */}
      {view !== 'checkout' && view !== 'tracking' && cart.length > 0 && (
        <div className="fixed bottom-28 left-0 right-0 z-[140] px-4 max-w-[480px] mx-auto animate-slide-up">
          <button onClick={() => setView('checkout')} className="w-full bg-black text-white p-4 rounded-[24px] shadow-[0_15px_30px_rgba(0,0,0,0.3)] flex justify-between items-center active:scale-[0.98] transition-transform relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center space-x-4 relative z-10">
              <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-black border border-white/10 backdrop-blur-sm">{cart.reduce((a,c)=>a+c.qty,0)}</div>
              <span className="font-extrabold text-[15px] tracking-wide">Ver canasta</span>
            </div>
            <span className="font-black text-[16px] relative z-10 bg-white text-black px-4 py-2 rounded-full">RD$ {total}</span>
          </button>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { 
          font-family: 'Inter', sans-serif; 
          -webkit-tap-highlight-color: transparent; 
          background-color: #fafafa; /* Fondo gris muy claro para el body detrás del contenedor de la app */
          display: flex;
          justify-content: center;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .leaflet-container { height: 100%; width: 100%; }
        
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        
        .animate-fade-in { animation: fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
