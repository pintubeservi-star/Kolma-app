import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ success: false, error: 'Falta ID' }, { status: 400 });

  const SHIPDAY_KEY = "FzKmvwy7mB.DgaRNOaMv19P28urcMEb.";

  try {
    const response = await fetch(`https://api.shipday.com/orders/number/${id}`, {
      method: 'GET',
      headers: { 'Authorization': `Basic ${SHIPDAY_KEY}`, 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    const dataArray = await response.json();
    const p = Array.isArray(dataArray) ? dataArray[0] : dataArray;

    if (!p) return NextResponse.json({ success: false, error: 'No encontrado' }, { status: 404 });

    // NORMALIZACIÓN DE ESTADOS
    let rawStatus = (p.status || p.orderStatus?.shipdayStatus || "PENDING").toUpperCase();
    
    // OBJETO STATUS_ROUTE (Estructura que pediste)
    const status_route = {
      order_id: id,
      status: rawStatus,
      driver_name: p.carrier?.name || "Asignando...",
      driver_phone: p.carrier?.phoneNumber || "",
      driver_location: null,
      customer_location: { 
        lat: parseFloat(p.customer?.latitude) || 19.0527, 
        lng: parseFloat(p.customer?.longitude) || -70.1492 
      },
      eta: p.eta || p.etaTime || "Calculando...",
      last_update: new Date().toISOString()
    };

    // Extraer ubicación del mensajero si existe
    const lat = p.carrier?.location?.latitude || p.carrier?.latitude;
    const lng = p.carrier?.location?.longitude || p.carrier?.longitude;

    if (lat && lng && parseFloat(lat) !== 0) {
      status_route.driver_location = {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      };
    }

    return NextResponse.json({ success: true, status_route });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
          }
