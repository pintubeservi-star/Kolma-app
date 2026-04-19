import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { customerInfo, items, discount } = await req.json();

    // 1. Limpiar el ID de los productos para que Shopify los reconozca
    const lineItems = items.map(item => {
      // Si el variantId viene como "gid://shopify/ProductVariant/12345", extraemos solo los números
      const cleanId = item.variantId.includes('/') 
        ? parseInt(item.variantId.split('/').pop(), 10) 
        : parseInt(item.variantId, 10);

      return {
        variant_id: cleanId,
        quantity: item.qty
      };
    });

    // 2. Configurar el descuento si el cliente llegó a la meta
    let appliedDiscount = null;
    if (discount > 0) {
      appliedDiscount = {
        description: "Descuento en App",
        value_type: "fixed_amount",
        value: discount.toString(),
        amount: discount.toString()
      };
    }

    // 3. Crear la orden en Shopify (Draft Order)
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const adminToken = process.env.SHOPIFY_ADMIN_TOKEN; // Requiere token de administrador

    if (!domain || !adminToken) {
      return NextResponse.json({ error: "Faltan tokens de Shopify Admin" }, { status: 500 });
    }

    const response = await fetch(`https://${domain}/admin/api/2024-01/draft_orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({
        draft_order: {
          line_items: lineItems,
          customer: {
            first_name: customerInfo.firstName || customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
          },
          shipping_address: {
            address1: customerInfo.address,
            city: "Cotuí",
            province: "Sánchez Ramírez",
            country: "DO"
          },
          tags: "App_KolmaRD, Pago_Contra_Entrega",
          note: "Pedido desde la PWA. Cobrar al entregar.",
          applied_discount: appliedDiscount
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.errors || "Error al crear orden en Shopify" }, { status: 400 });
    }

    // 4. Completar la orden automáticamente para que pase de "Borrador" a "Orden Real"
    const draftOrderId = data.draft_order.id;
    await fetch(`https://${domain}/admin/api/2024-01/draft_orders/${draftOrderId}/complete.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      }
    });

    return NextResponse.json({ success: true, order: data.draft_order }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
