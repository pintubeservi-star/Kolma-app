import { NextResponse } from 'next/server';

// CRÍTICO: Evita que Vercel "congele" la respuesta. Siempre trae los datos frescos de Kolma.
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Esto lee el KRD-XXXXXX que le manda tu page.js

    if (!id) {
      return NextResponse.json({ success: false, error: 'Falta el ID del pedido' }, { status: 400 });
    }

    // 1. Buscamos primero en los pedidos "Activos" de Shipday
    const activeRes = await fetch("https://api.shipday.com/orders", {
      method: "GET",
      headers: {
        "Authorization": "Basic FzKmvwy7mB.DgaRNOaMv19P28urcMEb", // Tu llave
        "Content-Type": "application/json"
      },
      cache: 'no-store' // Refuerzo para apagar la caché de Vercel
    });

    const activeOrders = await activeRes.json();
    
    // Buscamos nuestro pedido en la lista por su Número de Orden (KRD-...)
    const miPedido = activeOrders.find(order => order.orderNumber === id);

    if (miPedido) {
      // Dependiendo de cómo devuelva Shipday el estatus, lo extraemos
      const estadoActual = typeof miPedido.orderStatus === 'string' 
                            ? miPedido.orderStatus 
                            : miPedido.orderStatus.orderState;

      return NextResponse.json({ success: true, shipdayStatus: estadoActual });
    } 
    
    // 2. Si no está en los activos, es porque ya se entregó y se movió al historial de Shipday
    const completedRes = await fetch("https://api.shipday.com/orders/completed", {
      method: "GET",
      headers: {
        "Authorization": "Basic FzKmvwy7mB.DgaRNOaMv19P28urcMEb",
        "Content-Type": "application/json"
      },
      cache: 'no-store'
    });

    const completedOrders = await completedRes.json();
    const miPedidoCompletado = completedOrders.find(order => order.orderNumber === id);

    if (miPedidoCompletado) {
      return NextResponse.json({ success: true, shipdayStatus: 'SUCCESSFUL' });
    }

    // Si no lo encuentra en ningún lado
    return NextResponse.json({ success: false, error: 'Pedido no encontrado en Shipday' });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
