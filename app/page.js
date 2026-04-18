"use client";

import React, { useState, useMemo, useEffect } from 'react';

// --- ICONOS SVG (Rojo y Blanco - KolmaRD) ---
const SVG = {
  Market: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>,
  Category: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg>,
  User: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Cart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 002 1.58h9.78a2 2 0 001.95-1.57l1.65-7.43H5.12"/></svg>,
  Truck: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10Z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Pin: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-red-600"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Arrow: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="m9 18 6-6-6-6"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><polyline points="20 6 9 17 4 12"/></svg>,
  LogOut: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Box: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-12 h-12 text-slate-300"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
};

export default function KolmaRDApp() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' o 'register'
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', phone: '', address: 'Cotuí, Centro' });
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isOrdering, setIsOrdering] = useState(false);

  // Estados desde API Vercel
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Cargar datos al iniciar
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
      // Conexión a tu API de Vercel
      const res = await fetch('/api/products');
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
            desc: node.description || 'Calidad KolmaRD garantizada.',
            available: node.variants?.edges[0]?.node.availableForSale
          }));
        setProducts(formattedProducts);

        // Generar categorías únicas
        const uniqueCats = [...new Set(formattedProducts.map(p => p.cat))];
        const dynamicCategories = uniqueCats.map((cat, index) => ({
          id: cat,
          name: cat,
          icon: ['🥦', '🥫', '🧼', '🍷', '🥖', '🍎'][index % 6], 
          color: ['bg-red-500', 'bg-orange-500', 'bg-blue-500', 'bg-purple-500', 'bg-emerald-500'][index % 5]
        }));
        setCategories(dynamicCategories);
      }
    } catch (error) {
      console.error("Error cargando productos de Vercel:", error);
    } finally {
      setLoadingData(false);
    }
  };

  // Autenticación con tu API de Vercel
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoadingAuth(true);
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
        localStorage.setItem('kolma_user', JSON.stringify(data.user));
        setShowLogin(false);
      } else {
        alert(data.error || 'Verifica tus credenciales');
      }
    } catch (error) {
      alert('Error de conexión con el servidor.');
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setActiveTab('home');
    setShowLogin(true);
    localStorage.removeItem('kolma_user');
    localStorage.removeItem('kolmard_cart');
  };

  // Carrito
  const addToCart = (p) => {
    if (!p.available) return alert("Producto agotado");
    setCart(curr => {
      const ex = curr.find(i => i.id === p.id);
      const n = ex 
        ? curr.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) 
        : [...curr, { ...p, qty: 1 }];
      localStorage.setItem('kolmard_cart', JSON.stringify(n));
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
  
  const total = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
  const totalItems = cart.reduce((acc, i) => acc + i.qty, 0);

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    return products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.cat.toLowerCase().includes(search.toLowerCase()));
  }, [search, products]);

  // Checkout (Crear Orden)
  const processCheckout = async () => {
    if (cart.length === 0) return;
    setIsOrdering(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo: user,
          items: cart.map(item => ({ variantId: item.variantId, quantity: item.qty }))
        })
      });

      if (res.ok) {
        const { order } = await res.json();
        
        const newOrder = {
          id: order?.id || Date.now(),
          name: order?.name || `#${Math.floor(Math.random() * 10000)}`,
          date: new Date().toISOString(),
          total: total,
          status: 'Preparando',
          items: cart
        };
        
        const updatedOrders = [newOrder, ...orders];
        setOrders(updatedOrders);
        localStorage.setItem('kolma_orders', JSON.stringify(updatedOrders));

        setCart([]);
        localStorage.removeItem('kolmard_cart');
        setIsCartOpen(false);
        setActiveTab('orders');
      } else {
        alert('Error al procesar pedido. Intenta nuevamente.');
      }
    } catch (error) {
      alert('Error de conexión con el servidor.');
    } finally {
      setIsOrdering(false);
    }
  };

  // VISTA: PORTAL DE ACCESO (LOGIN / REGISTRO)
  if (showLogin) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-white rounded-[3.5rem] shadow-2xl overflow-hidden p-12 animate-in zoom-in-95 duration-500 border border-white">
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-red-600 rounded-[2.5rem] mx-auto flex items-center justify-center text-5xl mb-6 shadow-2xl shadow-red-200">
              <span className="text-white font-black italic">K</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-2 italic">KOLMARD</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">Cotuí · Express</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-5">
            {authMode === 'register' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Nombre</label>
                <input type="text" placeholder="Ej: Juan Pérez" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-50 border-none rounded-[2rem] py-5 px-8 focus:ring-2 focus:ring-red-600 outline-none transition-all font-medium" required/>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Correo / Usuario</label>
              <input type="email" placeholder="correo@ejemplo.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border-none rounded-[2rem] py-5 px-8 focus:ring-2 focus:ring-red-600 outline-none transition-all font-medium" required/>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Contraseña</label>
              <input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border-none rounded-[2rem] py-5 px-8 focus:ring-2 focus:ring-red-600 outline-none transition-all font-medium" required/>
            </div>
            <button type="submit" disabled={loadingAuth} className="w-full bg-black text-white py-5 rounded-[2rem] font-black text-lg hover:bg-red-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
              {loadingAuth ? 'Cargando...' : (authMode === 'login' ? 'Ingresar' : 'Registrarme')} <SVG.Arrow />
            </button>
          </form>
          <div className="text-center mt-6">
            <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-sm font-bold text-red-600 hover:underline">
              {authMode === 'login' ? '¿No tienes cuenta? Crea una' : 'Ya tengo cuenta. Entrar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // VISTA: APLICACIÓN COMPLETA
  return (
    <div className="min-h-screen bg-[#F7F9FB] text-slate-900 font-sans pb-40">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100 h-24 px-6 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-0.5">
            <SVG.Pin />
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">{user.address || user.location || "Cotuí"}</span>
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

      <main className="max-w-xl mx-auto px-6 py-8">
        
        {loadingData ? (
           <div className="flex flex-col items-center justify-center py-20 opacity-50">
             <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="font-bold tracking-widest text-sm uppercase">Cargando inventario...</p>
           </div>
        ) : (
          <>
            {/* --- VISTA: PERFIL --- */}
            {activeTab === 'me' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <h2 className="text-3xl font-black italic tracking-tighter mb-8">Mi Perfil</h2>
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 flex items-center gap-6">
                  <div className="w-20 h-20 bg-red-600 text-white rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-lg shadow-red-200">
                    {(user.firstName || user.name || "U").charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight leading-none mb-1">{user.firstName || user.name}</h3>
                    <p className="text-sm font-bold text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-red-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 mt-8">
                  <SVG.LogOut /> Cerrar Sesión
                </button>
              </div>
            )}

            {/* --- VISTA: ÁREA DE PEDIDOS (SHIPDAY READY) --- */}
            {activeTab === 'orders' && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black italic tracking-tighter mb-8">Mis Pedidos</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-50">
                    <div className="flex justify-center mb-6"><SVG.Box /></div>
                    <p className="text-xl font-black text-slate-800 mb-2">Sin Pedidos</p>
                    <p className="text-slate-400 text-sm">Tus órdenes aparecerán aquí.</p>
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
                              <span className="font-bold text-slate-900">RD${item.price * item.qty}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total</span>
                          <span className="text-xl font-black italic">RD${order.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- VISTA PRINCIPAL (HOME) --- */}
            {(activeTab === 'home') && (
              <div className="animate-in fade-in duration-500">
                <div className="relative mb-10 group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors">
                    <SVG.Search />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Buscar productos..." 
                    className="w-full bg-white rounded-[2.2rem] py-5 pl-16 pr-12 border-none shadow-sm outline-none focus:ring-2 focus:ring-red-600 transition-all font-medium text-lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-800"><SVG.X /></button>
                  )}
                </div>

                {!search && categories.length > 0 && (
                  <section className="mb-12">
                    <h3 className="text-lg font-black mb-6 px-2">Categorías</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                      {categories.map((c, i) => (
                        <button key={c.id} onClick={() => setSearch(c.name)} className="snap-start min-w-[80px] flex flex-col items-center gap-3 group">
                          <div className={`w-16 h-16 ${c.color} rounded-[2rem] flex items-center justify-center text-3xl shadow-lg shadow-black/5 group-hover:scale-110 transition-all text-white overflow-hidden`}>
                            {c.icon}
                          </div>
                          <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-slate-900 tracking-tighter line-clamp-1">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  <div className="flex items-center justify-between mb-8 px-2">
                    <h3 className="text-2xl font-black tracking-tight italic">{search ? `Resultados: ${search}` : 'Todos los Productos'}</h3>
                    <div className="h-0.5 flex-1 bg-slate-100 mx-4"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    {filteredProducts.map(p => (
                      <div key={p.id} className={`bg-white rounded-[2.8rem] p-6 shadow-sm border border-slate-50 flex flex-col group transition-all duration-500 ${!p.available ? 'opacity-50 grayscale' : 'hover:shadow-2xl'}`}>
                        <div onClick={() => p.available && setSelectedProduct(p)} className="aspect-square bg-[#F8FAFB] rounded-[2.2rem] flex items-center justify-center mb-5 overflow-hidden relative cursor-pointer">
                          <img src={p.img} alt={p.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform" />
                          {!p.available && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="bg-black text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">Agotado</span></div>}
                        </div>
                        <div className="flex-1 px-1" onClick={() => p.available && setSelectedProduct(p)}>
                          <p className="text-[11px] font-black text-red-600 uppercase mb-1 tracking-tighter line-clamp-1">{p.cat}</p>
                          <h4 className="font-bold text-slate-800 leading-tight mb-4 h-12 line-clamp-2 cursor-pointer">{p.name}</h4>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xl font-black tracking-tighter italic">RD${p.price}</span>
                          <button disabled={!p.available} onClick={() => addToCart(p)} className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-red-600 transition-all active:scale-90 shadow-lg disabled:bg-slate-300">
                            <SVG.Plus />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </>
        )}
      </main>

      {/* Navegación Inferior */}
      <nav className="fixed bottom-8 left-8 right-8 z-[60] h-24 bg-white/90 backdrop-blur-3xl rounded-[3rem] border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-around px-4">
        {[
          { id: 'home', icon: SVG.Market, label: 'Inicio' },
          { id: 'orders', icon: SVG.Truck, label: 'Pedidos' },
          { id: 'cart', icon: SVG.Cart, label: 'Cesta' },
          { id: 'me', icon: SVG.User, label: 'Perfil' },
        ].map(i => (
          <button 
            key={i.id}
            onClick={() => {
              if (i.id === 'cart') setIsCartOpen(true);
              else { setActiveTab(i.id); setSearch(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }
            }}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === i.id && i.id !== 'cart' ? 'text-red-600 scale-110' : 'text-slate-300 hover:text-slate-400'}`}
          >
            <i.icon />
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">{i.label}</span>
          </button>
        ))}
      </nav>

      {/* Modal Detalle Producto */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative w-full max-w-xl bg-white rounded-t-[4rem] sm:rounded-[4rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-10 right-10 w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 z-10 hover:bg-red-50 hover:text-red-600 transition-all"><SVG.X /></button>
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-1/2 bg-slate-50 flex items-center justify-center p-16"><img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-auto mix-blend-multiply" /></div>
              <div className="sm:w-1/2 p-12 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-full italic">Verificado</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{selectedProduct.unit}</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 leading-tight mb-4 italic">{selectedProduct.name}</h2>
                <p className="text-slate-500 text-sm mb-12 leading-relaxed font-medium">{selectedProduct.desc}</p>
                <div className="mt-auto border-t border-slate-100 pt-10 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Precio</span>
                    <p className="text-3xl font-black tracking-tighter italic">RD${selectedProduct.price}</p>
                  </div>
                  <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="bg-black text-white px-8 py-5 rounded-[2rem] font-black text-lg hover:bg-red-600 transition-all active:scale-95 shadow-2xl">Agregar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Carrito / Checkout */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[110] flex items-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl animate-in fade-in" onClick={() => setIsCartOpen(false)}></div>
          <aside className="relative w-full max-w-xl mx-auto bg-[#F7F9FB] h-[90vh] rounded-t-[4rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden">
            <div className="p-10 bg-white flex items-center justify-between border-b border-slate-100">
              <div>
                <h2 className="text-3xl font-black tracking-tighter italic leading-none mb-2">Mi Pedido</h2>
                <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">{totalItems} productos • Pago Contra Entrega</p>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="w-14 h-14 bg-slate-50 flex items-center justify-center rounded-[1.5rem] text-slate-400 hover:text-red-600 transition-all"><SVG.X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-6">
              {cart.map(i => (
                <div key={i.id} className="flex gap-5 bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm group">
                  <div className="w-24 h-24 bg-slate-50 rounded-[1.8rem] flex items-center justify-center shrink-0 p-2 overflow-hidden"><img src={i.img} alt={i.name} className="w-full h-full object-cover mix-blend-multiply" /></div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div><h4 className="font-black text-slate-800 text-lg leading-tight mb-1 line-clamp-1">{i.name}</h4><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">RD${i.price} / {i.unit}</p></div>
                      <button onClick={() => removeFromCart(i.id)} className="text-slate-200 hover:text-red-600 transition-colors"><SVG.X /></button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                       <span className="text-2xl font-black text-slate-900 tracking-tighter italic">RD${i.price * i.qty}</span>
                       <div className="flex items-center gap-4 bg-slate-50 rounded-[1.5rem] p-1.5 border border-slate-100">
                          <button onClick={() => updateQty(i.id, -1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-400 hover:text-red-600"><SVG.Minus /></button>
                          <span className="text-sm font-black min-w-[24px] text-center">{i.qty}</span>
                          <button onClick={() => updateQty(i.id, 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-400 hover:text-red-600"><SVG.Plus /></button>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-10 font-black italic"><div className="scale-[3] mb-12"><SVG.Cart /></div><p className="text-3xl tracking-tighter uppercase">Cesta Vacía</p></div>
              )}
            </div>

            <div className="p-10 bg-white border-t border-slate-100 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-center mb-8 px-4">
                 <div className="flex flex-col">
                   <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 italic">Total a Pagar</span>
                   <span className="text-5xl font-black tracking-tighter italic">RD${total}</span>
                 </div>
                 <button 
                  disabled={cart.length === 0 || isOrdering}
                  onClick={processCheckout}
                  className={`bg-black text-white px-10 py-6 rounded-[2.5rem] font-black text-lg hover:bg-red-600 transition-all flex items-center gap-3 shadow-2xl active:scale-95 ${(cart.length === 0 || isOrdering) ? 'opacity-50 pointer-events-none' : ''}`}
                 >
                   {isOrdering ? 'Enviando...' : 'Confirmar'} <SVG.Check />
                 </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce-short { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .animate-bounce-short { animation: bounce-short 1.5s ease-in-out infinite; }
      `}} />
    </div>
  );
}
