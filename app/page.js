'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- CONFIGURACIÓN DE MARCA Y TOKENS ---
const APP_ID = "kolma-rd-premium-v5";
const SHOPIFY_DOMAIN = "q0q09e-cp.myshopify.com";
const SHOPIFY_TOKEN = "c9bda45020488455d7fe2d8b7e22f352";
const MAP_CENTER = [19.0528, -70.1492]; // Cotuí, RD

// ==========================================
// 1. ICONOS NATIVOS (SVG) - Cero dependencias para Vercel
// ==========================================
const SvgIcon = ({ children, size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);

const Icons = {
  Search: (p) => <SvgIcon {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></SvgIcon>,
  Bag: (p) => <SvgIcon {...p}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></SvgIcon>,
  User: (p) => <SvgIcon {...p}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></SvgIcon>,
  Plus: (p) => <SvgIcon {...p}><path d="M5 12h14"/><path d="M12 5v14"/></SvgIcon>,
  X: (p) => <SvgIcon {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></SvgIcon>,
  Zap: (p) => <SvgIcon {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></SvgIcon>,
  Truck: (p) => <SvgIcon {...p}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></SvgIcon>,
  Phone: (p) => <SvgIcon {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></SvgIcon>
};

// ==========================================
// 2. COMPONENTE: RADAR SHIPDAY EN VIVO
// ==========================================
const LiveRadar = ({ order, onClose }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const initMap = () => {
      const L = window.L;
      if (!L || mapRef.current) return;
      mapRef.current = L.map('radar-map', { zoomControl: false, attributionControl: false }).setView(MAP_CENTER, 15);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(mapRef.current);
      
      const pinHtml = `<div class="bg-[#FF3D00] p-3 rounded-2xl shadow-2xl border-4 border-white animate-bounce text-white">🛵</div>`;
      const icon = L.divIcon({ className: 'custom-pin', html: pinHtml, iconSize: [40, 40] });
      markerRef.current = L.marker(MAP_CENTER, { icon }).addTo(mapRef.current);
    };

    if (!window.L) {
      const s = document.createElement('script'); s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.onload = initMap; document.head.appendChild(s);
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(l);
    } else { initMap(); }
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in">
      <button onClick={onClose} className="absolute top-12 left-6 z-[110] w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl"><Icons.X /></button>
      <div id="radar-map" className="w-full h-[60%] bg-slate-200" />
      <div className="flex-1 bg-white rounded-t-[48px] -mt-10 p-8 shadow-2xl z-[105]">
        <div className="w-12 h-2 bg-gray-100 rounded-full mx-auto mb-8" />
        <h2 className="text-3xl font-black tracking-tighter mb-1">Rastreando Orden</h2>
        <p className="text-[#FF3D00] font-black text-sm uppercase mb-8 animate-pulse">● Repartidor en ruta a Cotuí</p>
        <div className="bg-slate-50 p-6 rounded-[32px] flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">🛵</div>
             <div><p className="font-black">José Martínez</p><p className="text-xs text-gray-400">Repartidor Kolma</p></div>
           </div>
           <button className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg"><Icons.Phone size={24}/></button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL (KOLMA APP)
// ==========================================
export default function App() {
  const [view, setView] = useState('home'); 
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRadarOpen, setIsRadarOpen] = useState(false);

  // FETCH SHOPIFY
  useEffect(() => {
    const fetchShopify = async () => {
      const query = `{ products(first: 50) { edges { node { id title collections(first: 1) { edges { node { title } } } images(first: 1) { edges { node { url } } } variants(first: 1) { edges { node { id price { amount } compareAtPrice { amount } } } } } } } }`;
      try {
        const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN },
          body: JSON.stringify({ query })
        });
        const { data } = await res.json();
        setProducts(data.products.edges.map(({ node }) => ({
          id: node.id, name: node.title,
          category: node.collections.edges[0]?.node.title || 'General',
          image: node.images.edges[0]?.node.url,
          price: parseFloat(node.variants.edges[0].node.price.amount),
          variantId: node.variants.edges[0].node.id
        })));
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };
    fetchShopify();
  }, []);

  const addToCart = (p) => setCart(prev => {
    const ex = prev.find(i => i.variantId === p.variantId);
    if (ex) return prev.map(i => i.variantId === p.variantId ? {...i, qty: i.qty+1} : i);
    return [...prev, {...p, qty: 1}];
  });

  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 font-sans text-slate-900 selection:bg-orange-100">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-50 px-6 py-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div onClick={() => setView('home')} className="flex items-center gap-2 cursor-pointer">
            <div className="bg-[#FF3D00] text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl">K</div>
            <span className="font-black text-xl tracking-tighter">Kolma<span className="text-[#FF3D00]">RD</span></span>
          </div>
          <button onClick={() => setView('cart')} className="md:hidden bg-black text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-xs">
            <Icons.Bag size={18} /> RD$ {subtotal.toFixed(0)}
          </button>
        </div>
        <div className="flex-1 w-full relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"><Icons.Search size={20} /></div>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="¿Qué necesitas en Cotuí?" className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 font-bold outline-none focus:ring-2 ring-orange-200" />
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => setView('cart')} className="bg-black text-white px-8 py-4 rounded-3xl flex items-center gap-4 shadow-xl shadow-gray-200">
            <Icons.Bag /> <span className="font-black text-lg">RD$ {subtotal.toFixed(0)}</span>
          </button>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {isLoading ? (
          <div className="py-20 text-center font-black text-gray-300 animate-pulse">CONECTANDO KOLMA...</div>
        ) : view === 'home' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {filtered.map(p => (
              <div key={p.id} className="group flex flex-col">
                <div className="relative aspect-square rounded-[40px] bg-white border border-gray-50 overflow-hidden shadow-sm hover:shadow-2xl transition-all mb-4">
                  <img src={p.image} className="w-full h-full object-cover" />
                  <button onClick={() => addToCart(p)} className="absolute bottom-4 right-4 bg-[#FF3D00] text-white p-4 rounded-2xl shadow-xl hover:scale-110 active:scale-90 transition-transform">
                    <Icons.Plus size={24} />
                  </button>
                </div>
                <p className="text-[10px] font-black text-orange-500 uppercase">{p.category}</p>
                <h4 className="font-bold text-sm truncate">{p.name}</h4>
                <p className="font-black text-lg">RD$ {p.price.toFixed(0)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white rounded-[48px] p-10 shadow-2xl border border-gray-50">
            <h2 className="text-4xl font-black mb-10 tracking-tighter">Tu Canasta</h2>
            {cart.length === 0 ? <p className="text-gray-300 font-bold py-10">Vacía...</p> : (
              <div className="space-y-6">
                {cart.map(item => (
                  <div key={item.variantId} className="flex items-center gap-6 bg-gray-50 p-6 rounded-[32px]">
                    <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" />
                    <div className="flex-1 font-black"><h4 className="text-lg">{item.name}</h4><p className="text-[#FF3D00]">RD$ {item.price.toFixed(0)} x {item.qty}</p></div>
                  </div>
                ))}
                <div className="pt-10 border-t text-center">
                  <h3 className="text-5xl font-black mb-10">RD$ {subtotal.toFixed(0)}</h3>
                  <button onClick={() => setIsRadarOpen(true)} className="w-full bg-[#FF3D00] text-white py-6 rounded-[32px] font-black text-2xl shadow-xl shadow-red-200">Confirmar Pedido</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* NAV MÓVIL */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t px-10 py-6 flex justify-around rounded-t-[40px] shadow-2xl z-40">
        <button onClick={() => setView('home')} className={view === 'home' ? 'text-[#FF3D00]' : 'text-gray-300'}><Icons.Zap size={32}/></button>
        <button onClick={() => setView('cart')} className={`relative ${view === 'cart' ? 'text-[#FF3D00]' : 'text-gray-300'}`}>
          <Icons.Bag size={32}/>
          {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] w-5 h-5 rounded-full flex items-center justify-center font-black">{cart.length}</span>}
        </button>
        <button onClick={() => setIsRadarOpen(true)} className="text-gray-300"><Icons.Truck size={32}/></button>
      </nav>

      {/* RADAR OVERLAY */}
      {isRadarOpen && <LiveRadar order={{id: 'KOL-123'}} onClose={() => setIsRadarOpen(false)} />}

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-pin { background: transparent !important; border: none !important; }
      `}} />
    </div>
  );
}
