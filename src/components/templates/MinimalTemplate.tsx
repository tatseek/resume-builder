import { ResumeData } from '@/types/resume';

export default function MinimalTemplate({ data }: { data: ResumeData }) {
  const skills = data.isTailored && data.tailoredSkills ? data.tailoredSkills : data.skills;
  const summary = data.isTailored && data.tailoredSummary ? data.tailoredSummary : data.summary;

  return (
    <div className="bg-white w-full p-12" style={{ minHeight: '297mm' }}>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-light tracking-tight text-gray-900">{data.personalInfo.fullName}</h1>
        <p className="text-sm text-gray-500 mt-1 tracking-wide">{data.personalInfo.jobTitle}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && (
            <a href={data.personalInfo.linkedin} className="hover:underline">{data.personalInfo.linkedinLabel || data.personalInfo.linkedin}</a>
          )}
          {data.personalInfo.portfolio && (
            <a href={data.personalInfo.portfolio} className="hover:underline">{data.personalInfo.portfolioLabel || data.personalInfo.portfolio}</a>
          )}
        </div>
        <div className="mt-4 h-px bg-gray-100"></div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-8 grid grid-cols-4 gap-6">
          <div className="col-span-1">
            <p className="text-xs uppercase tracking-widest text-gray-400">Profile</p>
          </div>
          <div className="col-span-3">
            <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
            {data.isTailored && <p className="text-xs text-emerald-600 mt-1">✦ Tailored for this role</p>}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-8">
          <div className="h-px bg-gray-100 mb-6"></div>
          {data.experience.map((exp) => (
            <div key={exp.id} className="grid grid-cols-4 gap-6 mb-6">
              <div className="col-span-1">
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  {exp.startDate}<br />— {exp.current ? 'Now' : exp.endDate}
                </p>
              </div>
              <div className="col-span-3">
                <p className="font-medium text-sm text-gray-900">{exp.role}</p>
                <p className="text-xs text-gray-500 mb-2">{exp.company}</p>
                <ul className="space-y-1">
                  {exp.bullets.filter(b => b.trim()).map((bullet, i) => (
                    <li key={i} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-gray-300">—</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <div className="mb-8">
          <div className="h-px bg-gray-100 mb-6"></div>
          <div className="grid grid-cols-4 gap-6 mb-2">
            <div className="col-span-1">
              <p className="text-xs uppercase tracking-widest text-gray-400">Projects</p>
            </div>
            <div className="col-span-3 space-y-4">
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm text-gray-900">{proj.name}</p>
                    {proj.link && <p className="text-xs text-gray-400">{proj.link}</p>}
                  </div>
                  {proj.techStack && (
                    <p className="text-xs text-gray-400 italic mb-1">{proj.techStack}</p>
                  )}
                  {proj.description && (
                    <p className="text-xs text-gray-600">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-8">
          <div className="h-px bg-gray-100 mb-6"></div>
          {data.education.map((edu) => (
            <div key={edu.id} className="grid grid-cols-4 gap-6 mb-4">
              <div className="col-span-1">
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  {edu.startDate}<br />— {edu.endDate}
                </p>
              </div>
              <div className="col-span-3">
                <p className="font-medium text-sm text-gray-900">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                <p className="text-xs text-gray-500">{edu.institution}</p>
                {edu.gpa && <p className="text-xs text-gray-400">GPA {edu.gpa}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <div className="h-px bg-gray-100 mb-6"></div>
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1">
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Skills {data.isTailored && <span className="text-emerald-500">✦</span>}
              </p>
            </div>
            <div className="col-span-3">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="text-xs text-gray-600 border border-gray-200 px-2 py-0.5 rounded-sm">
                    {skill}
                  </span>
                ))}
              </div>
              {data.isTailored && <p className="text-xs text-emerald-600 mt-2">✦ AI-filtered for this role</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}