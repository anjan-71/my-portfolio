import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '../../../lib/mongodb';
import Portfolio from '../../../models/Portfolio';

// GET is public so visitors can view your structured portfolio data
export async function GET() {
  try {
    await dbConnect();
    const data = await Portfolio.findOne().lean();
    return NextResponse.json(data || {});
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST is protected – requires valid admin session cookie to save form data
export async function POST(request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== process.env.JWT_SECRET) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();

    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      {},
      {
        about: body.about,
        skills: body.skills || [],
        resumeUrl: body.resumeUrl,
        socialLinks: body.socialLinks,
        education: body.education,
        experience: body.experience || [],
        projects: body.projects || [],
        publications: body.publications || [],
        certifications: body.certifications || [],
        training: body.training || [],
        updatedAt: new Date()
      },
      { upsert: true, new: true, strict: false }
    );

    return NextResponse.json({ success: true, data: updatedPortfolio });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}