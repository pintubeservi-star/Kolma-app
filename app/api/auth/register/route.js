import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password, firstName, phone, address } = await request.json();

    const query = `
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer { id email firstName phone }
          customerUserErrors { code field message }
        }
      }
    `;

    const variables = {
      input: {
        email,
        password,
        firstName,
        phone: phone ? phone : null,
        acceptsMarketing: true
      }
    };

    const res = await fetch(`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.data?.customerCreate?.customerUserErrors?.length > 0) {
      return NextResponse.json({ error: json.data.customerCreate.customerUserErrors[0].message }, { status: 400 });
    }

    const customer = json.data.customerCreate.customer;

    return NextResponse.json({ 
      success: true, 
      user: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        name: customer.firstName, // Agregado para compatibilidad con la app
        phone: customer.phone || phone,
        address: address
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Error de conexión con Shopify" }, { status: 500 });
  }
}
