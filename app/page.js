"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, ChevronDown, Bell, ShoppingCart, Home, Store, Tag, 
  ClipboardList, User, ShoppingBag, Truck, MapPin, ArrowLeft, 
  Package, DollarSign, Phone, Check, X, LogOut, Eye, EyeOff, 
  Edit, Plus, Minus, CreditCard, Sparkles 
} from 'lucide-react';

const primaryColor = "bg-[#E31E52]";
const textColor = "text-[#E31E52]";
const primaryHex = "#E31E52";

// Iconos SVG Personalizados que no están en Lucide
const SVG = {
  Box: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-12 h-12 text-slate-300"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Motorcycle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-white drop-shadow-md"><path d="M5 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M5 10h1.5l1.5 2h3l1.5-2H14l1.5 3H19"/><path d="M9 10 7 6h2l2 4"/></svg>
};

const getCategoryStyle = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes('pan') || lower.includes('reposter')) return { icon: '🍞', color: 'bg-amber-100 text-amber-600' };
  if (lower.includes('bebida') || lower.includes('refresco') || lower.includes('jugo') || lower.includes('agua')) return { icon: '🥤', color: 'bg-blue-100 text-blue-500' };
  if (lower.includes('alcohol') || lower.includes('cerveza') || lower.includes('licor') || lower.includes('vino')) return { icon: '🍺', color: 'bg-yellow-100 text-yellow-600' };
  if (lower.includes('fresco') || lower.includes('fruta') || lower.includes('vegetal') || lower.includes('agro')) return { icon: '🍎', color: 'bg-emerald-100 text-emerald-500' };
  if (lower.includes('carn') || lower.includes('pollo') || lower.includes('pescado') || lower.includes('embutido')) return { icon: '🥩', color: 'bg-red-100 text-red-500' };
  if (lower.includes('lacteo') || lower.includes('queso') || lower.includes('leche') || lower.includes('huevo')) return { icon: '🧀', color: 'bg-yellow-100 text-yellow-500' };
  if (lower.includes('despensa') || lower.includes('arroz') || lower.includes('grano') || lower.includes('aceite')) return { icon: '🍚', color: 'bg-orange-100 text-orange-500' };
  if (lower.includes('limp') || lower.includes('hogar') || lower.includes('detergente')) return { icon: '🧼', color: 'bg-cyan-100 text-cyan-500' };
  if (lower.includes('cuidado') || lower.includes('personal') || lower.includes('belleza') || lower.includes('bebe')) return { icon: '🧴', color: 'bg-pink-100 text-pink-500' };
  if (lower.includes('snack') || lower.includes('picadera') || lower.includes('dulce') || lower.includes('galleta')) return { icon: '🍪', color: 'bg-purple-100 text-purple-500' };
  return { icon: '🛒', color: 'bg-slate-100 text-slate-500' };
};

const defaultGuest = { name: 'Invitado', lastName: '', email: 'Sin registrar', address: 'Cotuí, Sánchez Ramírez', phone: '+1 ', isGuest: true };

export default function KolmaApp() {
  // LÓGICA DE SHOPIFY Y ESTADO ORIGINAL
  const [user, setUser] = useState(defaultGuest);
  const [showLogin, setShowLogin] = useState(false);
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
  const [isOrdering, setIsOrdering] = useState(false);
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // NUEVOS ESTADOS DE NAVEGACIÓN UI
  const [currentView, setCurrentView] = useState('inicio');
  const [activeTab, setActiveTab] = useState('inicio');

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
    }
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedCart) setCart(JSON.parse(savedCart));

    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeTab === 'pedidos' && orders.length > 0) {
      const updateStatuses = async () => {
        const updatedOrders = await Promise.all(orders.map(async (order) => {
          if (order.status.includes('✅') || order.status.includes('🚫') || order.status.includes('❌')) {
            return order;
          }
          try {
            const res = await fetch('/api/status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: order.id })
            });
            const data = await res.json();
            return { ...order, status: data.status || order.status };
          } catch (e) {
            return order;
          }
        }));
        
        if (JSON.stringify(orders) !== JSON.stringify(updatedOrders)) {
          setOrders(updatedOrders);
          localStorage.setItem('kolma_orders', JSON.stringify(updatedOrders));
        }
      };
      
      updateStatuses(); 
      const interval = setInterval(updateStatuses, 15000); 
      return () => clearInterval(interval);
    }
  }, [activeTab, orders]);

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
      showAppToast('Error cargando pasillos del supermercado. Verifica tu conexión.', 'error');
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
    setUser(defaultGuest);
    setCart([]);
    setActiveTab('inicio');
    setCurrentView('inicio');
    setShowLogin(true);
    setFormData({ ...formData, password: '' }); 
    localStorage.removeItem('kolma_user');
    localStorage.removeItem('kolmard_cart');
  };

  const handleGuestEntry = () => {
    setShowLogin(false);
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

  if (rawTotal >= 500) {
    discountPercent = 10;
    nextGoalAmount = 0;
  }

  const discountAmount = rawTotal * (discountPercent / 100);
  const finalTotal = rawTotal - discountAmount;
  const progressPercent = Math.min((rawTotal / 500) * 100, 100);
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
      return showAppToast('Inicia sesión o regístrate para procesar tu pedido.', 'error');
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
        setActiveTab('pedidos');
        showAppToast('¡Orden recibida! La estamos preparando en el supermercado.');
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
        <div className={`px-5 py-3 rounded-full shadow-2xl flex items-center space-x-3 backdrop-blur-md border ${toast.type === 'error' ? 'bg-red-50 text-[#E31E52] border-red-200' : `${primaryColor} text-white border-[#E31E52]`}`}>
          {toast.type === 'error' ? <X size={20} /> : <Check size={20} />}
          <span className="text-[13px] font-bold tracking-wide">{toast.message}</span>
        </div>
      </div>
    );
  };

  const MandaoForm = () => (
    <div className="flex flex-col bg-white min-h-screen animate-in slide-in-from-right duration-300 z-50 absolute inset-0">
      <div className={`${primaryColor} text-white p-6 flex items-center gap-4`}>
        <button onClick={() => setCurrentView('inicio')} className="p-1">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Solicitar un Mandao'</h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-red-50 p-4 rounded-2xl flex items-start gap-3">
          <Package className={textColor} size={20} />
          <p className="text-sm text-gray-700">
            Envía paquetes, documentos o cualquier encargo dentro de <strong>Cotuí</strong> de forma segura.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Valor aproximado del paquete</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="number" placeholder="0.00" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#E31E52]"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Dirección de recogida</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="text" placeholder="¿Dónde recogemos el paquete?" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#E31E52]"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Dirección de entrega</label>
            <div className="relative">
              <Truck className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="text" placeholder="¿A dónde lo llevamos?" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#E31E52]"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Contacto de quien recibe</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="text" placeholder="Nombre y teléfono" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#E31E52]"/>
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            if (user.isGuest) {
              setShowLogin(true);
              return showAppToast('Inicia sesión o regístrate para pedir un Mandao.', 'error');
            }
            setCurrentView('inicio');
            showAppToast('Solicitud de Mandao recibida.');
          }}
          className={`${primaryColor} w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg active:scale-95 transition-transform`}
        >
          Confirmar Mandao'
        </button>
      </div>
    </div>
  );

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
            <div className={`${primaryColor} w-20 h-20 rounded-[2rem] mx-auto flex items-center justify-center text-4xl mb-4 shadow-2xl shadow-red-200`}>
              <span className="text-white font-black italic">K</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-1 italic">KOLMA</h1>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em] flex items-center justify-center gap-1">
              <span>Tu Supermercado</span> <span className={textColor}>⚡</span>
            </p>
            <div className="mt-4 bg-red-50 border border-red-100 rounded-xl py-2 px-3 flex items-center justify-center gap-2 animate-pulse">
              <span className={`${textColor} font-black text-sm`}>🔥 10% OFF en pedidos &gt; RD$500 HOY</span>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div className="flex gap-3">
                  <div className="space-y-1 flex-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Nombre *</label>
                    <input type="text" placeholder="Juan" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className={`w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 focus:ring-2 focus:ring-[#E31E52] outline-none transition-all font-medium text-sm`} required/>
                  </div>
                  <div className="space-y-1 flex-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Apellido *</label>
                    <input type="text" placeholder="Pérez" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 focus:ring-2 focus:ring-[#E31E52] outline-none transition-all font-medium text-sm" required/>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Teléfono *</label>
                  <input type="tel" placeholder="+1 809-000-0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 focus:ring-2 focus:ring-[#E31E52] outline-none transition-all font-medium text-sm" required/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Dirección de Entrega *</label>
                  <input type="text" placeholder="Ej: C/ Principal #4, Centro" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 focus:ring-2 focus:ring-[#E31E52] outline-none transition-all font-medium text-sm" required/>
                </div>
              </>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Correo Electrónico</label>
              <input type="email" placeholder="tucorreo@ejemplo.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 focus:ring-2 focus:ring-[#E31E52] outline-none transition-all font-medium text-sm" required/>
            </div>
            
            <div className="space-y-1 relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">Contraseña</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 pl-6 pr-14 focus:ring-2 focus:ring-[#E31E52] outline-none transition-all font-medium text-sm" required/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loadingAuth} className={`w-full ${primaryColor} text-white py-4 rounded-[1.5rem] font-black text-base hover:bg-[#C91A47] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 mt-4`}>
              {loadingAuth ? 'Verificando...' : (authMode === 'login' ? 'Entrar al Súper' : 'Aprovechar Oferta')}
            </button>
          </form>

          <div className="text-center mt-6 flex flex-col gap-4">
            <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setFormData({...formData, phone: '+1 '}); }} className={`text-sm font-bold ${textColor} hover:underline`}>
              {authMode === 'login' ? '¿Primera compra? Regístrate aquí' : 'Ya tengo cuenta. Iniciar sesión'}
            </button>
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-slate-100"></div>
              <span className="text-[9px] font-black text-slate-300 uppercase">o explorar pasillos</span>
              <div className="h-[1px] flex-1 bg-slate-100"></div>
            </div>
            <button onClick={handleGuestEntry} className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors">
              Volver a la tienda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FB] font-sans max-w-md mx-auto relative overflow-hidden pb-24">
      <ToastNotification />

      {currentView === 'mandao_form' ? (
        <MandaoForm />
      ) : (
        <>
          {/* HEADER VIBRANTE Y BUSCADOR */}
          {activeTab === 'inicio' && (
            <div className={`${primaryColor} text-white p-4 pb-8 rounded-b-[2.5rem] shadow-md`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-1 cursor-pointer">
                  <MapPin size={16} />
                  <span className="font-semibold text-sm truncate max-w-[200px]">{user.address || user.location || 'Cotuí, Sánchez Ramírez'}</span>
                  <ChevronDown size={18} />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setIsCartOpen(true)} className="relative hover:scale-105 transition-transform">
                    <ShoppingCart size={24} />
                    {totalItems > 0 && (
                      <span className={`absolute -top-1 -right-1 bg-white ${textColor} text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce-short`}>
                        {totalItems}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="relative mb-8 group">
                <input 
                  type="text" 
                  placeholder="Supermercados, productos o pedir un mandao'" 
                  className="w-full py-3 px-5 rounded-full text-gray-800 focus:outline-none shadow-lg pr-12 focus:ring-2 focus:ring-white transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className={`absolute right-1 top-1 bottom-1 w-10 h-10 ${primaryColor} rounded-full flex items-center justify-center text-white`}>
                  <Search size={20} />
                </div>
              </div>

              {!search && (
                <div className="flex items-center justify-between mt-4">
                  <div className="flex-1">
                    <div className="bg-white p-1 w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-sm">
                      <span className={`${textColor} font-bold text-xl`}>K</span>
                    </div>
                    <h2 className="text-2xl font-black leading-tight mb-1">
                      Compra todo lo que necesitas
                    </h2>
                    <p className="text-lg font-medium opacity-90">en Cotuí</p>
                    <div className="mt-4 bg-white/20 backdrop-blur-sm inline-block px-4 py-1 rounded-full text-xs font-bold border border-white/30">
                      Entregas rápidas ⚡
                    </div>
                  </div>
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
                    <ShoppingBag size={80} className="text-white/40 absolute" />
                    <Truck size={50} className="text-white relative z-10" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CONTENIDO PRINCIPAL */}
          <main className="px-4 py-4">
            {loadingData ? (
               <div className="flex flex-col items-center justify-center py-20 opacity-50">
                 <div className={`w-12 h-12 border-4 border-[#E31E52] border-t-transparent rounded-full animate-spin mb-4`}></div>
                 <p className="font-bold tracking-widest text-sm uppercase">Cargando pasillos...</p>
               </div>
            ) : (
              <>
                {/* VISTA INICIO */}
                {activeTab === 'inicio' && (
                  <div className="animate-in fade-in duration-500">
                    
                    {!search && (
                      <>
                        <div className="grid grid-cols-2 gap-4 -mt-4 mb-6 relative z-10">
                          <div className="bg-white p-6 rounded-3xl shadow-md flex flex-col items-center justify-center text-center cursor-pointer transform transition active:scale-95 border border-gray-100">
                            <div className="w-16 h-16 mb-4 flex items-center justify-center bg-orange-50 rounded-2xl">
                              <ShoppingBag size={32} className="text-orange-500" />
                            </div>
                            <span className="font-bold text-gray-800 text-sm">Supermercado</span>
                          </div>
                          
                          <div onClick={() => setCurrentView('mandao_form')} className="bg-white p-6 rounded-3xl shadow-md flex flex-col items-center justify-center text-center cursor-pointer transform transition active:scale-95 border border-gray-100">
                            <div className="w-16 h-16 mb-4 flex items-center justify-center bg-red-50 rounded-2xl relative overflow-hidden">
                               <svg viewBox="0 0 100 100" className="w-12 h-12">
                                 <path d="M20,70 L40,70 L50,55 L80,55 L85,70 L20,70" fill={primaryHex} />
                                 <circle cx="30" cy="75" r="8" fill="#333" />
                                 <circle cx="75" cy="75" r="8" fill="#333" />
                                 <path d="M50,55 L45,40 L55,40" stroke="#333" strokeWidth="2" fill="none" />
                                 <circle cx="58" cy="35" r="7" fill={primaryHex} />
                                 <path d="M58,42 Q65,45 65,55 L50,55 Z" fill={primaryHex} />
                                 <rect x="75" y="40" width="18" height="18" rx="2" fill="#1D0070" />
                                 <text x="79" y="53" fill="white" fontSize="10" fontWeight="bold">K</text>
                               </svg>
                            </div>
                            <span className="font-bold text-gray-800 text-sm">Mandao'</span>
                          </div>
                        </div>

                        {/* CATEGORÍAS (De Shopify) */}
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x -mx-4 px-4 mb-6">
                          <button onClick={() => { setActiveCategory('Todos'); setSearch(''); }} className={`snap-start min-w-[70px] flex flex-col items-center gap-2 group`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all ${activeCategory === 'Todos' ? `${primaryColor} text-white scale-110 shadow-red-200` : 'bg-white text-slate-400'}`}>🌟</div>
                            <span className={`text-[10px] font-bold uppercase tracking-tighter ${activeCategory === 'Todos' ? textColor : 'text-slate-400'}`}>Todos</span>
                          </button>
                          {categories.map((c) => (
                            <button key={c.id} onClick={() => { setActiveCategory(c.name); setSearch(''); }} className={`snap-start min-w-[70px] flex flex-col items-center gap-2 group`}>
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-all ${activeCategory === c.name ? `${primaryColor} text-white scale-110 shadow-lg` : `${c.color}`}`}>
                                {activeCategory === c.name ? c.icon : <span className="grayscale">{c.icon}</span>}
                              </div>
                              <span className={`text-[10px] font-bold uppercase tracking-tighter line-clamp-1 ${activeCategory === c.name ? 'text-slate-900' : 'text-slate-400'}`}>{c.name}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-black tracking-tight">
                        {search ? `Buscando: ${search}` : activeCategory !== 'Todos' ? `Pasillo de ${activeCategory}` : 'Todos los Productos'}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {filteredProducts.map(p => (
                        <div key={p.id} className={`bg-white rounded-3xl p-3 shadow-sm border border-slate-50 flex flex-col group transition-all duration-300 ${!p.available ? 'opacity-60' : 'hover:shadow-md'}`}>
                          <div onClick={() => setSelectedProduct(p)} className="aspect-square bg-[#F8FAFB] rounded-2xl flex items-center justify-center mb-3 overflow-hidden relative cursor-pointer p-2">
                            <img src={p.img} alt={p.name} className={`w-full h-full object-contain mix-blend-multiply transition-transform ${!p.available ? 'grayscale' : ''}`} />
                            {!p.available && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Agotado</span></div>}
                          </div>
                          <div className="flex-1 px-1 cursor-pointer" onClick={() => setSelectedProduct(p)}>
                            <p className={`text-[9px] font-black ${textColor} uppercase mb-1 tracking-widest line-clamp-1`}>{p.cat}</p>
                            <h4 className="font-bold text-slate-800 leading-tight mb-2 text-sm line-clamp-2 h-10">{p.name}</h4>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-auto">
                            <span className="text-base font-black tracking-tighter">RD${p.price}</span>
                            <button onClick={() => addToCart(p)} className={`w-8 h-8 ${primaryColor} text-white rounded-lg flex items-center justify-center hover:bg-[#C91A47] transition-all active:scale-90 shadow-md disabled:bg-slate-300`}>
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {filteredProducts.length === 0 && (
                        <div className="col-span-2 text-center py-10 bg-white rounded-3xl border border-slate-50">
                          <p className="text-lg font-black text-slate-800">No encontrado</p>
                          <p className="text-slate-400 text-sm">Prueba buscar otra cosa.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* VISTA PEDIDOS (Órdenes) */}
                {activeTab === 'pedidos' && (
                  <div className="animate-in fade-in duration-500 pt-6">
                    <div className={`${primaryColor} rounded-[2.5rem] p-6 mb-8 text-white relative overflow-hidden shadow-xl border border-red-500`}>
                       <h3 className="text-lg font-black italic mb-1">Ruta Cotuí Activa</h3>
                       <p className="text-xs text-white/80 font-bold mb-6">Nuestros motores están en la calle</p>
                       <div className="relative h-32 bg-black/20 rounded-2xl border border-white/20 overflow-hidden map-bg">
                          <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path d="M 10,50 Q 30,20 50,50 T 90,50" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                          </svg>
                          <div className="absolute top-[45%] left-[5%] w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                          <div className="absolute top-[45%] right-[5%] w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"></div>
                          <div className="absolute text-white animate-motorcycle-route">
                             <SVG.Motorcycle />
                          </div>
                       </div>
                    </div>

                    <h2 className="text-3xl font-black tracking-tighter mb-6">Mis Pedidos</h2>
                    
                    {user.isGuest ? (
                       <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-50">
                        <p className="text-slate-400 text-sm mb-4">Debes iniciar sesión para ver tus compras.</p>
                        <button onClick={handleLogout} className={`${textColor} font-bold hover:underline`}>Iniciar Sesión</button>
                       </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-50">
                        <div className="flex justify-center mb-6"><SVG.Box /></div>
                        <p className="text-xl font-black text-slate-800 mb-2">Sin Compras</p>
                        <p className="text-slate-400 text-sm">Tus recibos aparecerán aquí.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map(order => (
                          <div key={order.id} className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50">
                            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Orden {order.name}</p>
                                <p className="text-sm font-bold text-slate-900">{new Date(order.date).toLocaleDateString()}</p>
                              </div>
                              <div className={`bg-red-50 ${textColor} text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5`}>
                                <span className={`w-1.5 h-1.5 ${primaryColor} rounded-full animate-pulse`}></span> {order.status}
                              </div>
                            </div>
                            <div className="space-y-2 mb-4">
                              {order.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm font-medium text-slate-600">
                                  <span>{item.qty}x {item.name}</span>
                                  <span className="font-bold text-slate-900">RD${(item.price * item.qty).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total</span>
                              <span className="text-lg font-black">RD${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* VISTA PERFIL */}
                {activeTab === 'perfil' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-3xl font-black tracking-tighter">Mi Perfil</h2>
                      {!user.isGuest && !isEditingProfile && (
                        <button onClick={startEditProfile} className={`${textColor} font-bold text-sm flex items-center gap-1 hover:underline`}>
                          <Edit size={16} /> Editar
                        </button>
                      )}
                    </div>
                    
                    {user.isGuest ? (
                       <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 text-center">
                         <div className="text-4xl mb-2">👤</div>
                         <h3 className={`font-black ${textColor} text-lg mb-1`}>Cuenta de Invitado</h3>
                         <p className="text-xs text-red-700 mb-4 font-medium">Regístrate para guardar tu dirección y hacer pedidos más rápido.</p>
                         <button onClick={handleLogout} className={`${primaryColor} text-white font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-[#C91A47]`}>Iniciar Sesión / Registro</button>
                       </div>
                    ) : isEditingProfile ? (
                      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Nombre</label>
                          <input type="text" value={editForm.firstName} onChange={(e) => setEditForm({...editForm, firstName: e.target.value})} className={`w-full bg-slate-50 border-none rounded-2xl py-3 px-5 focus:ring-2 focus:ring-[#E31E52] outline-none font-medium text-sm`}/>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Apellido</label>
                          <input type="text" value={editForm.lastName} onChange={(e) => setEditForm({...editForm, lastName: e.target.value})} className={`w-full bg-slate-50 border-none rounded-2xl py-3 px-5 focus:ring-2 focus:ring-[#E31E52] outline-none font-medium text-sm`}/>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Teléfono</label>
                          <input type="text" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className={`w-full bg-slate-50 border-none rounded-2xl py-3 px-5 focus:ring-2 focus:ring-[#E31E52] outline-none font-medium text-sm`}/>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Dirección</label>
                          <input type="text" value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} className={`w-full bg-slate-50 border-none rounded-2xl py-3 px-5 focus:ring-2 focus:ring-[#E31E52] outline-none font-medium text-sm`}/>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <button onClick={() => setIsEditingProfile(false)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-2xl font-black text-sm hover:bg-slate-200">Cancelar</button>
                          <button onClick={saveProfile} className={`flex-1 ${primaryColor} text-white py-3 rounded-2xl font-black text-sm shadow-lg hover:bg-[#C91A47]`}>Guardar</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex items-center gap-5">
                          <div className={`w-16 h-16 ${primaryColor} text-white rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg`}>
                            {(user.firstName || user.name || "U").charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-xl font-black tracking-tight leading-none mb-1">{user.firstName || user.name} {user.lastName}</h3>
                            <p className="text-sm font-bold text-slate-400">{user.email}</p>
                          </div>
                        </div>

                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-50 p-6 space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="text-slate-400 mt-1"><MapPin size={20}/></div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dirección de Entrega</p>
                              <p className="font-bold text-slate-800 text-sm mt-0.5">{user.address || user.location}</p>
                            </div>
                          </div>
                          <div className="w-full h-[1px] bg-slate-50"></div>
                          <div className="flex items-start gap-4">
                             <div className="text-slate-400 mt-1"><User size={20}/></div>
                             <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono de Contacto</p>
                              <p className="font-bold text-slate-800 text-sm mt-0.5">{user.phone}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <button onClick={handleLogout} className="w-full bg-slate-900 text-white py-4 rounded-[2rem] font-black text-lg hover:bg-[#E31E52] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 mt-8">
                      <LogOut size={20}/> Cerrar Sesión
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </>
      )}

      {/* MENÚ INFERIOR */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 flex justify-around py-3 px-2 shadow-[0_-5px_20px_rgba(0,0,0,0.08)] z-[60]">
        <button onClick={() => { setActiveTab('inicio'); setCurrentView('inicio'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'inicio' && currentView === 'inicio' ? textColor : 'text-gray-400'}`}>
          <Home size={22} fill={activeTab === 'inicio' && currentView === 'inicio' ? "currentColor" : "none"} />
          <span className="text-[10px] font-bold">Inicio</span>
        </button>
        
        <button onClick={() => { setCurrentView('inicio'); setActiveTab('inicio'); window.scrollTo(0, 300); }} className={`flex flex-col items-center gap-1 text-gray-400`}>
          <Store size={22} />
          <span className="text-[10px] font-bold">Categorías</span>
        </button>
        
        <button onClick={() => { setActiveTab('pedidos'); setCurrentView('inicio'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'pedidos' ? textColor : 'text-gray-400'}`}>
          <ClipboardList size={22} fill={activeTab === 'pedidos' ? "currentColor" : "none"} />
          <span className="text-[10px] font-bold">Pedidos</span>
        </button>
        
        <button onClick={() => { setActiveTab('perfil'); setCurrentView('inicio'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'perfil' ? textColor : 'text-gray-400'}`}>
          <User size={22} fill={activeTab === 'perfil' ? "currentColor" : "none"} />
          <span className="text-[10px] font-bold">Mi cuenta</span>
        </button>
      </div>

      {/* MODAL DETALLE DE PRODUCTO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 z-10 hover:bg-red-50 hover:text-[#E31E52] transition-all"><X size={20}/></button>
            <div className="bg-slate-50 p-8 h-64 flex items-center justify-center relative">
               <img src={selectedProduct.img} alt={selectedProduct.name} className={`w-full h-full object-contain mix-blend-multiply ${!selectedProduct.available ? 'grayscale opacity-50' : ''}`} />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[9px] font-black ${textColor} uppercase tracking-widest bg-red-50 px-2.5 py-1 rounded-full`}>Verificado</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{selectedProduct.unit}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 leading-tight mb-2">{selectedProduct.name}</h2>
              <p className="text-slate-500 text-xs mb-6 line-clamp-3 font-medium">{selectedProduct.desc}</p>
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Precio</span>
                  <p className="text-2xl font-black tracking-tighter">RD${selectedProduct.price}</p>
                </div>
                <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className={`${primaryColor} text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-[#C91A47] transition-all active:scale-95 shadow-lg`}>
                  {selectedProduct.available ? 'Añadir' : 'Agotado'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CARRITO */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[110] flex items-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsCartOpen(false)}></div>
          <aside className="relative w-full max-w-md mx-auto bg-[#F7F9FB] h-[85vh] rounded-t-[2.5rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden">
            
            <div className="p-6 bg-white flex items-center justify-between border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-2xl font-black tracking-tighter mb-1">Tu Cesta</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{totalItems} artículos en cola</p>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-xl text-slate-400 hover:text-[#E31E52] transition-all"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length > 0 && (
                <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${primaryColor}`}></div>
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-2 pl-2">
                    <span className="text-slate-600">Oferta del Día</span>
                    <span className={discountPercent >= 10 ? `${textColor} animate-pulse` : 'text-slate-400'}>10% OFF (Llega a RD$500)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2 ml-2">
                    <div className={`h-full ${primaryColor} transition-all duration-500 rounded-full`} style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <p className="text-center text-[10px] font-bold text-slate-500 ml-2">
                    {discountPercent === 10 ? '¡Felicidades! Tienes 10% de descuento aplicado.' : `Agrega RD$${missingForNext.toFixed(2)} más para ganar tu 10% de descuento HOY`}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {cart.map(i => (
                  <div key={i.id} className="flex gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-50">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 p-1">
                      <img src={i.img} alt={i.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <div className="pr-2">
                          <h4 className="font-bold text-slate-800 text-xs leading-tight mb-0.5 line-clamp-1">{i.name}</h4>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">RD${i.price}</p>
                        </div>
                        <button onClick={() => removeFromCart(i.id)} className="text-slate-300 hover:text-[#E31E52] -mt-1"><X size={16}/></button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                         <span className="text-sm font-black text-slate-900 tracking-tighter">RD${(i.price * i.qty).toFixed(2)}</span>
                         <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-100">
                            <button onClick={() => updateQty(i.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-500 hover:text-[#E31E52]"><Minus size={14}/></button>
                            <span className="text-xs font-black w-4 text-center">{i.qty}</span>
                            <button onClick={() => updateQty(i.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-500 hover:text-[#E31E52]"><Plus size={14}/></button>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {cart.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-20 font-black">
                  <div className="scale-[2.5] mb-8"><ShoppingCart size={40}/></div>
                  <p className="text-xl tracking-tighter uppercase">Tu cesta está vacía</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] shrink-0">
              {discountPercent > 0 && cart.length > 0 && (
                <div className="flex justify-between items-center mb-3 border-b border-dashed border-slate-200 pb-2">
                  <span className={`text-[10px] font-black ${textColor} uppercase tracking-widest`}>Descuento ({discountPercent}%)</span>
                  <span className={`text-sm font-black ${textColor}`}>-RD${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                 <div className="flex flex-col">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Final</span>
                   <span className="text-2xl font-black tracking-tighter text-slate-900">RD${finalTotal.toFixed(2)}</span>
                 </div>
                 <button 
                  disabled={cart.length === 0 || isOrdering}
                  onClick={handleCheckoutClick}
                  className={`${primaryColor} text-white px-6 py-3.5 rounded-2xl font-black text-sm hover:bg-[#C91A47] transition-all flex items-center gap-2 shadow-xl active:scale-95 ${(cart.length === 0 || isOrdering) ? 'opacity-50 pointer-events-none' : ''}`}
                 >
                   Pagar <Check size={18} />
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
              <h2 className="text-2xl font-black">Método de Pago</h2>
              <button onClick={() => setShowPayment(false)} className="bg-slate-100 p-2 rounded-xl text-slate-400 hover:text-[#E31E52] transition-colors"><X size={20}/></button>
            </div>
            
            <div className="space-y-4 mb-6">
              <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-[#E31E52] bg-red-50 cursor-pointer transition-all shadow-sm`}>
                <div className={textColor}><DollarSign size={24}/></div>
                <div className="flex-1">
                  <p className="font-black text-sm text-slate-900">Pago contra entrega</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efectivo o Transferencia al recibir</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-4 ${primaryColor} bg-white`}></div>
              </label>

              <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 bg-white opacity-50 cursor-not-allowed">
                <div className="text-slate-400"><CreditCard size={24}/></div>
                <div className="flex-1">
                  <p className="font-black text-sm text-slate-500 line-through">Tarjeta de Crédito</p>
                  <p className={`text-[10px] font-bold ${textColor} uppercase tracking-widest`}>No disponible</p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>
              </label>
            </div>

            <button 
              onClick={processCheckout} 
              disabled={isOrdering} 
              className={`w-full ${primaryColor} text-white px-6 py-4 rounded-2xl font-black text-sm flex justify-center gap-2 hover:bg-[#C91A47] transition-colors shadow-xl active:scale-95`}
            >
              {isOrdering ? 'Procesando...' : 'Confirmar y Pedir'} <Check size={18} />
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce-short { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .animate-bounce-short { animation: bounce-short 1.5s ease-in-out infinite; }
        
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
        .map-bg { background-image: radial-gradient(#ffffff20 2px, transparent 2px); background-size: 15px 15px; }
      `}} />
    </div>
  );
}
