import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || !token) {
      return NextResponse.json({ error: "Faltan variables en Vercel" }, { status: 500 });
    }

    const loginQuery = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken { accessToken }
          customerUserErrors { message }
        }
      }
    `;

    const loginRes = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query: loginQuery, variables: { input: { email, password } } }),
    });

    const loginJson = await loginRes.json();

    if (loginJson.errors) return NextResponse.json({ error: loginJson.errors[0].message }, { status: 500 });

    const errors = loginJson.data?.customerAccessTokenCreate?.customerUserErrors;
    if (errors?.length > 0) return NextResponse.json({ error: errors[0].message }, { status: 401 });

    const accessToken = loginJson.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
    if (!accessToken) return NextResponse.json({ error: "No se generó el token" }, { status: 401 });

    const customerQuery = `
      query customerInfo($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          firstName
          email
          phone
        }
      }
    `;

    const customerRes = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query: customerQuery, variables: { customerAccessToken: accessToken } }),
    });

    const customerJson = await customerRes.json();
    const customer = customerJson.data?.customer;

    return NextResponse.json({ 
      success: true, 
      user: {
        id: customer?.id,
        email: customer?.email,
        name: customer?.firstName || "Usuario",
        firstName: customer?.firstName || "Usuario",
        phone: customer?.phone || "",
        token: accessToken
      }
    });

  } catch (error) {
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 });
  }
}
