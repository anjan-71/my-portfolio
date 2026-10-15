import dbConnect from '../../../lib/mongodb';
import Portfolio from '../../../models/Portfolio';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const data = await Portfolio.findOne().lean();
    return NextResponse.json(data || {});
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const updated = await Portfolio.findOneAndUpdate({}, body, {
      upsert: true,
      new: true,
      strict: false,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}