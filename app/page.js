"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';

// --- ICONOS SVG ---
const SVG = {
  Market: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>,
  Category: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg>,
  User: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Cart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 002 1.58h9.78a2 2 0 001.95-1.57l1.65-7.43H5.12"/></svg>,
  Truck: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10Z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Pin: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-red-600"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Arrow: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="m9 18 6-6-6-6"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><polyline points="20 6 9 17 4 12"/></svg>,
  LogOut: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Box: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-12 h-12 text-slate-300"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
  Sparkles: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  Money: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>,
  CreditCard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Motorcycle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-white drop-shadow-md"><path d="M5 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M5 10h1.5l1.5 2h3l1.5-2H14l1.5 3H19"/><path d="M9 10 7 6h2l2 4"/></svg>
};

const getCategoryStyle = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes('pan') || lower.includes('reposter')) return { icon: '🍞', color: 'bg-amber-600' };
  if (lower.includes('bebida') || lower.includes('refresco') || lower.includes('jugo') || lower.includes('agua')) return { icon: '🥤', color: 'bg-blue-400' };
  if (lower.includes('alcohol') || lower.includes('cerveza') || lower.includes('licor') || lower.includes('vino')) return { icon: '🍺', color: 'bg-yellow-600' };
  if (lower.includes('fresco') || lower.includes('fruta') || lower.includes('vegetal') || lower.includes('agro')) return { icon: '🍎', color: 'bg-emerald-500' };
  if (lower.includes('carn') || lower.includes('pollo') || lower.includes('pescado') || lower.includes('embutido')) return { icon: '🥩', color: 'bg-red-500' };
  if (lower.includes('lacteo') || lower.includes('queso') || lower.includes('leche') || lower.includes('huevo')) return { icon: '🧀', color: 'bg-yellow-400' };
  if (lower.includes('despensa') || lower.includes('arroz') || lower.includes('grano') || lower.includes('aceite')) return { icon: '🍚', color: 'bg-orange-500' };
  if (lower.includes('limp') || lower.includes('hogar') || lower.includes('detergente')) return { icon: '🧼', color: 'bg-cyan-500' };
  if (lower.includes('cuidado') || lower.includes('personal') || lower.includes('belleza') || lower.includes('bebe')) return { icon: '🧴', color: 'bg-pink-500' };
  if (lower.includes('snack') || lower.includes('picadera') || lower.includes('dulce') || lower.includes('galleta')) return { icon: '🍪', color: 'bg-purple-500' };
  return { icon: '🛒', color: 'bg-slate-800' };
};

export default function KolmaRDApp() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [authMode, setAuthMode] = useState('login'); 
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '+1 ', address: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({});

  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeTab, setActiveTab] = useState('home');
  const [isOrdering, setIsOrdering] = useState(false);
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const showAppToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000); 
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('kolma_user');
    const savedOrders = localStorage.getItem('kolma_orders');
    const savedCart = localStorage.getItem('kolmard_cart');

    if (savedUser) { 
      setUser(JSON.parse(savedUser)); 
      setShowLogin(false); 
    }
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedCart) setCart(JSON.parse(savedCart));

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Error de red');
      const json = await res.json();
      
      if (json.data?.products) {
        const formattedProducts = json.data.products.edges
          .filter(({ node }) => !node.tags?.some(tag => tag.toLowerCase() === 'pos'))
          .map(({ node }) => ({
            id: node.id,
            variantId: node.variants?.edges[0]?.node.id,
            name: node.title,
            cat: node.collections?.edges[0]?.node.title || node.productType || 'Catálogo',
            price: parseFloat(node.variants?.edges[0]?.node.price.amount || 0),
            img: node.images?.edges[0]?.node.url || 'https://via.placeholder.com/400',
            unit: node.variants?.edges[0]?.node.title !== 'Default Title' ? node.variants.edges[0].node.title : 'Unidad',
            desc: node.description || 'Calidad garantizada en Kolma RD.',
            available: true 
          }));
        setProducts(formattedProducts);

        const uniqueCats = [...new Set(formattedProducts.map(p => p.cat))];
        const dynamicCategories = uniqueCats.map((cat) => {
          const style = getCategoryStyle(cat);
          return { id: cat, name: cat, icon: style.icon, color: style.color };
        });
        setCategories(dynamicCategories);
      }
    } catch (error) {
      showAppToast('Error cargando pasillos. Verifica tu conexión.', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoadingAuth(true);

    if (authMode === 'register') {
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address) {
        setLoadingAuth(false);
        return showAppToast('Nombres, apellidos, teléfono y dirección son obligatorios.', 'error');
      }
      if (formData.phone.length < 12) {
        setLoadingAuth(false);
        return showAppToast('Ingresa un número de teléfono válido con su código de área.', 'error');
      }
    }

    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register'; 
      const payload = authMode === 'login' ? { email: formData.email, password: formData.password } : formData;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok && data.user) {
        const loggedUser = {
          ...data.user,
          firstName: data.user.firstName || data.user.name || formData.firstName,
          lastName: data.user.lastName || formData.lastName || '',
          phone: data.user.phone || formData.phone,
          address: data.user.address || formData.address,
        };
        setUser(loggedUser);
        localStorage.setItem('kolma_user', JSON.stringify(loggedUser));
        setShowLogin(false);
        showAppToast(authMode === 'login' ? '¡Bienvenido de vuelta al súper!' : '¡Cuenta creada, listo para comprar!');
      } else {
        showAppToast(data.error || 'Verifica tu correo y contraseña.', 'error');
      }
    } catch (error) {
      showAppToast('Error de conexión con el servidor.', 'error');
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setActiveTab('home');
    setShowLogin(true);
    setFormData({ ...formData, password: '' }); 
    localStorage.removeItem('kolma_user');
    localStorage.removeItem('kolmard_cart');
  };

  const handleGuestEntry = () => {
    setUser({ name: 'Invitado', lastName: '', email: 'Sin registrar', address: 'Cotuí (Por defecto)', phone: '+1 ', isGuest: true });
    setShowLogin(false);
    showAppToast('Navegando como invitado. Crea cuenta para hacer pedidos.');
  };

  const startEditProfile = () => {
    setEditForm({
      firstName: user.firstName || user.name || '',
      lastName: user.lastName || '',
      phone: user.phone || '+1 ',
      address: user.address || ''
    });
    setIsEditingProfile(true);
  };

  const saveProfile = () => {
    if (!editForm.firstName || !editForm.phone || !editForm.address) {
      return showAppToast('Nombre, teléfono y dirección son obligatorios', 'error');
    }
    const updatedUser = { ...user, ...editForm, name: editForm.firstName };
    setUser(updatedUser);
    localStorage.setItem('kolma_user', JSON.stringify(updatedUser));
    setIsEditingProfile(false);
    showAppToast('Datos actualizados exitosamente');
  };

  const addToCart = (p) => {
    if (!p.available) return showAppToast("Producto agotado por el momento.", "error");
    setCart(curr => {
      const ex = curr.find(i => i.id === p.id);
      const n = ex ? curr.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...curr, { ...p, qty: 1 }];
      localStorage.setItem('kolmard_cart', JSON.stringify(n));
      showAppToast(`${p.name} en tu cesta`);
      return n;
    });
  };

  const updateQty = (id, delta) => setCart(curr => {
    const n = curr.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item);
    localStorage.setItem('kolmard_cart', JSON.stringify(n));
    return n;
  });

  const removeFromCart = (id) => setCart(curr => {
    const n = curr.filter(i => i.id !== id);
    localStorage.setItem('kolmard_cart', JSON.stringify(n));
    return n;
  });
  
  const rawTotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
  const totalItems = cart.reduce((acc, i) => acc + i.qty, 0);

  let discountPercent = 0;
  let nextGoalAmount = 500;
  let nextGoalPercent = 5;

  if (rawTotal >= 1000) {
    discountPercent = 10;
    nextGoalAmount = 0;
  } else if (rawTotal >= 500) {
    discountPercent = 5;
    nextGoalAmount = 1000;
    nextGoalPercent = 10;
  }

  const discountAmount = rawTotal * (discountPercent / 100);
  const finalTotal = rawTotal - discountAmount;
  const progressPercent = Math.min((rawTotal / 1000) * 100, 100);
  const missingForNext = nextGoalAmount > 0 ? nextGoalAmount - rawTotal : 0;

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== 'Todos') result = result.filter(p => p.cat === activeCategory);
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.cat.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [search, activeCategory, products]);

  const homeSuggestions = useMemo(() => {
    if (products.length === 0) return [];
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [products]);

  const cartSuggestions = useMemo(() => {
    return products.filter(p => !cart.some(c => c.id === p.id) && p.available).slice(0, 4);
  }, [products, cart]);

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    if (user.isGuest) {
      setIsCartOpen(false);
      setShowLogin(true);
      return showAppToast('Crea una cuenta o inicia sesión para procesar tu pedido.', 'error');
    }
    setShowPayment(true);
  };

  const processCheckout = async () => {
    setIsOrdering(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo: user,
          items: cart.map(item => ({ variantId: item.variantId, qty: item.qty })),
          discount: discountAmount
        })
      });

      const data = await res.json(); 

      if (res.ok && data.success) {
        const newOrder = {
          id: data.order?.id || Date.now(),
          name: data.order?.name || `#${Math.floor(Math.random() * 10000)}`,
          date: new Date().toISOString(),
          total: finalTotal, 
          status: 'Preparando Empaque',
          items: cart
        };
        
        const updatedOrders = [newOrder, ...orders];
        setOrders(updatedOrders);
        localStorage.setItem('kolma_orders', JSON.stringify(updatedOrders));

        setCart([]);
        localStorage.removeItem('kolmard_cart');
        setIsCartOpen(false);
        setShowPayment(false);
        setActiveTab('orders');
        showAppToast('¡Orden recibida! La estamos preparando.');
      } else {
        showAppToast(`Detalle: ${data.error || 'Respuesta inválida de Shopify'}`, 'error');
      }
    } catch (error) {
      showAppToast(`Error local: ${error.message}`, 'error');
    } finally {
      setIsOrdering(false);
    }
  };

  const ToastNotification = () => {
    if (!toast.show) return null;
    return (
      <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-10 fade-in duration-300 w-fit max-w-[90%]">
        <div className={`px-5 py-3 rounded-full shadow-2xl flex items-center space-x-3 backdrop-blur-md border ${toast.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-black text-white border-slate-800'}`}>
          {toast.type === 'error' ? <SVG.X /> : <SVG.Check />}
          <span className="text-[13px] font-bold tracking-wide">{toast.message}</span>
        </div>
      </div>
    );
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 font-sans relative overflow-hidden">
        <ToastNotification />
        
        <div className="absolute top-10 left-10 text-6xl opacity-10 animate-pulse">🛒</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 animate-bounce">🍎</div>
        <div className="absolute top-40 right-20 text-5xl opacity-10">🧀</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-10">🥫</div>

        <div className="w-full max-w-md bg-white rounded-[3.5rem] shadow-2xl overflow-hidden p-8 sm:p-12 animate-in zoom-in-95 duration-500 border border-white relative z-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-600 rounded-[2rem] mx-auto flex items-center justify-center text-4xl mb-4 shadow-2xl shadow-red-200">
              <span className="text-white font-black italic">K</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-1 italic">KOLMARD</h1>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em] flex items-center justify-center gap-1">
              <span>Tu Súper Express</span> <span className="text-red-600">⚡</span>
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div className="flex gap-3">
                  <div className="space-y-1 flex-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Nombre *</label>
                    <input type="text" placeholder="Juan" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 focus:ring-2 focus:ring-red-600 outline-none transition-all font-medium text-sm" required/>
                  </div>
                  <div className="space-y-1 flex-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Apellido *</label>
                    <input type="text" placeholder="Pérez" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 focus:ring-2 focus:ring-red-600 outline-none transition-all font-medium text-sm" required/>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Teléfono *</label>
                  <input type="tel" placeholder="+1 809-000-0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 focus:ring-2 focus:ring-red-600 outline-none transition-all font-medium text-sm" required/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Dirección de Entrega *</label>
                  <input type="text" placeholder="Ej: C/ Principal #4, Centro" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 focus:ring-2 focus:ring-red-600 outline-none transition-all font-medium text-sm" required/>
                </div>
              </>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Correo Electrónico</label>
              <input type="email" placeholder="tucorreo@ejemplo.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 focus:ring-2 focus:ring-red-600 outline-none transition-all font-medium text-sm" required/>
            </div>
            
            <div className="space-y-1 relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Contraseña</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 pl-6 pr-14 focus:ring-2 focus:ring-red-600 outline-none transition-all font-medium text-sm" required/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800">
                  {showPassword ? <SVG.EyeOff /> : <SVG.Eye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loadingAuth} className="w-full bg-black text-white py-4 rounded-[1.5rem] font-black text-base hover:bg-red-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 mt-4">
              {loadingAuth ? 'Verificando...' : (authMode === 'login' ? 'Entrar al Súper' : 'Crear Cuenta')} <SVG.Arrow />
            </button>
          </form>

          <div className="text-center mt-6 flex flex-col gap-4">
            <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setFormData({...formData, phone: '+1 '}); }} className="text-sm font-bold text-red-600 hover:underline">
              {authMode === 'login' ? '¿Primera compra? Regístrate aquí' : 'Ya tengo cuenta. Iniciar sesión'}
            </button>
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-slate-100"></div>
              <span className="text-[9px] font-black text-slate-300 uppercase">o explorar pasillos</span>
              <div className="h-[1px] flex-1 bg-slate-100"></div>
            </div>
            <button onClick={handleGuestEntry} className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors">
              Entrar sin registrarse
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-slate-900 font-sans pb-40 relative">
      <ToastNotification />

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-slate-100 h-24 px-6 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-0.5">
            <SVG.Pin />
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600 truncate max-w-[150px]">{user.address || user.location}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2 italic">
            KOLMARD <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
          </h1>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setActiveTab('me')} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'me' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:text-red-600'}`}>
             <SVG.User />
           </button>
           <button onClick={() => setIsCartOpen(true)} className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-xl relative">
             <SVG.Cart />
             {totalItems > 0 && (
               <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-bounce-short">
                 {totalItems}
               </span>
             )}
           </button>
        </div>
      </header>

      {/* BANNER SUPERIOR DE ESTILO */}
      <div className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-2 text-center flex items-center justify-center gap-2 shadow-md relative z-40">
        <span className="text-red-500 animate-pulse">⚡</span> ENTREGAS RÁPIDAS EN TODO COTUÍ <span className="text-red-500 animate-pulse">⚡</span>
      </div>

      <main className="max-w-xl mx-auto px-6 py-4">
        
        {loadingData ? (
           <div className="flex flex-col items-center justify-center py-20 opacity-50">
             <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="font-bold tracking-widest text-sm uppercase">Cargando pasillos...</p>
           </div>
        ) : (
          <>
            {activeTab === 'me' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 mt-4">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-black italic tracking-tighter">Mi Perfil</h2>
                  {!user.isGuest && !isEditingProfile && (
                    <button onClick={startEditProfile} className="text-red-600 font-bold text-sm flex items-center gap-1 hover:underline">
                      <SVG.Edit /> Editar
                    </button>
                  )}
                </div>
                
                {user.isGuest ? (
                   <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 text-center">
                     <div className="text-4xl mb-2">👤</div>
                     <h3 className="font-black text-red-900 text-lg mb-1">Cuenta de Invitado</h3>
                     <p className="text-xs text-red-700 mb-4 font-medium">Regístrate para guardar tu dirección, ver tus órdenes pasadas y pedir más rápido.</p>
                     <button onClick={handleLogout} className="bg-red-600 text-white font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-red-700">Crear Cuenta</button>
                   </div>
                ) : isEditingProfile ? (
                  <div className="bg-white p-6 rounded-[3rem] shadow-sm border border-slate-50 space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Nombre</label>
                      <input type="text" value={editForm.firstName} onChange={(e) => setEditForm({...editForm, firstName: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-5 focus:ring-2 focus:ring-red-600 outline-none font-medium text-sm"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Apellido</label>
                      <input type="text" value={editForm.lastName} onChange={(e) => setEditForm({...editForm, lastName: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-5 focus:ring-2 focus:ring-red-600 outline-none font-medium text-sm"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Teléfono</label>
                      <input type="text" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-5 focus:ring-2 focus:ring-red-600 outline-none font-medium text-sm"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Dirección</label>
                      <input type="text" value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-5 focus:ring-2 focus:ring-red-600 outline-none font-medium text-sm"/>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button onClick={() => setIsEditingProfile(false)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-2xl font-black text-sm hover:bg-slate-200">Cancelar</button>
                      <button onClick={saveProfile} className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-black text-sm shadow-lg hover:bg-red-700">Guardar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 flex items-center gap-6">
                      <div className="w-20 h-20 bg-red-600 text-white rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-lg shadow-red-200">
                        {(user.firstName || user.name || "U").charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black tracking-tight leading-none mb-1">{user.firstName || user.name} {user.lastName}</h3>
                        <p className="text-sm font-bold text-slate-400">{user.email}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-[3rem] shadow-sm border border-slate-50 p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="text-slate-400 mt-1"><SVG.Pin /></div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dirección de Entrega</p>
                          <p className="font-bold text-slate-800 text-sm mt-0.5">{user.address || user.location}</p>
                        </div>
                      </div>
                      <div className="w-full h-[1px] bg-slate-50"></div>
                      <div className="flex items-start gap-4">
                         <div className="text-slate-400 mt-1"><SVG.User /></div>
                         <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono de Contacto</p>
                          <p className="font-bold text-slate-800 text-sm mt-0.5">{user.phone}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <button onClick={handleLogout} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-red-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 mt-8">
                  <SVG.LogOut /> Cerrar Sesión
                </button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="animate-in fade-in duration-500 mt-4">
                
                {/* MAPA ANIMADO DE COTUÍ */}
                <div className="bg-slate-900 rounded-[2.5rem] p-6 mb-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
                   <h3 className="text-lg font-black italic mb-1">Ruta Cotuí Activa</h3>
                   <p className="text-xs text-slate-400 font-bold mb-6">Nuestros motores están en la calle</p>
                   <div className="relative h-32 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden map-bg">
                      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M 10,50 Q 30,20 50,50 T 90,50" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                      </svg>
                      <div className="absolute top-[45%] left-[5%] w-3 h-3 bg-red-600 rounded-full shadow-[0_0_10px_red]"></div>
                      <div className="absolute top-[45%] right-[5%] w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_green]"></div>
                      <div className="absolute text-white animate-motorcycle-route">
                         <SVG.Motorcycle />
                      </div>
                   </div>
                </div>

                <h2 className="text-3xl font-black italic tracking-tighter mb-8">Mis Órdenes</h2>
                
                {user.isGuest ? (
                   <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-50">
                    <p className="text-slate-400 text-sm">Debes iniciar sesión para ver tus compras anteriores.</p>
                    <button onClick={handleLogout} className="mt-4 text-red-600 font-bold hover:underline">Iniciar Sesión</button>
                   </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-50">
                    <div className="flex justify-center mb-6"><SVG.Box /></div>
                    <p className="text-xl font-black text-slate-800 mb-2">Sin Compras</p>
                    <p className="text-slate-400 text-sm">Tus recibos aparecerán aquí.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-50">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Orden {order.name}</p>
                            <p className="text-sm font-bold text-slate-900">{new Date(order.date).toLocaleDateString()} - {new Date(order.date).toLocaleTimeString()}</p>
                          </div>
                          <div className="bg-red-50 text-red-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span> {order.status}
                          </div>
                        </div>
                        <div className="space-y-3 mb-4">
                          {order.items.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm font-medium text-slate-600">
                              <span>{item.qty}x {item.name}</span>
                              <span className="font-bold text-slate-900">RD${(item.price * item.qty).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Pagado</span>
                          <span className="text-xl font-black italic">RD${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'home' && (
              <div className="animate-in fade-in duration-500">
                
                <div className="sticky top-24 z-40 bg-[#F7F9FB] pt-4 pb-4 -mx-6 px-6 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.05)]">
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x">
                    <button onClick={() => { setActiveCategory('Todos'); setSearch(''); }} className={`snap-start min-w-[70px] flex flex-col items-center gap-2 group ${activeCategory === 'Todos' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
                      <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center text-2xl shadow-sm transition-all ${activeCategory === 'Todos' ? 'bg-red-600 text-white scale-110 shadow-red-200' : 'bg-white text-slate-400'}`}>🌟</div>
                      <span className={`text-[9px] font-black uppercase tracking-tighter ${activeCategory === 'Todos' ? 'text-red-600' : 'text-slate-400'}`}>Todos</span>
                    </button>
                    {categories.map((c) => (
                      <button key={c.id} onClick={() => { setActiveCategory(c.name); setSearch(''); }} className={`snap-start min-w-[70px] flex flex-col items-center gap-2 group ${activeCategory === c.name ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
                        <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center text-3xl shadow-sm transition-all ${activeCategory === c.name ? c.color + ' text-white scale-110 shadow-lg' : 'bg-white text-slate-400'}`}>
                          {activeCategory === c.name ? c.icon : <span className="grayscale">{c.icon}</span>}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-tighter line-clamp-1 ${activeCategory === c.name ? 'text-slate-900' : 'text-slate-400'}`}>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative mt-6 mb-8 group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors">
                    <SVG.Search />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Busca en el súper (ej. Arroz, Leche)..." 
                    className="w-full bg-white rounded-[2rem] py-4 pl-16 pr-12 border-none shadow-sm outline-none focus:ring-2 focus:ring-red-600 transition-all font-medium text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-800"><SVG.X /></button>
                  )}
                </div>

                {!search && activeCategory === 'Todos' && homeSuggestions.length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center gap-2 px-2 mb-4">
                      <span className="text-red-600"><SVG.Sparkles /></span>
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Lleva también</h3>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                      {homeSuggestions.map(sp => (
                        <div key={'sug_'+sp.id} className="snap-start min-w-[140px] bg-white p-3 rounded-2xl border border-slate-50 shadow-sm flex flex-col">
                          <div onClick={() => setSelectedProduct(sp)} className="w-full h-24 bg-[#F8FAFB] rounded-xl mb-3 flex items-center justify-center p-2 cursor-pointer">
                            <img src={sp.img} className="w-full h-full object-contain mix-blend-multiply" />
                          </div>
                          <h4 className="text-[11px] font-bold text-slate-800 line-clamp-1 mb-1">{sp.name}</h4>
                          <span className="text-sm font-black italic text-slate-900 mb-3">RD${sp.price}</span>
                          <button onClick={() => addToCart(sp)} className="mt-auto w-full bg-slate-100 text-slate-900 text-[10px] font-black uppercase py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors">Añadir</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <section>
                  <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-2xl font-black tracking-tight italic">
                      {search ? `Buscando: ${search}` : activeCategory !== 'Todos' ? `Pasillo de ${activeCategory}` : 'Todos los Productos'}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-5">
                    {filteredProducts.map(p => (
                      <div key={p.id} className={`bg-white rounded-[2rem] p-4 shadow-sm border border-slate-50 flex flex-col group transition-all duration-500 ${!p.available ? 'opacity-60' : 'hover:shadow-xl'}`}>
                        <div onClick={() => setSelectedProduct(p)} className="aspect-square bg-[#F8FAFB] rounded-3xl flex items-center justify-center mb-4 overflow-hidden relative cursor-pointer p-2">
                          <img src={p.img} alt={p.name} className={`w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform ${!p.available ? 'grayscale' : ''}`} />
                          {!p.available && <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm"><span className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Agotado</span></div>}
                        </div>
                        <div className="flex-1 px-1" onClick={() => setSelectedProduct(p)}>
                          <p className="text-[9px] font-black text-red-600 uppercase mb-1 tracking-widest line-clamp-1">{p.cat}</p>
                          <h4 className="font-bold text-slate-800 leading-tight mb-3 text-sm h-10 line-clamp-2 cursor-pointer">{p.name}</h4>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                          <span className="text-lg font-black tracking-tighter italic">RD${p.price}</span>
                          <button onClick={() => addToCart(p)} className="w-10 h-10 bg-slate-900 text-white rounded-[0.8rem] flex items-center justify-center hover:bg-red-600 transition-all active:scale-90 shadow-lg disabled:bg-slate-300">
                            <SVG.Plus />
                          </button>
                        </div>
                      </div>
                    ))}

                    {filteredProducts.length === 0 && (
                      <div className="col-span-2 text-center py-20 bg-white rounded-[3rem] border border-slate-50">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300"><SVG.Search /></div>
                        <p className="text-xl font-black text-slate-800 mb-2">No encontrado en el súper</p>
                        <p className="text-slate-400 text-sm">Prueba buscar otra marca o producto.</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}
          </>
        )}
      </main>

      <nav className="fixed bottom-8 left-8 right-8 z-[60] h-20 bg-white/95 backdrop-blur-3xl rounded-[2.5rem] border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-around px-4">
        {[
          { id: 'home', icon: SVG.Market, label: 'Inicio' },
          { id: 'orders', icon: SVG.Truck, label: 'Órdenes' },
          { id: 'cart', icon: SVG.Cart, label: 'Cesta' },
          { id: 'me', icon: SVG.User, label: 'Perfil' },
        ].map(i => (
          <button 
            key={i.id}
            onClick={() => {
              if (i.id === 'cart') setIsCartOpen(true);
              else { setActiveTab(i.id); setSearch(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }
            }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === i.id && i.id !== 'cart' ? 'text-red-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <i.icon />
            <span className="text-[8px] font-black uppercase tracking-widest leading-none">{i.label}</span>
          </button>
        ))}
      </nav>

      {/* MODAL DETALLE DE PRODUCTO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative w-full max-w-xl bg-white rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 z-10 hover:bg-red-50 hover:text-red-600 transition-all"><SVG.X /></button>
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-1/2 bg-slate-50 flex items-center justify-center p-10 relative h-64 sm:h-auto">
                 <img src={selectedProduct.img} alt={selectedProduct.name} className={`w-full h-full object-contain mix-blend-multiply ${!selectedProduct.available ? 'grayscale opacity-50' : ''}`} />
                 {!selectedProduct.available && <div className="absolute inset-0 bg-transparent flex items-center justify-center"><span className="bg-red-600 text-white text-[12px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg transform -rotate-12">AGOTADO</span></div>}
              </div>
              <div className="sm:w-1/2 p-8 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[9px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-2.5 py-1 rounded-full italic">Verificado</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{selectedProduct.unit}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2 italic">{selectedProduct.name}</h2>
                <p className="text-slate-500 text-xs mb-6 leading-relaxed font-medium">{selectedProduct.desc}</p>
                <div className="mt-auto border-t border-slate-100 pt-6 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Precio Unitario</span>
                    <p className="text-2xl font-black tracking-tighter italic">RD${selectedProduct.price}</p>
                  </div>
                  <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="bg-black text-white px-6 py-3.5 rounded-2xl font-black text-sm hover:bg-red-600 transition-all active:scale-95 shadow-xl">
                    {selectedProduct.available ? 'Agregar a Cesta' : 'Agotado'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CARRITO */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[110] flex items-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsCartOpen(false)}></div>
          <aside className="relative w-full max-w-md mx-auto bg-[#F7F9FB] h-[85vh] rounded-t-[2.5rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden">
            
            <div className="p-6 bg-white flex items-center justify-between border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-2xl font-black tracking-tighter italic leading-none mb-1">Tu Cesta</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{totalItems} artículos en cola</p>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-600 transition-all"><SVG.X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              {cart.length > 0 && (
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-2.5">
                    <span className={discountPercent >= 5 ? 'text-red-600' : 'text-slate-400'}>5% OFF (RD$500)</span>
                    <span className={discountPercent >= 10 ? 'text-red-600' : 'text-slate-400'}>10% OFF (RD$1000)</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-red-600 transition-all duration-500 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <p className="text-center text-[10px] font-bold text-slate-500">
                    {discountPercent === 10 ? '¡Felicidades! Tienes 10% de descuento aplicado.' : `Agrega RD$${missingForNext.toFixed(2)} para ganar un ${nextGoalPercent}% de descuento`}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {cart.map(i => (
                  <div key={i.id} className="flex gap-3 bg-white p-3 rounded-[1.5rem] border border-slate-50 shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 p-1">
                      <img src={i.img} alt={i.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <div className="pr-2">
                          <h4 className="font-bold text-slate-800 text-xs leading-tight mb-0.5 line-clamp-1">{i.name}</h4>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">RD${i.price}</p>
                        </div>
                        <button onClick={() => removeFromCart(i.id)} className="text-slate-300 hover:text-red-600 -mt-1"><SVG.X /></button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                         <span className="text-sm font-black text-slate-900 tracking-tighter italic">RD${(i.price * i.qty).toFixed(2)}</span>
                         <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-100">
                            <button onClick={() => updateQty(i.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-500 hover:text-red-600"><SVG.Minus /></button>
                            <span className="text-xs font-black w-4 text-center">{i.qty}</span>
                            <button onClick={() => updateQty(i.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-500 hover:text-red-600"><SVG.Plus /></button>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {cart.length > 0 && cartSuggestions.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <h3 className="text-xs font-black mb-3 uppercase tracking-widest text-slate-400">Otros clientes también compran</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                    {cartSuggestions.map(sp => (
                      <div key={'cart_sug_'+sp.id} className="snap-start min-w-[120px] bg-white p-2.5 rounded-[1.2rem] border border-slate-100 shadow-sm flex flex-col">
                        <div className="w-full h-16 bg-slate-50 rounded-xl mb-2 flex items-center justify-center p-1"><img src={sp.img} className="w-full h-full object-contain mix-blend-multiply" /></div>
                        <h4 className="text-[10px] font-bold text-slate-800 line-clamp-1 mb-1">{sp.name}</h4>
                        <span className="text-xs font-black italic text-slate-900 mb-2">RD${sp.price}</span>
                        <button onClick={() => addToCart(sp)} className="mt-auto w-full bg-slate-100 text-slate-900 text-[9px] font-black uppercase py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-colors">Añadir</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cart.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-20 font-black italic">
                  <div className="scale-[2.5] mb-8"><SVG.Cart /></div>
                  <p className="text-2xl tracking-tighter uppercase">Tu cesta está vacía</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] shrink-0">
              {discountPercent > 0 && cart.length > 0 && (
                <div className="flex justify-between items-center mb-3 border-b border-dashed border-slate-200 pb-2">
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Descuento Ganado ({discountPercent}%)</span>
                  <span className="text-sm font-black text-red-600">-RD${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                 <div className="flex flex-col">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Final</span>
                   <span className="text-2xl font-black tracking-tighter italic text-slate-900">RD${finalTotal.toFixed(2)}</span>
                 </div>
                 <button 
                  disabled={cart.length === 0 || isOrdering}
                  onClick={handleCheckoutClick}
                  className={`bg-black text-white px-6 py-3.5 rounded-2xl font-black text-sm hover:bg-red-600 transition-all flex items-center gap-2 shadow-xl active:scale-95 ${(cart.length === 0 || isOrdering) ? 'opacity-50 pointer-events-none' : ''}`}
                 >
                   Proceder al Pago <SVG.Check />
                 </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* MODAL MÉTODOS DE PAGO */}
      {showPayment && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowPayment(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black italic">Método de Pago</h2>
              <button onClick={() => setShowPayment(false)} className="bg-slate-100 p-2 rounded-xl text-slate-400 hover:text-red-600 transition-colors"><SVG.X/></button>
            </div>
            
            <div className="space-y-4 mb-6">
              {/* PAGO CONTRA ENTREGA (SELECCIONADO) */}
              <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-black bg-slate-50 cursor-pointer transition-all shadow-sm">
                <div className="text-green-600"><SVG.Money /></div>
                <div className="flex-1">
                  <p className="font-black text-sm text-slate-900">Pago contra entrega</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efectivo o Transferencia al recibir</p>
                </div>
                <div className="w-5 h-5 rounded-full border-4 border-black bg-white"></div>
              </label>

              {/* PAGO CON TARJETA (DESHABILITADO) */}
              <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 bg-white opacity-50 cursor-not-allowed">
                <div className="text-slate-400"><SVG.CreditCard /></div>
                <div className="flex-1">
                  <p className="font-black text-sm text-slate-500 line-through">Tarjeta de Crédito / Débito</p>
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">No disponible por el momento</p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>
              </label>
            </div>

            <button 
              onClick={processCheckout} 
              disabled={isOrdering} 
              className="w-full bg-black text-white px-6 py-4 rounded-2xl font-black text-sm flex justify-center gap-2 hover:bg-red-600 transition-colors shadow-xl active:scale-95"
            >
              {isOrdering ? 'Procesando...' : 'Confirmar y Pedir'} <SVG.Check />
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce-short { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .animate-bounce-short { animation: bounce-short 1.5s ease-in-out infinite; }
        
        /* Animación del Mapa y Motor */
        @keyframes routeCotu {
           0% { top: 35%; left: 5%; transform: scaleX(1) translateY(0); }
           25% { transform: scaleX(1) translateY(-10px); }
           45% { top: 15%; left: 45%; transform: scaleX(1) translateY(0); }
           70% { transform: scaleX(1) translateY(-10px); }
           90% { top: 35%; left: 85%; transform: scaleX(1) translateY(0); }
           95% { top: 35%; left: 85%; transform: scaleX(-1) translateY(0); }
           100% { top: 35%; left: 5%; transform: scaleX(-1) translateY(0); }
        }
        .animate-motorcycle-route { animation: routeCotu 6s linear infinite; }
        .map-bg { background-image: radial-gradient(#334155 2px, transparent 2px); background-size: 15px 15px; }
      `}} />
    </div>
  );
}
