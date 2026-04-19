import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { customerInfo, items, discount, total } = await req.json();

    // 1. ENVIAR A SHIPDAY PRIMERO (Prioridad para repartidores en Cotuí)
    const shipdayOrderNumber = `KRD-${Math.floor(Math.random() * 100000)}`;
    const shipdayApiKey = process.env.SHIPDAY_API_KEY || "FzKmvwy7mB.DgaRNOaMv19P28urcMEb."; // Tu API Key

    const shipdayPayload = {
      orderNumber: shipdayOrderNumber,
      customerName: `${customerInfo.firstName || customerInfo.name} ${customerInfo.lastName || ''}`.trim(),
      customerAddress: customerInfo.address || "Cotuí",
      customerPhoneNumber: customerInfo.phone,
      customerEmail: (customerInfo.email && customerInfo.email !== "Sin registrar") ? customerInfo.email : "cliente@kolmard.com",
      restaurantName: "Kolma RD",
      restaurantAddress: "Cotuí, Sánchez Ramírez, DO",
      deliveryInstruction: "Cobrar al entregar. " + (discount > 0 ? `(Descuento de RD$${discount} aplicado)` : ""),
      orderItem: items.map(item => ({
        name: item.name || "Producto de KolmaRD",
        unitPrice: item.price || 0,
        quantity: item.qty
      })),
      totalOrderCost: total || 0
    };

    const shipdayRes = await fetch('https://api.shipday.com/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${shipdayApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(shipdayPayload)
    });

    const shipdayData = await shipdayRes.json();

    // 2. INTENTAR GUARDAR EN SHOPIFY (En segundo plano)
    let shopifySuccess = false;
    
    try {
      const lineItems = items.map(item => {
        let rawId = item.variantId ? item.variantId.toString() : '';
        if (!rawId.includes('gid://') && /^[A-Za-z0-9+/=]+$/.test(rawId)) {
          rawId = Buffer.from(rawId, 'base64').toString('ascii');
        }
        const match = rawId.match(/\d+$/);
        return { variant_id: match ? parseInt(match[0], 10) : 0, quantity: item.qty };
      });

      let domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
      const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;

      if (domain && adminToken) {
        domain = domain.replace('https://', '').replace('/', '');
        const shopifyPayload = {
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
              city: "Cotuí",
              province: "Sánchez Ramírez",
              country: "DO"
            },
            financial_status: "pending", 
            inventory_behaviour: "bypass", 
            tags: "App_KolmaRD, Pago_Contra_Entrega, Shipday",
            note: `Shipday ID: ${shipdayOrderNumber} | Tel: ${customerInfo.phone}`,
          }
        };

        if (discount > 0) shopifyPayload.order.discount_codes = [{ code: "DESCUENTO_APP", amount: discount.toString(), type: "fixed_amount" }];

        const shopifyRes = await fetch(`https://${domain}/admin/api/2024-01/orders.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': adminToken },
          body: JSON.stringify(shopifyPayload)
        });

        if (shopifyRes.ok) shopifySuccess = true;
      }
    } catch (e) {
      console.log("Error silencioso de Shopify omitido:", e);
    }

    // Retornamos éxito si Shipday lo recibe, sin importar Shopify
    return NextResponse.json({ 
      success: true, 
      order: { id: shipdayData.orderId || shipdayOrderNumber, name: shipdayOrderNumber }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 200 });
  }
}
