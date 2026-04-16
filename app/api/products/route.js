import { NextResponse } from 'next/server';

export async function GET() {
  try {
    let domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || !token) {
      return NextResponse.json({ error: 'Faltan variables de entorno en Vercel' });
    }

    // Limpia el dominio por si le pusiste https:// en Vercel
    domain = domain.replace('https://', '').replace('/', '');

    const query = `
      {
        products(first: 20) {
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
    
    // Usamos una versión más reciente de la API
    const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query }),
    });
    
    const json = await res.json();

    if (json.errors) {
        return NextResponse.json({ error: 'Error desde Shopify', detalles: json.errors });
    }

    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: 'Error interno', mensaje: error.message }, { status: 500 });
  }
}
