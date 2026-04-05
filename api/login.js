export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { email } = req.body;

    try {
        const response = await fetch(`https://${process.env.SHOPIFY_STORE}/admin/api/2024-01/customers/search.json?query=email:${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_TOKEN
            }
        });

        const data = await response.json();

        if (data.customers && data.customers.length > 0) {
            const customer = data.customers[0];
            return res.status(200).json({ 
                success: true, 
                user: { id: customer.id, email: customer.email, name: customer.first_name } 
            });
        } else {
            return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error de conexión' });
    }
}
