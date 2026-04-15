```react
"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, ShoppingBag, User, MapPin, Clock, Star, Plus, Minus, X, 
  CheckCircle, TrendingUp, Flame, LogOut, Navigation, ChevronRight, 
  Tag, Zap, Phone, MessageSquare, Sparkles, ArrowRight, ShieldCheck, Activity
} from 'lucide-react';

// --- ICONOS SVG PERSONALIZADOS ---
const CategoryIcons = {
  Lacteos: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M6 18h12l1-9H5l1 9z" /><path d="M10 6h4l.5 3h-5L10 6z" /><circle cx="12" cy="14" r="2" />
    </svg>
  ),
  Frutas: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 3a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Carnes: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M15 5c0 3.5-2.5 4.5-5 4.5s-5-1-5-4.5 2.24-4 5-4 5 .5 5 4z" /><path d="M15 5c0 4-4 15-4 15s-6-11-6-15" /><line x1="10" y1="2" x2="10" y2="8" />
    </svg>
  ),
  Panaderia: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M3 13c3.5-3 14.5-3 18 0" /><path d="M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6" /><path d="M12 13v8" /><path d="M8 13v8" /><path d="M16 13v8" />
    </svg>
  ),
  Despensa: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <rect x="5" y="6" width="14" height="15" rx="2" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><line x1="5" y1="10" x2="19" y2="10" /><line x1="5" y1="15" x2="19" y2="15" />
    </svg>
  ),
  Bebidas: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M7 21h10" /><path d="M12 21V7" /><path d="M6 7h12l-1 11H7L6 7z" /><path d="M12 3v4" /><path d="M10 3h4" />
    </svg>
  )
};

const MAP_CENTER = [19.0528, -70.1492];

export default function KolmaRD() {
  const [view, setView] = useState('home');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showUpsell, setShowUpsell] = useState(null);

  // Catálogo Mock
  const products = [
    { id: '1', name: 'Leche Rica Entera 1L', price: 78.00, oldPrice: 95.0, category: 'Lácteos', image: 'https://images.unsplash.com/photo-1563636619-e9107da5a1bb?auto=format&fit=crop&w=300', upsellId: '4', weight: '1L' },
    { id: '2', name: 'Aguacate Hass Cotuí', price: 45.00, oldPrice: 65.0, category: 'Frutas y Verduras', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=300', upsellId: '3', weight: 'Unidad' },
    { id: '3', name: 'Pechuga Pollo Premium', price: 185.00, oldPrice: 230.0, category: 'Carnes', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=300', weight: '1lb' },
    { id: '4', name: 'Pan Sobao Fresco', price: 55.00, oldPrice: 75.0, category: 'Panadería', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300', upsellId: '1', weight: 'Funda' },
    { id: '5', name: 'Arroz Kolma Selecto 5lb', price: 160.00, oldPrice: 195.0, category: 'Despensa', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300', weight: '5lb' },
    { id: '6', name: 'Detergente Líquido 2L', price: 350.00, oldPrice: 425.0, category: 'Limpieza', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300', weight: '2L' },
  ];

  // Social Proof System
  useEffect(() => {
    const names = ['Ana', 'Juan', 'Rosa', 'Junior'];
    const items = ['leche rica', 'pan sobao', 'aguacates'];
    const interval = setInterval(() => {
      setToast({
        title: `${names[Math.floor(Math.random()*names.length)]} en Cotuí`,
        desc: `Acaba de comprar ${items[Math.floor(Math.random()*items.length)]}`,
      });
      setTimeout(() => setToast(null), 5000);
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      (activeCategory === 'Todos' || p.category === activeCategory) &&
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, activeCategory]);

  const addToCart = (product, isUpsell = false) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    if (!isUpsell && product.upsellId) {
      setShowUpsell(products.find(p => p.id === product.upsellId));
    } else {
      setShowUpsell(null);
    }
  };

  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

  // Mapa de Seguimiento
  const TrackingMap = () => {
    useEffect(() => {
      if (!window.L || !document.getElementById('map-live')) return;
      const map = window.L.map('map-live', { zoomControl: false }).setView(MAP_CENTER, 16);
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);
      const icon = window.L.divIcon({
        html: `<div class="marker-pin">🛵</div>`,
        className: 'custom-icon', iconSize: [40, 40]
      });
      window.L.marker(MAP_CENTER, { icon }).addTo(map);
      return () => map.remove();
    }, []);
    return <div id="map-live" className="w-full h-full min-h-[400px]" />;
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      
      {/* Notificación Social */}
      {toast && (
        <div className="fixed top-28 left-6 z-[100] bg-white shadow-2xl rounded-3xl p-5 border border-orange-100 flex items-center gap-4 animate-in slide-in-from-left-10">
          <div className="w-12 h-12 bg-gradient-to-br from-kolma-red to-kolma-orange rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
            <ShoppingBasket size={24} />
          </div>
          <div>
            <p className="text-xs font-black leading-none mb-1">{toast.title}</p>
            <p className="text-[11px] text-gray-500 font-bold">{toast.desc}</p>
          </div>
        </div>
      )}

      {/* Header Premium */}
      <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-2xl border-b border-gray-50 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div onClick={() => setView('home')} className="flex items-center gap-3 cursor-pointer">
            <div className="bg-gradient-to-br from-kolma-red to-kolma-orange text-white w-14 h-14 rounded-[22px] flex items-center justify-center font-black text-3xl shadow-xl shadow-red-200">K</div>
            <div className="hidden sm:block">
              <h1 className="font-black text-2xl tracking-tighter leading-none">Kolma<span className="text-kolma-red">RD</span></h1>
              <span className="text-[10px] font-black uppercase tracking-[2px] text-orange-500 opacity-80">Premium</span>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-8 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Lo mejor de Cotuí en un click..." 
            className="w-full bg-gray-100/50 rounded-full py-4 pl-14 pr-6 font-bold outline-none border-2 border-transparent focus:border-kolma-orange transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('cart')} 
            className="bg-gradient-to-r from-kolma-red to-kolma-orange text-white px-8 py-4 rounded-[28px] flex items-center gap-4 shadow-2xl shadow-red-100 active:scale-95 transition-all"
          >
            <ShoppingBag size={24} />
            <span className="font-black text-xl border-l border-white/20 pl-4">RD$ {subtotal.toFixed(0)}</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">
        {view === 'home' && (
          <div className="space-y-16 animate-in fade-in duration-700">
            {/* Banners Estilo Uber */}
            {!searchTerm && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 relative h-80 bg-slate-900 rounded-[56px] overflow-hidden p-14 flex items-center group cursor-pointer shadow-2xl border border-white/5">
                  <div className="z-10 text-white max-w-lg">
                    <div className="bg-kolma-red px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-6 w-fit">Kolma Express</div>
                    <h2 className="text-6xl font-black mb-6 tracking-tighter leading-none">Frescura <br/> <span className="text-kolma-orange">Sin Esperas.</span></h2>
                    <button className="bg-white text-black px-8 py-4 rounded-3xl font-black flex items-center gap-3">Explorar Menú <ArrowRight size={20}/></button>
                  </div>
                  <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800" className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000" />
                </div>
                <div className="bg-gradient-to-br from-kolma-red to-kolma-orange rounded-[56px] p-12 text-white shadow-2xl flex flex-col justify-between">
                  <h3 className="text-4xl font-black tracking-tighter leading-tight">Envío Gratis <br/> en Cotuí</h3>
                  <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Cupón</p>
                    <p className="font-black text-2xl tracking-tighter">KOLMA-PREMIUM</p>
                  </div>
                </div>
              </div>
            )}

            {/* Categorías SVG */}
            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
              {['Todos', 'Lácteos', 'Frutas y Verduras', 'Carnes', 'Panadería', 'Despensa', 'Bebidas'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`flex flex-col items-center gap-4 p-8 min-w-[140px] rounded-[44px] transition-all border-4 ${activeCategory === cat ? 'bg-white border-kolma-red shadow-2xl -translate-y-2' : 'bg-white border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <div className={`p-4 rounded-3xl ${activeCategory === cat ? 'bg-orange-50 text-kolma-red' : 'bg-gray-50 text-gray-400'}`}>
                    {cat === 'Lácteos' ? <CategoryIcons.Lacteos /> : 
                     cat === 'Frutas y Verduras' ? <CategoryIcons.Frutas /> : 
                     cat === 'Carnes' ? <CategoryIcons.Carnes /> : 
                     cat === 'Panadería' ? <CategoryIcons.Panaderia /> : 
                     cat === 'Despensa' ? <CategoryIcons.Despensa /> : 
                     cat === 'Bebidas' ? <CategoryIcons.Bebidas /> : <ShoppingBag size={32}/>}
                  </div>
                  <span className={`text-[11px] font-black uppercase tracking-[2px] text-center ${activeCategory === cat ? 'text-kolma-red' : 'text-slate-400'}`}>{cat}</span>
                </button>
              ))}
            </div>

            {/* Grid de Productos */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-16">
              {filteredProducts.map(p => (
                <div key={p.id} className="group relative flex flex-col">
                  <div className="relative aspect-square rounded-[50px] bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 mb-6 cursor-pointer">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-5 left-5">
                       <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-[10px] font-black shadow-lg flex items-center gap-2 border border-white/50">
                         <Flame size={14} className="text-red-500 animate-bounce" /> Populares
                       </div>
                    </div>
                    <button 
                      onClick={() => addToCart(p)}
                      className="absolute bottom-5 right-5 bg-black text-white p-5 rounded-[28px] opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all shadow-2xl hover:bg-kolma-red"
                    >
                      <Plus size={28} strokeWidth={3} />
                    </button>
                  </div>
                  <div className="px-3">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">{p.category} • {p.weight}</p>
                    <h4 className="font-bold text-lg leading-tight truncate mb-3 group-hover:text-kolma-red transition-colors">{p.name}</h4>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-3xl tracking-tighter">RD$ {p.price.toFixed(0)}</span>
                      <span className="text-sm text-gray-300 line-through font-bold">RD$ {p.oldPrice.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-4xl mx-auto bg-white rounded-[64px] p-16 shadow-2xl animate-in slide-in-from-bottom-20">
             <h2 className="text-5xl font-black tracking-tighter mb-12">Mi Canasta</h2>
             {cart.length === 0 ? (
               <div className="text-center py-20">
                 <p className="text-gray-300 font-black text-2xl mb-10">Nada por aquí aún</p>
                 <button onClick={() => setView('home')} className="bg-black text-white px-12 py-6 rounded-3xl font-black">Empezar Compra</button>
               </div>
             ) : (
               <div className="space-y-8">
                 {cart.map(item => (
                   <div key={item.id} className="flex items-center gap-8 p-6 rounded-[40px] hover:bg-orange-50/20 transition-all border-2 border-transparent hover:border-orange-50">
                     <img src={item.image} className="w-24 h-24 rounded-3xl object-cover shadow-xl shadow-black/5" />
                     <div className="flex-1">
                       <h4 className="font-black text-2xl tracking-tighter">{item.name}</h4>
                       <p className="text-kolma-red font-black text-xl">RD$ {item.price.toFixed(0)}</p>
                     </div>
                     <div className="flex items-center gap-6 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <button onClick={() => {
                           setCart(prev => prev.map(i => i.id === item.id ? {...i, qty: Math.max(0, i.qty - 1)} : i).filter(i => i.qty > 0));
                        }} className="w-10 h-10 flex items-center justify-center hover:bg-red-50 rounded-xl transition-all"><Minus/></button>
                        <span className="font-black text-2xl w-6 text-center">{item.qty}</span>
                        <button onClick={() => addToCart(item, true)} className="w-10 h-10 flex items-center justify-center hover:bg-orange-50 rounded-xl transition-all"><Plus/></button>
                     </div>
                   </div>
                 ))}
                 <div className="mt-12 pt-12 border-t-8 border-gray-50 flex justify-between items-center">
                    <div>
                       <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total hoy</p>
                       <h3 className="text-6xl font-black tracking-tighter">RD$ {subtotal.toFixed(0)}</h3>
                    </div>
                    <button 
                      onClick={() => setView('tracking')}
                      className="bg-gradient-to-r from-kolma-red to-kolma-orange text-white px-20 py-8 rounded-[40px] font-black text-3xl shadow-2xl hover:scale-105 transition-all"
                    >
                      Pagar Pedido
                    </button>
                 </div>
               </div>
             )}
          </div>
        )}

        {view === 'tracking' && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in zoom-in-95">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white rounded-[64px] p-16 shadow-2xl border border-gray-50">
                   <div className="flex items-center gap-8 mb-16">
                      <div className="w-20 h-20 bg-green-50 text-green-500 rounded-[30px] flex items-center justify-center shadow-lg shadow-green-50">
                         <ShieldCheck size={40} strokeWidth={2.5} />
                      </div>
                      <div>
                         <h2 className="text-4xl font-black tracking-tighter mb-2 leading-none">Orden Segura</h2>
                         <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">KolmaRD Live Tracking</p>
                      </div>
                   </div>
                   <div className="space-y-12 px-4">
                      {[
                        { label: 'Pedido Validado', done: true },
                        { label: 'Preparación en Tienda', done: true },
                        { label: 'Repartidor en Camino', active: true },
                        { label: 'Entregado en Cotuí', done: false }
                      ].map((s, i) => (
                        <div key={i} className="flex gap-8 items-center">
                           <div className={`w-6 h-6 rounded-full border-4 border-white shadow-xl ${s.active ? 'bg-kolma-red ring-[15px] ring-orange-100 animate-pulse' : s.done ? 'bg-black' : 'bg-gray-100'}`} />
                           <span className={`text-xl font-black ${s.done || s.active ? 'text-black' : 'text-gray-200'}`}>{s.label}</span>
                        </div>
                      ))}
                   </div>
                   <div className="mt-20 p-8 bg-slate-900 text-white rounded-[48px] flex flex-col sm:flex-row items-center justify-between gap-8">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-gradient-to-tr from-kolma-red to-kolma-orange rounded-2xl flex items-center justify-center text-4xl shadow-2xl">🛵</div>
                         <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Socio Kolma</p>
                            <p className="font-black text-2xl tracking-tighter">José Martínez</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <button className="p-5 bg-white/10 rounded-3xl"><Phone size={24}/></bu
