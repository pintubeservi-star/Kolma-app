import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { customerInfo, items, discount } = await req.json();

    // 1. Extraer ID real de Shopify (Soporta IDs encriptados en Base64)
    const lineItems = items.map(item => {
      let rawId = item.variantId ? item.variantId.toString() : '';
      
      if (!rawId.includes('gid://') && /^[A-Za-z0-9+/=]+$/.test(rawId)) {
        rawId = Buffer.from(rawId, 'base64').toString('ascii');
      }
      
      const match = rawId.match(/\d+$/);
      const numericId = match ? parseInt(match[0], 10) : 0;

      return {
        variant_id: numericId,
        quantity: item.qty
      };
    });

    let domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
    if (!domain) return NextResponse.json({ success: false, error: "Falta NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN" }, { status: 200 });
    domain = domain.replace('https://', '').replace('/', '');
    
    const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;
    if (!adminToken) return NextResponse.json({ success: false, error: "Falta SHOPIFY_ADMIN_TOKEN en Vercel" }, { status: 200 });

    const payload = {
      order: {
        line_items: lineItems,
        customer: {
          first_name: customerInfo.firstName || customerInfo.name || "Cliente",
          last_name: customerInfo.lastName || "KolmaRD",
          phone: customerInfo.phone || undefined,
        },
        shipping_address: {
          first_name: customerInfo.firstName || customerInfo.name || "Cliente",
          last_name: customerInfo.lastName || "KolmaRD",
          address1: customerInfo.address || "Cotuí",
          phone: customerInfo.phone || undefined,
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

    if (customerInfo.email && customerInfo.email.includes('@') && customerInfo.email !== "Sin registrar") {
       payload.order.customer.email = customerInfo.email;
    }

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
      return NextResponse.json({ success: false, error: JSON.stringify(data.errors) }, { status: 200 });
    }

    return NextResponse.json({ success: true, order: data.order }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 200 });
  }
}
