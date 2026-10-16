import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not defined.');
  }
  await mongoose.connect(process.env.MONGO_URI);
}

// Explicitly define/retrieve the Portfolio model safely
const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', new mongoose.Schema({
  resumeText: String,
  updatedAt: { type: Date, default: Date.now },
}, { strict: false }));

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session || session.value !== (process.env.JWT_SECRET || 'fallback_secret')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";

    try {
      const pdfParseModule = await import('pdf-parse');
      const parse = pdfParseModule.default || pdfParseModule;
      const pdfData = await parse(buffer);
      extractedText = pdfData.text;
    } catch (parseErr) {
      console.warn('pdf-parse secondary engine fallback triggered:', parseErr.message);
      extractedText = buffer.toString('utf8').replace(/[^\x20-\x7E\n]/g, ' ');
    }

    await connectDB();

    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      portfolio = new Portfolio({});
    }

    portfolio.resumeText = extractedText;
    portfolio.updatedAt = new Date();

    await portfolio.save();

    return NextResponse.json({ 
      success: true, 
      message: 'PDF successfully processed and portfolio updated!',
      extractedTextSnippet: extractedText.slice(0, 200)
    });

  } catch (err) {
    console.error('PDF Upload Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}