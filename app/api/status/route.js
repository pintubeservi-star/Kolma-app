import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); 

    if (!id) {
      return NextResponse.json({ success: false, error: 'Falta el ID del pedido' }, { status: 400 });
    }

    // 1. Buscamos primero en los pedidos "Activos" de Shipday
    const activeRes = await fetch("https://api.shipday.com/orders", {
      method: "GET",
      headers: {
        "Authorization": "Basic FzKmvwy7mB.DgaRNOaMv19P28urcMEb", 
        "Content-Type": "application/json"
      },
      cache: 'no-store'
    });

    const activeOrders = await activeRes.json();
    const miPedido = activeOrders.find(order => order.orderNumber === id);

    if (miPedido) {
      const estadoActual = typeof miPedido.orderStatus === 'string' 
                            ? miPedido.orderStatus 
                            : miPedido.orderStatus.orderState;

      // Extraer datos del repartidor y ETA desde Shipday
      const driverName = miPedido.carrier?.name || miPedido.carrierName || null;
      const driverPhone = miPedido.carrier?.phoneNumber || miPedido.carrierPhoneNumber || null;
      const eta = miPedido.etaTime || null;
      
      // Extraer coordenadas GPS en tiempo real
      let driverLocation = null;
      const loc = miPedido.carrierLocation || miPedido.carrier?.location || null;
      if (loc) {
        driverLocation = {
          latitude: loc.latitude || loc.lat,
          longitude: loc.longitude || loc.lng
        };
      }

      return NextResponse.json({ 
        success: true, 
        shipdayStatus: estadoActual,
        driverName,
        driverPhone,
        driverLocation,
        eta
      });
    } 
    
    // 2. Si no está activo, buscar en completados
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

    return NextResponse.json({ success: false, error: 'Pedido no encontrado en Shipday' });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
