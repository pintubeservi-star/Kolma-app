"use client";
import React, { useState, useEffect, useMemo } from 'react';

const Icons = {
  Search: ({ size = 24, className = "" }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Bag: ({ size = 24, className = "" }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  User: ({ size = 24, className = "" }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Plus: ({ size = 24, className = "" }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  Minus: ({ size = 24, className = "" }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>,
  ArrowRight: ({ size = 24, className = "" }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
  Phone: ({ size = 24, className = "" }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Message: ({ size = 24, className = "" }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  Basket: ({ size = 24, className = "" }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Lacteos: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18h12l1-9H5l1 9zM10 6h4l.5 3h-5L10 6z" /><circle cx="12" cy="14" r="2" /></svg>,
  Frutas: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 3a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>,
  Carnes: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5c0 3.5-2.5 4.5-5 4.5s-5-1-5-4.5 2.24-4 5-4 5 .5 5 4zM15 5c0 4-4 15-4 15s-6-11-6-15" /><line x1="10" y1="2" x2="10" y2="8" /></svg>,
  Panaderia: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13c3.5-3 14.5-3 18 0M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6M12 13v8M8 13v8M16 13v8" /></svg>
};

const COTUI_CENTER = [19.0528, -70.1492];

export default function KolmaRD() {
  const [view, setView] = useState('home'); 
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Llama a la API interna segura
  useEffect(() => {
    const fetchShopifyProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        
        if(json.data) {
           const formattedProducts = json.data.products.edges.map(({node}) => ({
             id: node.id,
             name: node.title,
             category: node.productType || 'Despensa',
             price: parseFloat(node.variants.edges[0]?.node?.price?.amount || 0),
             oldPrice: parseFloat(node.variants.edges[0]?.node?.compareAtPrice?.amount || 0),
             image: node.images.edges[0]?.node?.url || 'https://via.placeholder.com/300'
           }));
           setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Error fetching", error);
      }
    };
    fetchShopifyProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      (activeCategory === 'Todos' || p.category === activeCategory) &&
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, activeCategory, products]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setToast({ title: "Agregado", desc: `${product.name} en tu canasta.` });
    setTimeout(() => setToast(null), 2000);
  };

  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

  const handleAuth = (e) => {
    e.preventDefault();
    if(email && password) {
       setUser({ email, name: email.split('@')[0] });
       setView('home');
       setToast({ title: `Bienvenido, ${email.split('@')[0]}`, desc: "Sesión iniciada con éxito." });
       setTimeout(() => setToast(null), 3000);
    }
  };

  // Llama a la API interna segura
  const handleCheckout = async () => {
    if(!user) {
        setView('auth');
        return;
    }
    
    try {
        const shipdayPayload = {
            orderNumber: `KOLMA-${Math.floor(Math.random() * 10000)}`,
            customerName: user.name,
            customerEmail: user.email,
            customerPhoneNumber: "18090000000",
            customerAddress: "Centro de Cotuí, República Dominicana",
            restaurantName: "Kolma RD",
            restaurantAddress: "Cotuí Centro",
            orderItem: cart.map(item => ({ name: item.name, quantity: item.qty, unitPrice: item.price })),
            totalOrderCost: subtotal
        };

        await fetch("/api/checkout", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shipdayPayload)
        });

        setView('tracking');
        setCart([]);
    } catch(err) {
        console.error("Error", err);
        setView('tracking'); 
    }
  };

  const MapView = () => {
    useEffect(() => {
      if (!window.L || !document.getElementById('live-map')) return;
      const map = window.L.map('live-map', { zoomControl: false }).setView(COTUI_CENTER, 15);
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);
      const icon = window.L.divIcon({ html: '<div class="w-12 h-12 flex items-center justify-center text-2xl bg-black rounded-full text-white shadow-2xl border-4 border-white">🛵</div>', className: '', iconSize: [48, 48] });
      window.L.marker(COTUI_CENTER, { icon }).addTo(map);
      return () => map.remove();
    }, []);
    return <div id="live-map" className="w-full h-full min-h-[400px] bg-gray-100 rounded-[40px]" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0 font-sans selection:bg-red-500 selection:text-white">
      {toast && (
        <div className="fixed top-24 left-6 z-[100] bg-white shadow-2xl rounded-2xl p-4 border border-gray-100 flex items-center gap-4 transition-all duration-500 ease-out translate-y-0 opacity-100">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Icons.Basket size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none mb-1">{toast.title}</p>
            <p className="text-xs text-gray-500 font-medium">{toast.desc}</p>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div onClick={() => setView('home')} className="bg-gradient-to-br from-red-600 to-orange-500 text-white w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg cursor-pointer hover:opacity-90 active:scale-95 transition-all">K</div>
          <div className="hidden md:block">
            <h1 className="font-black text-2xl tracking-tighter text-gray-900">Kolma<span className="text-red-600">RD</span></h1>
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest leading-none">Cotuí</p>
          </div>
        </div>

        {view === 'home' && (
            <div className="flex-1 max-w-lg mx-6 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Icons.Search size={18} />
            </div>
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busca en el super..." 
                className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-4 font-semibold text-gray-800 placeholder-gray-400 outline-none border-2 border-transparent focus:border-red-500 focus:bg-white transition-all text-sm shadow-inner"
            />
            </div>
        )}

        <div className="flex items-center gap-4">
            <button onClick={() => user ? setToast({title: user.name, desc: "Sesión activa"}) : setView('auth')} className="hidden md:flex bg-gray-100 text-gray-900 p-3 rounded-full items-center justify-center shadow-sm hover:bg-gray-200 transition-all">
               <Icons.User size={20} />
            </button>
            <button onClick={() => setView('cart')} className="bg-gray-900 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-lg hover:bg-black hover:-translate-y-0.5 active:scale-95 transition-all">
            <Icons.Bag size={20} />
            <span className="font-bold border-l border-white/20 pl-3">RD$ {subtotal}</span>
            </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        
        {view === 'auth' && (
            <div className="max-w-md mx-auto bg-white rounded-[40px] p-10 shadow-2xl border border-gray-100 mt-10">
                <h2 className="text-3xl font-black tracking-tight text-gray-900 mb-2 text-center">
                    {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <p className="text-gray-500 text-center font-medium mb-8">Para comprar en KolmaRD</p>
                
                <form onSubmit={handleAuth} className="space-y-4">
                    <input type="email" placeholder="Correo electrónico" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-semibold outline-none focus:border-red-500 transition-all" />
                    <input type="password" placeholder="Contraseña" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-semibold outline-none focus:border-red-500 transition-all" />
                    <button type="submit" className="w-full bg-red-600 text-white font-bold text-lg py-4 rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/30 mt-4">
                        {authMode === 'login' ? 'Entrar' : 'Registrarme'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm font-bold text-gray-500 cursor-pointer hover:text-red-600" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
                    {authMode === 'login' ? '¿No tienes cuenta? Regístrate' : 'Ya tengo cuenta. Iniciar sesión'}
                </p>
            </div>
        )}

        {view === 'home' && (
          <div className="space-y-12">
            {!searchTerm && (
              <div className="relative h-[300px] bg-gradient-to-r from-gray-900 to-gray-800 rounded-[32px] overflow-hidden p-10 flex items-center group cursor-pointer shadow-2xl">
                <div className="z-10 text-white max-w-md">
                  <span className="bg-red-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-6 inline-block shadow-md">KolmaRD Express</span>
                  <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">El súper <br/> <span className="text-orange-400">de Cotuí.</span></h2>
                  <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg hover:bg-gray-50 transition-colors">
                    Comprar ahora <Icons.ArrowRight size={18}/>
                  </button>
                </div>
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800" alt="Banner" className="absolute right-0 top-0 h-full w-3/5 object-cover opacity-40 group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
              </div>
            )}

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 pt-2">
              {['Todos', 'Lácteos', 'Frutas y Verduras', 'Carnes', 'Panadería'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`flex flex-col items-center gap-3 p-6 min-w-[130px] rounded-3xl transition-all duration-300 border-2 ${activeCategory === cat ? 'bg-white border-red-500 shadow-xl shadow-red-500/10 -translate-y-1' : 'bg-white border-transparent text-gray-500 hover:shadow-md hover:border-gray-200'}`}
                >
                  <div className={activeCategory === cat ? 'text-red-500' : 'text-gray-400'}>
                    {cat === 'Lácteos' ? <Icons.Lacteos /> : cat === 'Frutas y Verduras' ? <Icons.Frutas /> : cat === 'Carnes' ? <Icons.Carnes /> : <Icons.Panaderia />}
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${activeCategory === cat ? 'text-gray-900' : 'text-gray-500'}`}>{cat}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
              {filteredProducts.map(p => (
                <div key={p.id} className="group relative flex flex-col bg-white p-4 rounded-[28px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square rounded-2xl bg-gray-50 overflow-hidden mb-5 cursor-pointer">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    <button 
                      onClick={() => addToCart(p)}
                      className="absolute bottom-3 right-3 bg-gray-900 text-white p-3 rounded-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-red-600"
                    >
                      <Icons.Plus size={20} />
                    </button>
                  </div>
                  <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">{p.category}</p>
                  <h4 className="font-bold text-gray-900 text-base leading-tight truncate mb-2">{p.name}</h4>
                  <div className="flex items-center gap-3 mt-auto">
                    <span className="font-black text-xl text-gray-900 tracking-tight">RD$ {p.price}</span>
                    {p.oldPrice > 0 && <span className="text-xs text-gray-400 line-through font-semibold">RD$ {p.oldPrice}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-3xl mx-auto bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-100">
             <h2 className="text-4xl font-black tracking-tight text-gray-900 mb-10 text-center">Tu Canasta</h2>
             {cart.length === 0 ? (
               <div className="text-center py-20 text-gray-400 font-bold text-xl">Tu canasta está vacía.</div>
             ) : (
               <div className="space-y-6">
                 {cart.map(item => (
                   <div key={item.id} className="flex items-center gap-6 p-4 rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all bg-white">
                     <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover shadow-sm" />
                     <div className="flex-1">
                       <h4 className="font-bold text-lg text-gray-900 leading-tight mb-1">{item.name}</h4>
                       <p className="text-red-600 font-black text-lg">RD$ {item.price}</p>
                     </div>
                     <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                        <button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? {...i, qty: Math.max(0, i.qty - 1)} : i).filter(i => i.qty > 0))} className="w-10 h-10 flex items-center justify-center bg-white text-gray-600 hover:text-gray-900 rounded-xl shadow-sm transition-colors"><Icons.Minus size={18}/></button>
                        <span className="font-bold text-gray-900 w-6 text-center">{item.qty}</span>
                        <button onClick={() => addToCart(item)} className="w-10 h-10 flex items-center justify-center bg-white text-gray-600 hover:text-gray-900 rounded-xl shadow-sm transition-colors"><Icons.Plus size={18}/></button>
                     </div>
                   </div>
                 ))}
                 <div className="pt-10 mt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                       <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total a pagar</p>
                       <h3 className="text-5xl font-black text-gray-900 tracking-tight">RD$ {subtotal}</h3>
                    </div>
                    <button onClick={handleCheckout} className="w-full md:w-auto bg-gray-900 text-white px-12 py-5 rounded-full font-bold text-xl shadow-xl shadow-gray-900/20 hover:bg-black hover:-translate-y-1 transition-all">Pagar Ahora</button>
                 </div>
               </div>
             )}
          </div>
        )}

        {view === 'tracking' && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white rounded-[40px] p-10 md:p-12 shadow-2xl border border-gray-100">
               <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">Estado de tu Orden</h2>
               <div className="space-y-10 relative">
                  <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gray-100 z-0"></div>
                  {['Pedido Recibido', 'Preparación en Tienda', 'Repartidor en Camino', 'Entrega Exitosa'].map((s, i) => (
                    <div key={i} className="flex gap-6 items-center relative z-10">
                       <div className={`w-6 h-6 rounded-full border-4 border-white shadow-md ${i <= 2 ? 'bg-red-500 ring-4 ring-red-50 animate-pulse' : 'bg-gray-200'}`} />
                       <span className={`text-lg font-bold ${i <= 2 ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
                    </div>
                  ))}
               </div>
               
               <div className="mt-16 p-6 bg-gray-900 text-white rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-14 bg-gradient-to-tr from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">🛵</div>
                     <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Socio Repartidor</p>
                        <p className="font-bold text-xl tracking-tight leading-none text-white">Socio Shipday</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="h-[500px] lg:h-[600px] overflow-hidden rounded-[40px] shadow-2xl border border-gray-100 sticky top-32 bg-gray-100 flex items-center justify-center">
               <MapView />
               {!window.L && <p className="text-gray-400 font-bold">Cargando Mapa...</p>}
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-200 px-8 py-5 flex justify-around md:hidden z-50 pb-8">
        <button onClick={() => {setView('home'); setSearchTerm('');}} className={`p-3 rounded-2xl transition-all duration-300 ${view === 'home' ? 'text-gray-900 scale-110' : 'text-gray-400'}`}>
          <Icons.Search size={28} />
        </button>
        <button onClick={() => setView('cart')} className={`relative p-4 rounded-2xl transition-all duration-300 -translate-y-4 shadow-xl ${view === 'cart' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'}`}>
          <Icons.Bag size={24} />
          {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-orange-500 text-white w-6 h-6 rounded-full text-[11px] flex items-center justify-center font-bold border-2 border-white shadow-sm">{cart.length}</span>}
        </button>
        <button onClick={() => setView('auth')} className={`p-3 rounded-2xl transition-all duration-300 ${view === 'auth' ? 'text-gray-900 scale-110' : 'text-gray-400'}`}>
          <Icons.User size={28} />
        </button>
      </nav>
    </div>
  );
}
