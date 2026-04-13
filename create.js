// pages/api/orders/create.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Solo se permite el método POST' });
  }

  const { items, customer, total_weight } = req.body;

  // Construcción del objeto Order para Shopify Admin API
  const orderData = {
    order: {
      line_items: items.map(item => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
        // Si manejas productos por peso (libras), asegúrate de que el quantity 
        // o las notas reflejen el pesaje correcto de Kolma RD.
      })),
      customer: {
        first_name: customer.name,
        phone: customer.phone,
      },
      shipping_address: {
        address1: customer.address,
        city: "Cotuí",
        province: "Sánchez Ramírez",
        country: "Dominican Republic",
      },
      financial_status: "pending", // Se marca como pendiente para cobro en entrega o POS
      note: `Pedido desde la web - Peso total: ${total_weight} lbs`
    }
  };

  try {
    const response = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_PRIVATE_ADMIN_TOKEN, // Tu variante privada
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(201).json({ success: true, orderId: data.order.id });
    } else {
      res.status(400).json({ success: false, error: data.errors });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error de conexión con el servidor' });
  }
}
