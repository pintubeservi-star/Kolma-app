export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { email, phone, name } = req.body;

    try {
        const response = await fetch(`https://${process.env.SHOPIFY_STORE}/admin/api/2024-01/customers.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_TOKEN
            },
            body: JSON.stringify({
                customer: {
                    first_name: name,
                    email: email,
                    phone: phone,
                    verified_email: true
                }
            })
        });

        const data = await response.json();

        if (data.errors) {
            return res.status(400).json({ success: false, message: JSON.stringify(data.errors) });
        }

        return res.status(200).json({ 
            success: true, 
            user: { id: data.customer.id, email: data.customer.email, name: data.customer.first_name } 
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
}
