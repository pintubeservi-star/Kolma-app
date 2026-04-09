import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer, total, metodoPago } = body;

    const orderId = `KRD-${Math.floor(Math.random() * 900000) + 100000}`;
    const listaProductosTexto = items.map(i => `${i.quantity}x ${i.title}`).join(', ');

    const shipdayItems = items.map(item => ({
      name: item.title.substring(0, 50),
      unitPrice: parseFloat(item.price),
      quantity: parseInt(item.quantity)
    }));

    const formspreePromise = fetch("https://formspree.io/f/xjgpldag", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        Pedido_ID: orderId, Cliente: customer.nombre, WhatsApp: customer.telefono,
        Direccion: customer.direccion, Productos: listaProductosTexto, Total: total,
        Metodo: metodoPago === 'efectivo' ? 'Efectivo' : 'Tarjeta'
      })
    });

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
        // ESTO ES LO QUE IMPORTA:
        orderStatus: 'OPEN' 
      })
    });

    const [resForm, resShip] = await Promise.all([formspreePromise, shipdayPromise]);
    const shipDayData = await resShip.json();

    if (resShip.ok) {
      return NextResponse.json({ success: true, orderId: orderId });
    } else {
      return NextResponse.json({ success: false, error: "Shipday rechazo el pedido" }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
