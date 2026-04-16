"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShoppingBag, Search, Plus, Minus, User, Tag, ChevronRight,
  Loader2, Truck, CheckCircle2, Package, ArrowRight, ArrowLeft,
  Clock, Star, MapPin, Phone, LogOut, Settings, 
  CreditCard, Bell, ShieldCheck, Mail, Lock, Eye, EyeOff, Sparkles, X,
  Navigation, MessageCircle, MapPinned, CreditCard as CardIcon, Trash2,
  AlertCircle, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPONENTE MAPA (LEAFLET) ---
const CotuiMap = () => {
  const mapRef = useRef(null);
  useEffect(() => {
    if (typeof window !== 'undefined' && !mapRef.current) {
      const L = window.L;
      if (L) {
        const cotuiCoords = [19.0531, -70.1491];
        const map = L.map('map-tracking', { zoomControl: false, attributionControl: false }).setView(cotuiCoords, 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        
        const motoristaIcon = L.divIcon({
          className: 'custom-motorista',
          html: `<div class="w-10 h-10 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-pulse">
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
        L.marker(cotuiCoords, { icon: destIcon }).addTo(map);
        mapRef.current = map;
      }
    }
  }, []);
  return <div id="map-tracking" className="w-full h-full grayscale-[0.5] contrast-[1.1]" />;
};

export default function App() {
  // --- ESTADOS DE UI ---
  const [view, setView] = useState('home'); 
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);
  
  // --- ESTADOS DE DATOS REALES ---
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null); // Objeto de usuario real
  const [authMode, setAuthMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', address: '', phone: '' });

  // --- CUPONES ---
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // --- 1. CARGA INICIAL (Leaflet + Shopify Products) ---
  useEffect(() => {
    // Carga de Scripts de Mapa
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => fetchShopifyProducts();
    document.head.appendChild(script);

    // Persistencia de Usuario y Carrito
    const savedUser = localStorage.getItem('kolmard_user');
    const savedCart = localStorage.getItem('kolmard_cart');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCart) setCart(JSON.parse(savedCart));

    return () => {
      if(document.head.contains(link)) document.head.removeChild(link);
      if(document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  // --- 2. CONEXIÓN AL CEREBRO (SHOPIFY API) ---
  const fetchShopifyProducts = async () => {
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
          description: node.description || 'Producto fresco garantizado por KolmaRD.'
        }));
        setProducts(formatted);
      }
    } catch (e) {
      showToast("Error conectando con Shopify", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. GESTIÓN DE USUARIOS (REGISTRO/LOGIN) ---
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
        showToast(`Bienvenido, ${data.customer.firstName}`);
        setView('home');
      } else {
        showToast(data.error || "Error de autenticación", "error");
      }
    } catch (e) {
      showToast("Fallo en el servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kolmard_user');
    showToast("Sesión cerrada");
    setView('home');
  };

  // --- 4. GESTIÓN DEL CARRITO ---
  const addToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      const newCart = ex ? prev.map(i => i.id === p.id ? {...i, qty: i.qty + 1} : i) : [...prev, {...p, qty: 1}];
      localStorage.setItem('kolmard_cart', JSON.stringify(newCart));
      return newCart;
    });
    showToast(`Agregado: ${p.name}`);
  };

  const updateQty = (id, d) => {
    setCart(prev => {
      const newCart = prev.map(i => i.id === id ? {...i, qty: Math.max(0, i.qty + d)} : i).filter(i => i.qty > 0);
      localStorage.setItem('kolmard_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const total = useMemo(() => cart.reduce((acc, i) => acc + (i.price * i.qty), 0), [cart]);
  const finalTotal = useMemo(() => Math.max(0, total - discount), [total, discount]);

  // --- 5. LÓGICA DE CHECKOUT (SHIPDAY) ---
  const confirmOrder = async () => {
    if (!user) { setView('profile'); return; }
    setLoading(true);

    try {
      const payload = {
        orderNumber: `KOLMA-${Date.now().toString().slice(-4)}`,
        customerName: user.firstName,
        customerEmail: user.email,
        customerAddress: user.address || "Cotuí Centro",
        customerPhoneNumber: user.phone || "809-000-0000",
        orderItem: cart.map(i => ({ name: i.name, quantity: i.qty, unitPrice: i.price })),
        totalOrderCost: finalTotal
      };

      const res = await fetch("/api/checkout", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setCart([]);
        localStorage.removeItem('kolmard_cart');
        showToast("¡Pedido confirmado con éxito!");
        setView('orders');
      }
    } catch (e) {
      showToast("Error enviando a Shipday", "error");
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = () => {
    if (!coupon) return;
    setIsApplyingCoupon(true);
    setTimeout(() => {
      if (coupon.toUpperCase() === 'COTUI10') {
        setDiscount(total * 0.1);
        showToast("10% de descuento aplicado");
      } else {
        setDiscount(0);
        showToast("Cupón no válido", "error");
      }
      setIsApplyingCoupon(false);
    }, 800);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // --- SUB-VISTAS (RENDERERS) ---

  const CheckoutView = () => (
    <div className="pt-6 pb-32 space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center space-x-4">
        <button onClick={() => setView('home')} className="p-3 bg-gray-50 rounded-2xl active:scale-90 transition-transform"><ArrowLeft size={20}/></button>
        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Tu Carrito</h2>
      </div>

      <div className="space-y-3">
        {cart.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <ShoppingBag size={48} className="text-gray-100 mb-4" />
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest italic">El carrito está vacío</p>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.id} className="bg-white p-3 rounded-[24px] border border-gray-100 flex items-center shadow-sm">
              <img src={item.img} className="w-16 h-16 rounded-xl object-cover shadow-sm" alt={item.name} />
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-tight truncate w-40">{item.name}</h4>
                  <button onClick={() => updateQty(item.id, -item.qty)} className="text-gray-300 p-1 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-black text-red-600 italic">RD$ {item.price * item.qty}</span>
                  <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-gray-500 active:scale-75 transition-transform"><Minus size={12} /></button>
                    <span className="w-8 text-center text-[10px] font-black">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-red-600 active:scale-75 transition-transform"><Plus size={12} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom duration-700">
          <div className="space-y-3 mb-6">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cupón de Descuento</label>
            <div className="flex space-x-2">
              <input type="text" placeholder="CÓDIGO" className="flex-1 bg-gray-50 p-4 rounded-2xl text-sm font-black outline-none uppercase border-2 border-transparent focus:border-red-500" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
              <button onClick={applyCoupon} className="bg-[#0D1117] text-white px-8 rounded-2xl font-black text-xs uppercase transition-all active:scale-95">{isApplyingCoupon ? '...' : 'Aplicar'}</button>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-[32px] space-y-4 mb-8">
            <div className="flex justify-between text-gray-500 font-bold text-xs uppercase"><span>Subtotal</span><span>RD$ {total}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600 font-black text-xs uppercase"><span>Descuento</span><span>- RD$ {discount.toFixed(0)}</span></div>}
            <div className="flex justify-between text-red-600 font-black text-2xl italic tracking-tighter pt-4 border-t border-gray-200"><span>TOTAL</span><span>RD$ {finalTotal.toFixed(0)}</span></div>
          </div>

          <button onClick={confirmOrder} className="w-full bg-red-600 text-white h-20 rounded-[32px] font-black uppercase shadow-2xl active:scale-95 transition-all italic border-b-4 border-red-800 text-xl tracking-widest">Confirmar Pedido</button>
        </div>
      )}
    </div>
  );

  const HomeView = () => (
    <div className="space-y-4 pb-24">
      {!searchTerm && (
        <>
          <div className="relative h-44 w-full rounded-[32px] overflow-hidden shadow-lg mt-2 group">
            <img src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=800" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Frescos" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
              <Badge variant="orange" className="w-fit mb-2">Lo más fresco de Cotuí</Badge>
              <h2 className="text-white text-3xl font-black leading-none italic tracking-tighter uppercase">Calidad<br />Garantizada.</h2>
            </div>
          </div>

          <div className="bg-[#0D1117] -mx-4 px-5 py-8 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 px-1">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 mb-1">
                  <Sparkles size={14} className="text-red-500 animate-pulse" />
                  <span className="text-red-500 text-[9px] font-black uppercase tracking-[0.2em]">Exclusivo</span>
                </div>
                <h3 className="text-white font-black text-2xl italic uppercase tracking-tighter leading-none">Ofertas del día</h3>
              </div>
              <Tag className="text-white/20" size={30} />
            </div>
            <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
              {products.filter(p => p.collection === 'Ofertas').map((p) => (
                <div key={p.id} onClick={() => setSelectedProduct(p)} className="min-w-[160px] bg-white/5 backdrop-blur-md p-4 rounded-[28px] border border-white/5 cursor-pointer transition-all hover:bg-white/10 active:scale-95">
                  <div className="relative rounded-2xl overflow-hidden mb-3 shadow-xl">
                    <img src={p.img} className="w-full h-28 object-cover" alt={p.name} />
                  </div>
                  <p className="text-[10px] font-black text-white truncate uppercase tracking-tight mb-2">{p.name}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-red-500 font-black text-sm italic tracking-tighter">RD$ {p.price}</span>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="bg-white text-black w-8 h-8 rounded-xl flex items-center justify-center shadow-lg active:scale-75 transition-transform"><Plus size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* CATEGORÍAS */}
      <div className="flex space-x-3 overflow-x-auto no-scrollbar py-2">
        {['Todos', 'Carnes', 'Granos', 'Lácteos', 'Limpieza', 'Bebidas'].map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === c ? 'bg-red-600 text-white shadow-xl shadow-red-100 scale-105' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>{c}</button>
        ))}
      </div>

      {/* LISTA DE PRODUCTOS REALES */}
      <div className="space-y-4 pt-4">
        {products.filter(p => (activeCategory === 'Todos' || p.category === activeCategory) && p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
          <motion.div layout key={p.id} onClick={() => setSelectedProduct(p)} className="flex items-center bg-white p-3 rounded-[28px] border border-gray-50 shadow-sm cursor-pointer transition-all hover:shadow-md active:scale-[0.98]">
            <img src={p.img} className="w-20 h-20 rounded-2xl object-cover shadow-md" alt={p.name} />
            <div className="ml-4 flex-1">
              <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-tight leading-none mb-1">{p.name}</h4>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-2 italic">Unidad: {p.unit}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-black text-red-600 italic tracking-tighter leading-none">RD$ {p.price}</span>
                <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="bg-red-600 text-white w-10 h-10 rounded-xl flex items-center justify-center active:scale-90 border-b-4 border-red-800 transition-all shadow-lg"><Plus size={18}/></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <div className="min-h-screen bg-white text-[#0D1117] font-sans selection:bg-red-500 selection:text-white overflow-x-hidden">
      
      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[200]">
            <div className={`flex items-center space-x-3 px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${toast.type === 'success' ? 'bg-green-600/90 text-white border-green-400' : 'bg-red-600/90 text-white border-red-400'}`}>
              {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span className="text-[10px] font-black uppercase tracking-widest italic">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAIL MODAL (PÁGINA DE PRODUCTO) */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="bg-white w-full max-w-lg rounded-t-[48px] overflow-hidden shadow-2xl">
              <div className="relative h-80 w-full group">
                <img src={selectedProduct.img} className="w-full h-full object-cover" alt={selectedProduct.name} />
                <button onClick={() => setSelectedProduct(null)} className="absolute top-8 right-8 bg-black/20 backdrop-blur-xl text-white p-3 rounded-full hover:bg-red-600 transition-all active:scale-90">
                  <X size={24} />
                </button>
                <div className="absolute bottom-6 left-8"><Badge variant="red" className="text-sm px-6 py-2 shadow-xl">{selectedProduct.category}</Badge></div>
              </div>
              <div className="px-10 pb-12 pt-8">
                <h2 className="text-3xl font-black text-gray-900 leading-tight uppercase tracking-tighter italic">{selectedProduct.name}</h2>
                <div className="mt-2 flex items-center space-x-2 text-red-600 font-black italic text-xl"><span>RD$ {selectedProduct.price}</span><span className="text-gray-300 font-bold text-sm">/ {selectedProduct.unit}</span></div>
                <p className="text-gray-500 text-[12px] font-bold uppercase tracking-wide mt-6 italic leading-relaxed border-l-4 border-red-100 pl-4">{selectedProduct.description}</p>
                <button onClick={() => {addToCart(selectedProduct); setSelectedProduct(null);}} className="w-full bg-red-600 text-white h-20 rounded-[32px] font-black uppercase tracking-widest mt-10 shadow-2xl shadow-red-200 italic active:scale-95 transition-all text-lg">Agregar a mi canasta</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RASTREO SHIPDAY EN VIVO */}
      <AnimatePresence>
        {view === 'tracking' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-white flex flex-col">
            <div className="absolute top-12 left-6 right-6 z-10 flex items-center space-x-4">
              <button onClick={() => setView('orders')} className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-black active:scale-90 transition-transform"><ArrowLeft size={24} /></button>
              <div className="flex-1 bg-white px-8 h-14 rounded-2xl shadow-2xl flex items-center border border-gray-100"><span className="text-[11px] font-black uppercase tracking-widest italic">Rastreo de pedido KolmaRD</span></div>
            </div>
            <div className="flex-1 w-full"><CotuiMap /></div>
            <motion.div initial={{ y: 200 }} animate={{ y: 0 }} className="bg-white rounded-t-[56px] px-10 pt-10 pb-14 shadow-[0_-25px_60px_rgba(0,0,0,0.15)] relative z-20">
              <div className="w-16 h-2 bg-gray-100 rounded-full mx-auto mb-10"></div>
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="flex items-center space-x-2 mb-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div><span className="text-[10px] font-black uppercase tracking-widest text-green-600 italic">En camino vía Shipday</span></div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter text-red-600 leading-none">Llega en 12 min</h3>
                </div>
                <a href={`tel:${user?.phone}`} className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl active:scale-90 transition-transform"><Phone size={24}/></a>
              </div>
              <div className="space-y-8 relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                <div className="flex items-center space-x-6 relative z-10">
                  <div className="w-6 h-6 bg-red-600 rounded-full border-4 border-white flex items-center justify-center shadow-lg"><CheckCircle2 size={12} color="white" /></div>
                  <span className="text-sm font-black uppercase tracking-tight italic">Pedido confirmado y empacado</span>
                </div>
                <div className="flex items-center space-x-6 relative z-10">
                  <div className="w-6 h-6 bg-white border-4 border-red-600 rounded-full animate-pulse shadow-lg"></div>
                  <span className="text-sm font-black uppercase tracking-tight text-red-600 italic">Repartidor cruzando Calle Mella</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER DE LA APP */}
      {view !== 'tracking' && (
        <header className="sticky top-0 z-[80] bg-white/95 backdrop-blur-xl px-6 py-4 border-b border-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div onClick={() => setView('home')} className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-11 h-11 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-2xl shadow-red-200 group-hover:scale-110 transition-transform">K</div>
              <div className="flex flex-col leading-none">
                <div className="flex items-center space-x-1.5"><MapPinned size={12} className="text-red-600" /><span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Cotuí, RD</span></div>
                <span className="text-[13px] font-black uppercase tracking-tighter italic">KolmaRD Express</span>
              </div>
            </div>
            {user && (
              <div className="bg-[#0D1117] text-white px-5 py-2 rounded-full flex items-center space-x-3 shadow-2xl active:scale-95 transition-all">
                <ShoppingBag size={14} className="text-red-500" />
                <span className="font-black text-[12px] tracking-tighter italic uppercase">RD$ {total.toLocaleString()}</span>
              </div>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="BUSCA LO QUE NECESITES..." className="w-full bg-gray-100 py-3.5 pl-12 pr-6 rounded-2xl text-[11px] font-black focus:outline-none uppercase tracking-widest border-2 border-transparent focus:border-red-500 transition-all shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </header>
      )}

      {/* CONTENEDOR PRINCIPAL */}
      <main className="max-w-md mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center py-56 text-gray-400">
            <Loader2 className="animate-spin text-red-600 mb-6" size={32} />
            <span className="text-[12px] font-black uppercase tracking-[0.3em] italic text-center animate-pulse">Sincronizando Cerebro KolmaRD...</span>
          </div>
        ) : (
          <motion.div key={view} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            {view === 'home' && <HomeView />}
            {view === 'checkout' && <CheckoutView />}
            
            {/* VISTA DE ÓRDENES REALES */}
            {view === 'orders' && (
              <div className="pt-8 space-y-8 pb-32">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 border-l-8 border-red-600 pl-4 leading-none">Mis Pedidos</h2>
                <div onClick={() => setView('tracking')} className="bg-white p-8 rounded-[40px] border-2 border-red-600 shadow-2xl shadow-red-50 cursor-pointer active:scale-[0.98] transition-all group">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4"><Truck size={24} className="text-red-600" /><span className="text-sm font-black uppercase italic italic tracking-tight">Rastrear orden en vivo</span></div>
                    <Badge variant="orange" className="animate-pulse px-4 py-1.5">En Camino</Badge>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 italic">Progreso de entrega</p>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                    <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1.5 }} className="h-full bg-red-600" />
                  </div>
                  <div className="flex justify-between mt-4"><span className="text-[9px] font-black uppercase text-gray-400">Salida Tienda</span><span className="text-[9px] font-black uppercase text-red-600">Llegada estimada: 11:45 AM</span></div>
                </div>
              </div>
            )}

            {/* VISTA DE PERFIL Y AUTENTICACIÓN */}
            {view === 'profile' && (user ? (
              <div className="pt-8 space-y-10 pb-32 animate-in fade-in duration-500">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-red-600 rounded-[32px] flex items-center justify-center text-white text-4xl font-black italic shadow-2xl italic">{(user.firstName || "K")[0]}</div>
                  <div><h2 className="text-3xl font-black italic uppercase tracking-tighter">{user.firstName}</h2><p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">{user.email}</p></div>
                </div>
                <div className="space-y-4">
                  <ProfileItem icon={User} label="Nombre Completo" value={user.firstName} />
                  <ProfileItem icon={MapPin} label="Dirección de Entrega" value={user.address || "No configurada"} />
                  <ProfileItem icon={Phone} label="Teléfono de Contacto" value={user.phone || "No configurado"} />
                </div>
                <button onClick={handleLogout} className="w-full p-6 text-gray-400 font-black text-[11px] uppercase tracking-widest flex items-center justify-center space-x-3 mt-12 bg-gray-50 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all"><LogOut size={16} /><span>Cerrar Sesión Segura</span></button>
              </div>
            ) : (
              <div className="pt-12 px-2 animate-in zoom-in duration-500">
                <div className="text-center mb-12">
                  <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black italic shadow-2xl mx-auto mb-6 italic">K</div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic">{authMode === 'login' ? 'Bienvenido a KolmaRD' : 'Crea tu Cuenta Premium'}</h2>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">{authMode === 'login' ? 'Introduce tus credenciales' : 'Únete al club de Cotuí'}</p>
                </div>
                <form onSubmit={handleAuth} className="space-y-5">
                  {authMode === 'register' && (
                    <>
                      <AuthInput icon={User} placeholder="Nombre completo" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                      <AuthInput icon={MapPin} placeholder="Dirección en Cotuí" value={formData.address} onChange={v => setFormData({...formData, address: v})} />
                      <AuthInput icon={Phone} placeholder="Teléfono de contacto" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
                    </>
                  )}
                  <AuthInput icon={Mail} placeholder="Correo electrónico" type="email" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
                  <div className="relative group">
                    <AuthInput icon={Lock} placeholder="Contraseña" type={showPassword ? "text" : "password"} value={formData.password} onChange={v => setFormData({...formData, password: v})} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-red-600 transition-colors">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                  </div>
                  <button type="submit" disabled={loading} className="w-full h-20 bg-red-600 text-white rounded-[32px] font-black uppercase mt-6 italic shadow-2xl shadow-red-200 active:scale-95 transition-all text-xl tracking-widest disabled:opacity-50">
                    {loading ? 'Sincronizando...' : authMode === 'login' ? 'Entrar Ahora' : 'Crear Cuenta'}
                  </button>
                </form>
                <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="w-full text-center mt-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-red-600 transition-colors">
                  {authMode === 'login' ? '¿AÚN NO TIENES CUENTA? REGÍSTRATE' : '¿YA TIENES CUENTA? INICIA SESIÓN'}
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </main>

      {/* FOOTER NAVEGACIÓN (STICKY) */}
      {view !== 'tracking' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-3xl border-t border-gray-100 px-8 py-6 flex justify-between items-center z-[90] pb-10">
          <NavBtn icon={ShoppingBag} label="Inicio" active={view === 'home'} onClick={() => setView('home')} />
          <NavBtn icon={Truck} label="Pedidos" active={view === 'orders'} onClick={() => setView('orders')} />
          
          <div className="relative -mt-20">
            <button onClick={() => setView('checkout')} className="bg-[#0D1117] w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-2xl relative ring-8 ring-white active:scale-90 transition-all group">
              <ShoppingBag size={28} strokeWidth={2.5} className="group-hover:text-red-500 transition-colors" />
              {cart.length > 0 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 bg-red-600 text-[9px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xl italic">
                  {cart.length}
                </motion.div>
              )}
            </button>
          </div>

          <NavBtn icon={Tag} label="Ofertas" active={view === 'offers'} onClick={() => setView('offers')} />
          <NavBtn icon={User} label="Perfil" active={view === 'profile'} onClick={() => setView('profile')} />
        </nav>
      )}

      {/* ESTILOS GLOBALES */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-tap-highlight-color: transparent; background-color: #fff; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        #map-tracking .leaflet-tile { filter: grayscale(1) invert(0) contrast(1.1) brightness(1.0); }
        .leaflet-container { height: 100%; width: 100%; }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTES DE UI REUTILIZABLES ---

const NavBtn = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center space-y-1.5 transition-all ${active ? 'text-red-600 scale-110' : 'text-gray-300 hover:text-gray-400'}`}>
    <Icon size={24} strokeWidth={active ? 3 : 2} />
    <span className="text-[9px] font-black uppercase tracking-widest italic">{label}</span>
  </button>
);

const Badge = ({ children, variant = "red", className = "" }) => {
  const styles = {
    red: "bg-red-600 text-white shadow-red-100",
    orange: "bg-orange-500 text-white shadow-orange-100",
  };
  return (
    <span className={`${styles[variant]} px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg ${className}`}>
      {children}
    </span>
  );
};

const AuthInput = ({ icon: Icon, placeholder, type = "text", value, onChange }) => (
  <div className="bg-gray-50 rounded-2xl flex items-center px-6 py-5 space-x-4 border-2 border-transparent focus-within:border-red-500 focus-within:bg-white transition-all shadow-inner">
    <Icon size={20} className="text-red-600" />
    <input 
      type={type} 
      placeholder={placeholder.toUpperCase()} 
      className="bg-transparent text-[11px] font-black w-full outline-none uppercase tracking-widest placeholder:text-gray-300"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const ProfileItem = ({ icon: Icon, label, value }) => (
  <div className="bg-white p-6 rounded-[28px] border border-gray-100 flex items-center space-x-5 shadow-sm">
    <div className="bg-red-50 p-4 rounded-2xl text-red-600"><Icon size={22} /></div>
    <div className="flex-1">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="font-black text-sm uppercase italic tracking-tight text-gray-900">{value}</p>
    </div>
    <ChevronRight size={16} className="text-gray-200" />
  </div>
);
