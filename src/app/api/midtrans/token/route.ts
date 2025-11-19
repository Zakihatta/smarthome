// src/app/api/midtrans/token/route.ts
import { NextResponse } from 'next/server';
import Midtrans from 'midtrans-client';

export async function POST(request: Request) {
  const { total, planName, customerName, customerEmail } = await request.json();

  // 1. Inisialisasi Snap Client
  const snap = new Midtrans.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY || "",
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
  });

  // 2. Buat Order ID Unik (Format: ORDER-TIMESTAMP-RANDOM)
  const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  // 3. Siapkan Parameter Transaksi
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: total,
    },
    item_details: [
      {
        id: planName.replace(/\s/g, '_').toLowerCase(),
        price: total,
        quantity: 1,
        name: planName.substring(0, 50), // Midtrans membatasi panjang nama item
      }
    ],
    customer_details: {
      first_name: customerName,
      email: customerEmail,
    },
  };

  try {
    // 4. Minta Token ke Midtrans
    const transaction = await snap.createTransaction(parameter);
    
    return NextResponse.json({ token: transaction.token, orderId: orderId });
  } catch (error) {
    console.error('Midtrans Error:', error);
    return NextResponse.json({ error: 'Gagal memproses token pembayaran' }, { status: 500 });
  }
}