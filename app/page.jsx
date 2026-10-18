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
        title: "Web Developer | CSE Graduate & M.Tech Student",
        summary: "Computer Science and Engineering graduate with practical experience in web development, responsive website design, and team mentoring."
      }
    };
  }

  const { about, skills, education, experience, projects, publications, certifications, training } = portfolioData;

  // Helper function to format external links safely
  const formatUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 sm:p-16">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header / About Section */}
        <header className="flex justify-between items-start border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">{about?.name || "Portfolio"}</h1>
            <p className="text-xl text-indigo-400 mt-2">{about?.title}</p>
            <p className="text-slate-400 mt-4 max-w-xl">{about?.summary}</p>
          </div>
          <Link 
            href="/admin" 
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-md font-medium transition"
          >
            Admin Panel ⚙️
          </Link>
        </header>

        {/* Education Section (With Description Support) */}
        {education && Array.isArray(education) && education.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Education</h2>
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-white">{edu.degree}</h3>
                      <p className="text-indigo-400 text-sm mt-1">{edu.institution}</p>
                    </div>
                    <span className="text-xs text-slate-400">{edu.period || edu.tenure}</span>
                  </div>
                  {edu.description && (
                    <p className="text-slate-300 text-sm leading-relaxed pt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section - Completely hides if array is empty */}
        {skills && Array.isArray(skills) && skills.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs">
                  {typeof skill === 'string' ? skill : (skill.name || skill.toString())}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {experience && Array.isArray(experience) && experience.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Experience</h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-white">{exp.title || exp.role}</h3>
                    <span className="text-xs text-slate-400">{exp.tenure || exp.period}</span>
                  </div>
                  <p className="text-indigo-400 text-sm">{exp.company}</p>
                  {exp.description && (
                    Array.isArray(exp.description) ? (
                      <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
                        {exp.description.map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-300 text-sm leading-relaxed">{exp.description}</p>
                    )
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section (With Image & Tenure Support) */}
        {projects && Array.isArray(projects) && projects.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((proj, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col justify-between shadow-lg">
                  {proj.image && (
                    <div className="w-full h-44 bg-slate-950 relative overflow-hidden border-b border-slate-800">
                      <img src={proj.image} alt={proj.name || proj.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-white">{proj.name || proj.title}</h3>
                        {proj.link && (
                          <a href={formatUrl(proj.link)} target="_blank" rel="noreferrer" className="text-indigo-400 text-xs underline">Link ↗</a>
                        )}
                      </div>
                      {proj.tenure && (
                        <p className="text-xs text-indigo-300 font-mono mt-1">{proj.tenure}</p>
                      )}
                      <p className="text-slate-400 text-sm mt-2">{proj.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.techStack ? (
                        <span className="bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded text-[10px]">
                          {proj.techStack}
                        </span>
                      ) : proj.tech && Array.isArray(proj.tech) ? (
                        proj.tech.map((t, i) => (
                          <span key={i} className="bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded text-[10px]">
                            {t}
                          </span>
                        ))
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Publications Section */}
        {publications && Array.isArray(publications) && publications.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Publications</h2>
            <div className="space-y-4">
              {publications.map((pub, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-1">
                  <h3 className="text-lg font-medium text-white">{pub.title}</h3>
                  <p className="text-slate-400 text-sm">{pub.publisher || pub.authors}</p>
                  <p className="text-indigo-400 text-xs italic">{pub.date || pub.journal}</p>
                  {pub.link && (
                    <a href={formatUrl(pub.link)} target="_blank" rel="noreferrer" className="text-indigo-400 text-xs underline inline-block pt-1">Read Publication ↗</a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {certifications && Array.isArray(certifications) && certifications.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Certifications</h2>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm">
                {certifications.map((cert, idx) => (
                  <li key={idx}>
                    {typeof cert === 'string' ? cert : `${cert.name} — ${cert.issuer} (${cert.year})`}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Training Section */}
        {training && Array.isArray(training) && training.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Training</h2>
            <div className="space-y-3">
              {training.map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex justify-between items-center text-sm">
                  <div>
                    <span className="font-semibold text-white">{item.course || item.title}</span>
                    <p className="text-xs text-slate-400">{item.institution}</p>
                  </div>
                  <span className="text-xs text-indigo-400 font-mono">{item.tenure || item.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Fallback if Resume Text exists and structured sections are empty */}
        {portfolioData.resumeText && (!experience?.length && !projects?.length) && (
          <section className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-4">
            <h2 className="text-xl font-semibold text-indigo-400">Resume & Background</h2>
            <div className="whitespace-pre-line text-slate-300 text-sm leading-relaxed bg-slate-950 p-6 rounded-xl border border-slate-800/80 font-mono overflow-x-auto max-h-[600px]">
              {portfolioData.resumeText}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}