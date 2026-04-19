import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { orderId } = await req.json();
    
    // Aquí usamos la variable que pusiste en Vercel
    // Si no existe, usa la que tenemos por defecto como respaldo
    const shipdayApiKey = process.env.SHIPDAY_API_KEY || "FzKmvwy7mB.DgaRNOaMv19P28urcMEb.";

    const res = await fetch(`https://api.shipday.com/orders/${orderId}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Basic ${shipdayApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      return NextResponse.json({ status: 'Preparando pedido' });
    }

    const data = await res.json();

    const statusMap = {
      'ACTIVE': 'Preparando pedido',
      'NOT_ASSIGNED': 'Buscando repartidor',
      'ASSIGNED': 'Repartidor asignado',
      'STARTED': 'Repartidor en camino al súper',
      'PICKED_UP': 'Pedido en camino 🛵',
      'READY_TO_DELIVER': 'Llegando a tu puerta 📍',
      'ALREADY_DELIVERED': 'Entregado ✅',
      'CANCELED': 'Cancelado 🚫',
      'DELETED': 'Eliminado'
    };

    const estadoTraducido = statusMap[data.orderStatus] || 'Procesando...';

    return NextResponse.json({ status: estadoTraducido });

  } catch (error) {
    console.error("Error en status:", error);
    return NextResponse.json({ status: 'Actualizando estado...' });
  }
}
