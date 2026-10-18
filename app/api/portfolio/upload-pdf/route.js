import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

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

    // Clean up filename and setup uploads directory path
    const filename = file.name.replace(/\s+/g, '_');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure public/uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Write file to public/uploads
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Return the public URL path so the frontend/database can store it
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ 
      success: true, 
      message: 'PDF file successfully uploaded!',
      url: fileUrl 
    });

  } catch (err) {
    console.error('PDF Upload Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}