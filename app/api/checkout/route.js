import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { customerInfo, items, discount } = await req.json();

    const lineItems = items.map(item => ({
      variant_id: parseInt(item.variantId.toString().split('/').pop(), 10),
      quantity: item.qty
    }));

    let domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
    domain = domain.replace('https://', '').replace('/', '');
    const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;

    if (!domain || !adminToken) {
      return NextResponse.json({ error: "Faltan tokens en Vercel" }, { status: 500 });
    }

    const payload = {
      order: {
        line_items: lineItems,
        customer: {
          first_name: customerInfo.firstName || customerInfo.name || "Cliente",
          last_name: customerInfo.lastName || "KolmaRD",
          email: (customerInfo.email && customerInfo.email !== "Sin registrar") ? customerInfo.email : undefined,
        },
        shipping_address: {
          first_name: customerInfo.firstName || customerInfo.name || "Cliente",
          last_name: customerInfo.lastName || "KolmaRD",
          address1: customerInfo.address || "Cotuí",
          city: "Cotuí",
          province: "Sánchez Ramírez",
          country: "DO"
        },
        financial_status: "pending", 
        inventory_behaviour: "bypass", 
        tags: "App_KolmaRD, Pago_Contra_Entrega",
        note: `TELÉFONO: ${customerInfo.phone} | DIRECCIÓN: ${customerInfo.address} | Cobrar al entregar.`,
      }
    };

    if (discount > 0) {
      payload.order.discount_codes = [
        { code: "DESCUENTO_APP", amount: discount.toString(), type: "fixed_amount" }
      ];
    }

    // Actualizado a la API 2026-01
    const response = await fetch(`https://${domain}/admin/api/2026-01/orders.json`, {
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
      return NextResponse.json({ error: JSON.stringify(data.errors) }, { status: 400 });
    }

    return NextResponse.json({ success: true, order: data.order }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
