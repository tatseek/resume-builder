import { ResumeData } from '@/types/resume';

export default function ModernTemplate({ data }: { data: ResumeData }) {
  const skills = data.isTailored && data.tailoredSkills ? data.tailoredSkills : data.skills;
  const summary = data.isTailored && data.tailoredSummary ? data.tailoredSummary : data.summary;

  return (
    <div className="bg-white w-full flex" style={{ minHeight: '297mm' }}>
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white p-7 flex-shrink-0">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-full bg-indigo-400 flex items-center justify-center text-2xl font-bold mb-3">
            {data.personalInfo.fullName?.charAt(0) || 'R'}
          </div>
          <h1 className="text-xl font-bold leading-tight">{data.personalInfo.fullName}</h1>
          <p className="text-indigo-300 text-xs mt-1 font-medium">{data.personalInfo.jobTitle}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-3">Contact</h3>
          <div className="space-y-2 text-xs text-slate-300">
            {data.personalInfo.email && <p className="break-all">{data.personalInfo.email}</p>}
            {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
            {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
            {data.personalInfo.linkedin && (
              <a href={data.personalInfo.linkedin} className="break-all text-indigo-300 hover:text-white">
                {data.personalInfo.linkedinLabel || data.personalInfo.linkedin}
              </a>
            )}
            {data.personalInfo.portfolio && (
              <a href={data.personalInfo.portfolio} className="break-all text-indigo-300 hover:text-white">
                {data.personalInfo.portfolioLabel || data.personalInfo.portfolio}
              </a>
            )}
          </div>
        </div>

        {skills.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-3">
              Skills {data.isTailored && <span className="text-indigo-400">✦</span>}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, i) => (
                <span key={i} className="bg-slate-700 text-slate-200 text-xs px-2 py-0.5 rounded">
                  {skill}
                </span>
              ))}
            </div>
            {data.isTailored && <p className="text-indigo-400 text-xs mt-2">✦ AI-filtered for role</p>}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {summary && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">About</h2>
            <div className="w-8 h-0.5 bg-indigo-600 mb-3"></div>
            <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
            {data.isTailored && <p className="text-xs text-indigo-500 mt-1">✦ AI-tailored for your job</p>}
          </div>
        )}

        {data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Experience</h2>
            <div className="w-8 h-0.5 bg-indigo-600 mb-4"></div>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-5 relative pl-4 border-l-2 border-slate-200">
                <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-indigo-500"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{exp.role}</p>
                    <p className="text-xs text-indigo-600 font-medium">{exp.company}</p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap ml-2">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </p>
                </div>
                <ul className="mt-2 space-y-1">
                  {exp.bullets.filter(b => b.trim()).map((bullet, i) => (
                    <li key={i} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-indigo-400 mt-0.5">›</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {data.projects?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Projects</h2>
            <div className="w-8 h-0.5 bg-indigo-600 mb-4"></div>
            {data.projects.map((proj) => (
              <div key={proj.id} className="mb-4 relative pl-4 border-l-2 border-slate-200">
                <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-indigo-400"></div>
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-sm text-gray-900">{proj.name}</p>
                  {proj.link && <p className="text-xs text-indigo-500 ml-2">{proj.link}</p>}
                </div>
                {proj.techStack && (
                  <p className="text-xs text-indigo-600 font-medium mb-1">{proj.techStack}</p>
                )}
                {proj.description && (
                  <p className="text-xs text-gray-600">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Education</h2>
            <div className="w-8 h-0.5 bg-indigo-600 mb-4"></div>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3 flex justify-between">
                <div>
                  <p className="font-semibold text-sm text-gray-900">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                  <p className="text-xs text-indigo-600">{edu.institution}</p>
                  {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                </div>
                <p className="text-xs text-gray-400 whitespace-nowrap ml-2">{edu.startDate} — {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}