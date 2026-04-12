import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'Falta el ID del pedido' }, { status: 400 });
  }

  // LLAVE REAL DE SHIPDAY INTEGRADA
  const SHIPDAY_KEY = "FzKmvwy7mB.DgaRNOaMv19P28urcMEb.";

  try {
    const response = await fetch(`https://api.shipday.com/orders/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${SHIPDAY_KEY}`,
        'Content-Type': 'application/json'
      },
      // Desactivamos la caché para que el GPS se actualice en tiempo real
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: 'Pedido no encontrado en Shipday' }, { status: 404 });
    }

    const data = await response.json();

    // Extraemos y formateamos solo lo que la app necesita para el mapa
    const result = {
      success: true,
      shipdayStatus: data.orderStatus?.shipdayStatus || 'PENDING',
      trackingUrl: data.trackingLink || null,
      driverName: data.carrier?.name || null,
      driverPhone: data.carrier?.phoneNumber || null,
      eta: data.eta || null,
      driverLocation: null
    };

    // Si Shipday envía las coordenadas del motorista, las pasamos al mapa
    if (data.carrier?.latitude && data.carrier?.longitude) {
      result.driverLocation = {
        latitude: parseFloat(data.carrier.latitude),
        longitude: parseFloat(data.carrier.longitude)
      };
    }

    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
