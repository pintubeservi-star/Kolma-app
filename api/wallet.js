export default async function handler(req, res) {
    // Permite GET o POST
    const customer_id = req.method === 'POST' ? req.body.customer_id : req.query.id;
    if (!customer_id) return res.status(400).json({ success: false, message: 'Falta customer_id' });

    try {
        const response = await fetch(`https://${process.env.SHOPIFY_STORE}/admin/api/2024-01/customers/${customer_id}/metafields.json`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_TOKEN
            }
        });

        const data = await response.json();
        
        // Buscar el metafield específico
        const walletMetafield = data.metafields?.find(m => m.namespace === 'custom' && m.key === 'wallet_balance');
        const balance = walletMetafield ? parseFloat(walletMetafield.value) : 0;

        return res.status(200).json({ success: true, balance: balance });

    } catch (error) {
        return res.status(500).json({ success: false, balance: 0 });
    }
}
