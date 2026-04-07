import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer } = body;

    // --- CREDENCIALES ---
    const shopifyStore = "q0q09e-cp.myshopify.com";
    
    // ENTORNO HEADLESS: Es más seguro usar el Token de Acceso Permanente (shpat_) 
    // Si tienes el API Key/Secret, el Basic Auth funciona, pero el Admin Token es más directo.
    // Usaremos el Basic Auth por defecto como lo configuramos, pero presta atención a los errores.
    const apiKey = "c9bda45020488455d7fe2d8b7e22f352";
    const apiSecret = "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";
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    // 1. Limpieza de IDs Headless
    // La Storefront API devuelve IDs como: "gid://shopify/ProductVariant/123456"
    // La Admin API (para crear órdenes) NECESITA SOLO EL NÚMERO: 123456
    const lineItems = items.map(item => {
      // Nos aseguramos de extraer solo los números del final del string
      const variantIdMatch = String(item.variantId).match(/\d+$/);
      const cleanVariantId = variantIdMatch ? parseInt(variantIdMatch[0], 10) : null;

      return {
        variant_id: cleanVariantId,
        quantity: parseInt(item.quantity, 10)
      };
    }).filter(item => item.variant_id !== null); // Evitamos enviar items corruptos

    // 2. Estructura de la Orden
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
          address1: customer.direccion,
          city: "Cotuí",
          province: "Sánchez Ramírez",
          country: "Dominican Republic",
          phone: customer.telefono
        },
        financial_status: "pending",
        inventory_behavior: "decrement_ignoring_policy", // Importante para que no falle si no hay stock rastreado
        note: "PEDIDO DESDE APP HEADLESS (Cotuí)"
      }
    };

    console.log("Enviando Payload a Shopify:", JSON.stringify(orderPayload, null, 2));

    // 3. Petición a Shopify Admin API
    const response = await fetch(`https://${shopifyStore}/admin/api/2024-04/orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify(orderPayload)
    });

    const data = await response.json();

    // 4. Manejo de Errores de Shopify
    if (!response.ok || data.errors) {
      console.error("Shopify rechazó la orden. Razón:", data.errors);
      return NextResponse.json({ 
        success: false, 
        error: data.errors || "Shopify rechazó la petición",
        status: response.status 
      }, { status: response.status });
    }

    console.log("Orden creada exitosamente ID:", data.order.id);
    return NextResponse.json({ success: true, order: data.order });

  } catch (error) {
    console.error("Error catastrófico en la API /order:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
