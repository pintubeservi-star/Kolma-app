import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { customerInfo, items, discount } = await req.json();

    const lineItems = items.map(item => {
      let rawId = item.variantId.toString();
      // Decodificar Base64 si Shopify Storefront lo envía encriptado
      if (!rawId.includes('gid://') && /^[A-Za-z0-9+/=]+$/.test(rawId)) {
        rawId = Buffer.from(rawId, 'base64').toString('ascii');
      }
      const numericId = parseInt(rawId.split('?')[0].split('/').pop(), 10);
      
      return {
        variant_id: numericId,
        quantity: item.qty
      };
    });

    let domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
    domain = domain.replace('https://', '').replace('/', '');
    const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;

    if (!domain || !adminToken) {
      return NextResponse.json({ error: "Falta SHOPIFY_ADMIN_TOKEN o DOMAIN en Vercel" }, { status: 500 });
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
      // Devolver error exacto de Shopify
      return NextResponse.json({ error: JSON.stringify(data.errors) }, { status: 400 });
    }

    return NextResponse.json({ success: true, order: data.order }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
