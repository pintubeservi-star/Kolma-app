import { NextResponse } from 'next/server';

export async function GET() {
  const query = `
    {
      products(first: 100) {
        edges {
          node {
            id
            title
            description
            productType
            tags
            collections(first: 1) {
              edges {
                node {
                  title
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  price {
                    amount
                  }
                }
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const json = await res.json();
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: "Error cargando productos" }, { status: 500 });
  }
}
