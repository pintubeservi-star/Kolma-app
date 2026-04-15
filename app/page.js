'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- CONFIGURACIÓN DE MARCA Y TOKENS ---
const APP_ID = "kolma-rd-premium-v3";
const DOMAIN = "q0q09e-cp.myshopify.com";
const ACCESS_TOKEN = "c9bda45020488455d7fe2d8b7e22f352";
const MAP_CENTER = [19.0528, -70.1492]; 

// ==========================================
// 1. COMPONENTE DE ICONOS NATIVOS (Evita errores de compilación)
// ==========================================
const SvgIcon = ({ d, size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d={d}/></svg>
);

const Icons = {
  Search: (p) => <SvgIcon d="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z" {...p}/>,
  Bag: (p) => <SvgIcon d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0" {...p}/>,
  User: (p) => <SvgIcon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 110-8 4 4 0 010 8z" {...p}/>,
  Plus: (p) => <SvgIcon d="M12 5v14M5 12h14" {...p}/>,
  Minus: (p) => <SvgIcon d="M5 12h14" {...p}/>,
  Flame: (p) => <SvgIcon d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" {...p}/>,
  Zap: (p) => <SvgIcon d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" {...p}/>,
};

const App = () => {
  const [view, setView] = useState('home'); 
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // ==========================================
  // 2. CONEXIÓN REAL A SHOPIFY
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
              handle
              description
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
          category: node.collections.edges[0]?.node.title || 'General',
          image: node.images.edges[0]?.node.url,
          price: parseFloat(node.variants.edges[0].node.price.amount),
          oldPrice: parseFloat(node.variants.edges[0].node.compareAtPrice?.amount || node.variants.edges[0].node.price.amount * 1.2),
          variantId: node.variants.edges[0].node.id,
          weight: 'Unidad'
        }));
        setProducts(formatted);
      } catch (error) {
        console.error("Error conectando a Shopify:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopify();
    const savedUser = localStorage.getItem(`${APP_ID}_user`);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Notificaciones de ventas simuladas
  useEffect(() => {
    const interval = setInterval(() => {
      const names = ['Junior', 'Milagros', 'Nelson', 'Carla'];
      const zones = ['Centro', 'Pueblo Nuevo', 'Los Multis'];
      setToast({ title: `${names[Math.floor(Math.random()*names.length)]} en ${zones[Math.floor(Math.random()*zones.length)]}`, desc: `Realizó un pedido Express` });
      setTimeout(() => setToast(null), 4000);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filtrado de productos
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      (activeCategory === 'Todas' || p.category === activeCategory) &&
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm, activeCategory]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.variantId === product.variantId);
      if (existing) return prev.map(item => item.variantId === product.variantId ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans pb-24 overflow-x-hidden">
      
      {/* Toast Notificación */}
      {toast && (
        <div className="fixed top-24 left-6 z-[100] bg-white shadow-2xl rounded-3xl p-5 border border-orange-100 flex items-center gap-4 animate-bounce">
          <div className="w-12 h-12 bg-[#FF3D00] rounded-2xl flex items-center justify-center text-white"><Icons.Zap /></div>
          <div><p className="text-xs font-black">{toast.title}</p><p className="text-[10px] text-gray-400">{toast.desc}</p></div>
        </div>
      )}

      {/* Header Premium */}
      <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-gray-50 px-6 py-4 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div onClick={() => setView('home')} className="flex items-center gap-3 cursor-pointer">
            <div className="bg-[#FF3D00] text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-red-200">K</div>
            <span className="font-black text-xl tracking-tighter">Kolma<span className="text-[#FF3D00]">RD</span></span>
          </div>
          <button onClick={() => setView('cart')} className="md:hidden bg-[#FF3D00] text-white p-3 rounded-xl flex items-center gap-2 font-bold text-xs">
            <Icons.Bag size={18} /> RD$ {subtotal.toFixed(0)}
          </button>
        </div>

        <div className="flex-1 w-full relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"><Icons.Search size={20} /></div>
          <input 
            type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="¿Qué necesitas hoy en Cotuí?" 
            className="w-full bg-gray-50 border-none rounded-3xl py-4 pl-14 pr-6 font-bold outline-none focus:ring-2 ring-orange-200"
          />
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => setView('cart')} className="bg-black text-white px-8 py-4 rounded-3xl flex items-center gap-4 hover:scale-105 transition-all shadow-xl">
            <Icons.Bag /> <span className="font-black">RD$ {subtotal.toFixed(0)}</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Pasillos Categorías */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar mb-12">
          {['Todas', 'Lácteos', 'Frutas y Verduras', 'Carnes', 'Bebidas'].map(cat => (
            <button 
              key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-[#FF3D00] text-white shadow-lg' : 'bg-white text-gray-400 hover:text-black'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-orange-100 border-t-[#FF3D00] rounded-full animate-spin"></div>
            <p className="mt-4 font-black text-gray-300">Conectando con Kolma Almacén...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {filteredProducts.map(p => (
              <div key={p.id} className="group flex flex-col">
                <div className="relative aspect-square rounded-[40px] bg-white border border-gray-50 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 mb-4">
                  <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-[9px] font-black flex items-center gap-1 shadow-sm">
                      <Icons.Flame size={12} className="text-red-500"/> POPULAR
                    </div>
                  </div>
                  <button onClick={() => addToCart(p)} className="absolute bottom-4 right-4 bg-black text-white p-4 rounded-2xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl hover:bg-[#FF3D00]">
                    <Icons.Plus size={20} />
                  </button>
                </div>
                <p className="text-[10px] font-black text-orange-500 uppercase">{p.category}</p>
                <h4 className="font-bold text-sm truncate">{p.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-black text-lg">RD$ {p.price.toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vista del Carrito */}
        {view === 'cart' && (
          <div className="fixed inset-0 z-[100] bg-white overflow-y-auto p-8 animate-in slide-in-from-bottom-10">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-black">Tu Canasta</h2>
                <button onClick={() => setView('home')} className="bg-gray-100 p-4 rounded-full"><Icons.X /></button>
              </div>
              {cart.length === 0 ? (
                <p className="text-center text-gray-400 py-20 font-bold">No has agregado nada aún socio.</p>
              ) : (
                <div className="space-y-6">
                  {cart.map(item => (
                    <div key={item.variantId} className="flex items-center gap-6 bg-gray-50 p-6 rounded-3xl">
                      <img src={item.image} className="w-20 h-20 rounded-2xl object-cover shadow-md" />
                      <div className="flex-1">
                        <h4 className="font-black text-lg leading-tight">{item.name}</h4>
                        <p className="text-[#FF3D00] font-black">RD$ {item.price.toFixed(0)}</p>
                      </div>
                      <div className="flex items-center gap-4 bg-white p-2 rounded-2xl">
                        <button onClick={() => updateCartQty(item.variantId, -1)} className="p-2"><Icons.Minus size={16}/></button>
                        <span className="font-black">{item.qty}</span>
                        <button onClick={() => addToCart(item)} className="p-2"><Icons.Plus size={16}/></button>
                      </div>
                    </div>
                  ))}
                  <div className="mt-10 border-t pt-10 text-center">
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-[4px] mb-2">Total a pagar</p>
                    <h3 className="text-6xl font-black mb-10">RD$ {subtotal.toFixed(0)}</h3>
                    <button className="w-full bg-[#FF3D00] text-white py-6 rounded-[35px] font-black text-2xl shadow-xl shadow-red-200">Confirmar Pedido</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Nav Móvil */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t px-10 py-6 flex justify-around items-center z-50 rounded-t-[40px] shadow-2xl">
        <button onClick={() => setView('home')} className={view === 'home' ? 'text-[#FF3D00]' : 'text-gray-300'}><Icons.Zap size={28}/></button>
        <button onClick={() => setView('cart')} className={`relative ${view === 'cart' ? 'text-[#FF3D00]' : 'text-gray-300'}`}>
          <Icons.Bag size={28}/>
          {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] w-5 h-5 rounded-full flex items-center justify-center font-black">{cart.length}</span>}
        </button>
        <button onClick={() => setIsAuthOpen(true)} className="text-gray-300"><Icons.User size={28}/></button>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};
