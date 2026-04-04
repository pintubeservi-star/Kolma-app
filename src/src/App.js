import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import {
Home, Search, ShoppingCart, User, Menu, X,
ChevronRight, Minus, Plus, Trash2, ArrowLeft,
CreditCard, Smartphone, CheckCircle, Bell, MessageCircle,
AlertCircle
} from 'lucide-react';

// --- CONFIGURACIÓN DE SHOPIFY ---
const SHOPIFY_DOMAIN = 'q0q09e-cp.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = 'a171ee1eaf68d9b7ca5234b4c45a9b0c';
const API_VERSION = '2024-01';
const ENDPOINT = https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json;

// --- CONFIGURACIÓN DE TEMA ---
const THEME = {
primary: '#E60023',
primaryHover: '#cc001f',
white: '#FFFFFF',
text: '#111827',
textLight: '#6B7280',
bg: '#F9FAFB'
};

// --- UTILIDADES ---
const formatPrice = (amount) => {
return new Intl.NumberFormat('es-DO', {
style: 'currency',
currency: 'DOP',
minimumFractionDigits: 2
}).format(amount).replace('DOP', 'RD$');
};

// --- CLIENTE API SHOPIFY (GRAPHQL) ---
const shopifyFetch = async (query, variables = {}) => {
try {
const response = await fetch(ENDPOINT, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
},
body: JSON.stringify({ query, variables }),
});
const result = await response.json();
if (result.errors) {
console.error('Shopify API Errors:', result.errors);
throw new Error('Error en la consulta a Shopify');
}
return result.data;
} catch (error) {
console.error('Fetch Error:', error);
return null;
}
};

const ShopifyAPI = {
getProducts: async (searchQuery = '') => {
const query =   query getProducts($query: String) {   products(first: 20, query: $query) {   edges {   node {   id   title   description   availableForSale   images(first: 1) {   edges { node { url } }   }   variants(first: 1) {   edges {   node {   id   price { amount }   }   }   }   collections(first: 1) {   edges { node { title } }   }   }   }   }   }  ;
const variables = searchQuery ? { query: title:*${searchQuery}* } : {};
const data = await shopifyFetch(query, variables);
if (!data || !data.products) return [];

return data.products.edges.map(({ node }) => ({  
  id: node.id,  
  variantId: node.variants.edges[0]?.node.id,  
  title: node.title,  
  description: node.description,  
  price: parseFloat(node.variants.edges[0]?.node.price.amount || 0),  
  image: node.images.edges[0]?.node.url || 'https://via.placeholder.com/400?text=Sin+Imagen',  
  category: node.collections.edges[0]?.node.title || 'General',  
  available: node.availableForSale  
}));

},

getCollections: async () => {
const query =   query getCollections {   collections(first: 10) {   edges {   node { id, title }   }   }   }  ;
const data = await shopifyFetch(query);
if (!data || !data.collections) return [];
return [{ id: 'all', title: 'Todos' }, ...data.collections.edges.map(({ node }) => node)];
},

createCheckout: async (cartItems) => {
const query =   mutation checkoutCreate($input: CheckoutCreateInput!) {   checkoutCreate(input: $input) {   checkout { id, webUrl }   checkoutUserErrors { message }   }   }  ;
const lineItems = cartItems.map(item => ({
variantId: item.variantId,
quantity: item.quantity
}));

const data = await shopifyFetch(query, { input: { lineItems } });  
return data?.checkoutCreate;

}
};

// --- CONTEXTOS ---
const AppContext = createContext();
const CartContext = createContext();

// --- PWA HOOK ---
const usePWA = () => {
useEffect(() => {
const manifest = {
name: "KOLMA Supermercado",
short_name: "KOLMA",
description: "Tu supermercado digital en República Dominicana",
start_url: "/",
display: "standalone",
background_color: THEME.white,
theme_color: THEME.primary,
icons: [{
src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='192' height='192' fill='%23E60023'><rect width='192' height='192' fill='%23fff'/><text x='50%' y='50%' font-size='48' text-anchor='middle' dy='.3em' fill='%23E60023' font-family='sans-serif' font-weight='bold'>K</text></svg>",
sizes: "192x192",
type: "image/svg+xml"
}]
};
const blob = new Blob([JSON.stringify(manifest)], {type: 'application/json'});
let link = document.querySelector('link[rel="manifest"]');
if (!link) {
link = document.createElement('link');
link.rel = 'manifest';
document.head.appendChild(link);
}
link.href = URL.createObjectURL(blob);
}, []);
};

// --- COMPONENTES UI ---
const Header = () => {
const { navigate, currentView } = useContext(AppContext);
const { cart } = useContext(CartContext);
const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

return (
<header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm safe-top">
<div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
{currentView !== 'home' ? (
<button onClick={() => navigate('home')} className="p-2 -ml-2 text-gray-800">
<ArrowLeft size={24} />
</button>
) : (
<div className="flex items-center space-x-2">
<div className="w-8 h-8 rounded-full bg-[#E60023] flex items-center justify-center text-white font-bold text-xl">K</div>
<h1 className="font-bold text-xl tracking-tight text-[#E60023]">KOLMA</h1>
</div>
)}
<div className="flex items-center space-x-4">
<button onClick={() => navigate('search')} className="text-gray-600 hover:text-[#E60023] transition-colors">
<Search size={24} />
</button>
<button onClick={() => navigate('cart')} className="relative text-gray-600 hover:text-[#E60023] transition-colors">
<ShoppingCart size={24} />
{cartCount > 0 && (
<span className="absolute -top-1 -right-1 bg-[#E60023] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
{cartCount}
</span>
)}
</button>
</div>
</div>
</header>
);
};

const BottomNav = () => {
const { currentView, navigate } = useContext(AppContext);
const navItems = [
{ id: 'home', icon: Home, label: 'Inicio' },
{ id: 'search', icon: Search, label: 'Buscar' },
{ id: 'cart', icon: ShoppingCart, label: 'Carrito' },
{ id: 'profile', icon: User, label: 'Perfil' },
];

return (
<nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 pb-safe z-50 md:hidden">
<div className="max-w-md mx-auto flex justify-between px-6 py-3">
{navItems.map((item) => (
<button
key={item.id}
onClick={() => navigate(item.id)}
className={flex flex-col items-center space-y-1 ${currentView === item.id ? 'text-[#E60023]' : 'text-gray-400'}}
>
<item.icon size={24} strokeWidth={currentView === item.id ? 2.5 : 2} />
<span className="text-[10px] font-medium">{item.label}</span>
</button>
))}
</div>
</nav>
);
};

const ProductCard = ({ product }) => {
const { navigate } = useContext(AppContext);
const { addToCart } = useContext(CartContext);

return (
<div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col active:scale-[0.98] transition-transform">
<div
className="relative aspect-square cursor-pointer bg-white flex items-center justify-center p-2"
onClick={() => navigate('product', { product })}
>
<img src={product.image} alt={product.title} className="w-full h-full object-contain rounded-xl" loading="lazy" />
{!product.available && (
<div className="absolute inset-0 bg-white/70 flex items-center justify-center">
<span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">Agotado</span>
</div>
)}
</div>
<div className="p-3 flex flex-col flex-grow bg-gray-50/50">
<p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">{product.category}</p>
<h3 className="font-semibold text-sm leading-tight text-gray-800 line-clamp-2 flex-grow cursor-pointer" onClick={() => navigate('product', { product })}>
{product.title}
</h3>
<div className="mt-3 flex items-center justify-between">
<span className="font-bold text-base text-[#E60023]">{formatPrice(product.price)}</span>
<button
disabled={!product.available}
onClick={(e) => { e.stopPropagation(); addToCart(product); }}
className={p-2 rounded-full transition-colors ${product.available ? 'bg-white shadow-sm border border-gray-200 text-[#E60023] hover:bg-[#E60023] hover:text-white' : 'bg-gray-100 text-gray-300'}}
>
<Plus size={20} />
</button>
</div>
</div>
</div>
);
};

// --- VISTAS ---
const HomeView = () => {
const { navigate } = useContext(AppContext);
const [products, setProducts] = useState([]);
const [collections, setCollections] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const loadData = async () => {
const [prods, colls] = await Promise.all([
ShopifyAPI.getProducts(),
ShopifyAPI.getCollections()
]);
setProducts(prods);
setCollections(colls.filter(c => c.title !== 'Todos'));
setLoading(false);
};
loadData();
}, []);

return (
<div className="pb-24 pt-4 px-4 space-y-6 animate-fade-in">
{/* Banner */}
<div className="bg-gradient-to-r from-[#E60023] to-red-500 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
<div className="relative z-10 w-2/3">
<h2 className="text-2xl font-bold mb-2">Supermercado en tus manos.</h2>
<p className="text-sm opacity-90 mb-4">Descubre nuestros productos frescos y ofertas diarias.</p>
<button className="bg-white text-[#E60023] px-4 py-2 rounded-full font-bold text-sm shadow-sm" onClick={() => navigate('search')}>
Comprar ahora
</button>
</div>
<div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12">
<ShoppingCart size={180} />
</div>
</div>

{/* Categorías */}  
  <section>  
    <div className="flex justify-between items-center mb-3">  
      <h3 className="font-bold text-lg">Categorías</h3>  
      <button onClick={() => navigate('search')} className="text-[#E60023] text-sm font-medium">Ver todas</button>  
    </div>  
    <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">  
      {loading ? (  
         [1,2,3,4].map(i => <div key={i} className="w-20 h-24 bg-gray-200 animate-pulse rounded-2xl flex-shrink-0"></div>)  
      ) : collections.map((cat, idx) => (  
        <button   
          key={cat.id}  
          onClick={() => navigate('search', { category: cat.title })}  
          className="flex flex-col items-center flex-shrink-0 w-20 space-y-2"  
        >  
          <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-[#E60023] font-bold text-xl uppercase">  
            {cat.title.substring(0, 2)}  
          </div>  
          <span className="text-[11px] font-medium text-gray-700 truncate w-full text-center">{cat.title}</span>  
        </button>  
      ))}  
    </div>  
  </section>  

  {/* Productos */}  
  <section>  
    <h3 className="font-bold text-lg mb-3">Nuestros Productos</h3>  
    {loading ? (  
      <div className="grid grid-cols-2 gap-4">  
        {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>)}  
      </div>  
    ) : products.length > 0 ? (  
      <div className="grid grid-cols-2 gap-4">  
        {products.map(product => (  
          <ProductCard key={product.id} product={product} />  
        ))}  
      </div>  
    ) : (  
       <div className="text-center p-8 bg-white rounded-2xl border border-gray-100">  
         <AlertCircle className="mx-auto text-gray-400 mb-2" size={32} />  
         <p className="text-gray-500">No se encontraron productos en la tienda.</p>  
       </div>  
    )}  
  </section>  
</div>

);
};

const SearchView = () => {
const { routeParams } = useContext(AppContext);
const [query, setQuery] = useState('');
const [category, setCategory] = useState(routeParams?.category || 'Todos');
const [products, setProducts] = useState([]);
const [collections, setCollections] = useState([]);
const [loading, setLoading] = useState(true);

// Cargar colecciones una vez
useEffect(() => {
ShopifyAPI.getCollections().then(setCollections);
}, []);

// Buscar productos
useEffect(() => {
const fetchSearch = async () => {
setLoading(true);
const data = await ShopifyAPI.getProducts(query);
let filtered = data;
if (category && category !== 'Todos') {
filtered = data.filter(p => p.category === category);
}
setProducts(filtered);
setLoading(false);
};

// Pequeño debounce manual  
const timeoutId = setTimeout(() => {  
  fetchSearch();  
}, 400);  
return () => clearTimeout(timeoutId);

}, [query, category]);

return (
<div className="pb-24 pt-4 px-4 flex flex-col h-[calc(100vh-64px)] animate-fade-in">
<div className="relative mb-4 flex-shrink-0">
<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
<input
type="text"
placeholder="Buscar productos..."
className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#E60023] transition-all shadow-sm"
value={query}
onChange={(e) => setQuery(e.target.value)}
/>
</div>

<div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide mb-4 flex-shrink-0 -mx-4 px-4">  
    {collections.map(cat => (  
      <button  
        key={cat.id}  
        onClick={() => setCategory(cat.title)}  
        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${category === cat.title ? 'bg-[#E60023] text-white' : 'bg-white border border-gray-200 text-gray-700'}`}  
      >  
        {cat.title}  
      </button>  
    ))}  
  </div>  

  <div className="flex-grow overflow-y-auto hide-scrollbar -mx-4 px-4">  
    {loading ? (  
       <div className="grid grid-cols-2 gap-4">  
       {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>)}  
     </div>  
    ) : products.length > 0 ? (  
      <div className="grid grid-cols-2 gap-4 pb-4">  
        {products.map(product => (  
          <ProductCard key={product.id} product={product} />  
        ))}  
      </div>  
    ) : (  
      <div className="flex flex-col items-center justify-center h-48 text-gray-400">  
        <Search size={48} className="mb-4 opacity-30" />  
        <p>No se encontraron resultados.</p>  
      </div>  
    )}  
  </div>  
</div>

);
};

const ProductDetailView = () => {
const { routeParams, navigate } = useContext(AppContext);
const { addToCart } = useContext(CartContext);
const product = routeParams?.product;
const [qty, setQty] = useState(1);

if (!product) return <div className="p-8 text-center" onClick={()=>navigate('home')}>Volver</div>;

return (
<div className="pb-24 animate-slide-up bg-white min-h-screen">
<div className="w-full aspect-square bg-white relative p-6 border-b border-gray-100">
<img src={product.image} alt={product.title} className="w-full h-full object-contain drop-shadow-md" />
</div>

<div className="p-5 rounded-t-3xl -mt-6 relative bg-white">  
    <div className="flex justify-between items-start mb-2">  
      <div className="pr-4">  
        <p className="text-[#E60023] font-bold text-[10px] uppercase tracking-wider mb-1">{product.category}</p>  
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">{product.title}</h2>  
      </div>  
    </div>  
      
    <div className="mt-2 mb-4">  
       <span className="text-3xl font-black text-[#E60023]">{formatPrice(product.price)}</span>  
    </div>  

    {product.description && (  
      <div className="bg-gray-50 p-4 rounded-xl mt-4 border border-gray-100">  
        <h4 className="font-semibold text-sm mb-1">Descripción</h4>  
        <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>  
      </div>  
    )}  
      
    <div className="mt-8">  
      <p className="font-semibold mb-3 text-gray-800">Cantidad</p>  
      <div className="flex items-center space-x-4">  
        <div className="flex items-center border border-gray-200 rounded-full p-1 bg-white shadow-sm">  
          <button   
            onClick={() => setQty(Math.max(1, qty - 1))}  
            className="w-12 h-12 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"  
          >  
            <Minus size={20} />  
          </button>  
          <span className="w-10 text-center font-bold text-lg">{qty}</span>  
          <button   
            onClick={() => setQty(qty + 1)}  
            className="w-12 h-12 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"  
          >  
            <Plus size={20} />  
          </button>  
        </div>  
          
        <button   
          disabled={!product.available}  
          onClick={() => {  
            addToCart(product, qty);  
            navigate('cart');  
          }}  
          className={`flex-grow py-4 rounded-full font-bold text-lg shadow-lg transition-all flex justify-center items-center ${product.available ? 'bg-[#E60023] text-white hover:bg-[#cc001f] active:scale-95' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}  
        >  
          {product.available ? `Agregar - ${formatPrice(product.price * qty)}` : 'Agotado'}  
        </button>  
      </div>  
    </div>  
  </div>  
</div>

);
};

const CartView = () => {
const { cart, updateQuantity, removeFromCart, getCartTotal } = useContext(CartContext);
const { navigate } = useContext(AppContext);
const total = getCartTotal();
const [loadingCheckout, setLoadingCheckout] = useState(false);
const [error, setError] = useState(null);

const handleCheckout = async () => {
setLoadingCheckout(true);
setError(null);
try {
const checkoutRes = await ShopifyAPI.createCheckout(cart);
if (checkoutRes?.checkoutUserErrors?.length > 0) {
setError(checkoutRes.checkoutUserErrors[0].message);
setLoadingCheckout(false);
return;
}

if (checkoutRes?.checkout?.webUrl) {  
    // Redirigir al Checkout seguro de Shopify  
    // Usamos window.open para evitar bloqueos de iframe en la vista previa  
    window.open(checkoutRes.checkout.webUrl, '_blank') || (window.location.href = checkoutRes.checkout.webUrl);  
  } else {  
    setError("Error al crear la orden. Intente de nuevo.");  
  }  
} catch (err) {  
  setError("Error de conexión con la tienda.");  
}  
setLoadingCheckout(false);

};

if (cart.length === 0) {
return (
<div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] px-4 animate-fade-in text-center">
<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400 shadow-inner">
<ShoppingCart size={48} />
</div>
<h2 className="text-xl font-bold mb-2">Tu carrito está vacío</h2>
<p className="text-gray-500 mb-8">Parece que aún no has agregado productos.</p>
<button
onClick={() => navigate('home')}
className="bg-[#E60023] text-white px-8 py-3 rounded-full font-bold shadow-md active:scale-95 transition-transform"
>
Empezar a comprar
</button>
</div>
);
}

return (
<div className="pb-32 pt-4 px-4 h-[calc(100vh-64px)] flex flex-col animate-fade-in relative">
<h2 className="text-2xl font-bold mb-4 flex-shrink-0">Mi Carrito</h2>

{error && (  
    <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium border border-red-200">  
      {error}  
    </div>  
  )}  

  <div className="flex-grow overflow-y-auto space-y-4 pb-4 hide-scrollbar">  
    {cart.map(item => (  
      <div key={item.id} className="flex bg-white p-3 rounded-2xl border border-gray-100 shadow-sm relative">  
        <div className="w-20 h-20 bg-gray-50 rounded-xl flex-shrink-0 p-1 border border-gray-100">  
          <img src={item.image} alt={item.title} className="w-full h-full object-contain" />  
        </div>  
        <div className="ml-4 flex-grow flex flex-col justify-between">  
          <div className="pr-6">  
            <h3 className="font-semibold text-sm leading-tight text-gray-800 line-clamp-2">{item.title}</h3>  
            <p className="text-[#E60023] font-bold mt-1">{formatPrice(item.price)}</p>  
          </div>  
          <div className="flex items-center space-x-3 mt-2">  
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 bg-gray-100 rounded-full text-gray-600 active:bg-gray-200"><Minus size={14} /></button>  
            <span
