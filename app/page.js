"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

// --- ICONOGRAFÍA NATIVA ---
const Icons = {
  ShoppingBag: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Search: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Plus: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5v14M5 12h14"/></svg>,
  Minus: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/></svg>,
  User: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Truck: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10Z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>,
  ArrowLeft: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  MapPinned: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"/><circle cx="12" cy="8" r="2"/><path d="M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.3 0 .6.2.8s.5.2.8.1l6-2c.3-.1.6-.1.9-.1h3.141"/></svg>,
  CheckCircle2: ({ size = 24, color = "currentColor", className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
  X: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Mail: ({ size = 20, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Lock: ({ size = 20, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Eye: ({ size = 18, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: ({ size = 18, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
  LogOut: ({ size = 18, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Banknote: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>,
  Gift: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>,
  Flame: ({ size = 24, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
};

const COTUI_CENTER = [19.0531, -70.1491];
const FREE_SHIPPING_THRESHOLD = 500;
const STANDARD_SHIPPING_COST = 50;

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
          html: `<div class="w-10 h-10 bg-red-600 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center animate-bounce text-lg">🛵</div>`,
          iconSize: [40, 40], iconAnchor: [20, 20]
        });
        L.marker([19.055, -70.145], { icon: motoristaIcon }).addTo(map);
        L.marker(COTUI_CENTER, { icon: L.divIcon({ html: `<div class="w-5 h-5 bg-black rounded-full border-[3px] border-white shadow-md"></div>`, className: '', iconSize: [20, 20] }) }).addTo(map);
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
  const [paymentMethod, setPaymentMethod] = useState('cash');

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
        showToast(authMode === 'login' ? '¡Hola de nuevo!' : 'Cuenta creada');
      } else {
        showToast(data.error || 'Verifica tus datos');
      }
    } catch (error) {
      showToast('Error de conexión');
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
          .filter(({ node }) => !node.tags?.some(tag => tag.toLowerCase() === 'pos'))
          .map(({ node }) => ({
            id: node.id,
            name: node.title,
            price: parseFloat(node.variants?.edges?.[0]?.node?.price?.amount || 0),
            img: node.images?.edges?.[0]?.node?.url || 'https://via.placeholder.com/600',
            category: node.collections?.edges?.[0]?.node?.title || node.productType || 'Otros',
            collection: node.tags?.some(tag => tag.toLowerCase().includes('oferta')) ? 'Ofertas' : 'General',
            description: node.description || 'Producto de KolmaRD.'
          }));
        setProducts(formatted);
      }
    } catch (e) { 
        showToast('Error cargando inventario');
    } finally { 
        setLoading(false); 
    }
  };

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const addToCart = useCallback((p, isFlashSale = false) => {
    const finalPrice = isFlashSale ? (p.price * 0.9).toFixed(2) : p.price; 
    setCart(curr => {
      const ex = curr.find(i => i.id === p.id && i.isFlashSale === isFlashSale);
      const n = ex 
        ? curr.map(i => i.id === p.id && i.isFlashSale === isFlashSale ? { ...i, qty: i.qty + 1 } : i) 
        : [...curr, { ...p, price: parseFloat(finalPrice), qty: 1, isFlashSale }];
      localStorage.setItem('kolmard_cart', JSON.stringify(n));
      return n;
    });
    showToast(`Agregado: ${p.name}`);
  }, [showToast]);

  const updateQty = useCallback((id, isFlashSale, delta) => {
    setCart(curr => {
      const n = curr.map(i => {
        if (i.id === id && i.isFlashSale === isFlashSale) {
          return { ...i, qty: Math.max(0, i.qty + delta) };
        }
        return i;
      }).filter(i => i.qty > 0);
      localStorage.setItem('kolmard_cart', JSON.stringify(n));
      return n;
    });
  }, []);

  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const total = subtotal + shipping;
  const percentToFreeShipping = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const realCategories = useMemo(() => {
    const cats = products.map(p => p.category);
    return ['Todos', ...new Set(cats)];
  }, [products]);

  const upsellingProducts = useMemo(() => {
    return products.filter(p => p.price <= 150 && !cart.some(c => c.id === p.id)).slice(0, 4);
  }, [products, cart]);

  const HomeView = () => (
    <div className="space-y-6 pb-32 animate-fade-in">
      
      {/* SECION OFERTAS PREMIUM (DARK MODE) EN INICIO */}
      {!searchTerm && products.filter(p => p.collection === 'Ofertas').length > 0 && (
        <div className="bg-[#121212] -mx-4 px-4 py-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[70px] opacity-20"></div>
          
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="flex items-center space-x-2">
              <Icons.Flame className="text-red-500" size={22} />
              <h2 className="text-white text-xl font-black tracking-tight">Ofertas Flash</h2>
            </div>
            <span className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">-10% EXTRA</span>
          </div>

          <div className="flex space-x-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 relative z-10">
            {products.filter(p => p.collection === 'Ofertas').map(p => {
              const flashPrice = (p.price * 0.9).toFixed(2);
              return (
                <div key={p.id} className="snap-start min-w-[140px] max-w-[140px] bg-[#1e1e1e] rounded-[16px] p-2 flex flex-col active:scale-[0.98] transition-transform cursor-pointer" onClick={() => setSelectedProduct({...p, price: flashPrice, originalPrice: p.price})}>
                  <div className="bg-white rounded-[12px] p-2 mb-2 aspect-square relative">
                    <img src={p.img} className="w-full h-full object-contain mix-blend-multiply" alt={p.name} />
                    <button onClick={(e) => { e.stopPropagation(); addToCart(p, true); }} className="absolute -bottom-2 -right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg"><Icons.Plus size={16}/></button>
                  </div>
                  <h4 className="text-white text-[12px] font-semibold line-clamp-2 leading-tight mb-1">{p.name}</h4>
                  <div className="mt-auto">
                    <span className="text-gray-400 text-[10px] line-through block">RD$ {p.price}</span>
                    <span className="text-red-500 font-bold text-[15px]">RD$ {flashPrice}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* CATEGORÍAS TIPO PILL STICKY */}
      <div className="sticky top-[132px] bg-white/95 backdrop-blur-md z-40 -mx-4 px-4 py-3 border-b border-gray-100 flex space-x-2 overflow-x-auto no-scrollbar shadow-sm">
        {realCategories.map(c => (
          <button 
            key={c} 
            onClick={() => setActiveCategory(c)} 
            className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${activeCategory === c ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* LISTA DE PRODUCTOS ESTILO UBER EATS (Lista limpia) */}
      <div className="flex flex-col pt-2">
        {products.filter(p => (activeCategory === 'Todos' || p.category === activeCategory) && p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
          <div key={p.id} onClick={() => setSelectedProduct(p)} className="flex items-center bg-white border-b border-gray-100 py-4 cursor-pointer active:bg-gray-50 transition-colors">
            <div className="flex-1 pr-4">
              <h4 className="text-[15px] font-bold text-gray-900 leading-tight mb-1">{p.name}</h4>
              <p className="text-[13px] text-gray-500 line-clamp-2 leading-snug mb-2">{p.description}</p>
              <span className="text-[15px] font-bold text-gray-900">RD$ {p.price}</span>
            </div>
            <div className="relative w-[100px] h-[100px] bg-gray-50 rounded-[12px] flex-shrink-0 border border-gray-100/50 p-1">
                <img src={p.img} className="w-full h-full object-contain mix-blend-multiply" alt={p.name}/>
                <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="absolute bottom-1 right-1 bg-white text-red-600 w-8 h-8 rounded-full flex items-center justify-center shadow-md border border-gray-100"><Icons.Plus size={18}/></button>
            </div>
          </div>
        ))}
        {products.length === 0 && !loading && (
           <div className="text-center py-10 text-gray-400 font-medium">No se encontraron productos.</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-red-200 overflow-x-hidden max-w-[480px] mx-auto shadow-2xl relative">
      
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] animate-fade-in w-[90%] max-w-[350px]">
          <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center space-x-3">
            <Icons.CheckCircle2 color="#4ade80" size={18} />
            <span className="text-[13px] font-medium">{toast}</span>
          </div>
        </div>
      )}

      {/* HEADER BUSCADOR STICKY PREMIUM */}
      {view !== 'tracking' && view !== 'login' && view !== 'profile' && (
        <header className="sticky top-0 z-[100] bg-white pt-4 pb-3 px-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div onClick={() => setView('home')} className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center text-white font-black text-lg">K</div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center">Entregar en <Icons.MapPinned size={10} className="ml-1 text-red-600"/></span>
                <span className="text-[14px] font-bold text-gray-900 flex items-center">{user?.address || "Cotuí, Centro"}</span>
              </div>
            </div>
            {user && <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm cursor-pointer" onClick={()=>setView('profile')}>{user.firstName[0]}</div>}
          </div>
          
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Busca en KolmaRD..." 
                className="w-full bg-gray-100 py-3 pl-10 pr-4 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:ring-1 focus:ring-red-600 transition-all border border-transparent" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </header>
      )}

      <main className="px-4 h-full">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
             <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-gray-500 text-sm font-medium">Cargando supermercado...</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {view === 'home' && <HomeView />}

            {/* VISTA CHECKOUT (FRICCIÓN CERO) */}
            {view === 'checkout' && (
              <div className="pt-4 pb-40 space-y-6">
                <div className="flex items-center space-x-3 pb-2">
                  <button onClick={() => setView('home')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-900"><Icons.ArrowLeft size={20}/></button>
                  <h2 className="text-xl font-bold text-gray-900">Tu Pedido</h2>
                </div>
                
                {/* BARRA DE ENVIO GRATIS */}
                {cart.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <p className="text-[13px] font-bold text-gray-900 mb-2 flex items-center">
                      <Icons.Gift size={16} className="text-red-600 mr-2"/>
                      {subtotal >= FREE_SHIPPING_THRESHOLD ? '¡Envío Gratis Desbloqueado!' : `Faltan RD$ ${FREE_SHIPPING_THRESHOLD - subtotal} para Envío Gratis`}
                    </p>
                    <div className="h-1.5 bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 rounded-full transition-all duration-500" style={{width: `${percentToFreeShipping}%`}} />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {cart.length === 0 ? (
                      <div className="py-12 flex flex-col items-center text-gray-400">
                        <Icons.ShoppingBag size={48} className="mb-4 opacity-50"/>
                        <p className="text-base font-bold text-gray-900">Canasta vacía</p>
                        <button onClick={() => setView('home')} className="mt-4 bg-red-600 text-white px-6 py-2.5 rounded-full font-bold text-sm">Comprar ahora</button>
                      </div>
                  ) : (
                      cart.map(item => (
                        <div key={`${item.id}-${item.isFlashSale}`} className="flex items-center py-2 border-b border-gray-50">
                            <div className="w-16 h-16 bg-gray-50 rounded-lg p-1 mr-3 relative">
                              {item.isFlashSale && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white"></div>}
                              <img src={item.img} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <div className="flex-1 pr-2">
                                <h4 className="text-[13px] font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                                <span className="text-[14px] font-bold text-gray-900">RD$ {item.price * item.qty}</span>
                            </div>
                            <div className="flex items-center bg-gray-100 rounded-full p-1">
                                <button onClick={() => updateQty(item.id, item.isFlashSale, -1)} className="w-7 h-7 flex items-center justify-center text-gray-700 bg-white rounded-full shadow-sm"><Icons.Minus size={14} /></button>
                                <span className="w-6 text-center text-[13px] font-bold">{item.qty}</span>
                                <button onClick={() => updateQty(item.id, item.isFlashSale, 1)} className="w-7 h-7 flex items-center justify-center text-white bg-red-600 rounded-full shadow-sm"><Icons.Plus size={14} /></button>
                            </div>
                        </div>
                      ))
                  )}
                </div>

                {/* UPSELLING */}
                {cart.length > 0 && subtotal < FREE_SHIPPING_THRESHOLD && upsellingProducts.length > 0 && (
                  <div className="py-2">
                    <h3 className="text-[14px] font-bold text-gray-900 mb-3">Completa tu pedido</h3>
                    <div className="flex space-x-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
                      {upsellingProducts.map(p => (
                        <div key={p.id} className="min-w-[120px] bg-white border border-gray-100 rounded-xl p-2 flex flex-col cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedProduct(p)}>
                          <div className="bg-gray-50 rounded-lg p-2 mb-2 aspect-square">
                            <img src={p.img} className="w-full h-full object-contain mix-blend-multiply" />
                          </div>
                          <p className="text-[11px] font-medium text-gray-900 line-clamp-1">{p.name}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="font-bold text-[12px] text-gray-900">RD$ {p.price}</span>
                            <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center"><Icons.Plus size={12}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {cart.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <h3 className="text-[16px] font-bold text-gray-900">Pago</h3>
                      <div onClick={() => setPaymentMethod('cash')} className={`flex items-center p-3 rounded-xl border ${paymentMethod === 'cash' ? 'border-red-600 bg-red-50/50' : 'border-gray-200 bg-white'}`}>
                        <Icons.Banknote size={20} className={paymentMethod === 'cash' ? 'text-red-600' : 'text-gray-400'}/>
                        <div className="ml-3 flex-1">
                          <p className="font-bold text-[14px] text-gray-900">Contra entrega</p>
                          <p className="text-[11px] text-gray-500">Efectivo o transferencia</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-red-600' : 'border-gray-300'}`}>
                          {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                        </div>
                      </div>
                      <div className="flex items-center p-3 rounded-xl border border-gray-100 bg-gray-50 opacity-50">
                        <Icons.CreditCard size={20} className="text-gray-400"/>
                        <div className="ml-3 flex-1">
                          <p className="font-bold text-[14px] text-gray-500">Tarjeta</p>
                          <p className="text-[11px] text-red-500 font-bold">No disponible</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between text-gray-500 text-[13px]"><span>Subtotal</span><span>RD$ {subtotal}</span></div>
                        <div className="flex justify-between text-gray-500 text-[13px]"><span>Envío</span><span className={shipping === 0 ? "text-green-600 font-bold" : ""}>{shipping === 0 ? 'Gratis' : `RD$ ${shipping}`}</span></div>
                        <div className="flex justify-between text-gray-900 font-bold text-[18px] pt-3 border-t border-gray-200 mt-2"><span>Total</span><span>RD$ {total}</span></div>
                    </div>
                    
                    <button onClick={() => {
                        if (!user) { setView('login'); showToast("Inicia sesión para pedir"); return; }
                        setView('tracking'); setCart([]); localStorage.removeItem('kolmard_cart');
                    }} className="w-full bg-red-600 text-white h-[56px] rounded-xl font-bold text-[16px] shadow-lg shadow-red-600/30 active:scale-95 transition-transform flex items-center justify-center">
                      Hacer Pedido • RD$ {total}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* VISTA ÓRDENES */}
            {view === 'orders' && (
              <div className="pt-6 space-y-4 pb-24">
                <h2 className="text-xl font-bold text-gray-900">Mis Pedidos</h2>
                <div onClick={() => setView('tracking')} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm cursor-pointer active:scale-95 transition-transform relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600"></div>
                  <div className="flex justify-between items-center mb-3 pl-2">
                    <div className="flex items-center space-x-3">
                        <div className="bg-red-50 p-2 rounded-lg text-red-600"><Icons.Truck size={20} /></div>
                        <div>
                          <span className="text-[14px] font-bold text-gray-900 block">Pedido en curso</span>
                          <span className="text-[12px] text-gray-500">Llegando pronto</span>
                        </div>
                    </div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold animate-pulse">En Camino</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden ml-2">
                    <div className="h-full bg-red-600 rounded-full w-[70%]" />
                  </div>
                </div>
              </div>
            )}

            {/* PERFIL & LOGIN */}
            {view === 'profile' || view === 'login' ? (user ? (
              <div className="pt-8 space-y-6 pb-24">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">{user.firstName[0]}</div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{user.firstName}</h2>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl flex items-center space-x-3">
                  <Icons.MapPinned className="text-red-600" size={20} />
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-500 uppercase font-bold">Dirección de entrega</span>
                    <span className="font-bold text-[14px] text-gray-900">{user.address || "Cotuí, Centro"}</span>
                  </div>
                </div>

                <button onClick={() => { setUser(null); localStorage.removeItem('kolmard_user'); setView('home'); }} className="w-full py-4 text-red-600 font-bold text-[14px] bg-red-50 rounded-xl flex items-center justify-center space-x-2 mt-4">
                  <Icons.LogOut size={18} /><span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="pt-10 px-2 space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mb-4 mx-auto shadow-lg">K</div>
                  <h2 className="text-2xl font-bold text-gray-900">{authMode === 'login' ? 'Bienvenido' : 'Crear Cuenta'}</h2>
                  <p className="text-gray-500 text-[14px] mt-1">KolmaRD Express</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {authMode === 'register' && (
                    <div className="bg-gray-50 rounded-xl flex items-center px-4 py-3 border focus-within:border-red-600 transition-colors">
                      <Icons.User size={18} className="text-gray-400 mr-3" />
                      <input type="text" placeholder="Nombre completo" className="bg-transparent text-[14px] font-medium w-full outline-none" value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} required />
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-xl flex items-center px-4 py-3 border focus-within:border-red-600 transition-colors">
                    <Icons.Mail size={18} className="text-gray-400 mr-3" />
                    <input type="email" placeholder="Correo electrónico" className="bg-transparent text-[14px] font-medium w-full outline-none" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="bg-gray-50 rounded-xl flex items-center px-4 py-3 border focus-within:border-red-600 transition-colors">
                    <Icons.Lock size={18} className="text-gray-400 mr-3" />
                    <input type={showPassword ? "text" : "password"} placeholder="Contraseña" className="bg-transparent text-[14px] font-medium w-full outline-none" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} required />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="text-gray-400 ml-2">
                      {showPassword ? <Icons.EyeOff size={18}/> : <Icons.Eye size={18}/>}
                    </button>
                  </div>
                  
                  <button type="submit" className="w-full h-[50px] bg-red-600 text-white rounded-xl font-bold text-[15px] shadow-lg shadow-red-600/30 active:scale-95 transition-transform mt-6 flex items-center justify-center">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (authMode === 'login' ? 'Iniciar Sesión' : 'Registrarme')}
                  </button>
                </form>

                <div className="text-center">
                  <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-[13px] font-bold text-gray-500">
                    {authMode === 'login' ? '¿Nuevo aquí? Regístrate' : 'Ya tengo cuenta. Entrar'}
                  </button>
                </div>
              </div>
            )) : null}
          </div>
        )}
      </main>

      {/* RASTREO MAPA (ESTILO PEDIDOS YA) */}
      {view === 'tracking' && (
        <div className="fixed inset-0 z-[180] bg-white flex flex-col animate-fade-in max-w-[480px] mx-auto">
          <button onClick={() => setView('orders')} className="absolute top-12 left-4 z-30 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-900 active:scale-90">
            <Icons.ArrowLeft size={20} />
          </button>
          
          <div className="flex-1 w-full relative z-10"><CotuiMap /></div>
          
          <div className="bg-white rounded-t-3xl px-6 pt-6 pb-8 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] relative z-20 -mt-6">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">12 min</h3>
                <p className="text-sm text-gray-500 font-medium">Hora de llegada estimada</p>
              </div>
              <div className="bg-green-50 p-3 rounded-full text-green-600"><Icons.CheckCircle2 size={28} /></div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 flex items-center">
               <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl mr-4">🛵</div>
               <div className="flex-1">
                 <p className="font-bold text-[14px] text-gray-900">Repartidor KolmaRD</p>
                 <p className="text-[12px] text-gray-500">Motor en camino</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE PRODUCTO LIGERO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-end sm:items-center sm:justify-center animate-fade-in p-0 sm:p-4">
          <div className="bg-white w-full max-w-[480px] mx-auto rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[85vh]">
            <div className="relative h-64 w-full bg-gray-50 p-6 flex items-center justify-center shrink-0">
              <img src={selectedProduct.img} className="w-full h-full object-contain mix-blend-multiply" alt={selectedProduct.name} />
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 bg-white text-gray-900 p-2 rounded-full shadow-sm"><Icons.X size={20} /></button>
            </div>
            <div className="p-6 bg-white overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedProduct.name}</h2>
              <div className="mb-4">
                {selectedProduct.originalPrice && <span className="text-[12px] text-gray-400 line-through mr-2">RD$ {selectedProduct.originalPrice}</span>}
                <span className="text-red-600 font-bold text-xl">RD$ {selectedProduct.price}</span>
              </div>
              <p className="text-gray-500 text-[14px] mb-6 leading-relaxed">{selectedProduct.description}</p>
              <button onClick={() => { addToCart(selectedProduct, !!selectedProduct.originalPrice); setSelectedProduct(null); }} className="w-full bg-red-600 text-white h-[50px] rounded-xl font-bold text-[15px] shadow-lg shadow-red-600/30 active:scale-95 flex items-center justify-center">
                Agregar • RD$ {selectedProduct.price}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER NAV BOTTOM */}
      {view !== 'tracking' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-8 py-3 flex justify-between items-center z-[150] max-w-[480px] mx-auto pb-6">
          <button onClick={()=>setView('home')} className={`flex flex-col items-center space-y-1 transition-colors ${view === 'home' ? 'text-red-600' : 'text-gray-400'}`}>
            <Icons.ShoppingBag size={24} />
            <span className="text-[10px] font-bold">Inicio</span>
          </button>
          
          <button onClick={()=>setView('orders')} className={`flex flex-col items-center space-y-1 transition-colors ${view === 'orders' ? 'text-red-600' : 'text-gray-400'}`}>
            <Icons.Truck size={24} />
            <span className="text-[10px] font-bold">Pedidos</span>
          </button>

          <button onClick={() => setView(user ? 'profile' : 'login')} className={`flex flex-col items-center space-y-1 transition-colors ${view === 'profile' || view === 'login' ? 'text-red-600' : 'text-gray-400'}`}>
            <Icons.User size={24} />
            <span className="text-[10px] font-bold">Perfil</span>
          </button>
        </nav>
      )}

      {/* BOTON FLOTANTE DE CARRITO */}
      {view !== 'checkout' && view !== 'tracking' && cart.length > 0 && (
        <div className="fixed bottom-24 left-0 right-0 z-[140] px-4 max-w-[480px] mx-auto animate-slide-up">
          <button onClick={() => setView('checkout')} className="w-full bg-red-600 text-white p-4 rounded-xl shadow-lg shadow-red-600/30 flex justify-between items-center active:scale-95 transition-transform">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold">{cart.reduce((a,c)=>a+c.qty,0)}</div>
              <span className="font-bold text-[14px]">Ver canasta</span>
            </div>
            <span className="font-bold text-[15px]">RD$ {total}</span>
          </button>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { 
          font-family: 'Inter', sans-serif; 
          -webkit-tap-highlight-color: transparent; 
          background-color: #f9fafb;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .leaflet-container { height: 100%; width: 100%; }
        
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .animate-fade-in { animation: fade-in 0.25s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
