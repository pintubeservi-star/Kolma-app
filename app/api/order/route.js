import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer, total, metodoPago } = body;

    // Generar ID único para Kolma
    const orderId = `KRD-${Math.floor(Math.random() * 900000) + 100000}`;

    // Limpiar productos para Shipday
    const shipdayItems = items.map(item => ({
      name: item.title.substring(0, 50),
      unitPrice: parseFloat(item.price),
      quantity: parseInt(item.quantity)
    }));

    // LLAMADA A SHIPDAY
    const shipdayRes = await fetch("https://api.shipday.com/orders", {
      method: "POST",
      headers: {
        "Authorization": "Basic FzKmvwy7mB.DgaRNOaMv19P28urcMEb", // Tu Key
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        orderNumber: orderId,
        customerName: customer.nombre,
        customerAddress: customer.direccion, 
        customerPhoneNumber: customer.telefono,
        customerEmail: customer.email || "cliente@kolmard.com",
        restaurantName: "Kolma RD",
        restaurantAddress: "Cotuí, RD", 
        totalOrderCost: parseFloat(total),
        deliveryInstruction: metodoPago === 'efectivo' ? 'COBRAR EFECTIVO' : 'YA PAGADO',
        orderItem: shipdayItems
      })
    });

    const shipdayData = await shipdayRes.json();

    if (shipdayRes.ok) {
      // ENVIAR TAMBIÉN A FORMSPREE (Opcional para respaldo)
      await fetch("https://formspree.io/f/xjgpldag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ID: orderId, Cliente: customer.nombre, Total: total })
      });

      return NextResponse.json({ 
        success: true, 
        orderId: orderId,
        trackingUrl: shipdayData.trackingLink // ESTE ES EL LINK DEL MAPA
      });
    } else {
      return NextResponse.json({ success: false, error: "Error en Shipday" }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
