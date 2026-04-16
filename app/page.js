"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONOGRAFÍA SVG PURA (Sin dependencias) ---
const Icons = {
  Search: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Bag: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  ),
  User: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Plus: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5v14M5 12h14"/></svg>
  ),
  Minus: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/></svg>
  ),
  MapPin: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Phone: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  Truck: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10Z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
  ),
  Apple: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 3a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Milk: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18h12l1-9H5l1 9zM10 6h4l.5 3h-5L10 6z"/><circle cx="12" cy="14" r="2"/></svg>
  ),
  Meat: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 5c0 3.5-2.5 4.5-5 4.5s-5-1-5-4.5 2.24-4 5-4 5 .5 5 4zM15 5c0 4-4 15-4 15s-6-11-6-15"/><line x1="10" y1="2" x2="10" y2="8"/></svg>
  ),
  Bread: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 13c3.5-3 14.5-3 18 0M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6M12 13v8M8 13v8M16 13v8"/></svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
  ),
  X: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
  )
};

const COTUI_CENTER = [19.0528, -70.1492];

export default function KolmaRD() {
  // --- ESTADOS PRINCIPALES ---
  const [view, setView] = useState('home'); 
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [orderStep, setOrderStep] = useState(0);

  // Formulario de Registro Obligatorio
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', address: '', phone: ''
  });

  const mapRef = useRef(null);

  // --- 1. PERSISTENCIA Y CARGA ---
  useEffect(() => {
    const localUser = localStorage.getItem('kolmard_u');
    if (localUser) setUser(JSON.parse(localUser));

    const fetchShopify = async () => {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.data) {
          const mapped = json.data.products.edges.map(({ node }) => {
            const type = (node.productType || "").toLowerCase();
            let cat = 'Despensa';
            if (type.includes('carne')) cat = 'Carnes';
            if (type.includes('fruta') || type.includes('verdur')) cat = 'Frutas y Verduras';
            if (type.includes('leche') || type.includes('lacteo')) cat = 'Lácteos';
            if (type.includes('pan')) cat = 'Panadería';

            return {
              id: node.id,
              name: node.title,
              category: cat,
              price: parseFloat(node.variants.edges[0]?.node?.price?.amount || 0),
              image: node.images.edges[0]?.node?.url || 'https://via.placeholder.com/400'
            };
          });
          setProducts(mapped);
        }
      } catch (e) { console.error(e); }
    };
    fetchShopify();
  }, []);

  // --- 2. LÓGICA DE REGISTRO REAL (Shopify Connect) ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación de teléfono dominicano para Shopify (+1)
    let cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone.startsWith('1')) cleanPhone = `1${cleanPhone}`;
    const finalPhone = `+${cleanPhone}`;

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
        const newUser = { ...formData, phone: finalPhone };
        setUser(newUser);
        localStorage.setItem('kolmard_u', JSON.stringify(newUser));
        setView('home');
        showToast("¡Bienvenido!", "Cuenta creada en KolmaRD.");
      } else {
        showToast("Error", data.error || "Revisa los datos");
      }
    } catch (error) {
      showToast("Error", "No se pudo conectar con Shopify");
    } finally { setLoading(false); }
  };

  // --- 3. LÓGICA DE PEDIDO (Shipday Connect) ---
  const handleCheckout = async () => {
    if (!user) { setView('auth'); return; }
    setLoading(true);

    try {
      const payload = {
        orderNumber: `KRD-${Date.now().toString().slice(-5)}`,
        customerName: user.name,
        customerEmail: user.email,
        customerAddress: user.address,
        customerPhoneNumber: user.phone,
        orderItems: cart.map(i => ({ name: i.name, quantity: i.qty, unitPrice: i.price })),
        totalOrderCost: cart.reduce((acc, i) => acc + (i.price * i.qty), 0)
      };

      const res = await fetch("/api/checkout", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setView('tracking');
        setCart([]);
        simulateTracking();
      }
    } catch (e) {
      setView('tracking'); // Fallback para demo
    } finally { setLoading(false); }
  };

  const simulateTracking = () => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setOrderStep(step);
      if (step >= 3) clearInterval(interval);
    }, 4000);
  };

  const showToast = (title, desc) => {
    setToast({ title, desc });
    setTimeout(() => setToast(null), 3000);
  };

  // --- 4. MAPA VISUAL (Leaflet Integration) ---
  const MapComponent = () => {
    useEffect(() => {
      const loadMap = async () => {
        if (!window.L) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);

          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.async = true;
          script.onload = () => initLeaflet();
          document.body.appendChild(script);
        } else {
          initLeaflet();
        }
      };

      const initLeaflet = () => {
        if (mapRef.current) return;
        const L = window.L;
        const map = L.map('live-map-container', { zoomControl: false }).setView(COTUI_CENTER, 15);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);
        
        const motorIcon = L.divIcon({
          html: '<div class="bg-black text-white p-2 rounded-full border-4 border-white shadow-2xl animate-bounce">🛵</div>',
          className: '',
          iconSize: [40, 40]
        });

        L.marker(COTUI_CENTER, { icon: motorIcon }).addTo(map);
        mapRef.current = map;
      };

      loadMap();
      return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
    }, []);

    return <div id="live-map-container" className="w-full h-full min-h-[400px] md:min-h-[600px] z-0" />;
  };

  // --- VISTAS ---

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-[#1A1C1E] selection:bg-red-500 selection:text-white">
      
      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('home')}>
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
            <Icons.Bag size={28} />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter leading-none">KOLMA<span className="text-red-600">RD</span></h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Cotuí Centro</p>
          </div>
        </div>

        {view === 'home' && (
          <div className="flex-1 max-w-xl mx-10 relative hidden md:block">
            <Icons.Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Busca comida, víveres o limpieza..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl py-3.5 pl-14 pr-6 font-bold outline-none transition-all"
            />
          </div>
        )}

        <div className="flex items-center gap-4">
          <button onClick={() => setView(user ? 'home' : 'auth')} className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
            <Icons.User size={22} />
          </button>
          <button onClick={() => setView('cart')} className="bg-[#1A1C1E] text-white px-6 py-3.5 rounded-2xl flex items-center gap-4 shadow-xl active:scale-95 transition-all">
            <Icons.Bag size={20} />
            <span className="font-black border-l border-white/20 pl-4">RD$ {cart.reduce((a, b) => a + (b.price * b.qty), 0)}</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* VISTA: HOME */}
        {view === 'home' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            
            {/* Banner Hero */}
            <div className="relative h-[300px] md:h-[400px] bg-[#1A1C1E] rounded-[40px] overflow-hidden flex items-center p-12">
              <div className="z-10 max-w-lg space-y-6">
                <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Express Delivery</span>
                <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">Tu súper,<br /><span className="text-red-500">en 45 minutos.</span></h2>
                <button className="bg-white text-[#1A1C1E] px-8 py-4 rounded-2xl font-black shadow-2xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-3">
                  Comprar ahora <Icons.Plus size={20} />
                </button>
              </div>
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200" className="absolute right-0 top-0 w-full h-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A1C1E] via-[#1A1C1E]/60 to-transparent" />
            </div>

            {/* CATEGORÍAS GRANDES FUNCIONANDO */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { n: 'Todos', i: Icons.Bag, c: 'bg-gray-100 text-gray-900' },
                { n: 'Carnes', i: Icons.Meat, c: 'bg-red-50 text-red-600' },
                { n: 'Lácteos', i: Icons.Milk, c: 'bg-blue-50 text-blue-600' },
                { n: 'Frutas y Verduras', i: Icons.Apple, c: 'bg-green-50 text-green-600' },
                { n: 'Panadería', i: Icons.Bread, c: 'bg-orange-50 text-orange-600' }
              ].map(cat => (
                <button 
                  key={cat.n} 
                  onClick={() => setActiveCategory(cat.n)}
                  className={`flex flex-col items-center justify-center p-8 rounded-[40px] border-4 transition-all ${activeCategory === cat.n ? 'border-red-600 bg-white scale-105 shadow-2xl' : 'border-transparent bg-white shadow-sm hover:shadow-xl'}`}
                >
                  <div className={`mb-4 ${activeCategory === cat.n ? 'text-red-600' : 'text-gray-300'}`}>
                    <cat.i />
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest ${activeCategory === cat.n ? 'text-gray-900' : 'text-gray-400'}`}>{cat.n}</span>
                </button>
              ))}
            </div>

            {/* PRODUCTOS */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {products.filter(p => activeCategory === 'Todos' || p.category === activeCategory).map(p => (
                <div key={p.id} className="group bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all relative">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-5 bg-gray-50">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <button 
                      onClick={() => {
                        const ex = cart.find(i => i.id === p.id);
                        if(ex) setCart(cart.map(i => i.id === p.id ? {...i, qty: i.qty+1} : i));
                        else setCart([...cart, {...p, qty: 1}]);
                        showToast("Agregado", p.name);
                      }}
                      className="absolute bottom-3 right-3 bg-[#1A1C1E] text-white p-3.5 rounded-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl hover:bg-red-600"
                    >
                      <Icons.Plus size={24} />
                    </button>
                  </div>
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">{p.category}</p>
                  <h4 className="font-bold text-gray-900 text-sm md:text-base leading-tight mb-3 truncate">{p.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xl tracking-tighter">RD$ {p.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* VISTA: REGISTRO OBLIGATORIO */}
        {view === 'auth' && (
          <div className="max-w-md mx-auto py-10 animate-in zoom-in duration-500">
            <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-gray-100">
              <h2 className="text-3xl font-black text-center mb-2">{authMode === 'login' ? 'Bienvenido' : 'Crear Cuenta'}</h2>
              <p className="text-center text-gray-400 font-bold text-sm mb-10">Entra al súper de Cotuí</p>
              
              <form onSubmit={handleRegister} className="space-y-4">
                {authMode === 'register' && (
                  <>
                    <input type="text" placeholder="Nombre completo" required className="w-full bg-gray-50 border-2 border-transparent focus:border-red-500 rounded-2xl px-6 py-4 font-bold outline-none" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
                    <input type="text" placeholder="Dirección exacta en Cotuí" required className="w-full bg-gray-50 border-2 border-transparent focus:border-red-500 rounded-2xl px-6 py-4 font-bold outline-none" value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} />
                    <input type="tel" placeholder="WhatsApp (Ej: 8091112222)" required className="w-full bg-gray-50 border-2 border-transparent focus:border-red-500 rounded-2xl px-6 py-4 font-bold outline-none" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} />
                  </>
                )}
                <input type="email" placeholder="Email" required className="w-full bg-gray-50 border-2 border-transparent focus:border-red-500 rounded-2xl px-6 py-4 font-bold outline-none" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
                <input type="password" placeholder="Contraseña" required className="w-full bg-gray-50 border-2 border-transparent focus:border-red-500 rounded-2xl px-6 py-4 font-bold outline-none" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} />
                
                <button type="submit" disabled={loading} className="w-full bg-red-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all mt-4">
                  {loading ? 'Procesando...' : authMode === 'login' ? 'Iniciar Sesión' : 'Registrarme'}
                </button>
              </form>

              <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="w-full text-center mt-6 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-red-600">
                {authMode === 'login' ? '¿No tienes cuenta? Regístrate' : 'Ya tengo cuenta. Entrar'}
              </button>
            </div>
          </div>
        )}

        {/* VISTA: CARRITO */}
        {view === 'cart' && (
          <div className="max-w-3xl mx-auto py-10">
            <h2 className="text-4xl font-black mb-10 text-center tracking-tighter">Tu Canasta</h2>
            <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-gray-100">
              {cart.length === 0 ? <p className="text-center py-20 text-gray-300 font-black uppercase tracking-widest">Vacío</p> : (
                <div className="space-y-6">
                  {cart.map(i => (
                    <div key={i.id} className="flex items-center gap-6 p-4 rounded-3xl bg-gray-50">
                      <img src={i.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
                      <div className="flex-1">
                        <h4 className="font-black text-gray-900 leading-tight">{i.name}</h4>
                        <p className="text-red-600 font-black text-lg">RD$ {i.price}</p>
                      </div>
                      <div className="flex items-center gap-4 bg-white p-2 rounded-xl">
                        <button onClick={() => setCart(cart.map(x => x.id === i.id ? {...x, qty: Math.max(0, x.qty-1)} : x).filter(x=>x.qty>0))} className="text-gray-300 hover:text-red-600"><Icons.Minus size={18}/></button>
                        <span className="font-black w-4 text-center">{i.qty}</span>
                        <button onClick={() => setCart(cart.map(x => x.id === i.id ? {...x, qty: x.qty+1} : x))} className="text-gray-300 hover:text-red-600"><Icons.Plus size={18}/></button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-10 mt-10 border-t flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total del pedido</p>
                      <h3 className="text-5xl font-black tracking-tighter">RD$ {cart.reduce((a, b) => a + (b.price * b.qty), 0)}</h3>
                    </div>
                    <button onClick={handleCheckout} className="w-full md:w-auto bg-[#1A1C1E] text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl hover:bg-red-600 transition-all">Pagar Ahora</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VISTA: TRACKING + MAPA VISUAL */}
        {view === 'tracking' && (
          <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-1000">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Info de tracking */}
              <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-gray-100 flex flex-col">
                <h2 className="text-3xl font-black mb-10 tracking-tighter">Tu pedido está volando</h2>
                <div className="space-y-10 relative flex-1">
                  <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gray-100"></div>
                  {['Pedido Recibido', 'Preparación en Tienda', 'En camino a tu casa', '¡Entregado!'].map((s, i) => (
                    <div key={i} className={`flex gap-6 items-center relative z-10 transition-all ${orderStep >= i ? 'opacity-100' : 'opacity-20'}`}>
                      <div className={`w-6 h-6 rounded-full border-4 border-white shadow-lg ${orderStep >= i ? 'bg-red-600 animate-pulse' : 'bg-gray-200'}`} />
                      <span className="font-black uppercase tracking-widest text-sm">{s}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-12 p-6 bg-[#1A1C1E] text-white rounded-[32px] flex items-center gap-6 shadow-xl">
                  <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">🛵</div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Repartidor Shipday</p>
                    <p className="font-bold text-lg leading-none">Caminando hacia: {user?.address}</p>
                  </div>
                </div>
              </div>

              {/* MAPA VISUAL INTEGRADO */}
              <div className="bg-white rounded-[48px] overflow-hidden shadow-2xl border-8 border-white relative h-[500px] lg:h-auto">
                <MapComponent />
                <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-white">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Rastreo en vivo Cotuí</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen inferior del pedido */}
            <div className="bg-[#1A1C1E] p-10 rounded-[48px] text-white grid grid-cols-2 md:grid-cols-4 gap-8">
               <div><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Orden</p><p className="font-black text-xl">#KRD-9921</p></div>
               <div><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Destino</p><p className="font-black text-xl truncate">{user?.address}</p></div>
               <div><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Contacto</p><p className="font-black text-xl">{user?.phone}</p></div>
               <div><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Tipo</p><Badge variant="orange">Express</Badge></div>
            </div>
          </div>
        )}
      </main>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] bg-[#1A1C1E] text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom duration-300">
          <Icons.Check />
          <span className="font-black uppercase tracking-widest text-xs">{toast.desc}</span>
        </div>
      )}

      {/* FOOTER NAVEGACIÓN MÓVIL */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 px-10 py-6 flex justify-around md:hidden z-50 pb-10">
        <button onClick={() => setView('home')} className={`p-2 transition-all ${view === 'home' ? 'text-red-600 scale-125' : 'text-gray-300'}`}><Icons.Bag size={30} /></button>
        <button onClick={() => setView('cart')} className={`p-2 transition-all relative ${view === 'cart' ? 'text-red-600 scale-125' : 'text-gray-300'}`}>
          <Icons.Bag size={30} />
          {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black border-2 border-white">{cart.length}</span>}
        </button>
        <button onClick={() => setView('auth')} className={`p-2 transition-all ${view === 'auth' ? 'text-red-600 scale-125' : 'text-gray-300'}`}><Icons.User size={30} /></button>
      </nav>
    </div>
  );
}

// Subcomponente de estilo
const Badge = ({ children, variant = "red" }) => (
  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${variant === 'red' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
    {children}
  </span>
);
