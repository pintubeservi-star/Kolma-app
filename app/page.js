"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- ICONOGRAFÍA SVG NATIVA ---
const Icons = {
  ShoppingBag: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Search: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Plus: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5v14M5 12h14"/></svg>,
  Minus: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/></svg>,
  User: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Tag: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>,
  Truck: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10Z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>,
  ArrowLeft: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  MapPinned: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"/><circle cx="12" cy="8" r="2"/><path d="M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.3 0 .6.2.8s.5.2.8.1l6-2c.3-.1.6-.1.9-.1h3.141"/></svg>,
  CheckCircle2: ({ size = 24, color = "currentColor", className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
  Sparkles: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  X: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Mail: ({ size = 20, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Lock: ({ size = 20, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Eye: ({ size = 18, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: ({ size = 18, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
  LogOut: ({ size = 18, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  CreditCard: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>,
  Banknote: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
};

const COTUI_CENTER = [19.0531, -70.1491];

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
          html: `<div class="w-8 h-8 bg-red-600 rounded-full border-2 border-white shadow-md flex items-center justify-center animate-bounce text-sm">🛵</div>`,
          iconSize: [32, 32], iconAnchor: [16, 16]
        });
        L.marker([19.055, -70.145], { icon: motoristaIcon }).addTo(map);
        L.marker(COTUI_CENTER, { icon: L.divIcon({ html: `<div class="w-4 h-4 bg-black rounded-full border-2 border-white shadow-md"></div>`, className: '', iconSize: [16, 16] }) }).addTo(map);
        mapRef.current = map;
      }
    }
  }, []);
  return <div id="map-tracking" className="w-full h-full grayscale-[0.2]" />;
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
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' o 'card'

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
        showToast(authMode === 'login' ? '¡Bienvenido de vuelta!' : 'Cuenta creada con éxito');
      } else {
        showToast(data.error || 'Error en la autenticación');
      }
    } catch (error) {
      showToast('Error de conexión al servidor');
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
          .filter(({ node }) => {
            const tags = node.tags || [];
            return !tags.some(tag => tag.toLowerCase() === 'pos');
          })
          .map(({ node }) => ({
            id: node.id,
            name: node.title,
            price: parseFloat(node.variants?.edges?.[0]?.node?.price?.amount || 0),
            img: node.images?.edges?.[0]?.node?.url || 'https://via.placeholder.com/600',
            category: node.collections?.edges?.[0]?.node?.title || node.productType || 'Otros',
            collection: node.tags?.some(tag => tag.toLowerCase().includes('oferta')) ? 'Ofertas' : 'General',
            description: node.description || 'Producto fresco de KolmaRD.'
          }));
        setProducts(formatted);
      }
    } catch (e) { 
        console.error(e); 
        showToast('Error cargando productos');
    } finally { 
        setLoading(false); 
    }
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

  const realCategories = useMemo(() => {
    const cats = products.map(p => p.category);
    return ['Todos', ...new Set(cats)];
  }, [products]);

  const HomeView = () => (
    <div className="space-y-6 pb-24 animate-fade-in">
      {!searchTerm && (
        <div className="relative h-40 w-full rounded-2xl overflow-hidden shadow-sm mt-2 group">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 flex flex-col justify-end">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold w-fit mb-2 shadow-sm">Entrega Rápida</span>
            <h2 className="text-white text-2xl font-bold leading-tight">Supermercado<br/>a tu puerta</h2>
          </div>
        </div>
      )}

      {/* SECCIÓN OFERTAS - ESTILO DARK PREMIUM */}
      {!searchTerm && (
        <div className="bg-[#1a1a1a] -mx-4 px-4 py-6 rounded-2xl shadow-md relative overflow-hidden">
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Icons.Sparkles size={16} className="text-red-500" />
                <span className="text-red-500 text-xs font-bold uppercase tracking-wider">Exclusivo</span>
              </div>
              <h3 className="text-white font-bold text-xl">Ofertas de Hoy</h3>
            </div>
            <button onClick={() => setView('offers')} className="text-gray-400 hover:text-white text-sm font-medium">Ver todo</button>
          </div>
          
          <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
            {products.filter(p => p.collection === 'Ofertas').length > 0 ? (
                products.filter(p => p.collection === 'Ofertas').slice(0,5).map(p => (
                    <div key={p.id} onClick={() => setSelectedProduct(p)} className="min-w-[140px] bg-[#2a2a2a] p-3 rounded-xl border border-white/5 active:scale-95 transition-all cursor-pointer">
                      <div className="relative rounded-lg overflow-hidden mb-3 aspect-square bg-white">
                        <img src={p.img} className="w-full h-full object-contain mix-blend-multiply p-2" />
                        <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">- %</div>
                      </div>
                      <p className="text-sm font-medium text-white/90 truncate mb-1">{p.name}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-red-400 font-bold text-sm">RD$ {p.price}</span>
                        <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="bg-white/10 hover:bg-white/20 text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors"><Icons.Plus size={14}/></button>
                      </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-400 text-sm py-2">Buscando ofertas...</p>
            )}
          </div>
        </div>
      )}

      {/* CATEGORÍAS TIPO PILL */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1 sticky top-[72px] bg-white z-40 -mx-4 px-4 pb-3">
        {realCategories.map(c => (
          <button 
            key={c} 
            onClick={() => setActiveCategory(c)} 
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === c ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* LISTA DE PRODUCTOS - ESTILO PEDIDOSYA/UBER EATS */}
      <div className="flex flex-col space-y-4 pt-2">
        {products.filter(p => (activeCategory === 'Todos' || p.category === activeCategory) && p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
          <div key={p.id} onClick={() => setSelectedProduct(p)} className="flex items-center bg-white p-0 active:opacity-70 transition-opacity cursor-pointer group border-b border-gray-100 pb-4">
            <div className="flex-1 pr-4">
              <h4 className="text-base font-semibold text-gray-900 leading-tight mb-1">{p.name}</h4>
              <p className="text-xs text-gray-500 mb-2 line-clamp-2">{p.description}</p>
              <span className="text-base font-bold text-gray-900">RD$ {p.price}</span>
            </div>
            <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <img src={p.img} className="w-full h-full object-contain p-2 mix-blend-multiply" />
                <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="absolute bottom-2 right-2 bg-white text-black w-8 h-8 rounded-full flex items-center justify-center shadow-md border border-gray-100 active:scale-90 transition-all"><Icons.Plus size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-red-200 overflow-x-hidden max-w-md mx-auto relative shadow-2xl">
      
      {/* TOAST SYSTEM */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] animate-fade-in w-[90%] max-w-sm">
          <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center space-x-3">
            <Icons.CheckCircle2 color="#4ade80" size={18} />
            <span className="text-sm font-medium">{toast}</span>
          </div>
        </div>
      )}

      {/* HEADER TIPO APP */}
      {view !== 'tracking' && view !== 'login' && view !== 'profile' && (
        <header className="sticky top-0 z-[100] bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div onClick={() => setView('home')} className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">K</div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider flex items-center"><Icons.MapPinned size={10} className="mr-1"/> Entregar en</span>
                <span className="text-sm font-semibold text-gray-900 flex items-center">Cotuí, Centro <Icons.Search size={14} className="ml-1 text-gray-400 rotate-90"/></span>
              </div>
            </div>
          </div>
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Buscar en KolmaRD..." 
                className="w-full bg-gray-100 py-2.5 pl-10 pr-4 rounded-xl text-sm font-medium outline-none focus:bg-gray-200 transition-colors" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </header>
      )}

      <main className="px-4 h-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-500">Cargando KolmaRD...</span>
          </div>
        ) : (
          <div className="animate-fade-in">
            {view === 'home' && <HomeView />}
            
            {/* VISTA: OFERTAS */}
            {view === 'offers' && (
              <div className="pt-6 pb-24 space-y-6">
                <div className="flex items-center space-x-3">
                    <button onClick={() => setView('home')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><Icons.ArrowLeft size={20}/></button>
                    <h2 className="text-2xl font-bold text-gray-900">Ofertas de Hoy</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {products.filter(p => p.collection === 'Ofertas').map(p => (
                        <div key={p.id} onClick={() => setSelectedProduct(p)} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col active:scale-95 transition-all cursor-pointer">
                            <div className="bg-gray-50 rounded-lg p-2 mb-3">
                              <img src={p.img} className="w-full aspect-square object-contain mix-blend-multiply" />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{p.name}</h4>
                            <p className="text-red-600 font-bold text-base mt-auto">RD$ {p.price}</p>
                            <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="mt-3 w-full bg-red-100 text-red-700 py-2 rounded-lg font-bold text-xs hover:bg-red-200 transition-colors">Agregar</button>
                        </div>
                    ))}
                </div>
              </div>
            )}

            {/* VISTA: CHECKOUT */}
            {view === 'checkout' && (
              <div className="pt-6 pb-32 space-y-6">
                <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
                  <button onClick={() => setView('home')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><Icons.ArrowLeft size={20}/></button>
                  <h2 className="text-xl font-bold text-gray-900">Tu Pedido</h2>
                </div>
                
                <div className="space-y-4">
                  {cart.length === 0 ? (
                      <div className="py-12 flex flex-col items-center text-gray-400">
                        <Icons.ShoppingBag size={48} className="mb-4 opacity-50"/>
                        <p className="text-base font-medium">Tu canasta está vacía</p>
                        <button onClick={() => setView('home')} className="mt-4 text-red-600 font-bold text-sm">Explorar productos</button>
                      </div>
                  ) : (
                      cart.map(item => (
                        <div key={item.id} className="flex items-center py-2 border-b border-gray-50">
                            <div className="w-16 h-16 bg-gray-50 rounded-lg p-1 mr-3 flex-shrink-0">
                              <img src={item.img} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                                <span className="text-sm font-bold text-gray-900 mt-1 block">RD$ {item.price * item.qty}</span>
                            </div>
                            <div className="flex items-center bg-gray-100 rounded-full p-1 ml-2">
                                <button onClick={() => {
                                    const n = cart.map(i => i.id === item.id ? {...i, qty: Math.max(0, i.qty-1)} : i).filter(i => i.qty > 0);
                                    setCart(n); localStorage.setItem('kolmard_cart', JSON.stringify(n));
                                }} className="w-7 h-7 flex items-center justify-center text-gray-600"><Icons.Minus size={14} /></button>
                                <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                                <button onClick={() => {
                                    const n = cart.map(i => i.id === item.id ? {...i, qty: i.qty+1} : i);
                                    setCart(n); localStorage.setItem('kolmard_cart', JSON.stringify(n));
                                }} className="w-7 h-7 flex items-center justify-center text-gray-600"><Icons.Plus size={14} /></button>
                            </div>
                        </div>
                      ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="space-y-6 pt-4">
                    {/* METODOS DE PAGO */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-gray-900">Método de Pago</h3>
                      
                      {/* Opción Efectivo */}
                      <div 
                        onClick={() => setPaymentMethod('cash')}
                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-red-600 bg-red-50' : 'border-gray-200 bg-white'}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${paymentMethod === 'cash' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                          <Icons.Banknote size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900">Pago contra entrega</p>
                          <p className="text-xs text-gray-500">Efectivo o transferencia al recibir</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-red-600' : 'border-gray-300'}`}>
                          {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                        </div>
                      </div>

                      {/* Opción Tarjeta (Deshabilitada) */}
                      <div className="flex items-center p-4 rounded-xl border-2 border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4 text-gray-400">
                          <Icons.CreditCard size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-500">Pago con tarjeta</p>
                          <p className="text-xs text-red-500 font-medium">No disponible por el momento</p>
                        </div>
                      </div>
                    </div>

                    {/* RESUMEN Y BOTÓN */}
                    <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between text-gray-500 text-sm"><span>Subtotal</span><span>RD$ {total}</span></div>
                        <div className="flex justify-between text-gray-500 text-sm"><span>Envío</span><span className="text-green-600 font-medium">Gratis</span></div>
                        <div className="flex justify-between text-gray-900 font-bold text-lg pt-2 border-t border-gray-200 mt-2"><span>Total</span><span>RD$ {total}</span></div>
                    </div>
                    
                    <button onClick={() => {
                        if (!user) { setView('login'); return; }
                        setView('tracking');
                        setCart([]); localStorage.removeItem('kolmard_cart');
                    }} className="w-full bg-red-600 text-white h-14 rounded-xl font-bold text-base active:scale-95 transition-transform flex items-center justify-center">
                      Hacer pedido • RD$ {total}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* VISTA: ÓRDENES */}
            {view === 'orders' && (
              <div className="pt-6 space-y-6 pb-24">
                <h2 className="text-2xl font-bold text-gray-900">Mis Pedidos</h2>
                <div onClick={() => setView('tracking')} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm cursor-pointer active:scale-95 transition-transform group relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                  <div className="flex justify-between items-center mb-4 pl-2">
                    <div className="flex items-center space-x-3">
                        <div className="bg-red-50 p-2 rounded-full text-red-600"><Icons.Truck size={20} /></div>
                        <div>
                          <span className="text-xs font-bold uppercase text-gray-400 tracking-wider block">Activo ahora</span>
                          <span className="text-sm font-bold text-gray-900">Pedido en curso</span>
                        </div>
                    </div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">En Camino</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden ml-2">
                    <div className="h-full bg-red-500 rounded-full w-[75%]" />
                  </div>
                </div>
              </div>
            )}

            {/* VISTA: PERFIL / LOGIN */}
            {view === 'profile' || view === 'login' ? (user ? (
              <div className="pt-8 space-y-8 pb-24 px-2">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white text-2xl font-bold">{(user.firstName || "K")[0]}</div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{user.firstName}</h2>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-gray-50 p-4 rounded-xl flex items-center space-x-4">
                    <Icons.MapPinned className="text-gray-400" size={20} />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500">Dirección de entrega</span>
                      <span className="font-semibold text-sm text-gray-900">{user.address || "Cotuí, Centro"}</span>
                    </div>
                  </div>
                </div>

                <button onClick={() => { setUser(null); localStorage.removeItem('kolmard_user'); setView('home'); }} className="w-full py-4 text-red-600 font-bold text-sm bg-red-50 rounded-xl flex items-center justify-center space-x-2 transition-colors hover:bg-red-100 mt-8">
                  <Icons.LogOut size={18} /><span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="pt-16 px-4 space-y-8 max-w-sm mx-auto">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">K</div>
                  <h2 className="text-2xl font-bold text-gray-900">{authMode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}</h2>
                  <p className="text-gray-500 text-sm mt-2">Para disfrutar de entregas rápidas en Cotuí</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {authMode === 'register' && (
                    <div className="bg-gray-50 rounded-xl flex items-center px-4 py-3 border border-gray-200 focus-within:border-black focus-within:bg-white transition-colors">
                      <Icons.User size={18} className="text-gray-400 mr-3" />
                      <input type="text" placeholder="Nombre completo" className="bg-transparent text-sm font-medium w-full outline-none text-gray-900" value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} required />
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-xl flex items-center px-4 py-3 border border-gray-200 focus-within:border-black focus-within:bg-white transition-colors">
                    <Icons.Mail size={18} className="text-gray-400 mr-3" />
                    <input type="email" placeholder="Correo electrónico" className="bg-transparent text-sm font-medium w-full outline-none text-gray-900" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="bg-gray-50 rounded-xl flex items-center px-4 py-3 border border-gray-200 focus-within:border-black focus-within:bg-white transition-colors">
                    <Icons.Lock size={18} className="text-gray-400 mr-3" />
                    <input type={showPassword ? "text" : "password"} placeholder="Contraseña" className="bg-transparent text-sm font-medium w-full outline-none text-gray-900" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} required />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 ml-2">
                      {showPassword ? <Icons.EyeOff size={18}/> : <Icons.Eye size={18}/>}
                    </button>
                  </div>
                  
                  <button type="submit" className="w-full h-12 bg-black text-white rounded-xl font-bold text-sm active:scale-95 transition-transform mt-6 flex items-center justify-center">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (authMode === 'login' ? 'Continuar' : 'Registrarme')}
                  </button>
                </form>

                <div className="text-center">
                  <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                    {authMode === 'login' ? '¿No tienes cuenta? Regístrate' : 'Ya tengo cuenta. Iniciar sesión'}
                  </button>
                </div>
              </div>
            )) : null}
          </div>
        )}
      </main>

      {/* FOOTER NAV ESTILO APP */}
      {view !== 'tracking' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-[150] pb-6 max-w-md mx-auto">
          <button onClick={()=>setView('home')} className={`flex flex-col items-center space-y-1 transition-colors ${view === 'home' ? 'text-black' : 'text-gray-400'}`}>
            <Icons.ShoppingBag size={24} />
            <span className="text-[10px] font-medium">Inicio</span>
          </button>
          
          <button onClick={()=>setView('offers')} className={`flex flex-col items-center space-y-1 transition-colors ${view === 'offers' ? 'text-black' : 'text-gray-400'}`}>
            <Icons.Tag size={24} />
            <span className="text-[10px] font-medium">Ofertas</span>
          </button>

          <button onClick={()=>setView('orders')} className={`flex flex-col items-center space-y-1 transition-colors ${view === 'orders' ? 'text-black' : 'text-gray-400'}`}>
            <Icons.Truck size={24} />
            <span className="text-[10px] font-medium">Pedidos</span>
          </button>

          <button onClick={() => setView(user ? 'profile' : 'login')} className={`flex flex-col items-center space-y-1 transition-colors ${view === 'profile' || view === 'login' ? 'text-black' : 'text-gray-400'}`}>
            <Icons.User size={24} />
            <span className="text-[10px] font-medium">Perfil</span>
          </button>
        </nav>
      )}

      {/* RASTREO MAPA (ESTILO UBER EATS) */}
      {view === 'tracking' && (
        <div className="fixed inset-0 z-[180] bg-white flex flex-col animate-fade-in max-w-md mx-auto relative">
          <button onClick={() => setView('orders')} className="absolute top-12 left-4 z-30 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-black active:scale-90 transition-transform">
            <Icons.ArrowLeft size={20} />
          </button>
          
          <div className="flex-1 w-full relative z-10"><CotuiMap /></div>
          
          <div className="bg-white rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-20 -mt-6">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">12 min</h3>
                <p className="text-sm font-medium text-gray-500">Hora de llegada estimada</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full"><Icons.CheckCircle2 size={24} color="#16a34a" /></div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 flex items-center">
               <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl mr-4">🛵</div>
               <div className="flex-1">
                 <p className="font-bold text-sm text-gray-900">Repartidor KolmaRD</p>
                 <p className="text-xs text-gray-500">Motor en camino</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE PRODUCTO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-end animate-fade-in sm:items-center sm:justify-center">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
            <div className="relative h-64 w-full bg-gray-50 p-6 flex items-center justify-center">
              <img src={selectedProduct.img} className="max-w-full max-h-full object-contain mix-blend-multiply" alt={selectedProduct.name} />
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 bg-white text-gray-900 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"><Icons.X size={20} /></button>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedProduct.name}</h2>
              <span className="text-red-600 font-bold text-xl block mb-4">RD$ {selectedProduct.price}</span>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">{selectedProduct.description}</p>
              <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="w-full bg-black text-white h-14 rounded-xl font-bold text-sm active:scale-95 transition-transform flex items-center justify-center">
                Agregar pedido • RD$ {selectedProduct.price}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTON FLOTANTE DE CARRITO (CUANDO HAY ITEMS) */}
      {view !== 'checkout' && view !== 'tracking' && cart.length > 0 && (
        <div className="fixed bottom-24 left-0 right-0 z-[140] px-4 max-w-md mx-auto animate-fade-in">
          <button onClick={() => setView('checkout')} className="w-full bg-red-600 text-white p-4 rounded-xl shadow-lg flex justify-between items-center active:scale-95 transition-transform">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">{cart.length}</div>
              <span className="font-bold text-sm">Ver canasta</span>
            </div>
            <span className="font-bold text-sm">RD$ {total}</span>
          </button>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; -webkit-tap-highlight-color: transparent; background-color: #f3f4f6; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .leaflet-container { height: 100%; width: 100%; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
