
    import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ success: false, error: 'Falta ID' }, { status: 400 });

  const SHIPDAY_KEY = "FzKmvwy7mB.DgaRNOaMv19P28urcMEb.";

  try {
    // 1. Buscamos el pedido directamente por su número
    const response = await fetch(`https://api.shipday.com/orders/number/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${SHIPDAY_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    const dataArray = await response.json();
    const p = Array.isArray(dataArray) ? dataArray[0] : dataArray;

    if (!p) return NextResponse.json({ success: false, error: 'No encontrado' }, { status: 404 });

    // 2. EXTRACCIÓN MAESTRA DE ESTADO
    let status = "PENDING";
    if (p.orderStatus?.orderState) status = p.orderStatus.orderState;
    else if (p.orderStatus?.shipdayStatus) status = p.orderStatus.shipdayStatus;
    else if (p.status) status = p.status;

    // 3. EXTRACCIÓN DE MOTORISTA (Buscando en todas las capas)
    const carrier = p.carrier || {};
    const driverName = carrier.name || p.carrierName || "Asignando...";
    const driverPhone = carrier.phoneNumber || p.carrierPhoneNumber || "";

    // 4. ESCANEO PROFUNDO DE GPS (Para que no salga null si hay señal)
    let driverLocation = null;
    const lat = carrier.location?.latitude || carrier.latitude || p.latitude;
    const lng = carrier.location?.longitude || carrier.longitude || p.longitude;

    if (lat && lng && lat !== 0) {
      driverLocation = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng)
      };
    }

    // 5. RESPUESTA COMPLETA PARA LA APP
    return NextResponse.json({
      success: true,
      shipdayStatus: String(status).toUpperCase(),
      driverName,
      driverPhone,
      eta: p.eta || p.etaTime || null,
      driverLocation,
      // Enviamos el link de rastreo nativo de Shipday por si el mapa interno falla
      trackingUrl: p.trackingLink || p.trackingUrl || null 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
