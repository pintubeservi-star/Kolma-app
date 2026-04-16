import { NextResponse } from 'next/server';

export async function GET() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    return NextResponse.json({ 
      error: 'Variables faltantes', 
      domain: domain ? 'OK' : 'FALTA', 
      token: token ? 'OK' : 'FALTA' 
    }, { status: 400 });
  }

  try {
    const res = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({
        query: `{
          products(first: 10) {
            edges {
              node {
                id
                title
                handle
                images(first: 1) { edges { node { url } } }
                variants(first: 1) { edges { node { price { amount } } } }
              }
            }
          }
        }`
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
