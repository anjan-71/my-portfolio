import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== process.env.JWT_SECRET) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure public/uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Directory already exists or error
    }

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: imageUrl });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}