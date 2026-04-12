import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'Falta el ID' }, { status: 400 });
  }

  const SHIPDAY_KEY = "FzKmvwy7mB.DgaRNOaMv19P28urcMEb.";

  try {
    // Buscamos por número de orden
    const response = await fetch(`https://api.shipday.com/orders/number/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${SHIPDAY_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    const dataArray = await response.json();
    const pedido = Array.isArray(dataArray) ? dataArray[0] : dataArray;

    if (!pedido) {
      return NextResponse.json({ success: false, error: 'No encontrado' }, { status: 404 });
    }

    // EXTRAER EL ESTADO CORRECTO (Igual que en tu código anterior que sí funcionaba)
    const estadoShipday = typeof pedido.orderStatus === 'string' 
                            ? pedido.orderStatus 
                            : (pedido.orderStatus?.orderState || 'PENDING');

    // EXTRAER DATOS DEL MOTORISTA
    const driverName = pedido.carrier?.name || pedido.carrierName || null;
    const driverPhone = pedido.carrier?.phoneNumber || pedido.carrierPhoneNumber || null;
    const eta = pedido.etaTime || pedido.eta || null;
    
    // EXTRAER GPS (Shipday lo manda dentro de carrier.location o carrier directamente)
    let driverLocation = null;
    const lat = pedido.carrier?.location?.latitude || pedido.carrier?.latitude;
    const lng = pedido.carrier?.location?.longitude || pedido.carrier?.longitude;

    if (lat && lng) {
      driverLocation = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng)
      };
    }

    return NextResponse.json({
      success: true,
      shipdayStatus: estadoShipday,
      driverName,
      driverPhone,
      driverLocation,
      eta
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
