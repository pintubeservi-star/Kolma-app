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

    // --- LÓGICA DE ESTADO SEGURA ---
    let estadoCrudo = pedido.status || 
                       pedido.orderStatus?.shipdayStatus || 
                       pedido.orderStatus?.orderState || 
                       "PENDING";

    // Forzamos que sea texto antes de usar toUpperCase() para evitar el error anterior
    const estadoFinal = String(estadoCrudo).toUpperCase();

    const result = {
      success: true,
      shipdayStatus: estadoFinal,
      driverName: pedido.carrier?.name || null,
      driverPhone: pedido.carrier?.phoneNumber || null,
      eta: pedido.eta || pedido.etaTime || null,
      driverLocation: null
    };

    // Ubicación GPS (Revisando múltiples rutas de Shipday)
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
    // Si algo falla, devolvemos el error pero sin romper la ejecución
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
      }
