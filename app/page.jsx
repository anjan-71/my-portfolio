import dbConnect from '../lib/mongodb';
import Portfolio from '../models/Portfolio';
import Link from 'next/link';

export const revalidate = 0; // Disable cache so changes show up instantly

export default async function Home() {
  await dbConnect();
  let portfolioData = await Portfolio.findOne().lean();

  // Fallback if database is empty
  if (!portfolioData) {
    portfolioData = {
      about: {
        name: "Anjan Boro",
        title: "Full-Stack Web Developer & CSE Graduate",
        summary: "Passionate developer building dynamic, data-driven web applications."
      },
      skills: {
        languages: ["Python", "JavaScript", "C++"],
        webDevelopment: ["Next.js", "Tailwind CSS", "Node.js"]
      },
      experience: [
        {
          role: "Web Development Team Lead",
          company: "Sanganak Coding Club, Dibrugarh",
          period: "Oct 2023 - Present",
          description: [
            "Mentoring team members on full-stack workflows and version control.",
            "Architecting dynamic components for club events and workshops."
          ]
        }
      ],
      projects: [
        {
          title: "Portfolio Admin Dashboard",
          description: "A live MongoDB-backed admin panel built with Next.js App Router.",
          tech: ["Next.js", "MongoDB", "Tailwind CSS"]
        }
      ]
    };
  }

  const { about, skills, experience, projects } = portfolioData;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 sm:p-16">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header / About Section */}
        <header className="flex justify-between items-start border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">{about?.name}</h1>
            <p className="text-xl text-indigo-400 mt-2">{about?.title}</p>
            <p className="text-slate-400 mt-4 max-w-xl">{about?.summary}</p>
          </div>
          <Link 
            href="/admin" 
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-md font-medium transition"
          >
            Admin Panel
          </Link>
        </header>

        {/* Skills Section */}
        {skills && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Skills</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category} className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-indigo-300 uppercase tracking-wider mb-2">
                    {category.replace(/([A-Z])/g, ' $1')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(items) && items.map((item, idx) => (
                      <span key={idx} className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Experience</h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-white">{exp.role}</h3>
                    <span className="text-xs text-slate-400">{exp.period}</span>
                  </div>
                  <p className="text-indigo-400 text-sm mt-1">{exp.company}</p>
                  <ul className="list-disc list-inside mt-3 space-y-1 text-slate-300 text-sm">
                    {exp.description?.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-lg flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white">{proj.title}</h3>
                    <p className="text-slate-400 text-sm mt-2">{proj.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {proj.tech && proj.tech.map((t, i) => (
                      <span key={i} className="bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}