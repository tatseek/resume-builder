import { ResumeData } from '@/types/resume';

export default function ClassicTemplate({ data }: { data: ResumeData }) {
  const skills = data.isTailored && data.tailoredSkills ? data.tailoredSkills : data.skills;
  const summary = data.isTailored && data.tailoredSummary ? data.tailoredSummary : data.summary;

  return (
    <div className="bg-white w-full h-full p-10 font-serif text-gray-900" style={{ minHeight: '297mm' }}>
      {/* Header */}
      <div className="border-b-2 border-gray-900 pb-4 mb-6">
        <h1 className="text-3xl font-bold tracking-wide uppercase">{data.personalInfo.fullName}</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">{data.personalInfo.jobTitle}</p>
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600 font-sans">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && (
            <span>• <a href={data.personalInfo.linkedin} className="text-blue-600 hover:underline">{data.personalInfo.linkedinLabel || data.personalInfo.linkedin}</a></span>
          )}          
          {data.personalInfo.portfolio && (
            <span>• <a href={data.personalInfo.portfolio} className="text-blue-600 hover:underline">{data.personalInfo.portfolioLabel || data.personalInfo.portfolio}</a></span>
          )}
          </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-2 font-sans">Professional Summary</h2>
          <p className="text-sm leading-relaxed text-gray-800 font-sans">{summary}</p>
          {data.isTailored && <span className="text-xs text-blue-600 font-sans">✦ AI-tailored for your job</span>}
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-3 font-sans">Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-sm font-sans">{exp.role}</p>
                  <p className="text-sm text-gray-600 font-sans">{exp.company}</p>
                </div>
                <p className="text-xs text-gray-500 font-sans whitespace-nowrap">
                  {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                </p>
              </div>
              <ul className="mt-2 space-y-1">
                {exp.bullets.filter(b => b.trim()).map((bullet, i) => (
                  <li key={i} className="text-xs text-gray-700 font-sans flex gap-2">
                    <span className="mt-0.5">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-3 font-sans">Projects</h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-start">
                <p className="font-bold text-sm font-sans">{proj.name}</p>
                {proj.link && (
                  <p className="text-xs text-blue-600 font-sans">{proj.link}</p>
                )}
              </div>
              {proj.techStack && (
                <p className="text-xs text-gray-500 font-sans italic mb-1">{proj.techStack}</p>
              )}
              {proj.description && (
                <p className="text-xs text-gray-700 font-sans">{proj.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-3 font-sans">Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3 flex justify-between items-start">
              <div>
                <p className="font-bold text-sm font-sans">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                <p className="text-sm text-gray-600 font-sans">{edu.institution}</p>
                {edu.gpa && <p className="text-xs text-gray-500 font-sans">GPA: {edu.gpa}</p>}
              </div>
              <p className="text-xs text-gray-500 font-sans whitespace-nowrap">{edu.startDate} — {edu.endDate}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-2 font-sans">
            Skills {data.isTailored && <span className="text-blue-600 normal-case tracking-normal">✦ filtered for role</span>}
          </h2>
          <p className="text-sm text-gray-800 font-sans">{skills.join(' • ')}</p>
        </div>
      )}
    </div>
  );
}