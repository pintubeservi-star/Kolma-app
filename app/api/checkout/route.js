import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { customerInfo, items, discount } = await req.json();

    // 1. Extraer ID real de Shopify
    const lineItems = items.map(item => ({
      variant_id: parseInt(item.variantId.toString().split('/').pop(), 10),
      quantity: item.qty
    }));

    let appliedDiscount = undefined;
    if (discount > 0) {
      appliedDiscount = {
        description: "Descuento en App",
        value_type: "fixed_amount",
        value: discount.toString(),
        amount: discount.toString()
      };
    }

    // 2. Limpiar el dominio por si tiene "https://"
    let domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
    domain = domain.replace('https://', '').replace('/', '');
    
    const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;

    if (!domain || !adminToken) {
      return NextResponse.json({ error: "Faltan tokens de Shopify Admin en Vercel" }, { status: 500 });
    }

    // 3. Crear Borrador (Protegido contra errores de formato de teléfono de Shopify)
    const payload = {
      draft_order: {
        line_items: lineItems,
        customer: {
          first_name: customerInfo.firstName || customerInfo.name || "Cliente",
          email: customerInfo.email !== "Sin registrar" ? customerInfo.email : undefined,
        },
        shipping_address: {
          first_name: customerInfo.firstName || customerInfo.name || "Cliente",
          address1: customerInfo.address || "Cotuí",
          phone: customerInfo.phone, 
          city: "Cotuí",
          province: "Sánchez Ramírez",
          country: "DO"
        },
        tags: "App_KolmaRD, Pago_Contra_Entrega",
        note: `Teléfono: ${customerInfo.phone}. Cobrar al entregar.`,
        applied_discount: appliedDiscount
      }
    };

    const response = await fetch(`https://${domain}/admin/api/2024-01/draft_orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      // Esto mostrará el error exacto de Shopify en la app
      return NextResponse.json({ error: JSON.stringify(data.errors) }, { status: 400 });
    }

    const draftOrderId = data.draft_order.id;

    // 4. Completar orden y marcar como pago pendiente (Pago contra entrega)
    const completeRes = await fetch(`https://${domain}/admin/api/2024-01/draft_orders/${draftOrderId}/complete.json?payment_pending=true`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      }
    });

    return NextResponse.json({ success: true, order: data.draft_order }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
