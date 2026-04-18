import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password, firstName, phone, address } = await request.json();

    // Se eliminó "addresses" porque Storefront API no lo soporta en la creación.
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
        phone: phone ? phone : null, // Debe ser +1... o null si está vacío
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

    // Se devuelve "user" con la dirección local para que tu frontend funcione
    return NextResponse.json({ 
      success: true, 
      user: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        phone: customer.phone,
        address: address // Mantenemos la dirección para el estado local de KolmaRD
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Error de conexión con Shopify" }, { status: 500 });
  }
}
