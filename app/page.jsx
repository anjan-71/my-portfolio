import dbConnect from '../lib/mongodb';
import Portfolio from '../models/Portfolio';
import Link from 'next/link';

export const revalidate = 0; // Disable cache so changes show up instantly

export default async function Home() {
  await dbConnect();
  let portfolioData = await Portfolio.findOne().lean();

  if (!portfolioData) {
    portfolioData = {
      about: {
        name: "Anjan Boro",
        title: "Full-Stack Developer",
        summary: "Building and deploying modern web applications."
      }
    };
  }

  const { about, resumeUrl, socialLinks, skills, education, experience, projects, publications, certifications, training } = portfolioData;

  const formatUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const getSocialIcon = (platformName) => {
    const name = (platformName || '').toLowerCase();
    
    if (name.includes('github')) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );
    } else if (name.includes('linkedin')) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      );
    } else if (name.includes('instagram')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      );
    } else if (name.includes('twitter') || name.includes('x')) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 sm:p-16">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header / About */}
        <header className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-800 pb-8 gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-white">{about?.name || "Portfolio"}</h1>
            <p className="text-xl text-indigo-400">{about?.title}</p>
            <p className="text-slate-400 max-w-xl text-sm leading-relaxed">{about?.summary}</p>
            
            {socialLinks && Array.isArray(socialLinks) && socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2.5 pt-2">
                {socialLinks.map((social, idx) => (
                  <a 
                    key={idx} 
                    href={formatUrl(social.url)} 
                    target="_blank" 
                    rel="noreferrer" 
                    title={social.platform}
                    className="text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 p-2.5 rounded-lg transition-all flex items-center justify-center shadow-sm"
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:items-end gap-3 shrink-0">
            <Link 
              href="/admin" 
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-md font-medium transition"
            >
              Admin Panel ⚙️
            </Link>

            {resumeUrl && (
              <a 
                href={formatUrl(resumeUrl)} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-md font-medium transition inline-flex items-center gap-1.5"
              >
                <span>Download Resume</span>
                <span>📄</span>
              </a>
            )}
          </div>
        </header>

        {/* Education */}
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
                    <span className="text-xs text-slate-400">{edu.period}</span>
                  </div>
                  {edu.description && (
                    <p className="text-slate-300 text-sm leading-relaxed pt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
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

        {/* Experience */}
        {experience && Array.isArray(experience) && experience.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Experience</h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-white">{exp.title}</h3>
                    <span className="text-xs text-slate-400">{exp.tenure}</span>
                  </div>
                  <p className="text-indigo-400 text-sm">{exp.company}</p>
                  {exp.description && (
                    <p className="text-slate-300 text-sm leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && Array.isArray(projects) && projects.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((proj, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col justify-between shadow-lg">
                  {proj.image && (
                    <div className="w-full h-44 bg-slate-950 relative overflow-hidden border-b border-slate-800">
                      <img src={proj.image} alt={proj.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-white">{proj.name}</h3>
                        {proj.link && (
                          <a href={formatUrl(proj.link)} target="_blank" rel="noreferrer" className="text-indigo-400 text-xs underline">Link ↗</a>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mt-2">{proj.description}</p>
                    </div>
                    {proj.techStack && (
                      <div className="pt-2">
                        <span className="bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded text-[10px]">
                          {proj.techStack}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Publications */}
        {publications && Array.isArray(publications) && publications.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Publications</h2>
            <div className="space-y-4">
              {publications.map((pub, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-white">{pub.title}</h3>
                    <span className="text-xs text-slate-400">{pub.date}</span>
                  </div>
                  <p className="text-indigo-400 text-sm">{pub.publisher}</p>
                  {pub.link && (
                    <a href={formatUrl(pub.link)} target="_blank" rel="noreferrer" className="text-indigo-400 text-xs underline inline-block">Read Publication ↗</a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications && Array.isArray(certifications) && certifications.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Certifications</h2>
            <div className="space-y-3">
              {certifications.map((cert, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex justify-between items-center text-sm">
                  <div>
                    <span className="font-semibold text-white">{cert.name}</span>
                    <p className="text-xs text-indigo-400">{cert.issuer}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{cert.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Training */}
        {training && Array.isArray(training) && training.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Training</h2>
            <div className="space-y-3">
              {training.map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex justify-between items-center text-sm">
                  <div>
                    <span className="font-semibold text-white">{item.course}</span>
                    <p className="text-xs text-indigo-400">{item.institution}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{item.tenure}</span>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}