import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ success: false, error: 'Falta ID' }, { status: 400 });

  const SHIPDAY_KEY = "FzKmvwy7mB.DgaRNOaMv19P28urcMEb.";

  try {
    const response = await fetch(`https://api.shipday.com/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${SHIPDAY_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) throw new Error('Error de conexión');

    const todosLosPedidos = await response.json();
    
    // Buscamos el pedido por número o por ID
    const pedido = todosLosPedidos.find(p => 
      String(p.orderNumber) === String(id) || 
      String(p.id) === String(id)
    );

    if (!pedido) {
      return NextResponse.json({ success: false, error: 'No encontrado' }, { status: 404 });
    }

    // --- DETECTAR EL ESTADO REAL (Multi-campo) ---
    // Revisamos cada rincón donde Shipday guarda el estatus
    let estadoReal = "PENDING";
    
    if (pedido.orderStatus?.orderState) estadoReal = pedido.orderStatus.orderState;
    else if (pedido.orderStatus?.shipdayStatus) estadoReal = pedido.orderStatus.shipdayStatus;
    else if (pedido.status) estadoReal = pedido.status;

    // TRUCO DE SEGURIDAD: Si hay un motorista (carrier) asignado, el estado NO puede ser PENDING.
    // Lo forzamos a "STARTED" para que la barra de la app se mueva.
    if (pedido.carrier && (estadoReal === "PENDING" || estadoReal === "UNASSIGNED")) {
        estadoReal = "STARTED";
    }

    const result = {
      success: true,
      shipdayStatus: String(estadoReal).toUpperCase(),
      driverName: pedido.carrier?.name || null,
      driverPhone: pedido.carrier?.phoneNumber || null,
      eta: pedido.eta || pedido.etaTime || null,
      driverLocation: null
    };

    // Ubicación GPS (Ruta absoluta de Shipday)
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
