import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer } = body;

    // Preparamos el resumen para que tu correo se vea limpio
    const listaProductos = items.map(i => `${i.quantity}x ${i.title}`).join(', ');

    // Enviamos a Formspree (Tu ID: xjgpldag)
    const res = await fetch("https://formspree.io/f/xjgpldag", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Accept": "application/json" 
      },
      body: JSON.stringify({
        Pedido_ID: `KOL-${Math.floor(Math.random() * 9000) + 1000}`,
        Cliente: customer.nombre,
        WhatsApp: customer.telefono,
        Direccion_Cotuí: customer.direccion,
        Productos: listaProductos,
        Total: body.total || "Manual",
        Nota: "PEDIDO DESDE APP - PAGO EFECTIVO"
      })
    });

    if (res.ok) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
