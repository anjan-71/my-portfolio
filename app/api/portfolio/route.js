import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Portfolio from '../../../models/Portfolio';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    await dbConnect();
    const portfolio = await Portfolio.findOne().lean();
    return NextResponse.json(portfolio || {});
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== process.env.JWT_SECRET) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();

    const updated = await Portfolio.findOneAndUpdate(
      {},
      {
        about: body.about,
        resumeUrl: body.resumeUrl,
        socialLinks: body.socialLinks,
        skills: body.skills,
        education: body.education,
        experience: body.experience,
        projects: body.projects,
        publications: body.publications,
        certifications: body.certifications,
        training: body.training,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}