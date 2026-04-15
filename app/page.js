'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- CONFIGURACIÓN DE MARCA Y TOKENS ---
const APP_ID = "kolma-rd-premium-v3";
const DOMAIN = "q0q09e-cp.myshopify.com";
const ACCESS_TOKEN = "c9bda45020488455d7fe2d8b7e22f352";
const MAP_CENTER = [19.0528, -70.1492]; 

// ==========================================
// 1. ICONOS NATIVOS (SVG) - Reemplazan a Lucide para evitar errores
// ==========================================
const SvgIcon = ({ children, size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);

const Icons = {
  Search: (p) => <SvgIcon {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></SvgIcon>,
  ShoppingBag: (p) => <SvgIcon {...p}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></SvgIcon>,
  User: (p) => <SvgIcon {...p}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></SvgIcon>,
  Plus: (p) => <SvgIcon {...p}><path d="M5 12h14"/><path d="M12 5v14"/></SvgIcon>,
  Minus: (p) => <SvgIcon {...p}><path d="M5 12h14"/></SvgIcon>,
  X: (p) => <SvgIcon {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></SvgIcon>,
  Flame: (p) => <SvgIcon {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></SvgIcon>,
  Zap: (p) => <SvgIcon {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></SvgIcon>,
  Clock: (p) => <SvgIcon {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></SvgIcon>,
  Tag: (p) => <SvgIcon {...p}><path d="m12 2 3.5 3.5L22 12l-10 10L2 12l6.5-6.5L12 2z"/><circle cx="12" cy="12" r="2"/></SvgIcon>,
  Sparkles: (p) => <SvgIcon {...p}><path d="m12 3 1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z"/></SvgIcon>,
  ArrowRight: (p) => <SvgIcon {...p}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></SvgIcon>,
  TrendingUp: (p) => <SvgIcon {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></SvgIcon>,
  ShieldCheck: (p) => <SvgIcon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></SvgIcon>,
  Phone: (p) => <SvgIcon {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></SvgIcon>,
  MessageSquare: (p) => <SvgIcon {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></SvgIcon>,
  Activity: (p) => <SvgIcon {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></SvgIcon>
};

const CategoryIcons = {
  Lacteos: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8"><path d="M6 18h12l1-9H5l1 9z" /><path d="M10 6h4l.5 3h-5L10 6z" /><circle cx="12" cy="14" r="2" /></svg>
  ),
  Frutas: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 3a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>
  ),
  Carnes: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8"><path d="M15 5c0 3.5-2.5 4.5-5 4.5s-5-1-5-4.5 2.24-4 5-4 5 .5 5 4z" /><path d="M15 5c0 4-4 15-4 15s-6-11-6-15" /><line x1="10" y1="2" x2="10" y2="8" /></svg>
  ),
  Panaderia: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8"><path d="M3 13c3.5-3 14.5-3 18 0" /><path d="M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6" /><path d="M12 13v8" /><path d="M8 13v8" /><path d="M16 13v8" /></svg>
  ),
  Despensa: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8"><rect x="5" y="6" width="14" height="15" rx="2" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><line x1="5" y1="10" x2="19" y2="10" /><line x1="5" y1="15" x2="19" y2="15" /></svg>
  ),
  Bebidas: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8"><path d="M7 21h10" /><path d="M12 21V7" /><path d="M6 7h12l-1 11H7L6 7z" /><path d="M12 3v4" /><path d="M10 3h4" /></svg>
  )
};

const App = () => {
  const [view, setView] = useState('home'); 
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showUpsell, setShowUpsell] = useState(null);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // 2. CARGA REAL DESDE SHOPIFY
  // ==========================================
  useEffect(() => {
    const fetchShopify = async () => {
      setIsLoading(true);
      const query = `{
        products(first: 50) {
          edges {
            node {
              id
              title
              collections(first: 1) { edges { node { title } } }
              images(first: 1) { edges { node { url } } }
              variants(first: 1) {
                edges {
                  node {
                    id
                    price { amount }
                    compareAtPrice { amount }
                  }
                }
              }
            }
          }
        }
      }`;

      try {
        const response = await fetch(`https://${DOMAIN}/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
          },
          body: JSON.stringify({ query }),
        });

        const { data } = await response.json();
        const formatted = data.products.edges.map(({ node }) => ({
          id: node.id,
          name: node.title,
          category: node.collections.edges[0]?.node.title || 'Despensa',
          image: node.images.edges[0]?.node.url,
          price: parseFloat(node.variants.edges[0].node.price.amount),
          oldPrice: parseFloat(node.variants.edges[0].node.compareAtPrice?.amount || node.variants.edges[0].node.price.amount * 1.2),
          variantId: node.variants.edges[0].node.id,
          weight: 'Unidad',
          upsellId: node.id // Simulación de upsell
        }));
        setProducts(formatted);
      } catch (error) {
        console.error("Shopify Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopify();
    const savedUser = localStorage.getItem(`${APP_ID}_user`);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Notificaciones de ventas reales
  useEffect(() => {
    const triggerNotification = () => {
      const names = ['Ana', 'Roberto', 'Milagros', 'Junior', 'Carla', 'Nelson'];
      const items = ['arroz', 'leche rica', 'aguacates', 'pan caliente'];
      const zones = ['Centro', 'Pueblo Nuevo', 'Los Multis', 'La Esperanza'];
      
      setToast({
        title: `${names[Math.floor(Math.random()*names.length)]} en ${zones[Math.floor(Math.random()*zones.length)]}`,
        desc: `Compró ${items[Math.floor(Math.random()*items.length)]}`,
      });
      setTimeout(() => setToast(null), 5000);
    };
    const interval = setInterval(triggerNotification, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (val) => {
    setSearchTerm(val);
    if(val.length > 2) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      (activeCategory === 'Todos' || p.category === activeCategory) &&
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm, activeCategory]);

  const addToCart = (product, isUpsell = false) => {
    setCart(prev => {
      const existing = prev.find(item => item.variantId === product.variantId);
      if (existing) {
        return prev.map(item => item.variantId === product.variantId ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    
    if (!isUpsell && product.upsellId) {
      const suggested = products.find(p => p.id !== product.id && p.category === product.category);
      if (suggested) setShowUpsell(suggested);
    } else {
      setShowUpsell(null);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalSavings = cart.reduce((acc, item) => acc + ((item.oldPrice - item.price) * item.qty), 0);

  // ==========================================
  // 3. RADAR SHIPDAY (LEAFLET)
  // ==========================================
  const LiveTrackingMap = () => {
    useEffect(() => {
      if (typeof window === 'undefined' || !window.L) return;
      const map = window.L.map('map-live', { zoomControl: false }).setView(MAP_CENTER, 16);
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);
      const icon = window.L.divIcon({
        html: `<div class="marker-pin shadow-2xl scale-125">🛵</div>`,
        className: 'custom-div-icon', iconSize: [40, 40]
      });
      window.L.marker(MAP_CENTER, { icon }).addTo(map);
      return () => map.remove();
    }, []);

    // Cargar Leaflet si no está
    useEffect(() => {
      if (!window.L) {
        const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; document.head.appendChild(script);
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
      }
    }, []);

    return <div id="map-live" className="w-full h-full rounded-[48px] border-8 border-white shadow-2xl" />;
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans pb-24 md:pb-0 overflow-x-hidden">
      
      {/* Toast Notificación */}
      {toast && (
        <div className="fixed top-28 left-6 z-[100] bg-white/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(255,61,0,0.15)] rounded-3xl p-5 border border-orange-100 flex items-center gap-4 animate-in slide-in-from-left-20 duration-700">
          <div className="w-14 h-14 bg-gradient-to-br from-[#FF3D00] to-[#FF9100] rounded-2xl flex items-center justify-center text-white shadow-xl">
            <Icons.Zap size={28} className="animate-pulse" />
          </div>
          <div><p className="text-xs font-black text-slate-900 leading-none mb-1">{toast.title}</p><p className="text-[11px] text-slate-500 font-bold">{toast.desc}</p></div>
        </div>
      )}

      {/* Header Premium */}
      <header className="sticky top-0 z-[60] bg-white/70 backdrop-blur-3xl border-b border-gray-50 px-8 py-5 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="flex items-center justify-between w-full md:w-auto gap-10">
          <div onClick={() => setView('home')} className="flex items-center gap-3 cursor-pointer group">
             <div className="bg-gradient-to-br from-[#FF3D00] to-[#FF9100] text-white w-14 h-14 rounded-[22px] flex items-center justify-center font-black text-3xl shadow-xl group-hover:scale-110 transition-transform">K</div>
             <div className="flex flex-col">
               <span className="font-black text-2xl tracking-tighter leading-none">Kolma<span className="text-[#FF3D00]">RD</span></span>
               <span className="text-[10px] font-black uppercase tracking-[3px] text-orange-500 opacity-80">Premium Service</span>
             </div>
          </div>
          <div className="md:hidden">
             <button onClick={() => setView('cart')} className="bg-gradient-to-r from-[#FF3D00] to-[#FF9100] text-white px-5 py-3 rounded-2xl flex items-center gap-3 font-black shadow-xl">
               <Icons.ShoppingBag size={20} /> RD$ {subtotal.toFixed(0)}
             </button>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="flex-1 w-full max-w-2xl relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2">
            {isLoading ? <Icons.Activity size={20} className="text-[#FF3D00] animate-pulse" /> : <Icons.Search className="text-gray-300 group-focus-within:text-[#FF3D00]" size={22} />}
          </div>
          <input 
            type="text" value={searchTerm} onChange={(e) => handleSearch(e.target.value)}
            placeholder="¿Qué necesitas hoy en Cotuí?" 
            className="w-full bg-gray-100/50 border-2 border-transparent focus:border-[#FF9100] focus:bg-white rounded-[28px] py-5 pl-16 pr-6 font-bold transition-all outline-none"
          />
          {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"><Icons.X size={20}/></button>}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => setView('cart')} className="bg-black text-white px-10 py-5 rounded-[28px] flex items-center gap-5 hover:scale-105 transition-all shadow-2xl relative group">
            <div className="relative">
              <Icons.ShoppingBag size={24} />
              {cart.length > 0 && <span className="absolute -top-3 -right-3 bg-[#FF3D00] text-white w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-black animate-bounce">{cart.length}</span>}
            </div>
            <span className="font-black text-xl border-l border-white/20 pl-5 tracking-tighter">RD$ {subtotal.toFixed(0)}</span>
          </button>
          <button onClick={() => setView('profile')} className="w-16 h-16 bg-white rounded-[28px] flex items-center justify-center border-2 border-gray-100 hover:border-orange-200 transition-all shadow-sm"><Icons.User size={26} className="text-slate-400" /></button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {view === 'home' && (
          <div className="space-y-16 animate-in fade-in duration-1000">
            {!searchTerm && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 relative h-80 bg-slate-900 rounded-[56px] overflow-hidden p-14 flex items-center shadow-2xl group border border-white/5">
                    <div className="z-10 text-white max-w-lg">
                      <div className="flex items-center gap-3 mb-5">
                         <div className="bg-[#FF3D00] px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">Prioridad Kolma</div>
                         <div className="flex items-center gap-2 text-[#FF9100] text-sm font-black"><Icons.Clock size={16} /> ENTREGAS RÁPIDAS</div>
                      </div>
                      <h2 className="text-6xl font-black mb-6 tracking-tighter leading-[0.9]">Frescura <br/> <span className="text-[#FF9100]">Local Directa.</span></h2>
                      <button className="bg-white text-black px-8 py-4 rounded-3xl font-black text-base transition-all flex items-center gap-3">Ver Ofertas <Icons.ArrowRight size={20}/></button>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-2/3 opacity-40 group-hover:scale-105 transition-transform duration-1000 mix-blend-overlay">
                      <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800" className="w-full h-full object-cover" alt="Banner" />
                    </div>
                  </div>

                  <div className="relative h-80 bg-gradient-to-br from-[#FF3D00] to-[#FF9100] rounded-[56px] overflow-hidden p-12 shadow-2xl group border-4 border-white/10">
                    <div className="z-10 text-white relative h-full flex flex-col justify-between">
                       <div><h3 className="text-4xl font-black tracking-tighter mb-3">Kolma Plus</h3><p className="font-bold opacity-90 text-base">Ahorra en tu primer pedido del mes en Cotuí.</p></div>
                       <div className="bg-black/20 backdrop-blur-xl p-5 rounded-[32px] border border-white/20 flex items-center justify-between">
                          <div><p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Cupón</p><p className="font-black text-2xl tracking-tighter">KOLMA-RD</p></div>
                          <div className="bg-white text-[#FF3D00] p-3 rounded-2xl"><Icons.Tag size={20} /></div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Categorías */}
                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 px-4">
                  {['Todos', 'Lácteos', 'Frutas y Verduras', 'Carnes', 'Panadería', 'Despensa', 'Bebidas'].map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex flex-col items-center gap-4 p-7 min-w-[140px] rounded-[44px] transition-all border-4 ${activeCategory === cat ? 'bg-white border-[#FF3D00] shadow-2xl -translate-y-2' : 'bg-white border-transparent opacity-50'}`}>
                      <div className={`p-4 rounded-3xl ${activeCategory === cat ? 'bg-orange-50 text-[#FF3D00]' : 'bg-gray-50 text-gray-400'}`}>
                        {cat === 'Lácteos' ? <CategoryIcons.Lacteos /> : cat === 'Frutas y Verduras' ? <CategoryIcons.Frutas /> : cat === 'Carnes' ? <CategoryIcons.Carnes /> : cat === 'Panadería' ? <CategoryIcons.Panaderia /> : cat === 'Despensa' ? <CategoryIcons.Despensa /> : cat === 'Bebidas' ? <CategoryIcons.Bebidas /> : <Icons.ShoppingBag size={32}/>}
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-[2px] ${activeCategory === cat ? 'text-[#FF3D00]' : 'text-slate-400'}`}>{cat}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Grid Productos */}
            <div className="relative">
              <div className="flex items-center gap-4 mb-12">
                <h3 className="text-4xl font-black tracking-tighter">{searchTerm ? `Resultados: "${searchTerm}"` : 'Sugeridos para ti'}</h3>
                <div className="bg-orange-50 text-[#FF9100] px-4 py-1.5 rounded-full flex items-center gap-2 border border-orange-100"><Icons.Sparkles size={18} /> <span className="text-[11px] font-black uppercase">Top Selección</span></div>
              </div>

              {isLoading ? <div className="py-20 text-center font-black text-gray-200">CARGANDO ALMACÉN...</div> : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-16">
                {filteredProducts.map(p => (
                  <div key={p.id} className="group flex flex-col relative">
                    <div className="relative aspect-square rounded-[50px] bg-white border border-gray-50 overflow-hidden shadow-sm hover:shadow-2xl transition-all mb-6">
                      <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={p.name} />
                      <div className="absolute top-5 left-5"><div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black shadow-lg flex items-center gap-2"><Icons.Flame size={14} className="text-red-500 animate-bounce" /> Hot Item</div></div>
                      <button onClick={() => addToCart(p)} className="absolute bottom-5 right-5 bg-black text-white p-5 rounded-[28px] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-[#FF3D00] shadow-2xl"><Icons.Plus size={28} /></button>
                    </div>
                    <div className="px-3">
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">{p.category}</p>
                      <h4 className="font-bold text-lg leading-tight truncate mb-3">{p.name}</h4>
                      <div className="flex items-center gap-4"><span className="font-black text-3xl tracking-tighter">RD$ {p.price.toFixed(0)}</span><span className="text-sm text-gray-300 line-through font-bold">RD$ {p.oldPrice.toFixed(0)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>
        )}

        {/* Carrito */}
        {view === 'cart' && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-20">
             <div className="bg-white rounded-[64px] p-16 shadow-2xl border border-gray-50">
                <div className="flex justify-between items-end mb-16 border-b-4 border-gray-50 pb-10">
                   <div><h2 className="text-5xl font-black tracking-tighter mb-2">Mi Canasta</h2><p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Express Cotuí</p></div>
                   <div className="text-right"><span className="bg-orange-50 px-4 py-2 rounded-2xl text-[#FF9100] font-black text-xs flex items-center gap-2 mb-2"><Icons.TrendingUp size={14} /> AHORRO</span><p className="font-black text-2xl text-[#FF3D00]">RD$ {totalSavings.toFixed(0)}</p></div>
                </div>

                {cart.length === 0 ? (
                  <div className="py-24 text-center"><p className="text-gray-200 font-black text-4xl mb-12">Canasta Vacía</p><button onClick={() => setView('home')} className="bg-black text-white px-14 py-6 rounded-3xl font-black text-xl shadow-2xl">Ir de Compras</button></div>
                ) : (
                  <div className="space-y-10">
                     {cart.map(item => (
                       <div key={item.variantId} className="flex items-center gap-8 p-6 rounded-[40px] hover:bg-orange-50/20 transition-all border-2 border-transparent hover:border-orange-50">
                         <img src={item.image} className="w-32 h-32 rounded-[32px] object-cover shadow-xl" alt="CartItem" />
                         <div className="flex-1 font-black"><h4 className="text-2xl tracking-tighter mb-3">{item.name}</h4><p className="text-[#FF3D00] text-xl">RD$ {item.price.toFixed(0)}</p></div>
                         <div className="flex items-center gap-6 bg-white p-3 rounded-3xl shadow-sm border border-gray-100">
                            <button onClick={() => setCart(cart.filter(i => i.variantId !== item.variantId))} className="text-red-500"><Icons.X size={24}/></button>
                            <span className="font-black text-2xl">{item.qty}</span>
                            <button onClick={() => addToCart(item, true)} className="text-green-500"><Icons.Plus size={24}/></button>
                         </div>
                       </div>
                     ))}
                     <div className="mt-16 pt-16 border-t-8 border-gray-50 flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="text-center md:text-left"><p className="text-xs font-black text-slate-300 uppercase tracking-[4px] mb-2">Total</p><h3 className="text-6xl font-black tracking-tighter">RD$ {subtotal.toFixed(0)}</h3></div>
                        <button onClick={() => setView('tracking')} className="bg-gradient-to-r from-[#FF3D00] to-[#FF9100] text-white px-20 py-8 rounded-[40px] font-black text-3xl shadow-2xl">Pagar Ahora</button>
                     </div>
                  </div>
                )}
             </div>
          </div>
        )}

        {/* Tracking */}
        {view === 'tracking' && (
          <div className="max-w-6xl mx-auto space-y-10 animate-in zoom-in-95">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
               <div className="bg-white rounded-[64px] p-16 shadow-2xl border border-gray-50">
                  <div className="flex items-center gap-8 mb-16">
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[35px] flex items-center justify-center shadow-xl shadow-green-50"><Icons.ShieldCheck size={48} /></div>
                    <div><h2 className="text-4xl font-black tracking-tighter mb-2 leading-none">Entrega Segura</h2><p className="text-slate-400 font-bold text-sm uppercase">KolmaRD Radar Live</p></div>
                  </div>
                  <div className="space-y-12 relative px-4">
                      {['Validado', 'Preparando', 'En Camino', 'Entregado'].map((s, i) => (
                       <div key={i} className="flex gap-8 items-center">
                          <div className={`w-6 h-6 rounded-full border-4 border-white shadow-xl ${i < 3 ? 'bg-black' : 'bg-gray-100'} ${i === 2 ? 'bg-[#FF3D00] ring-[15px] ring-orange-100 animate-pulse' : ''}`} />
                          <span className={`text-xl font-black ${i <= 2 ? 'text-black' : 'text-gray-200'}`}>{s}</span>
                       </div>
                      ))}
                  </div>
                  <div className="mt-20 p-8 bg-slate-900 text-white rounded-[48px] flex items-center justify-between gap-8">
                     <div className="flex items-center gap-6"><div className="text-4xl">🛵</div><div><p className="text-[10px] font-black text-gray-500 uppercase">Socio Delivery</p><p className="font-black text-2xl">Junior Ortiz</p></div></div>
                     <div className="flex gap-4"><button className="p-5 bg-white/10 rounded-3xl"><Icons.Phone size={24}/></button><button className="p-5 bg-[#FF3D00] rounded-3xl"><Icons.MessageSquare size={24}/></button></div>
                  </div>
               </div>
               <div className="h-[600px] sticky top-32"><LiveTrackingMap /></div>
            </div>
          </div>
        )}
      </main>

      {/* Upsell Modal */}
      {showUpsell && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-md rounded-[64px] p-14 shadow-2xl border-t-8 border-[#FF3D00] animate-in slide-in-from-bottom-20">
            <div className="text-center mb-10"><div className="text-5xl mb-8 animate-bounce">🛒</div><h3 className="text-3xl font-black tracking-tighter italic mb-3">"Socio, ¿olvidaste esto?"</h3><p className="text-slate-400 font-bold text-sm">Combina perfecto con tu orden.</p></div>
            <div className="bg-gray-50 p-8 rounded-[48px] flex items-center gap-8 mb-12 border border-gray-100">
               <img src={showUpsell.image} className="w-28 h-28 rounded-[32px] object-cover shadow-2xl" alt="upsell" />
               <div className="flex-1"><h4 className="font-black text-xl leading-none mb-3">{showUpsell.name}</h4><p className="font-black text-2xl text-[#FF3D00]">RD$ {showUpsell.price.toFixed(0)}</p></div>
               <button onClick={() => addToCart(showUpsell, true)} className="bg-black text-white p-5 rounded-3xl shadow-xl hover:bg-[#FF3D00] transition-all"><Icons.Plus size={32} /></button>
            </div>
            <button onClick={() => setShowUpsell(null)} className="w-full text-slate-300 font-black text-xs uppercase tracking-[5px] py-4 hover:text-black">Continuar</button>
          </div>
        </div>
      )}

      {/* Nav Móvil */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/70 backdrop-blur-3xl border-t border-gray-50 px-12 py-7 flex justify-around md:hidden z-50 rounded-t-[56px] shadow-2xl">
        <button onClick={() => setView('home')} className={`p-4 rounded-[24px] transition-all ${view === 'home' ? 'bg-black text-white shadow-2xl -translate-y-4 scale-125' : 'text-gray-300'}`}><Icons.Zap size={28} /></button>
        <button onClick={() => setView('cart')} className={`relative p-5 rounded-[28px] transition-all ${view === 'cart' ? 'bg-[#FF3D00] text-white shadow-2xl -translate-y-4 scale-125' : 'text-gray-300'}`}>
          <Icons.ShoppingBag size={28} />
          {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-black text-white w-7 h-7 rounded-full text-[10px] flex items-center justify-center font-black border-4 border-white">{cart.length}</span>}
        </button>
        <button onClick={() => setView('tracking')} className={`p-4 rounded-[24px] transition-all ${view === 'tracking' ? 'bg-black text-white shadow-2xl -translate-y-4 scale-125' : 'text-gray-300'}`}><Icons.Activity size={28} /></button>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .marker-pin { font-size: 35px; background: white; border-radius: 24px; padding: 12px; border: 4px solid #FF3D00; }
        .custom-div-icon { background: transparent !important; border: none !important; }
        .leaflet-container { z-index: 1 !important; border-radius: 48px; }
        .leaflet-control-attribution { display: none !important; }
      `}} />
    </div>
  );
};

export default App;
