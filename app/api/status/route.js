import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'Falta el ID del pedido' }, { status: 400 });
  }

  const SHIPDAY_KEY = "FzKmvwy7mB.DgaRNOaMv19P28urcMEb.";

  try {
    // EL CAMBIO ESTÁ AQUÍ: Agregamos "/number/" a la URL
    const response = await fetch(`https://api.shipday.com/orders/number/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${SHIPDAY_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: 'Pedido no encontrado en Shipday' }, { status: 404 });
    }

    // Shipday devuelve un array cuando buscas por número, tomamos el primero [0]
    const dataArray = await response.json();
    const data = Array.isArray(dataArray) ? dataArray[0] : dataArray;

    if (!data) {
      return NextResponse.json({ success: false, error: 'Pedido vacío' }, { status: 404 });
    }

    const result = {
      success: true,
      shipdayStatus: data.orderStatus?.shipdayStatus || 'PENDING',
      trackingUrl: data.trackingLink || null,
      driverName: data.carrier?.name || null,
      driverPhone: data.carrier?.phoneNumber || null,
      eta: data.eta || null,
      driverLocation: null
    };

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
