import dbConnect from '../../../lib/mongodb';
import Portfolio from '../../../models/Portfolio';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      portfolio = await Portfolio.create({
        about: {
          name: "Anjan Boro",
          title: "Web Developer | Computer Science and Engineering",
          email: "anjanboro811@gmail.com",
          phone: "+91-9957903364",
          location: "Dibrugarh, Assam, India",
          summary: "Computer Science and Engineering graduate with practical experience in web development, responsive design, and machine learning."
        },
        skills: {
          languages: ["Python", "C", "C++", "JavaScript", "HTML", "CSS", "PHP"],
          webDevelopment: ["React.js", "Node.js", "Bootstrap", "WordPress"],
          databasesAndTools: ["MySQL", "MongoDB", "Firebase", "Git", "GitHub"],
          machineLearning: ["PyTorch", "NLP", "Tesseract OCR"]
        }
      });
    }
    return NextResponse.json(portfolio);
  } catch (err) {
    console.error("GET Portfolio Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    delete body._id;
    delete body.__v;

    const updated = await Portfolio.findOneAndUpdate(
      {}, 
      body, 
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error("PUT Portfolio Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}