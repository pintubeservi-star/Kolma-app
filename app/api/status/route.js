import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ success: false, error: 'Falta ID' }, { status: 400 });

  const SHIPDAY_KEY = "FzKmvwy7mB.DgaRNOaMv19P28urcMEb.";

  try {
    const response = await fetch(`https://api.shipday.com/orders/number/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${SHIPDAY_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    // Si la respuesta de Shipday no es OK (200), es que el pedido no existe allí
    if (!response.ok) {
        return NextResponse.json({ success: false, error: 'Pedido no existe en Shipday' }, { status: 404 });
    }

    const dataArray = await response.json();
    
    // Si el array está vacío, Shipday no encontró el pedido
    if (!dataArray || (Array.isArray(dataArray) && dataArray.length === 0)) {
        return NextResponse.json({ success: false, error: 'Pedido no encontrado' }, { status: 404 });
    }

    const pedido = Array.isArray(dataArray) ? dataArray[0] : dataArray;

    // Extraer estado real evitando el error del "404"
    let estadoCrudo = "PENDING";
    if (pedido.orderStatus?.shipdayStatus) estadoCrudo = pedido.orderStatus.shipdayStatus;
    else if (pedido.status) estadoCrudo = pedido.status;
    else if (pedido.orderStatus?.orderState) estadoCrudo = pedido.orderStatus.orderState;

    const result = {
      success: true,
      shipdayStatus: String(estadoCrudo).toUpperCase(),
      driverName: pedido.carrier?.name || null,
      driverPhone: pedido.carrier?.phoneNumber || null,
      eta: pedido.eta || pedido.etaTime || null,
      driverLocation: null
    };

    // Ubicación GPS
    const lat = pedido.carrier?.location?.latitude || pedido.carrier?.latitude;
    const lng = pedido.carrier?.location?.longitude || pedido.carrier?.longitude;

    if (lat && lng) {
      result.driverLocation = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng)
      };
    }

    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
