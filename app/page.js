```react
"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, ShoppingBag, User, MapPin, Clock, Star, Plus, Minus, X, 
  CheckCircle, TrendingUp, Flame, LogOut, Navigation, ChevronRight, 
  Tag, Zap, Phone, MessageSquare, Sparkles, ArrowRight, ShieldCheck, ShoppingBasket 
} from 'lucide-react';

// --- ICONOS SVG ---
const SVGIcons = {
  Lacteos: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">
      <path d="M6 18h12l1-9H5l1 9z" /><path d="M10 6h4l.5 3h-5L10 6z" /><circle cx="12" cy="14" r="2" />
    </svg>
  ),
  Frutas: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">
      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 3a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Carnes: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">
      <path d="M15 5c0 3.5-2.5 4.5-5 4.5s-5-1-5-4.5 2.24-4 5-4 5 .5 5 4z" /><path d="M15 5c0 4-4 15-4 15s-6-11-6-15" /><line x1="10" y1="2" x2="10" y2="8" />
    </svg>
  ),
  Panaderia: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">
      <path d="M3 13c3.5-3 14.5-3 18 0" /><path d="M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6" /><path d="M12 13v8" /><path d="M8 13v8" /><path d="M16 13v8" />
    </svg>
  )
};

const COTUI_CENTER = [19.0528, -70.1492];

export default function KolmaRD() {
  const [view, setView] = useState('home');
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [showUpsell, setShowUpsell] = useState(null);
  const [deliveryCoords, setDeliveryCoords] = useState(COTUI_CENTER);

  const products = [
    { id: '1', name: 'Leche Rica Entera 1L', price: 78, oldPrice: 95, category: 'Lácteos', image: 'https://images.unsplash.com/photo-1563636619-e9107da5a1bb?auto=format&fit=crop&w=300', upsellId: '4' },
    { id: '2', name: 'Aguacate Hass Cotuí', price: 45, oldPrice: 65, category: 'Frutas y Verduras', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=300', upsellId: '3' },
    { id: '3', name: 'Pechuga Pollo Premium', price: 185, oldPrice: 230, category: 'Carnes', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=300' },
    { id: '4', name: 'Pan Sobao Caliente', price: 55, oldPrice: 75, category: 'Panadería', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300', upsellId: '1' },
    { id: '5', name: 'Arroz Kolma Selecto 5lb', price: 160, oldPrice: 195, category: 'Despensa', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300' },
  ];

  // Social Proof Simulado
  useEffect(() => {
    const interval = setInterval(() => {
      const names = ['Ana', 'Rosa', 'Miguel', 'Junior'];
      const sectors = ['El Centro', 'Pueblo Nuevo', 'Los Multis'];
      setToast({
        title: `${names[Math.floor(Math.random()*names.length)]} en ${sectors[Math.floor(Math.random()*sectors.length)]}`,
        desc: "Acaba de realizar un pedido express."
      });
      setTimeout(() => setToast(null), 4000);
    }, 20000);
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

  const MapView = () => {
    useEffect(() => {
      if (!window.L || !document.getElementById('live-map')) return;
      const map = window.L.map('live-map', { zoomControl: false }).setView(COTUI_CENTER, 15);
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);
      const icon = window.L.divIcon({ html: '<div class="w-10 h-10 marker-pin flex items-center justify-center text-white">🛵</div>', className: '', iconSize: [40, 40] });
      window.L.marker(COTUI_CENTER, { icon }).addTo(map);
      return () => map.remove();
    }, []);
    return <div id="live-map" className="w-full h-full min-h-[400px]" />;
  };

  return (
    <div className="pb-24 md:pb-0">
      {/* Notificación Social */}
      {toast && (
        <div className="fixed top-24 left-6 z-[100] bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-4 border border-orange-100 flex items-center gap-4 animate-in slide-in-from-left-10">
          <div className="w-12 h-12 bg-kolma-red rounded-2xl flex items-center justify-center text-white shadow-lg">
            <ShoppingBasket size={24} />
          </div>
          <div>
            <p className="text-xs font-black leading-none mb-1">{toast.title}</p>
            <p className="text-[11px] text-gray-500 font-bold">{toast.desc}</p>
          </div>
        </div>
      )}

      {/* Header Premium */}
      <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-3xl border-b border-gray-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div onClick={() => setView('home')} className="bg-gradient-to-br from-kolma-red to-kolma-orange text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl cursor-pointer">K</div>
          <div className="hidden md:block">
            <h1 className="font-black text-xl tracking-tighter">Kolma<span className="text-kolma-red">RD</span></h1>
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">Cotuí</p>
          </div>
        </div>

        <div className="flex-1 max-w-lg mx-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="¿Qué necesitas hoy?" 
            className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-4 font-bold outline-none border-2 border-transparent focus:border-kolma-orange transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setView('cart')} className="bg-kolma-red text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl active:scale-95 transition-all">
            <ShoppingBag size={20} />
            <span className="font-black border-l border-white/20 pl-3">RD$ {subtotal.toFixed(0)}</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {view === 'home' && (
          <div className="space-y-12">
            {!searchTerm && (
              <>
                <div className="relative h-64 bg-slate-900 rounded-[40px] overflow-hidden p-10 flex items-center group cursor-pointer shadow-2xl">
                  <div className="z-10 text-white max-w-sm">
                    <span className="bg-kolma-red px-3 py-1 rounded-full text-[10px] font-black uppercase mb-4 inline-block">KolmaRD Express</span>
                    <h2 className="text-4xl font-black mb-4 tracking-tighter leading-tight">Frescura Local <br/> <span className="text-kolma-orange">en 20 Minutos.</span></h2>
                    <button className="bg-white text-black px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2">Comprar ahora <ArrowRight size={18}/></button>
                  </div>
                  <div className="absolute right-0 top-0 h-full w-1/2 opacity-30">
                    <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                  {['Todos', 'Lácteos', 'Frutas y Verduras', 'Carnes', 'Panadería'].map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)}
                      className={`flex flex-col items-center gap-3 p-6 min-w-[120px] rounded-[32px] transition-all border-4 ${activeCategory === cat ? 'bg-white border-kolma-red shadow-xl' : 'bg-white border-transparent opacity-50'}`}
                    >
                      <div className={activeCategory === cat ? 'text-kolma-red' : 'text-gray-400'}>
                        {cat === 'Lácteos' ? <SVGIcons.Lacteos /> : cat === 'Frutas y Verduras' ? <SVGIcons.Frutas /> : cat === 'Carnes' ? <SVGIcons.Carnes /> : <SVGIcons.Panaderia />}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{cat}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {filteredProducts.map(p => (
                <div key={p.id} className="group relative flex flex-col">
                  <div className="relative aspect-square rounded-[40px] bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 mb-4 cursor-pointer">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <button 
                      onClick={() => addToCart(p)}
                      className="absolute bottom-4 right-4 bg-black text-white p-4 rounded-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-xl hover:bg-kolma-red"
                    >
                      <Plus size={24} strokeWidth={3} />
                    </button>
                  </div>
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">{p.category}</p>
                  <h4 className="font-bold text-base leading-tight truncate mb-2">{p.name}</h4>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-xl tracking-tighter">RD$ {p.price}</span>
                    <span className="text-xs text-gray-300 line-through font-bold">RD$ {p.oldPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-3xl mx-auto bg-white rounded-[50px] p-10 shadow-2xl border border-gray-50">
             <h2 className="text-4xl font-black tracking-tighter mb-10">Tu Compra</h2>
             {cart.length === 0 ? (
               <div className="text-center py-20">
                 <p className="text-gray-300 font-black text-xl mb-10">Canasta vacía</p>
                 <button onClick={() => setView('home')} className="bg-black text-white px-10 py-5 rounded-3xl font-black">Ver Productos</button>
               </div>
             ) : (
               <div className="space-y-6">
                 {cart.map(item => (
                   <div key={item.id} className="flex items-center gap-6 p-4 rounded-3xl border border-gray-50">
                     <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" />
                     <div className="flex-1">
                       <h4 className="font-black text-lg">{item.name}</h4>
                       <p className="text-kolma-red font-black">RD$ {item.price}</p>
                     </div>
                     <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-2xl">
                        <button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? {...i, qty: Math.max(0, i.qty - 1)} : i).filter(i => i.qty > 0))}><Minus/></button>
                        <span className="font-black w-4 text-center">{item.qty}</span>
                        <button onClick={() => addToCart(item, true)}><Plus/></button>
                     </div>
                   </div>
                 ))}
                 <div className="pt-10 border-t-4 border-gray-50 flex justify-between items-center">
                    <div>
                       <p className="text-xs font-black text-gray-400 uppercase">Total</p>
                       <h3 className="text-5xl font-black tracking-tighter">RD$ {subtotal}</h3>
                    </div>
                    <button onClick={() => setView('tracking')} className="bg-kolma-red text-white px-16 py-6 rounded-[32px] font-black text-2xl shadow-2xl">Confirmar</button>
                 </div>
               </div>
             )}
          </div>
        )}

        {view === 'tracking' && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white rounded-[50px] p-12 shadow-2xl border border-gray-50">
               <div className="flex items-center gap-6 mb-12">
                  <div className="w-16 h-16 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center"><ShieldCheck size={40} /></div>
                  <h2 className="text-3xl font-black tracking-tighter leading-none">Orden Segura</h2>
               </div>
               <div className="space-y-10 relative">
                  {['Validado', 'Preparado', 'En Camino', 'Entregado'].map((s, i) => (
                    <div key={i} className="flex gap-6 items-center">
                       <div className={`w-5 h-5 rounded-full ${i <= 2 ? 'bg-kolma-red shadow-lg ring-8 ring-orange-50' : 'bg-gray-100'}`} />
                       <span className={`text-xl font-black ${i <= 2 ? 'text-black' : 'text-gray-200'}`}>{s}</span>
                    </div>
                  ))}
               </div>
               <div className="mt-16 p-6 bg-slate-900 text-white rounded-[40px] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-kolma-red rounded-2xl flex items-center justify-center text-3xl">🛵</div>
                     <p className="font-black text-xl">José Martínez</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-4 bg-white/10 rounded-2xl"><Phone size={20}/></button>
                    <button className="p-4 bg-kolma-red rounded-2xl"><MessageSquare size={20}/></button>
                  </div>
               </div>
            </div>
            <div className="h-[500px] overflow-hidden rounded-[50px] shadow-2xl">
               <MapView />
            </div>
          </div>
        )}
      </main>

      {/* Upsell Modal */}
      {showUpsell && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[50px] p-10 shadow-2xl border-t-8 border-kolma-red text-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl animate-bounce">🛒</div>
            <h3 className="text-2xl font-black mb-2 tracking-tighter italic">"¿Lo olvidaste, socio?"</h3>
            <div className="bg-gray-50 p-6 rounded-[32px] flex items-center gap-4 mb-8">
               <img src={showUpsell.image} className="w-16 h-16 rounded-2xl object-cover" />
               <div className="flex-1 text-left">
                  <h4 className="font-black text-sm leading-tight">{showUpsell.name}</h4>
                  <p className="font-black text-xl text-kolma-red">RD$ {showUpsell.price}</p>
               </div>
               <button onClick={() => addToCart(showUpsell, true)} className="bg-black text-white p-3 rounded-2xl"><Plus/></button>
            </div>
            <button onClick={() => setShowUpsell(null)} className="w-full text-gray-400 font-black text-xs uppercase tracking-widest">Ir a pagar</button>
          </div>
        </div>
      )}

      {/* Nav Móvil */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-3xl border-t border-gray-50 px-10 py-6 flex justify-around md:hidden z-50 rounded-t-[40px] shadow-2xl">
        <button onClick={() => setView('home')} className={`p-4 rounded-2xl ${view === 'home' ? 'bg-black text-white shadow-xl rotate-3' : 'text-gray-300'}`}><Search size={26} /></button>
        <button onClick={() => setView('cart')} className={`relative p-5 rounded-3xl ${view === 'cart' ? 'bg-kolma-red text-white shadow-xl -translate-y-4' : 'text-gray-300 bg-gray-50'}`}>
          <ShoppingBag size={28} />
          {cart.length > 0 && <span className="absolute top-0 right-0 bg-black text-white w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-black border-2 border-white">{cart.length}</span>}
        </button>
        <button onClick={() => setView('home')} className="p-4 rounded-2xl text-gray-300"><User size={26} /></button>
      </nav>
    </div>
  );
}

```
  
