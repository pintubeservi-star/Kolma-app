import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer, total, metodoPago } = body;

    // 1. ID Único Maestro
    const orderId = `KRD-${Math.floor(Math.random() * 900000) + 100000}`;
    const listaProductosTexto = items.map(i => `${i.quantity}x ${i.title}`).join(', ');

    // 2. Formatear productos para Shipday
    const shipdayItems = items.map(item => ({
      name: item.title.substring(0, 50),
      unitPrice: parseFloat(item.price),
      quantity: parseInt(item.quantity)
    }));

    // 3. Obtener fecha y hora actual (ISO) para evitar el error de los "10 días"
    const ahora = new Date().toISOString();
    const fechaISO = ahora.split('T')[0];
    const horaISO = ahora.split('T')[1].split('.')[0];

    // 4. Envío a Shipday
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
        deliveryInstruction: metodoPago === 'efectivo' ? 'COBRAR EFECTIVO EN COTUÍ' : 'PAGADO',
        orderItem: shipdayItems,
        expectedDeliveryDate: fechaISO,
        expectedDeliveryTime: horaISO,
        orderStatus: 'OPEN' 
      })
    });

    // 5. Envío a Formspree (Correo)
    const formspreePromise = fetch("https://formspree.io/f/xjgpldag", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        Pedido: orderId, Cliente: customer.nombre, WhatsApp: customer.telefono,
        Direccion: customer.direccion, Productos: listaProductosTexto, Total: total
      })
    });

    await Promise.all([formspreePromise, shipdayPromise]);
    return NextResponse.json({ success: true, orderId: orderId });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
