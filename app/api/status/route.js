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

    const dataArray = await response.json();
    const pedido = Array.isArray(dataArray) ? dataArray[0] : dataArray;

    if (!pedido) return NextResponse.json({ success: false, error: 'No encontrado' }, { status: 404 });

    // --- LÓGICA DE ESTADO REFORZADA ---
    // Revisamos todas las posibles ubicaciones del estado en Shipday
    let estadoReal = "PENDING";
    
    if (pedido.status) estadoReal = pedido.status;
    if (pedido.orderStatus?.shipdayStatus) estadoReal = pedido.orderStatus.shipdayStatus;
    if (pedido.orderStatus?.orderState) estadoReal = pedido.orderStatus.orderState;
    
    // Si ya hay un motorista asignado, forzamos el estado a "STARTED" para activar el mapa
    if (pedido.carrier && estadoReal === "PENDING") {
        estadoReal = "ASSIGNED";
    }

    const result = {
      success: true,
      shipdayStatus: estadoReal.toUpperCase(), // Lo enviamos en mayúsculas para evitar errores
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
