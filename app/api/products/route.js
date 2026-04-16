import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    // Aumentamos a first: 250 para traer TODO el inventario
    const query = `
      {
        products(first: 250) {
          edges {
            node {
              id
              title
              productType
              images(first: 1) { edges { node { url } } }
              variants(first: 1) { edges { node { price { amount } compareAtPrice { amount } } } }
            }
          }
        }
      }
    `;

    const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query }),
    });
    
    const json = await res.json();
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
