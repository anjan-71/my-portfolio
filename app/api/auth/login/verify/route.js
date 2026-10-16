import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    // Check if session cookie matches the JWT_SECRET
    if (session && session.value === (process.env.JWT_SECRET || 'fallback_secret')) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 500 });
  }
}