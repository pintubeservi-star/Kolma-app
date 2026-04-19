import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { customerInfo, items, discount } = await req.json();

    // 1. Extraer ID real de Shopify
    const lineItems = items.map(item => ({
      variant_id: parseInt(item.variantId.toString().split('/').pop(), 10),
      quantity: item.qty
    }));

    // 2. Limpiar el dominio por si tiene "https://"
    let domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
    domain = domain.replace('https://', '').replace('/', '');
    
    const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;

    if (!domain || !adminToken) {
      return NextResponse.json({ error: "Faltan tokens de Shopify Admin en Vercel" }, { status: 500 });
    }

    // 3. Crear Orden Directa ignorando inventario agotado
    const payload = {
      order: {
        line_items: lineItems,
        customer: {
          first_name: customerInfo.firstName || customerInfo.name || "Cliente KolmaRD",
          email: customerInfo.email !== "Sin registrar" ? customerInfo.email : undefined,
          phone: customerInfo.phone
        },
        shipping_address: {
          first_name: customerInfo.firstName || customerInfo.name || "Cliente",
          address1: customerInfo.address || "Cotuí",
          phone: customerInfo.phone, 
          city: "Cotuí",
          province: "Sánchez Ramírez",
          country: "DO"
        },
        financial_status: "pending", // Pago contra entrega
        inventory_behaviour: "bypass", // ESTA ES LA CLAVE: Fuerza la orden aunque no haya inventario en Shopify
        tags: "App_KolmaRD, Pago_Contra_Entrega",
        note: `Teléfono: ${customerInfo.phone}. Cobrar al entregar.`,
      }
    };

    // 4. Agregar descuento si aplica
    if (discount > 0) {
      payload.order.discount_codes = [
        { code: "DESCUENTO_APP", amount: discount.toString(), type: "fixed_amount" }
      ];
    }

    const response = await fetch(`https://${domain}/admin/api/2024-01/orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error Shopify:", data.errors);
      return NextResponse.json({ error: "Error de Shopify: " + JSON.stringify(data.errors) }, { status: 400 });
    }

    return NextResponse.json({ success: true, order: data.order }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
