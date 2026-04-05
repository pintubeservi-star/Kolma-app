import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // 1. Recibimos la URL que manda nuestro frontend
    const body = await request.json();
    const { activationUrl } = body;

    if (!activationUrl) {
      return NextResponse.json({ error: "Falta la URL de activación" }, { status: 400 });
    }

    // 2. Preparamos la instrucción exacta para Shopify
    const query = `
      mutation customerActivateByUrl($activationUrl: URL!) {
        customerActivateByUrl(activationUrl: $activationUrl) {
          customer {
            id
            firstName
            email
          }
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    // 3. Enviamos la orden al "Cerebro" de Shopify usando tus Tokens de Vercel
    const shopifyResponse = await fetch(`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: query,
        variables: {
          activationUrl: activationUrl
        }
      }),
    });

    const { data } = await shopifyResponse.json();

    // 4. Revisamos si Shopify devolvió algún error (ej. link ya usado)
    const errors = data?.customerActivateByUrl?.customerUserErrors;
    if (errors && errors.length > 0) {
      return NextResponse.json({ error: errors[0].message }, { status: 400 });
    }

    // 5. Extraemos el Token Premium del cliente
    const accessToken = data?.customerActivateByUrl?.customerAccessToken?.accessToken;
    const customer = data?.customerActivateByUrl?.customer;

    if (!accessToken) {
       return NextResponse.json({ error: "No se pudo generar el token de acceso" }, { status: 400 });
    }

    // 6. ¡Éxito! Le mandamos la luz verde al frontend
    return NextResponse.json({ 
      success: true, 
      accessToken: accessToken,
      customer: customer
    }, { status: 200 });

  } catch (error) {
    console.error("Error en API de activación:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
