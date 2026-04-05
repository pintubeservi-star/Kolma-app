export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { customer_id, amount } = req.body;

    try {
        // 1. Obtener balance actual
        const getRes = await fetch(`https://${process.env.SHOPIFY_STORE}/admin/api/2024-01/customers/${customer_id}/metafields.json`, {
            method: 'GET',
            headers: { 'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_TOKEN }
        });
        const getData = await getRes.json();
        
        const existingMetafield = getData.metafields?.find(m => m.namespace === 'custom' && m.key === 'wallet_balance');
        const currentBalance = existingMetafield ? parseFloat(existingMetafield.value) : 0;
        const newBalance = currentBalance + parseFloat(amount);

        // 2. Actualizar balance en Shopify
        const updateRes = await fetch(`https://${process.env.SHOPIFY_STORE}/admin/api/2024-01/customers/${customer_id}/metafields.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_TOKEN
            },
            body: JSON.stringify({
                metafield: {
                    namespace: 'custom',
                    key: 'wallet_balance',
                    value: newBalance.toString(),
                    type: 'number_decimal'
                }
            })
        });

        const updateData = await updateRes.json();

        return res.status(200).json({ 
            success: true, 
            new_balance: newBalance 
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error procesando crédito' });
    }
                  }
