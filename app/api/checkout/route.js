import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const payload = await request.json();
    
    const res = await fetch("https://api.shipday.com/orders", {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${process.env.SHIPDAY_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}
