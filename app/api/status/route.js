import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { orderId } = await req.json();
    
    // Tu API Key configurada directamente
    const shipdayApiKey = "FzKmvwy7mB.DgaRNOaMv19P28urcMEb.";

    const res = await fetch(`https://api.shipday.com/orders/${orderId}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Basic ${shipdayApiKey}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 0 } // Evita que Vercel guarde una copia vieja del estado
    });

    if (!res.ok) {
      return NextResponse.json({ status: 'Preparando Empaque' });
    }

    const data = await res.json();

    // Mapeo exacto para que el frontend lo reconozca y se detenga al terminar
    const statusMap = {
      'ACTIVE': 'Preparando Empaque',
      'NOT_ASSIGNED': 'Buscando Repartidor',
      'ASSIGNED': 'Repartidor Asignado',
      'STARTED': 'Repartidor en camino al súper',
      'PICKED_UP': 'Pedido en camino 🛵',
      'READY_TO_DELIVER': 'Llegando a tu puerta 📍',
      'ALREADY_DELIVERED': 'Entregado ✅', // El icono ✅ detiene las consultas automáticas
      'CANCELED': 'Cancelado 🚫',         // El icono 🚫 detiene las consultas automáticas
      'FAILED_DELIVERY': 'Fallo en Entrega ❌'
    };

    const estadoTraducido = statusMap[data.orderStatus] || 'Actualizando...';

    return NextResponse.json({ status: estadoTraducido });

  } catch (error) {
    return NextResponse.json({ status: 'Preparando Empaque' });
  }
}
