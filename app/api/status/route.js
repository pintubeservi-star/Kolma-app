import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { orderId } = await req.json();
    const shipdayApiKey = process.env.SHIPDAY_API_KEY || "FzKmvwy7mB.DgaRNOaMv19P28urcMEb.";

    const res = await fetch(`https://api.shipday.com/orders/${orderId}`, {
      method: 'GET',
      headers: { 'Authorization': `Basic ${shipdayApiKey}` }
    });

    if (!res.ok) return NextResponse.json({ status: 'Preparando Empaque' });

    const data = await res.json();

    // Diccionario de estados Shipday a Español
    const statusMap = {
      'ACTIVE': 'Preparando Empaque',
      'NOT_ASSIGNED': 'Buscando Repartidor',
      'NOT_ACCEPTED': 'Esperando al Repartidor',
      'ASSIGNED': 'Repartidor Asignado',
      'STARTED': 'Repartidor en camino al súper',
      'PICKED_UP': 'Pedido en camino 🛵',
      'READY_TO_DELIVER': 'Llegando a tu puerta 📍',
      'ALREADY_DELIVERED': 'Entregado ✅',
      'FAILED_DELIVERY': 'Fallo en Entrega ❌',
      'INCOMPLETE': 'Cancelado 🚫',
      'CANCELED': 'Cancelado 🚫'
    };

    const estadoTraducido = statusMap[data.orderStatus] || 'Actualizando...';

    return NextResponse.json({ status: estadoTraducido });

  } catch (error) {
    return NextResponse.json({ status: 'Preparando Empaque' });
  }
}
