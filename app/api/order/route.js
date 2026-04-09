import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer, total, metodoPago } = body;

    // 1. Generamos el ID único para que todos hablen el mismo idioma
    const orderId = `KRD-${Math.floor(Math.random() * 900000) + 100000}`;

    // 2. Preparamos la lista de productos para el correo (Formspree)
    const listaProductosTexto = items.map(i => `${i.quantity}x ${i.title}`).join(', ');

    // 3. PREPARAMOS LOS PRODUCTOS PARA SHIPDAY (Paso crítico)
    // Shipday exige que 'unitPrice' sea número y 'quantity' sea número entero.
    const shipdayItems = items.map(item => ({
      name: item.title.substring(0, 50), // Limitamos el nombre por si es muy largo
      unitPrice: parseFloat(item.price),
      quantity: parseInt(item.quantity)
    }));

    // 4. TAREA A: Enviar a Formspree (Tu correo)
    const formspreePromise = fetch("https://formspree.io/f/xjgpldag", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        Pedido_ID: orderId,
        Cliente: customer.nombre,
        WhatsApp: customer.telefono,
        Direccion: customer.direccion,
        Productos: listaProductosTexto,
        Total: total,
        Metodo: metodoPago === 'efectivo' ? 'Efectivo (Contra entrega)' : 'Tarjeta'
      })
    });

    // 5. TAREA B: Enviar a Shipday (Con los datos limpios)
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
        restaurantAddress: "Cotuí, República Dominicana", 
        totalOrderCost: parseFloat(total),
        deliveryInstruction: metodoPago === 'efectivo' ? 'COBRAR EFECTIVO' : 'YA PAGADO',
        orderItem: shipdayItems
      })
    });

    // Ejecutamos ambos al mismo tiempo
    const [resForm, resShip] = await Promise.all([formspreePromise, shipdayPromise]);

    // Log para que tú veas en la consola de Vercel si Shipday dio error
    const shipDayData = await resShip.json();
    console.log("Respuesta de Shipday:", shipDayData);

    if (resShip.ok) {
      return NextResponse.json({ success: true, orderId: orderId });
    } else {
      // Si Shipday falla, devolvemos el error para saber qué pasó
      return NextResponse.json({ success: false, error: "Shipday rechazó el pedido" }, { status: 400 });
    }

  } catch (error) {
    console.error("Error crítico:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
