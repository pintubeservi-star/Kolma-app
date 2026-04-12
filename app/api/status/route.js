import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ success: false, error: 'Falta ID' }, { status: 400 });

  const SHIPDAY_KEY = "FzKmvwy7mB.DgaRNOaMv19P28urcMEb.";

  try {
    // 1. OBTENEMOS TODOS LOS PEDIDOS ACTIVOS PARA BUSCAR EL MATCH REAL
    const response = await fetch(`https://api.shipday.com/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${SHIPDAY_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) throw new Error('Error al conectar con Shipday');

    const todosLosPedidos = await response.json();
    
    // 2. BUSCAMOS EL PEDIDO QUE COINCIDA CON EL NÚMERO "KRD-315793"
    const pedido = todosLosPedidos.find(p => 
      String(p.orderNumber) === String(id) || 
      String(p.id) === String(id)
    );

    if (!pedido) {
      return NextResponse.json({ 
        success: false, 
        error: 'Pedido no encontrado en lista activa',
        buscado: id 
      }, { status: 404 });
    }

    // 3. EXTRACCIÓN DE ESTADO Y GPS
    const estadoCrudo = pedido.status || pedido.orderStatus?.shipdayStatus || "PENDING";

    const result = {
      success: true,
      shipdayStatus: String(estadoCrudo).toUpperCase(),
      driverName: pedido.carrier?.name || null,
      driverPhone: pedido.carrier?.phoneNumber || null,
      eta: pedido.eta || null,
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
