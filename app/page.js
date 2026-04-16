"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- ICONOGRAFÍA SVG NATIVA (Cero Errores de Módulo) ---
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
  X: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
  ),
  Trash2: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
  ),
  MapPinned: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"/><circle cx="12" cy="8" r="2"/><path d="M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.3 0 .6.2.8s.5.2.8.1l6-2c.3-.1.6-.1.9-.1h3.141"/></svg>
  ),
  Phone: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  CheckCircle2: ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
  ),
  Sparkles: ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
  ),
  Mail: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
  Lock: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  Eye: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  EyeOff: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
  ),
  LogOut: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  ),
  Check: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  AlertCircle: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  )
};

const COTUI_CENTER = [19.0531, -70.1491];

// --- COMPONENTE MAPA (Leaflet) ---
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
          html: `<div class="w-10 h-10 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-bounce">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                 </div>`,
          iconSize: [40, 40], iconAnchor: [20, 20]
        });
        L.marker([19.055, -70.145], { icon: motoristaIcon }).addTo(map);
        
        const destIcon = L.divIcon({
          className: 'custom-dest',
          html: `<div class="w-6 h-6 bg-black rounded-full border-2 border-white shadow-lg"></div>`,
          iconSize: [24, 24], iconAnchor: [12, 12]
        });
        L.marker(COTUI_CENTER, { icon: destIcon }).addTo(map);
        mapRef.current = map;
      }
    }
  }, []);
  return <div id="map-tracking" className="w-full h-full grayscale-[0.5] contrast-[1.1]" />;
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
  const [discount, setDiscount] = useState(0);
  const [toast, setToast] = useState(null);
  const [orderStep, setOrderStep] = useState(0);

  // --- 1. PERSISTENCIA Y CARGA ---
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

    return () => {
      if(document.head.contains(link)) document.head.removeChild(link);
      if(document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.data) {
        const formatted = json.data.products.edges.map(({ node }) => ({
          id: node.id,
          name: node.title,
          price: parseFloat(node.variants.edges[0]?.node?.price?.amount || 0),
          unit: node.productType === 'Carnes' ? 'lb' : 'ud',
          img: node.images.edges[0]?.node?.url || 'https://via.placeholder.com/600',
          category: node.productType || 'General',
          collection: node.tags.includes('Oferta') ? 'Ofertas' : 'General',
          description: node.description || 'Fresco de Cotuí.'
        }));
        setProducts(formatted);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        const sessionUser = { ...data.customer, address: formData.address, phone: formData.phone };
        setUser(sessionUser);
        localStorage.setItem('kolmard_user', JSON.stringify(sessionUser));
        setView('home');
        showToast(`Bienvenido, ${data.customer.firstName}`);
      } else { showToast(data.error, "error"); }
    } catch (e) { showToast("Error de conexión", "error"); } finally { setLoading(false); }
  };

  const confirmOrder = async () => {
    if (!user) { setView('profile'); return; }
    setLoading(true);
    try {
      const payload = {
        orderNumber: `KOLMA-${Date.now().toString().slice(-4)}`,
        customerName: user.firstName,
        customerEmail: user.email,
        customerAddress: user.address,
        customerPhoneNumber: user.phone,
        orderItem: cart.map(i => ({ name: i.name, quantity: i.qty, unitPrice: i.price })),
        totalOrderCost: total - discount
      };
      const res = await fetch("/api/checkout", { method: 'POST', body: JSON.stringify(payload) });
      if (res.ok) {
        setCart([]);
        localStorage.removeItem('kolmard_cart');
        setView('orders');
        showToast("¡Pedido confirmado!");
      }
    } catch (e) { showToast("Error en logística", "error"); } finally { setLoading(false); }
  };

  const total = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

  // --- COMPONENTES DE VISTA ---

  return (
    <div className="min-h-screen bg-white text-[#0D1117] font-sans selection:bg-red-500 overflow-x-hidden">
      
      {/* TOAST SYSTEM (SIN LIBRERÍAS) */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] transition-all duration-300">
          <div className={`flex items-center space-x-3 px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${toast.type === 'success' ? 'bg-green-600/90 text-white border-green-400' : 'bg-red-600/90 text-white border-red-400'}`}>
            {toast.type === 'success' ? <Icons.Check /> : <Icons.AlertCircle />}
            <span className="text-[10px] font-black uppercase tracking-widest italic">{toast.message}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      {view !== 'tracking' && (
        <header className="sticky top-0 z-[80] bg-white/95 backdrop-blur-xl px-6 py-4 border-b border-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div onClick={() => setView('home')} className="flex items-center space-x-3 cursor-pointer">
              <div className="w-11 h-11 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-2xl">K</div>
              <div className="flex flex-col leading-none">
                <div className="flex items-center space-x-1.5"><Icons.MapPinned size={12} className="text-red-600" /><span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Cotuí, RD</span></div>
                <span className="text-[13px] font-black uppercase tracking-tighter italic">KolmaRD Express</span>
              </div>
            </div>
            <div className="bg-[#0D1117] text-white px-5 py-2 rounded-full flex items-center space-x-3">
              <Icons.ShoppingBag size={14} className="text-red-500" />
              <span className="font-black text-[12px] tracking-tighter italic uppercase">RD$ {total.toLocaleString()}</span>
            </div>
          </div>
          <div className="relative">
            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="BUSCA LO QUE NECESITES..." className="w-full bg-gray-100 py-3.5 pl-12 pr-6 rounded-2xl text-[11px] font-black outline-none uppercase tracking-widest border-2 border-transparent focus:border-red-500 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </header>
      )}

      <main className="max-w-md mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center py-56">
            <div className="animate-spin text-red-600 mb-6"><Icons.Plus size={32} /></div>
            <span className="text-[12px] font-black uppercase tracking-widest italic animate-pulse">Iniciando KolmaRD...</span>
          </div>
        ) : (
          <div className="transition-opacity duration-300">
            {view === 'home' && (
                <div className="space-y-4 pb-32">
                  {!searchTerm && (
                    <>
                      <div className="relative h-44 w-full rounded-[32px] overflow-hidden shadow-lg mt-2">
                        <img src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=800" className="w-full h-full object-cover" alt="Banner" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                          <span className="bg-orange-500 text-white px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest w-fit mb-2 italic">Fresco de Cotuí</span>
                          <h2 className="text-white text-3xl font-black leading-none italic tracking-tighter uppercase">Calidad<br />Garantizada.</h2>
                        </div>
                      </div>
                      <div className="bg-[#0D1117] -mx-4 px-5 py-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6 px-1">
                          <div className="flex flex-col">
                            <div className="flex items-center space-x-2 mb-1">
                              <Icons.Sparkles size={14} className="text-red-500" />
                              <span className="text-red-500 text-[9px] font-black uppercase tracking-[0.2em]">Exclusivo</span>
                            </div>
                            <h3 className="text-white font-black text-2xl italic uppercase tracking-tighter leading-none">Ofertas del día</h3>
                          </div>
                          <Icons.Tag className="text-white/20" size={30} />
                        </div>
                        <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
                          {products.filter(p => p.collection === 'Ofertas').map((p) => (
                            <div key={p.id} onClick={() => setSelectedProduct(p)} className="min-w-[160px] bg-white/5 backdrop-blur-md p-4 rounded-[28px] border border-white/5 cursor-pointer active:scale-95 transition-all">
                              <img src={p.img} className="w-full h-28 object-cover rounded-2xl mb-3 shadow-xl" alt={p.name} />
                              <p className="text-[10px] font-black text-white truncate uppercase mb-2">{p.name}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-red-500 font-black text-sm italic tracking-tighter">RD$ {p.price}</span>
                                <button className="bg-white text-black w-8 h-8 rounded-xl flex items-center justify-center"><Icons.Plus size={14}/></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  <div className="flex space-x-3 overflow-x-auto no-scrollbar py-2">
                    {['Todos', 'Carnes', 'Granos', 'Lácteos'].map(c => (
                      <button key={c} onClick={() => setActiveCategory(c)} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === c ? 'bg-red-600 text-white shadow-xl scale-105' : 'bg-gray-100 text-gray-400'}`}>{c}</button>
                    ))}
                  </div>
                  <div className="space-y-4 pt-4">
                    {products.filter(p => (activeCategory === 'Todos' || p.category === activeCategory) && p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                      <div key={p.id} onClick={() => setSelectedProduct(p)} className="flex items-center bg-white p-3 rounded-[28px] border border-gray-50 shadow-sm cursor-pointer active:scale-[0.98] transition-all">
                        <img src={p.img} className="w-20 h-20 rounded-2xl object-cover shadow-md" alt={p.name} />
                        <div className="ml-4 flex-1">
                          <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-tight leading-none mb-1">{p.name}</h4>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-lg font-black text-red-600 italic">RD$ {p.price}</span>
                            <button onClick={(e) => { 
                                e.stopPropagation(); 
                                setCart(prev => {
                                    const ex = prev.find(i => i.id === p.id);
                                    const n = ex ? prev.map(i => i.id === p.id ? {...i, qty: i.qty+1} : i) : [...prev, {...p, qty: 1}];
                                    localStorage.setItem('kolmard_cart', JSON.stringify(n));
                                    return n;
                                });
                                showToast(`Agregado: ${p.name}`);
                            }} className="bg-red-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"><Icons.Plus size={18}/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            )}

            {view === 'checkout' && (
                <div className="pt-6 pb-32 space-y-8 animate-fade-in">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setView('home')} className="p-3 bg-gray-50 rounded-2xl"><Icons.ArrowLeft size={20}/></button>
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Tu Carrito</h2>
                    </div>
                    <div className="space-y-3">
                        {cart.map(item => (
                            <div key={item.id} className="bg-white p-3 rounded-[24px] border border-gray-100 flex items-center shadow-sm">
                                <img src={item.img} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
                                <div className="ml-4 flex-1">
                                    <h4 className="text-[10px] font-black uppercase tracking-tight truncate w-40">{item.name}</h4>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-sm font-black text-red-600 italic">RD$ {item.price * item.qty}</span>
                                        <div className="flex items-center bg-gray-50 rounded-xl p-1">
                                            <button onClick={() => {
                                                const n = cart.map(i => i.id === item.id ? {...i, qty: Math.max(0, i.qty-1)} : i).filter(i => i.qty > 0);
                                                setCart(n); localStorage.setItem('kolmard_cart', JSON.stringify(n));
                                            }} className="w-6 h-6 text-gray-500"><Icons.Minus size={12} /></button>
                                            <span className="w-8 text-center text-[10px] font-black">{item.qty}</span>
                                            <button onClick={() => {
                                                const n = cart.map(i => i.id === item.id ? {...i, qty: i.qty+1} : i);
                                                setCart(n); localStorage.setItem('kolmard_cart', JSON.stringify(n));
                                            }} className="w-6 h-6 text-red-600"><Icons.Plus size={12} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {cart.length > 0 && (
                        <>
                        <div className="bg-gray-50 p-6 rounded-[32px] space-y-4">
                            <div className="flex justify-between text-gray-500 font-bold text-xs uppercase"><span>Total</span><span>RD$ {total}</span></div>
                        </div>
                        <button onClick={confirmOrder} className="w-full bg-red-600 text-white h-20 rounded-[32px] font-black uppercase italic shadow-2xl active:scale-95 transition-all text-xl">Confirmar Pedido</button>
                        </>
                    )}
                </div>
            )}

            {view === 'orders' && (
              <div className="pt-8 space-y-8 pb-32">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Mis Pedidos</h2>
                <div onClick={() => setView('tracking')} className="bg-white p-8 rounded-[40px] border-2 border-red-600 shadow-2xl cursor-pointer">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4"><Icons.Truck size={24} className="text-red-600" /><span className="text-sm font-black uppercase italic">Rastrear orden activa</span></div>
                    <span className="bg-orange-500 text-white px-4 py-1.5 rounded-xl text-[8px] font-black uppercase animate-pulse">En Camino</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 transition-all duration-1000" style={{width: '75%'}} />
                  </div>
                </div>
              </div>
            )}

            {view === 'profile' && (user ? (
              <div className="pt-8 space-y-10 pb-32">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-red-600 rounded-[32px] flex items-center justify-center text-white text-4xl font-black italic">{(user.firstName || "K")[0]}</div>
                  <div><h2 className="text-3xl font-black italic uppercase tracking-tighter">{user.firstName}</h2><p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{user.email}</p></div>
                </div>
                <button onClick={() => { setUser(null); localStorage.removeItem('kolmard_user'); setView('home'); }} className="w-full p-6 text-gray-400 font-black text-[11px] uppercase tracking-widest bg-gray-50 rounded-2xl flex items-center justify-center gap-2 transition-all active:bg-red-50"><Icons.LogOut size={16} /> Cerrar Sesión</button>
              </div>
            ) : (
              <div className="pt-12 px-2">
                <div className="text-center mb-12">
                  <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black italic mx-auto mb-6">K</div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic">{authMode === 'login' ? 'Bienvenido' : 'Crear Cuenta'}</h2>
                </div>
                <form onSubmit={handleAuth} className="space-y-5">
                  {authMode === 'register' && (
                    <>
                      <div className="bg-gray-50 rounded-2xl flex items-center px-6 py-5 space-x-4 border-2 border-transparent focus-within:border-red-600 transition-all"><Icons.User size={20} className="text-red-600" /><input type="text" placeholder="NOMBRE" className="bg-transparent font-black w-full outline-none uppercase" value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} /></div>
                      <div className="bg-gray-50 rounded-2xl flex items-center px-6 py-5 space-x-4 border-2 border-transparent focus-within:border-red-600 transition-all"><Icons.MapPinned size={20} className="text-red-600" /><input type="text" placeholder="DIRECCIÓN EN COTUÍ" className="bg-transparent font-black w-full outline-none uppercase" value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} /></div>
                      <div className="bg-gray-50 rounded-2xl flex items-center px-6 py-5 space-x-4 border-2 border-transparent focus-within:border-red-600 transition-all"><Icons.Phone size={20} className="text-red-600" /><input type="text" placeholder="TELÉFONO" className="bg-transparent font-black w-full outline-none uppercase" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} /></div>
                    </>
                  )}
                  <div className="bg-gray-50 rounded-2xl flex items-center px-6 py-5 space-x-4 border-2 border-transparent focus-within:border-red-600 transition-all"><Icons.Mail size={20} className="text-red-600" /><input type="email" placeholder="EMAIL" className="bg-transparent font-black w-full outline-none uppercase" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} /></div>
                  <div className="bg-gray-50 rounded-2xl flex items-center px-6 py-5 space-x-4 relative border-2 border-transparent focus-within:border-red-600 transition-all">
                    <Icons.Lock size={20} className="text-red-600" />
                    <input type={showPassword ? "text" : "password"} placeholder="CONTRASEÑA" className="bg-transparent font-black w-full outline-none uppercase" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword ? <Icons.EyeOff size={18}/> : <Icons.Eye size={18}/>}</button>
                  </div>
                  <button type="submit" className="w-full h-20 bg-red-600 text-white rounded-[32px] font-black uppercase italic shadow-2xl text-xl active:scale-95 transition-all">
                    {loading ? 'Sincronizando...' : authMode === 'login' ? 'Entrar' : 'Registrarme'}
                  </button>
                </form>
                <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="w-full text-center mt-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-colors hover:text-red-600">
                  {authMode === 'login' ? '¿NO TIENES CUENTA? REGÍSTRATE' : 'YA TENGO CUENTA'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER NAV */}
      {view !== 'tracking' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-3xl border-t border-gray-100 px-8 py-6 flex justify-between items-center z-[90] pb-10">
          <button onClick={()=>setView('home')} className={`flex flex-col items-center space-y-1.5 transition-all ${view === 'home' ? 'text-red-600 scale-110' : 'text-gray-300'}`}><Icons.ShoppingBag size={24} /><span className="text-[9px] font-black uppercase italic">Inicio</span></button>
          <button onClick={()=>setView('orders')} className={`flex flex-col items-center space-y-1.5 transition-all ${view === 'orders' ? 'text-red-600 scale-110' : 'text-gray-300'}`}><Icons.Truck size={24} /><span className="text-[9px] font-black uppercase italic">Pedidos</span></button>
          <div className="relative -mt-20">
            <button onClick={()=>setView('checkout')} className="bg-[#0D1117] w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-2xl relative ring-8 ring-white active:scale-90 transition-all">
              <Icons.ShoppingBag size={28} />
              {cart.length > 0 && <div className="absolute -top-2 -right-2 bg-red-600 text-[9px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xl italic">{cart.length}</div>}
            </button>
          </div>
          <button onClick={()=>setView('offers')} className={`flex flex-col items-center space-y-1.5 transition-all ${view === 'offers' ? 'text-red-600 scale-110' : 'text-gray-300'}`}><Icons.Tag size={24} /><span className="text-[9px] font-black uppercase italic">Ofertas</span></button>
          <button onClick={()=>setView('profile')} className={`flex flex-col items-center space-y-1.5 transition-all ${view === 'profile' ? 'text-red-600 scale-110' : 'text-gray-300'}`}><Icons.User size={24} /><span className="text-[9px] font-black uppercase italic">Perfil</span></button>
        </nav>
      )}

      {/* RASTREO SHIPDAY EN VIVO */}
      {view === 'tracking' && (
        <div className="fixed inset-0 z-[120] bg-white flex flex-col">
          <div className="absolute top-12 left-6 right-6 z-10 flex items-center space-x-4">
            <button onClick={() => setView('orders')} className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-black active:scale-90 transition-transform"><Icons.ArrowLeft size={24} /></button>
            <div className="flex-1 bg-white px-8 h-14 rounded-2xl shadow-2xl flex items-center"><span className="text-[11px] font-black uppercase tracking-widest italic">Rastreo KolmaRD</span></div>
          </div>
          <div className="flex-1 w-full"><CotuiMap /></div>
          <div className="bg-white rounded-t-[56px] px-10 pt-10 pb-14 shadow-[0_-25px_60px_rgba(0,0,0,0.15)] relative z-20 transition-transform translate-y-0">
            <div className="w-16 h-2 bg-gray-100 rounded-full mx-auto mb-10"></div>
            <div className="flex justify-between items-start mb-10">
              <div>
                  <div className="flex items-center space-x-2 mb-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div><span className="text-[10px] font-black uppercase tracking-widest text-green-600 italic">Shipday Live</span></div>
                  <h3 className="text-3xl font-black italic uppercase text-red-600 leading-none">Llega en 12 min</h3>
              </div>
              <a href={`tel:${user?.phone}`} className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl active:scale-90 transition-transform"><Icons.Phone size={24}/></a>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT DETAIL (SIN LIBRERÍA DE ANIMACIÓN) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-end">
          <div className="bg-white w-full rounded-t-[48px] overflow-hidden shadow-2xl transition-all duration-300 transform translate-y-0">
            <div className="relative h-80 w-full">
              <img src={selectedProduct.img} className="w-full h-full object-cover" alt={selectedProduct.name} />
              <button onClick={() => setSelectedProduct(null)} className="absolute top-8 right-8 bg-black/20 backdrop-blur-xl text-white p-3 rounded-full hover:bg-red-600 transition-colors"><Icons.X size={24} /></button>
            </div>
            <div className="px-10 pb-12 pt-8">
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">{selectedProduct.name}</h2>
              <div className="mt-2 text-red-600 font-black italic text-xl">RD$ {selectedProduct.price}</div>
              <p className="text-gray-500 text-[12px] font-bold uppercase tracking-wide mt-6 italic leading-relaxed border-l-4 border-red-100 pl-4">{selectedProduct.description || 'Fresco de Cotuí.'}</p>
              <button onClick={() => {
                  const ex = cart.find(i => i.id === selectedProduct.id);
                  const n = ex ? cart.map(i => i.id === selectedProduct.id ? {...i, qty: i.qty+1} : i) : [...cart, {...selectedProduct, qty: 1}];
                  setCart(n); localStorage.setItem('kolmard_cart', JSON.stringify(n));
                  setSelectedProduct(null);
                  showToast(`Agregado: ${selectedProduct.name}`);
              }} className="w-full bg-red-600 text-white h-20 rounded-[32px] font-black uppercase mt-10 italic shadow-2xl text-lg active:scale-95 transition-all">Agregar a mi canasta</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-tap-highlight-color: transparent; background-color: #fff; overflow-x: hidden; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        #map-tracking .leaflet-tile { filter: grayscale(1) invert(0) contrast(1.1) brightness(1.0); }
        .leaflet-container { height: 100%; width: 100%; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
