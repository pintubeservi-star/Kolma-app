import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer } = body;

    // --- CREDENCIALES DE TU TIENDA KOLMA ---
    const shopifyStore = "q0q09e-cp.myshopify.com";
    const apiKey = "c9bda45020488455d7fe2d8b7e22f352";
    const apiSecret = "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";

    // Generar la llave de acceso interna (Basic Auth)
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    // 1. Limpiar los IDs y preparar los productos
    const lineItems = items.map(item => {
      // Extrae solo el número del ID (ej: de gid://.../123 a 123)
      const cleanId = item.variantId.includes('/') 
        ? item.variantId.split('/').pop() 
        : item.variantId;

      return {
        variant_id: parseInt(cleanId),
        quantity: item.quantity
      };
    });

    // 2. Estructura del Pedido para el panel de Shopify
    const orderPayload = {
      order: {
        line_items: lineItems,
        customer: {
          first_name: customer.nombre,
          email: customer.email,
          phone: customer.telefono
        },
        shipping_address: {
          first_name: customer.nombre,
          last_name: "Cliente Kolma",
          address1: customer.direccion,
          city: "Cotuí",
          province: "Sánchez Ramírez",
          country: "Dominican Republic",
          phone: customer.telefono
        },
        // 'pending' hace que aparezca como "Pago Pendiente" para cobrar en efectivo
        financial_status: "pending", 
        inventory_behavior: "decrement_ignoring_policy",
        note: "PEDIDO REALIZADO DESDE LA APP - ENTREGA EN COTUÍ"
      }
    };

    // 3. Envío a la API de Administrador de Shopify
    const response = await fetch(`https://${shopifyStore}/admin/api/2024-04/orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify(orderPayload)
    });

    const data = await response.json();

    if (data.errors) {
      console.error("Error detectado en Shopify:", data.errors);
      return NextResponse.json({ success: false, error: data.errors }, { status: 400 });
    }

    // Si todo sale bien, devolvemos el éxito a tu App
    return NextResponse.json({ success: true, order: data.order });

  } catch (error) {
    console.error("Error crítico en la API:", error);
    return NextResponse.json({ success: false, error: "Error de servidor" }, { status: 500 });
  }
}
