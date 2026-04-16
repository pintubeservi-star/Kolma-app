"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- ICONOGRAFÍA SVG NATIVA (Sin dependencias) ---
const Icons = {
  ShoppingBag: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  ),
  Search: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Plus: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5v14M5 12h14"/></svg>
  ),
  Minus: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/></svg>
  ),
  User: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Tag: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
  ),
  Truck: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10Z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
  ),
  ArrowLeft: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
  ),
  MapPinned: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"/><circle cx="12" cy="8" r="2"/><path d="M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.3 0 .6.2.8s.5.2.8.1l6-2c.3-.1.6-.1.9-.1h3.141"/></svg>
  ),
  CheckCircle2: ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
  ),
  Sparkles: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
  ),
  X: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
  ),
  Mail: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
  Lock: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  Eye: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  EyeOff: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
  ),
  LogOut: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  )
};

const COTUI_CENTER = [19.0531, -70.1491];

// --- COMPONENTE MAPA ---
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
          html: `<div class="w-10 h-10 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-bounce">🛵</div>`,
          iconSize: [40, 40], iconAnchor: [20, 20]
        });
        L.marker([19.055, -70.145], { icon: motoristaIcon }).addTo(map);
        L.marker(COTUI_CENTER, { icon: L.divIcon({ html: `<div class="w-6 h-6 bg-black rounded-full border-2 border-white shadow-lg"></div>`, className: '', iconSize: [24, 24] }) }).addTo(map);
        mapRef.current = map;
      }
    }
  }, []);
  return <div id="map-tracking" className="w-full h-full grayscale-[0.3]" />;
};

export default function KolmaRD() {
  // --- ESTADOS ---
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

  // --- CARGA DE PRODUCTOS (Cerebro Shopify) ---
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
        const formatted = json.data.products.edges.map(({ node }) => ({
          id: node.id,
          name: node.title,
          price: parseFloat(node.variants?.edges?.[0]?.node?.price?.amount || 0),
          img: node.images?.edges?.[0]?.node?.url || 'https://via.placeholder.com/600',
          category: node.productType || 'Otros',
          // Conectamos con el tag "Oferta" de Shopify
          collection: node.tags?.some(tag => tag.toLowerCase().includes('oferta')) ? 'Ofertas' : 'General',
          description: node.description || 'Producto fresco de KolmaRD.'
        }));
        setProducts(formatted);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const addToCart = (p) => {
    const ex = cart.find(i => i.id === p.id);
    const n = ex ? cart.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...cart, { ...p, qty: 1 }];
    setCart(n); 
    localStorage.setItem('kolmard_cart', JSON.stringify(n));
    showToast(`Agregado: ${p.name}`);
  };

  const total = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

  // --- FILTROS DE CATEGORÍA ---
  // Obtenemos categorías únicas de los productos reales para el menú
  const realCategories = useMemo(() => {
    const cats = products.map(p => p.category);
    return ['Todos', ...new Set(cats)];
  }, [products]);

  // --- COMPONENTES DE VISTA ---

  const HomeView = () => (
    <div className="space-y-6 pb-40 animate-fade-in">
      {!searchTerm && (
        <div className="relative h-48 w-full rounded-[40px] overflow-hidden shadow-2xl mt-2 group">
          <img src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=1000" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end">
            <span className="bg-red-600 text-white px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest w-fit mb-3 shadow-lg italic">Cotuí Express</span>
            <h2 className="text-white text-4xl font-black italic tracking-tighter uppercase leading-[0.9]">Fresco.<br />Hoy.<br />KolmaRD.</h2>
          </div>
        </div>
      )}

      {/* SECCIÓN OSCURA: COLECCIÓN DE OFERTAS REALES */}
      {!searchTerm && (
        <div className="bg-[#0D1117] -mx-6 px-6 py-10 rounded-[48px] shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 px-1">
            <div className="flex flex-col">
              <div className="flex items-center space-x-3 mb-2">
                <Icons.Sparkles className="text-red-600" />
                <span className="text-red-500 text-[9px] font-black uppercase tracking-[0.2em]">Exclusivo</span>
              </div>
              <h3 className="text-white font-black text-2xl italic uppercase tracking-tighter leading-none">Ofertas del Súper</h3>
            </div>
            <button onClick={() => setView('offers')} className="text-gray-500 hover:text-white transition-colors"><Icons.Tag size={28}/></button>
          </div>
          <div className="flex space-x-5 overflow-x-auto no-scrollbar pb-2">
            {products.filter(p => p.collection === 'Ofertas').length > 0 ? (
                products.filter(p => p.collection === 'Ofertas').map(p => (
                    <div key={p.id} onClick={() => setSelectedProduct(p)} className="min-w-[170px] bg-white/5 backdrop-blur-md p-5 rounded-[32px] border border-white/10 active:scale-95 transition-all cursor-pointer">
                      <div className="relative rounded-[24px] overflow-hidden mb-4 shadow-xl">
                        <img src={p.img} className="w-full h-32 object-cover" />
                      </div>
                      <p className="text-[11px] font-black text-white/90 truncate uppercase tracking-tight mb-3">{p.name}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-red-600 font-black text-base italic tracking-tighter">RD$ {p.price}</span>
                        <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="bg-white text-black w-9 h-9 rounded-xl flex items-center justify-center shadow-lg active:scale-75"><Icons.Plus size={16}/></button>
                      </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-600 font-black text-[10px] uppercase tracking-widest p-4">Cargando ofertas reales...</p>
            )}
          </div>
        </div>
      )}

      {/* CATEGORÍAS CONECTADAS A SHOPIFY */}
      <div className="flex space-x-3 overflow-x-auto no-scrollbar py-2">
        {realCategories.map(c => (
          <button 
            key={c} 
            onClick={() => setActiveCategory(c)} 
            className={`px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === c ? 'bg-red-600 text-white shadow-2xl scale-105 italic' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* GRID DE PRODUCTOS FILTRADOS */}
      <div className="grid grid-cols-1 gap-5 pt-2">
        {products.filter(p => (activeCategory === 'Todos' || p.category === activeCategory) && p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
          <div key={p.id} onClick={() => setSelectedProduct(p)} className="flex items-center bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer group hover:shadow-xl">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md">
                <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="ml-5 flex-1">
              <h4 className="text-[13px] font-black uppercase tracking-tight text-gray-900 leading-tight mb-1">{p.name}</h4>
              <p className="text-[9px] font-bold text-gray-400 uppercase mb-3 italic tracking-widest">{p.category}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-black text-red-600 italic tracking-tighter leading-none">RD$ {p.price}</span>
                <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="bg-red-600 text-white w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl border-b-4 border-red-800 active:scale-75 transition-all"><Icons.Plus size={20}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-red-600 overflow-x-hidden">
      
      {/* TOAST SYSTEM */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-fade-in">
          <div className="bg-black text-white px-8 py-4 rounded-[24px] shadow-2xl flex items-center space-x-4 border border-white/10">
            <Icons.CheckCircle2 color="#ef4444" size={20} />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">{toast}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      {view !== 'tracking' && (
        <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-2xl px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div onClick={() => setView('home')} className="flex items-center space-x-4 cursor-pointer active:opacity-60 transition-opacity">
              <div className="w-12 h-12 bg-red-600 rounded-[18px] flex items-center justify-center text-white font-black text-2xl italic shadow-2xl">K</div>
              <div className="flex flex-col leading-none">
                <div className="flex items-center space-x-2 mb-1"><Icons.MapPinned size={12} className="text-red-600" /><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Cotuí, Centro</span></div>
                <span className="text-[14px] font-black uppercase tracking-tighter italic text-gray-900 leading-none">KolmaRD Express</span>
              </div>
            </div>
            <div onClick={() => setView('checkout')} className="bg-[#0D1117] text-white px-6 py-2.5 rounded-full flex items-center space-x-3 shadow-2xl cursor-pointer active:scale-95 transition-all border border-white/5">
              <Icons.ShoppingBag size={14} className="text-red-500" />
              <span className="font-black text-[13px] tracking-tighter italic uppercase">RD$ {total.toLocaleString()}</span>
            </div>
          </div>
          <div className="relative">
            <Icons.Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="BUSCA PRODUCTOS FRESCOS..." 
                className="w-full bg-gray-50 py-4 pl-14 pr-6 rounded-[24px] text-[11px] font-black outline-none uppercase tracking-widest border-2 border-transparent focus:border-red-600 focus:bg-white transition-all shadow-inner" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </header>
      )}

      <main className="max-w-md mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center py-64 space-y-8 animate-pulse">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[12px] font-black uppercase tracking-[0.4em] italic text-red-600">Conectando Shopify...</span>
          </div>
        ) : (
          <div className="animate-fade-in">
            {view === 'home' && <HomeView />}
            
            {/* VISTA: OFERTAS (Menú Inferior) */}
            {view === 'offers' && (
              <div className="pt-8 pb-40 space-y-10 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-5">
                        <button onClick={() => setView('home')} className="p-4 bg-gray-50 rounded-3xl"><Icons.ArrowLeft size={24}/></button>
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic text-gray-900">Ofertas de Hoy</h2>
                    </div>
                    <Icons.Sparkles className="text-red-600" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                    {products.filter(p => p.collection === 'Ofertas').map(p => (
                        <div key={p.id} onClick={() => setSelectedProduct(p)} className="bg-white p-4 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-xl active:scale-[0.98] cursor-pointer">
                            <img src={p.img} className="w-full aspect-square rounded-[32px] object-cover mb-4 shadow-md" />
                            <h4 className="text-[11px] font-black uppercase tracking-tight truncate w-full mb-1">{p.name}</h4>
                            <p className="text-red-600 font-black text-lg italic tracking-tighter">RD$ {p.price}</p>
                            <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="mt-4 w-full bg-red-600 text-white py-3 rounded-[20px] font-black uppercase text-[10px] italic shadow-lg active:scale-90 transition-all">Añadir</button>
                        </div>
                    ))}
                </div>
              </div>
            )}

            {view === 'checkout' && (
              <div className="pt-8 pb-40 space-y-10 animate-fade-in">
                <div className="flex items-center space-x-5">
                  <button onClick={() => setView('home')} className="p-4 bg-gray-50 rounded-3xl"><Icons.ArrowLeft size={24}/></button>
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic text-gray-900">Tu Canasta</h2>
                </div>
                <div className="space-y-4">
                  {cart.length === 0 ? (
                      <div className="py-20 text-center text-gray-300 font-black uppercase tracking-[0.3em]">Cesta vacía</div>
                  ) : (
                      cart.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-[32px] border border-gray-100 flex items-center shadow-sm">
                            <img src={item.img} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
                            <div className="ml-5 flex-1">
                                <h4 className="text-[11px] font-black uppercase tracking-tight truncate w-40">{item.name}</h4>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-base font-black text-red-600 italic">RD$ {item.price * item.qty}</span>
                                    <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                                        <button onClick={() => {
                                            const n = cart.map(i => i.id === item.id ? {...i, qty: Math.max(0, i.qty-1)} : i).filter(i => i.qty > 0);
                                            setCart(n); localStorage.setItem('kolmard_cart', JSON.stringify(n));
                                        }} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-600"><Icons.Minus size={14} /></button>
                                        <span className="w-8 text-center text-[11px] font-black">{item.qty}</span>
                                        <button onClick={() => {
                                            const n = cart.map(i => i.id === item.id ? {...i, qty: i.qty+1} : i);
                                            setCart(n); localStorage.setItem('kolmard_cart', JSON.stringify(n));
                                        }} className="w-7 h-7 flex items-center justify-center text-red-600"><Icons.Plus size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                      ))
                  )}
                </div>
                {cart.length > 0 && (
                  <div className="space-y-8">
                    <div className="bg-gray-50 p-8 rounded-[40px] space-y-4 border border-gray-100">
                        <div className="flex justify-between text-gray-500 font-bold text-xs uppercase tracking-widest"><span>Total Pedido</span><span>RD$ {total}</span></div>
                        <div className="flex justify-between text-red-600 font-black text-4xl italic tracking-tighter pt-6 border-t border-gray-200"><span>PAGAR</span><span>RD$ {total}</span></div>
                    </div>
                    <button onClick={() => setView('orders')} className="w-full bg-red-600 text-white h-24 rounded-[40px] font-black uppercase italic shadow-2xl active:scale-95 transition-all text-2xl border-b-[6px] border-red-800 tracking-tighter">Confirmar Pedido</button>
                  </div>
                )}
              </div>
            )}

            {/* VISTA: ÓRDENES */}
            {view === 'orders' && (
              <div className="pt-10 space-y-10 pb-40">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Mis Pedidos</h2>
                <div onClick={() => setView('tracking')} className="bg-white p-10 rounded-[48px] border-2 border-red-600 shadow-2xl cursor-pointer active:scale-[0.98] transition-all group">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-5">
                        <Icons.Truck size={28} className="text-red-600" />
                        <div><span className="text-[11px] font-black uppercase text-gray-400 tracking-widest block mb-1">Orden Activa</span><span className="text-lg font-black uppercase italic text-gray-900 tracking-tight">Rastreo Shipday</span></div>
                    </div>
                    <span className="bg-orange-500 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-pulse">En Camino</span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full transition-all duration-1000" style={{width: '75%'}} />
                  </div>
                </div>
              </div>
            )}

            {/* VISTA: PERFIL */}
            {view === 'profile' && (user ? (
              <div className="pt-12 space-y-12 pb-40 animate-fade-in">
                <div className="flex items-center space-x-8">
                  <div className="w-28 h-28 bg-red-600 rounded-[40px] flex items-center justify-center text-white text-5xl font-black italic shadow-2xl shadow-red-200">{(user.firstName || "K")[0]}</div>
                  <div><h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">{user.firstName}</h2><p className="text-gray-400 font-bold text-sm uppercase tracking-[0.2em] mt-2">{user.email}</p></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-[32px] flex items-center space-x-6">
                    <Icons.MapPinned className="text-red-600" size={24} /><div className="flex flex-col"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Dirección Cotuí</span><span className="font-black text-sm uppercase italic">{user.address || "Centro"}</span></div>
                  </div>
                </div>
                <button onClick={() => { setUser(null); localStorage.removeItem('kolmard_user'); setView('home'); }} className="w-full p-8 text-gray-400 font-black text-[12px] uppercase tracking-[0.3em] bg-gray-50 rounded-[32px] flex items-center justify-center space-x-4 transition-all mt-16 shadow-inner"><Icons.LogOut size={20} /><span>Cerrar Sesión</span></button>
              </div>
            ) : (
              <div className="pt-16 px-2 space-y-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-red-600 rounded-[32px] flex items-center justify-center text-white text-5xl font-black italic shadow-2xl mx-auto mb-8 animate-bounce">K</div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic text-gray-900 leading-none">{authMode === 'login' ? 'Bienvenido a\nKolmaRD' : 'Nueva Cuenta\nPremium'}</h2>
                </div>
                <form onSubmit={handleAuth} className="space-y-6">
                  {authMode === 'register' && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="bg-gray-50 rounded-[28px] flex items-center px-8 py-6 space-x-5 border-2 border-transparent focus-within:border-red-600 transition-all shadow-inner"><Icons.User size={22} className="text-red-600" /><input type="text" placeholder="NOMBRE COMPLETO" className="bg-transparent font-black w-full outline-none uppercase tracking-widest text-sm" value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} /></div>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-[28px] flex items-center px-8 py-6 space-x-5 border-2 border-transparent focus-within:border-red-600 transition-all shadow-inner"><Icons.Mail size={22} className="text-red-600" /><input type="email" placeholder="EMAIL" className="bg-transparent font-black w-full outline-none uppercase tracking-widest text-sm" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} /></div>
                  <div className="bg-gray-50 rounded-[28px] flex items-center px-8 py-6 space-x-5 relative border-2 border-transparent focus-within:border-red-600 transition-all shadow-inner">
                    <Icons.Lock size={22} className="text-red-600" />
                    <input type={showPassword ? "text" : "password"} placeholder="CONTRASEÑA" className="bg-transparent font-black w-full outline-none uppercase tracking-widest text-sm" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="text-gray-300 hover:text-red-600 transition-colors">{showPassword ? <Icons.EyeOff size={22}/> : <Icons.Eye size={22}/>}</button>
                  </div>
                  <button type="submit" className="w-full h-24 bg-red-600 text-white rounded-[40px] font-black uppercase italic shadow-2xl text-2xl border-b-[6px] border-red-800 active:scale-95 transition-all tracking-tighter mt-10">
                    {loading ? 'Cargando...' : authMode === 'login' ? 'Entrar Ahora' : 'Registrarme'}
                  </button>
                </form>
                <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="w-full text-center mt-12 text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] hover:text-red-600 transition-colors">
                  {authMode === 'login' ? '¿NUEVO AQUÍ? REGÍSTRATE' : 'YA TENGO CUENTA'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER NAV PREMIUM */}
      {view !== 'tracking' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-3xl border-t border-gray-50 px-8 py-8 flex justify-between items-center z-[150] pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <button onClick={()=>setView('home')} className={`flex flex-col items-center space-y-2 transition-all ${view === 'home' ? 'text-red-600 scale-125' : 'text-gray-300'}`}><Icons.ShoppingBag size={28} /><span className="text-[10px] font-black uppercase italic tracking-tighter">Inicio</span></button>
          <button onClick={()=>setView('orders')} className={`flex flex-col items-center space-y-2 transition-all ${view === 'orders' ? 'text-red-600 scale-125' : 'text-gray-300'}`}><Icons.Truck size={28} /><span className="text-[10px] font-black uppercase italic tracking-tighter">Pedidos</span></button>
          
          <div className="relative -mt-24">
            <button onClick={()=>setView('checkout')} className="bg-[#0D1117] w-20 h-20 rounded-[32px] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative ring-[12px] ring-white active:scale-90 transition-all border-b-4 border-black group">
              <Icons.ShoppingBag size={34} className="group-hover:text-red-500 transition-colors" />
              {cart.length > 0 && <div className="absolute -top-3 -right-3 bg-red-600 text-[11px] font-black w-7 h-7 rounded-full flex items-center justify-center border-[3px] border-white shadow-xl italic animate-bounce">{cart.length}</div>}
            </button>
          </div>

          <button onClick={()=>setView('offers')} className={`flex flex-col items-center space-y-2 transition-all ${view === 'offers' ? 'text-red-600 scale-125' : 'text-gray-300'}`}><Icons.Tag size={28} /><span className="text-[10px] font-black uppercase italic tracking-tighter">Ofertas</span></button>
          <button onClick={()=>setView('profile')} className={`flex flex-col items-center space-y-2 transition-all ${view === 'profile' ? 'text-red-600 scale-125' : 'text-gray-300'}`}><Icons.User size={28} /><span className="text-[10px] font-black uppercase italic tracking-tighter">Perfil</span></button>
        </nav>
      )}

      {/* RASTREO SHIPDAY */}
      {view === 'tracking' && (
        <div className="fixed inset-0 z-[180] bg-white flex flex-col animate-fade-in">
          <div className="absolute top-14 left-8 right-8 z-10 flex items-center space-x-5">
            <button onClick={() => setView('orders')} className="w-16 h-16 bg-white rounded-[24px] shadow-2xl flex items-center justify-center text-black active:scale-90 transition-transform"><Icons.ArrowLeft size={28} /></button>
            <div className="flex-1 bg-white px-10 h-16 rounded-[24px] shadow-2xl flex items-center border border-gray-100"><span className="text-[12px] font-black uppercase tracking-[0.4em] italic text-gray-900">Shipday Live</span></div>
          </div>
          <div className="flex-1 w-full"><CotuiMap /></div>
          <div className="bg-white rounded-t-[64px] px-12 pt-12 pb-16 shadow-2xl relative z-20">
            <div className="w-20 h-2 bg-gray-100 rounded-full mx-auto mb-12"></div>
            <h3 className="text-4xl font-black italic uppercase text-red-600 tracking-tighter leading-none mb-8">Llega en 12 min</h3>
            <div className="flex items-center space-x-8"><Icons.CheckCircle2 size={28} color="#dc2626" /><span className="text-sm font-black uppercase italic text-gray-900">Camino a tu casa en Cotuí</span></div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE PRODUCTO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-end animate-fade-in">
          <div className="bg-white w-full max-w-lg mx-auto rounded-t-[56px] overflow-hidden shadow-2xl">
            <div className="relative h-96 w-full">
              <img src={selectedProduct.img} className="w-full h-full object-cover" alt={selectedProduct.name} />
              <button onClick={() => setSelectedProduct(null)} className="absolute top-10 right-10 bg-black/20 backdrop-blur-xl text-white p-4 rounded-full hover:bg-red-600 transition-colors"><Icons.X size={28} /></button>
            </div>
            <div className="px-12 pb-16 pt-10">
              <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-[0.8]">{selectedProduct.name}</h2>
              <div className="mt-4 flex items-center space-x-3 text-red-600 font-black italic text-3xl tracking-tighter"><span>RD$ {selectedProduct.price}</span></div>
              <p className="text-gray-500 text-[13px] font-bold uppercase tracking-wide mt-8 italic leading-relaxed border-l-8 border-red-50 pl-6">{selectedProduct.description}</p>
              <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="w-full bg-red-600 text-white h-24 rounded-[40px] font-black uppercase mt-12 italic shadow-2xl text-2xl border-b-[6px] border-red-800 active:scale-95 transition-all tracking-tighter">Agregar a mi canasta</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-tap-highlight-color: transparent; background-color: #fff; overflow-x: hidden; color: #0D1117; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .leaflet-container { height: 100%; width: 100%; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </div>
  );
}
