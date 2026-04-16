"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- ICONOGRAFÍA PREMIUM (SVG) ---
const Icons = {
  Search: ({ size = 24, className = "" }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Bag: ({ size = 24, className = "" }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  User: ({ size = 24, className = "" }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Plus: ({ size = 24, className = "" }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  Minus: ({ size = 24, className = "" }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>,
  ArrowRight: ({ size = 24, className = "" }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
  Basket: ({ size = 24, className = "" }) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Lacteos: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18h12l1-9H5l1 9zM10 6h4l.5 3h-5L10 6z" /><circle cx="12" cy="14" r="2" /></svg>,
  Frutas: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 3a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>,
  Carnes: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5c0 3.5-2.5 4.5-5 4.5s-5-1-5-4.5 2.24-4 5-4 5 .5 5 4zM15 5c0 4-4 15-4 15s-6-11-6-15" /><line x1="10" y1="2" x2="10" y2="8" /></svg>,
  Panaderia: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13c3.5-3 14.5-3 18 0M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6M12 13v8M8 13v8M16 13v8" /></svg>,
  Despensa: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10"><path d="M3 3h18v18H3V3zM3 9h18M3 15h18M9 3v18M15 3v18" /></svg>
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
  const [loading, setLoading] = useState(false);
  
  // Datos de registro obligatorio
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', phone: '' });

  // --- 1. CARGA DE PRODUCTOS (SHOPIFY API) ---
  useEffect(() => {
    const fetchShopify = async () => {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.data) {
          const items = json.data.products.edges.map(({ node }) => {
            const type = (node.productType || "").toLowerCase().trim();
            let cat = 'Despensa';
            if (type.includes('carne') || type.includes('pollo')) cat = 'Carnes';
            if (type.includes('fruta') || type.includes('verdur') || type.includes('vegetal')) cat = 'Frutas y Verduras';
            if (type.includes('leche') || type.includes('lacteo') || type.includes('queso')) cat = 'Lácteos';
            if (type.includes('pan') || type.includes('reposter')) cat = 'Panadería';

            return {
              id: node.id,
              name: node.title,
              category: cat,
              price: parseFloat(node.variants.edges[0]?.node?.price?.amount || 0),
              image: node.images.edges[0]?.node?.url || 'https://via.placeholder.com/300'
            };
          });
          setProducts(items);
        }
      } catch (e) { console.error("Error productos:", e); }
    };
    fetchShopify();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      (activeCategory === 'Todos' || p.category === activeCategory) &&
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, activeCategory, products]);

  // --- 2. REGISTRO CONECTADO A SHOPIFY ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    let finalPhone = formData.phone;
    if (!finalPhone.startsWith('+')) finalPhone = `+1${finalPhone}`;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.name,
          phone: finalPhone,
          address: formData.address
        }),
      });

      const data = await res.json();

      if (data.success) {
        setUser({ name: formData.name, email: formData.email, address: formData.address, phone: finalPhone });
        setView('home');
        setToast({ title: "Bienvenido", desc: "Registro completado con éxito." });
      } else {
        setToast({ title: "Error", desc: data.error || "Datos incorrectos" });
      }
    } catch (error) {
      setToast({ title: "Error", desc: "Fallo de conexión" });
    } finally { setLoading(false); }
  };

  // --- 3. CHECKOUT CONEXIÓN SHIPDAY ---
  const handleCheckout = async () => {
    if(!user) { setView('auth'); return; }
    setLoading(true);
    try {
        const payload = {
            orderNumber: `KOLMA-${Date.now().toString().slice(-4)}`,
            customerName: user.name,
            customerEmail: user.email,
            customerPhoneNumber: user.phone,
            customerAddress: user.address,
            restaurantName: "KolmaRD Super",
            orderItem: cart.map(i => ({ name: i.name, quantity: i.qty, unitPrice: i.price })),
            totalOrderCost: cart.reduce((acc, i) => acc + (i.price * i.qty), 0)
        };
        const res = await fetch("/api/checkout", { method: 'POST', body: JSON.stringify(payload) });
        if(res.ok) {
            setView('tracking');
            setCart([]);
        }
    } catch(e) { 
        setView('tracking'); // Forzamos para demo si falla el post
    } finally { setLoading(false); }
  };

  // --- 4. COMPONENTE DE MAPA (CORREGIDO) ---
  const MapView = () => {
    const mapRef = useRef(null);

    useEffect(() => {
      // Cargamos Leaflet dinámicamente para evitar errores de SSR
      const loadLeaflet = async () => {
        if (!window.L) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);

          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.async = true;
          script.onload = () => initMap();
          document.body.appendChild(script);
        } else {
          initMap();
        }
      };

      const initMap = () => {
        if (!document.getElementById('live-map') || mapRef.current) return;
        
        const L = window.L;
        const map = L.map('live-map', { zoomControl: false }).setView(COTUI_CENTER, 15);
        mapRef.current = map;

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: 'KolmaRD Logistics'
        }).addTo(map);

        const icon = L.divIcon({ 
          html: '<div class="w-12 h-12 flex items-center justify-center text-2xl bg-black rounded-full text-white border-4 border-white shadow-2xl animate-bounce">🛵</div>', 
          className: '', 
          iconSize: [48, 48] 
        });

        L.marker(COTUI_CENTER, { icon }).addTo(map);
      };

      loadLeaflet();

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }, []);

    return <div id="live-map" className="w-full h-full min-h-[500px] bg-gray-200" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0 font-sans selection:bg-red-500">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-24 left-6 z-[100] bg-white shadow-2xl rounded-2xl p-4 border border-gray-100 flex items-center gap-4 animate-in slide-in-from-left duration-300">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Icons.Basket size={20} /></div>
          <div><p className="text-sm font-bold text-gray-900 leading-none">{toast.title}</p><p className="text-xs text-gray-500">{toast.desc}</p></div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-gradient-to-br from-red-600 to-orange-500 text-white w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg hover:scale-105 transition-all">K</div>
          <div className="hidden md:block">
            <h1 className="font-black text-2xl tracking-tighter text-gray-900">Kolma<span className="text-red-600">RD</span></h1>
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest leading-none">Supermercado</p>
          </div>
        </div>

        {view === 'home' && (
          <div className="flex-1 max-w-lg mx-6 relative">
            <Icons.Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Busca en el súper..." className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-4 font-semibold text-gray-800 outline-none border-2 border-transparent focus:border-red-500 focus:bg-white transition-all text-sm shadow-inner" />
          </div>
        )}

        <div className="flex items-center gap-4">
            <button onClick={() => setView('auth')} className="bg-gray-100 text-gray-900 p-3 rounded-full hover:bg-gray-200 transition-all shadow-sm"><Icons.User size={20} /></button>
            <button onClick={() => setView('cart')} className="bg-gray-900 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-lg hover:bg-black transition-all active:scale-95">
              <Icons.Bag size={20} />
              <span className="font-bold border-l border-white/20 pl-3">RD$ {cart.reduce((acc, i) => acc + (i.price * i.qty), 0)}</span>
            </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        
        {/* VISTA: REGISTRO CON CAMPOS OBLIGATORIOS */}
        {view === 'auth' && (
            <div className="max-w-md mx-auto bg-white rounded-[40px] p-10 shadow-2xl border border-gray-100 mt-10">
                <h2 className="text-3xl font-black text-center text-gray-900 mb-2">{authMode === 'login' ? 'Entrar' : 'Nueva Cuenta'}</h2>
                <p className="text-gray-500 text-center mb-8">Disfruta el súper de Cotuí desde casa</p>
                <form onSubmit={handleAuth} className="space-y-4">
                    {authMode === 'register' && (
                      <>
                        <input type="text" placeholder="Nombre completo" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-semibold outline-none focus:border-red-500 transition-all" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
                        <input type="text" placeholder="Dirección en Cotuí (Sector/Calle)" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-semibold outline-none focus:border-red-500 transition-all" value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} />
                        <input type="tel" placeholder="Teléfono / WhatsApp" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-semibold outline-none focus:border-red-500 transition-all" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} />
                      </>
                    )}
                    <input type="email" placeholder="Email" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-semibold outline-none focus:border-red-500 transition-all" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
                    <input type="password" placeholder="Contraseña" required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-semibold outline-none focus:border-red-500 transition-all" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} />
                    <button disabled={loading} className="w-full bg-red-600 text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all">
                        {loading ? 'Procesando...' : authMode === 'login' ? 'Entrar' : 'Registrarme'}
                    </button>
                </form>
                <p className="text-center mt-6 text-sm font-bold text-gray-400 cursor-pointer hover:text-red-600" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
                    {authMode === 'login' ? '¿No tienes cuenta? Regístrate aquí' : 'Ya tengo cuenta. Entrar'}
                </p>
            </div>
        )}

        {/* VISTA: HOME (Botones de Categoría Grandes) */}
        {view === 'home' && (
          <div className="space-y-12">
            {!searchTerm && (
              <div className="relative h-[250px] md:h-[350px] bg-gray-900 rounded-[40px] overflow-hidden p-8 md:p-14 flex items-center shadow-2xl">
                <div className="z-10 text-white max-w-lg animate-in fade-in duration-700">
                  <span className="bg-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block shadow-md">Cotuí Express</span>
                  <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Tu compra <br/> <span className="text-orange-400">en la puerta.</span></h2>
                  <button onClick={() => window.scrollTo({top: 600, behavior: 'smooth'})} className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-orange-400 hover:text-white transition-all shadow-lg">Comprar ahora <Icons.ArrowRight size={20}/></button>
                </div>
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000" className="absolute right-0 top-0 w-full h-full object-cover opacity-30" alt="Banner" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
              </div>
            )}

            {/* BOTONES DE CATEGORÍA GRANDES */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-4">
              {[
                { name: 'Todos', icon: Icons.Basket },
                { name: 'Lácteos', icon: Icons.Lacteos },
                { name: 'Frutas y Verduras', icon: Icons.Frutas },
                { name: 'Carnes', icon: Icons.Carnes },
                { name: 'Panadería', icon: Icons.Panaderia },
                { name: 'Despensa', icon: Icons.Despensa }
              ].map(cat => (
                <button 
                  key={cat.name} 
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex flex-col items-center justify-center gap-4 p-8 min-w-[160px] md:min-w-[190px] h-[180px] md:h-[220px] rounded-[48px] transition-all duration-300 border-2 ${activeCategory === cat.name ? 'bg-white border-red-500 shadow-2xl -translate-y-2' : 'bg-white border-transparent text-gray-300 hover:border-gray-200 hover:shadow-lg'}`}
                >
                  <div className={activeCategory === cat.name ? 'text-red-600' : 'text-gray-300'}>
                    <cat.icon />
                  </div>
                  <span className={`text-[12px] font-black uppercase tracking-widest text-center ${activeCategory === cat.name ? 'text-gray-900' : 'text-gray-400'}`}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>

            {/* GRILLA DE PRODUCTOS */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
              {filteredProducts.map(p => (
                <div key={p.id} className="group bg-white p-4 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-5 bg-gray-50">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <button onClick={() => {
                        setCart(prev => {
                          const ex = prev.find(i => i.id === p.id);
                          if (ex) return prev.map(i => i.id === p.id ? {...i, qty: i.qty+1} : i);
                          return [...prev, {...p, qty: 1}];
                        });
                        setToast({ title: "Agregado", desc: p.name });
                        setTimeout(() => setToast(null), 2000);
                    }} className="absolute bottom-3 right-3 bg-gray-900 text-white p-3 rounded-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg hover:bg-red-600"><Icons.Plus size={20}/></button>
                  </div>
                  <p className="text-[9px] font-black text-orange-500 uppercase mb-1">{p.category}</p>
                  <h4 className="font-bold text-gray-900 text-sm md:text-base mb-2 truncate">{p.name}</h4>
                  <p className="font-black text-lg text-gray-900 mt-auto">RD$ {p.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA: CARRITO */}
        {view === 'cart' && (
          <div className="max-w-3xl mx-auto bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-50 animate-in slide-in-from-bottom duration-500">
             <h2 className="text-4xl font-black text-gray-900 mb-10 text-center">Tu Canasta</h2>
             {cart.length === 0 ? <div className="text-center py-20 text-gray-300 font-bold text-xl uppercase tracking-widest">Carrito Vacío</div> : (
               <div className="space-y-6">
                 {cart.map(item => (
                   <div key={item.id} className="flex items-center gap-6 p-4 rounded-3xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all">
                     <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover shadow-sm" />
                     <div className="flex-1">
                       <h4 className="font-bold text-lg text-gray-900 leading-tight mb-1">{item.name}</h4>
                       <p className="text-red-600 font-black text-lg">RD$ {item.price}</p>
                     </div>
                     <div className="flex items-center gap-3 bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                        <button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? {...i, qty: Math.max(0, i.qty-1)} : i).filter(i => i.qty > 0))} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600"><Icons.Minus size={18}/></button>
                        <span className="font-bold text-gray-900 w-6 text-center">{item.qty}</span>
                        <button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? {...i, qty: i.qty+1} : i))} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600"><Icons.Plus size={18}/></button>
                     </div>
                   </div>
                 ))}
                 <div className="pt-10 mt-10 border-t flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                       <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total a pagar</p>
                       <h3 className="text-5xl font-black text-gray-900">RD$ {cart.reduce((acc, i) => acc + (i.price * i.qty), 0)}</h3>
                    </div>
                    <button onClick={handleCheckout} className="w-full md:w-auto bg-gray-900 text-white px-12 py-5 rounded-full font-bold text-xl shadow-xl hover:bg-black transition-all active:scale-95">Pagar Ahora</button>
                 </div>
               </div>
             )}
          </div>
        )}

        {/* VISTA: TRACKING (Mapa Visual Corregido) */}
        {view === 'tracking' && (
          <div className="max-w-6xl mx-auto flex flex-col gap-10">
            {/* Estado del pedido */}
            <div className="bg-white rounded-[40px] p-10 md:p-12 shadow-2xl border border-gray-100 animate-in fade-in duration-700">
               <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">Estado de tu Orden</h2>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-10 relative">
                      <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gray-100 z-0"></div>
                      {['Pedido Recibido', 'Preparación en Tienda', 'Repartidor en Camino', 'Entrega Exitosa'].map((s, i) => (
                        <div key={i} className="flex gap-6 items-center relative z-10">
                          <div className={`w-6 h-6 rounded-full border-4 border-white shadow-md ${i <= 2 ? 'bg-red-500 ring-4 ring-red-50 animate-pulse' : 'bg-gray-200'}`} />
                          <span className={`text-lg font-bold ${i <= 2 ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
                        </div>
                      ))}
                      <div className="mt-12 p-6 bg-gray-900 text-white rounded-[32px] flex items-center gap-5 shadow-xl">
                        <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">🛵</div>
                        <div><p className="text-[11px] font-black text-gray-400 uppercase mb-1">Repartidor Shipday</p><p className="font-bold text-lg text-white">En camino a: {user?.address}</p></div>
                      </div>
                  </div>
                  
                  {/* Mapa Visual en la parte inferior/lateral */}
                  <div className="h-[500px] overflow-hidden rounded-[40px] shadow-2xl border-8 border-white bg-gray-100 relative">
                     <MapView />
                     <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg z-50 text-[10px] font-black uppercase tracking-widest text-gray-900">Logística en Vivo - Cotuí</div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Navegación Móvil */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-200 px-8 py-5 flex justify-around md:hidden z-50 pb-8">
        <button onClick={() => {setView('home'); setSearchTerm('');}} className={`p-3 rounded-2xl transition-all ${view === 'home' ? 'text-red-600 scale-110' : 'text-gray-400'}`}><Icons.Search size={28} /></button>
        <button onClick={() => setView('cart')} className={`relative p-4 rounded-2xl transition-all -translate-y-4 shadow-xl ${view === 'cart' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'}`}>
          <Icons.Bag size={24} />
          {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-orange-500 text-white w-6 h-6 rounded-full text-[11px] flex items-center justify-center font-bold border-2 border-white shadow-sm">{cart.length}</span>}
        </button>
        <button onClick={() => setView('auth')} className={`p-3 rounded-2xl transition-all ${view === 'auth' ? 'text-red-600 scale-110' : 'text-gray-400'}`}><Icons.User size={28} /></button>
      </nav>
    </div>
  );
}
