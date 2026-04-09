import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer, total, metodoPago } = body;

    const orderId = `KRD-${Math.floor(Math.random() * 900000) + 100000}`;
    const listaProductosTexto = items.map(i => `${i.quantity}x ${i.title}`).join(', ');

    // --- CÁLCULO DE HORA DOMINICANA (GMT-4) ---
    const ahora = new Date();
    // Ajustamos manualmente a la zona horaria de RD por si el servidor está en otro país
    const offsetRD = -4; 
    const horaRD = new Date(ahora.getTime() + (offsetRD * 3600000));
    const fechaISO = ahora.toISOString().split('T')[0]; // YYYY-MM-DD
    const horaISO = ahora.toISOString().split('T')[1].split('.')[0]; // HH:MM:SS

    const shipdayItems = items.map(item => ({
      name: item.title.substring(0, 50),
      unitPrice: parseFloat(item.price),
      quantity: parseInt(item.quantity)
    }));

    const shipdayPromise = fetch("https://api.shipday.com/orders", {
      method: "POST",
      headers: {
        "Authorization": "Basic FzKmvwy7mB.DgaRNOaMv19P28urcMEb",
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
        orderItem: shipdayItems,
        // FORZAMOS LA HORA ACTUAL PARA QUE NO SE VAYA AL FUTURO
        expectedDeliveryDate: fechaISO,
        expectedDeliveryTime: horaISO,
        orderStatus: 'OPEN' 
      })
    });

    // Disparamos Shipday y el correo
    const formspreePromise = fetch("https://formspree.io/f/xjgpldag", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ Pedido_ID: orderId, Cliente: customer.nombre, Productos: listaProductosTexto, Total: total })
    });

    const [resForm, resShip] = await Promise.all([formspreePromise, shipdayPromise]);
    const shipDayData = await resShip.json();

    if (resShip.ok) {
      return NextResponse.json({ success: true, orderId: orderId });
    } else {
      return NextResponse.json({ success: false, error: "Error en Shipday" }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
  
