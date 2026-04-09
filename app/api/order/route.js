import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    // Extraemos todos los datos que nos mandó la App
    const { items, customer, total, metodoPago } = body;

    // 1. CREAMOS UN NÚMERO DE PEDIDO MAESTRO
    // Este número será el mismo para el correo, para Shipday y para la App del cliente
    const orderId = `KRD-${Math.floor(Math.random() * 900000) + 100000}`;

    // Preparamos el resumen de texto para tu correo
    const listaProductos = items.map(i => `${i.quantity}x ${i.title}`).join(', ');

    // 2. TAREA A: ENVIAR EL CORREO A FORMSPREE
    const formspreePromise = fetch("https://formspree.io/f/xjgpldag", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Accept": "application/json" 
      },
      body: JSON.stringify({
        Pedido_ID: orderId,
        Cliente: customer.nombre,
        WhatsApp: customer.telefono,
        Direccion_Entrega: customer.direccion,
        Productos: listaProductos,
        Total: total || "0.00",
        Metodo_Pago: metodoPago === 'efectivo' ? 'Pago contra entrega' : 'Tarjeta',
        Nota: "PEDIDO DESDE APP"
      })
    });

    // 3. TAREA B: ENVIAR LA ORDEN DIRECTA A SHIPDAY
    // Convertimos la canasta al formato que el repartidor lee en su celular
    const shipdayItems = items.map(item => ({
      name: item.title,
      unitPrice: parseFloat(item.price),
      quantity: item.quantity
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
        customerEmail: customer.email || "contacto@kolmard.com",
        restaurantName: "Kolma RD",
        restaurantAddress: "Cotuí, República Dominicana", // Punto de origen
        expectedDeliveryDate: "TODAY",
        expectedDeliveryTime: "ASAP",
        totalOrderCost: parseFloat(total),
        deliveryFee: 0,
        orderItem: shipdayItems,
        paymentMethod: metodoPago === 'efectivo' ? 'cash' : 'credit_card'
      })
    });

    // 4. EJECUTAMOS AMBAS TAREAS A LA VEZ (Para que la app no se quede cargando)
    await Promise.all([formspreePromise, shipdayPromise]);

    // 5. RESPONDEMOS A LA APP CONFIRMANDO EL ÉXITO Y ENVIANDO EL NÚMERO DE PEDIDO
    return NextResponse.json({ success: true, orderId: orderId });

  } catch (error) {
    console.error("Error procesando pedido:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
