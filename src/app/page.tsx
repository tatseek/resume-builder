'use client';

import { useState, useRef } from 'react';
import { Plus, Trash2, Download, Wand2, FileText, ChevronDown, ChevronUp, Loader2, ExternalLink } from 'lucide-react';
import { ResumeData, TemplateId, Experience, Education, Project } from '@/types/resume';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import ModernTemplate from '@/components/templates/ModernTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';

// ── constants ─────────────────────────────────────────────────────────────────

const EMPTY_EXPERIENCE: Omit<Experience, 'id'> = {
  company: '', role: '', startDate: '', endDate: '', current: false, bullets: ['', '', ''],
};

const EMPTY_EDUCATION: Omit<Education, 'id'> = {
  institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '',
};

const EMPTY_PROJECT: Omit<Project, 'id'> = {
  name: '', description: '', techStack: '', link: '',
};

const DEFAULT_DATA: ResumeData = {
  personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', linkedinLabel: '', portfolio: '', portfolioLabel: '', jobTitle: '' },  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

type Step = 'form' | 'mode' | 'jd' | 'preview';

const TEMPLATES: { id: TemplateId; label: string; desc: string }[] = [
  { id: 'classic', label: 'Classic', desc: 'ATS-friendly, traditional black & white' },
  { id: 'modern', label: 'Modern', desc: 'Sidebar layout with accent colours' },
  { id: 'minimal', label: 'Minimal', desc: 'Spacious, clean, great for creative roles' },
];

const Input = ({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) => (
  <div>
    <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
    />
  </div>
);

const SectionHeader = ({
  label, section, openSections, toggleSection,
}: {
  label: string;
  section: string;
  openSections: Record<string, boolean>;
  toggleSection: (s: string) => void;
}) => (
  <button
    onClick={() => toggleSection(section)}
    className="w-full flex justify-between items-center py-3 text-left font-semibold text-slate-700 hover:text-slate-900"
  >
    {label}
    {openSections[section] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
  </button>
);

const ResumePreview = ({
  data, template, previewRef,
}: {
  data: ResumeData;
  template: TemplateId;
  previewRef: React.RefObject<HTMLDivElement>;
}) => (
  <div ref={previewRef} id="resume-preview" className="w-full shadow-lg">
    {template === 'classic' && <ClassicTemplate data={data} />}
    {template === 'modern' && <ModernTemplate data={data} />}
    {template === 'minimal' && <MinimalTemplate data={data} />}
  </div>
);

// main page 

export default function Home() {
  const [step, setStep] = useState<Step>('form');
  const [data, setData] = useState<ResumeData>(DEFAULT_DATA);
  const [template, setTemplate] = useState<TemplateId>('modern');
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true, summary: true, experience: true, projects:true, education: true, skills: true,
  });
  const previewRef = useRef<HTMLDivElement>(null);

  //helpers 
  const uid = () => Math.random().toString(36).slice(2);

  const toggleSection = (s: string) =>
    setOpenSections(p => ({ ...p, [s]: !p[s] }));

  const updatePersonal = (k: string, v: string) =>
    setData(p => ({ ...p, personalInfo: { ...p.personalInfo, [k]: v } }));

  const addExperience = () =>
    setData(p => ({ ...p, experience: [...p.experience, { id: uid(), ...EMPTY_EXPERIENCE }] }));

  const removeExperience = (id: string) =>
    setData(p => ({ ...p, experience: p.experience.filter(e => e.id !== id) }));

  const updateExperience = (id: string, k: string, v: string | boolean) =>
    setData(p => ({ ...p, experience: p.experience.map(e => e.id === id ? { ...e, [k]: v } : e) }));

  const updateBullet = (id: string, i: number, v: string) =>
    setData(p => ({
      ...p,
      experience: p.experience.map(e =>
        e.id === id ? { ...e, bullets: e.bullets.map((b, idx) => idx === i ? v : b) } : e
      ),
    }));

  const addBullet = (id: string) =>
    setData(p => ({
      ...p,
      experience: p.experience.map(e => e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e),
    }));

  const addEducation = () =>
    setData(p => ({ ...p, education: [...p.education, { id: uid(), ...EMPTY_EDUCATION }] }));

  const removeEducation = (id: string) =>
    setData(p => ({ ...p, education: p.education.filter(e => e.id !== id) }));

  const updateEducation = (id: string, k: string, v: string) =>
    setData(p => ({ ...p, education: p.education.map(e => e.id === id ? { ...e, [k]: v } : e) }));

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setData(p => ({ ...p, skills: [...p.skills, skillInput.trim()] }));
    setSkillInput('');
  };

  const removeSkill = (i: number) =>
    setData(p => ({ ...p, skills: p.skills.filter((_, idx) => idx !== i) }));

  const addProject = () =>
  setData(p => ({ ...p, projects: [...p.projects, { id: uid(), ...EMPTY_PROJECT }] }));

  const removeProject = (id: string) =>
  setData(p => ({ ...p, projects: p.projects.filter(pr => pr.id !== id) }));

  const updateProject = (id: string, k: string, v: string) =>
  setData(p => ({ ...p, projects: p.projects.map(pr => pr.id === id ? { ...pr, [k]: v } : pr) }));

  // AI tailoring 
  const tailorResume = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: data, jobDescription: jd }),
      });
      const result = await res.json();
      setData(p => ({
        ...p,
        tailoredSummary: result.tailoredSummary,
        tailoredSkills: result.tailoredSkills,
        isTailored: true,
      }));
      setStep('preview');
    } catch {
      alert('Failed to tailor resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // PDF download 
  const downloadPDF = async () => {
    if (!previewRef.current) return;
    setLoading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.personalInfo.fullName || 'resume'}.pdf`);
    } catch (e) {
      alert('PDF generation failed. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // mode selection step
  if (step === 'mode') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">How would you like your resume?</h2>
          <p className="text-slate-500 text-sm mb-8">Choose how to generate your resume from the info you provided.</p>

          <div className="space-y-4">
            <button
              onClick={() => { setData(p => ({ ...p, isTailored: false })); setStep('preview'); }}
              className="w-full border-2 border-slate-200 rounded-xl p-5 text-left hover:border-indigo-400 hover:bg-indigo-50 transition-all"
            >
              <div className="flex items-center gap-3 mb-1">
                <FileText className="text-indigo-500" size={20} />
                <span className="font-semibold text-slate-800">Generate Resume</span>
              </div>
              <p className="text-sm text-slate-500 ml-8">Use your info as-is to create a professional resume.</p>
            </button>

            <button
              onClick={() => setStep('jd')}
              className="w-full border-2 border-slate-200 rounded-xl p-5 text-left hover:border-indigo-400 hover:bg-indigo-50 transition-all"
            >
              <div className="flex items-center gap-3 mb-1">
                <Wand2 className="text-indigo-500" size={20} />
                <span className="font-semibold text-slate-800">Tailor for a Job Description</span>
                <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full font-medium">AI</span>
              </div>
              <p className="text-sm text-slate-500 ml-8">Paste a JD and our AI will filter relevant skills and rewrite your summary to match.</p>
            </button>
          </div>

          <button onClick={() => setStep('form')} className="mt-6 text-sm text-slate-400 hover:text-slate-600">
            ← Back to editing
          </button>
        </div>
      </div>
    );
  }

  // JD step
  if (step === 'jd') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl w-full">
          <div className="flex items-center gap-3 mb-2">
            <Wand2 className="text-indigo-500" size={22} />
            <h2 className="text-2xl font-bold text-slate-800">Paste the Job Description</h2>
          </div>
          <p className="text-slate-500 text-sm mb-6">
            Our AI will read the JD, filter only the relevant skills from your list, and rewrite your summary to align with the role.
          </p>

          <textarea
            value={jd}
            onChange={e => setJd(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={12}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep('mode')} className="text-sm text-slate-400 hover:text-slate-600 px-4">
              ← Back
            </button>
            <button
              onClick={tailorResume}
              disabled={!jd.trim() || loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Tailoring your resume...</>
                : <><Wand2 size={18} /> Tailor with AI</>
              }
            </button>
          </div>
        </div>
      </div>
    );
  }

  // preview step
  if (step === 'preview') {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="font-bold text-slate-800">ResumeForge</h1>
            {data.isTailored && <span className="text-xs text-indigo-600 font-medium">✦ AI-tailored resume</span>}
          </div>
          <div className="flex gap-3 items-center">
            <button onClick={() => setStep('form')} className="text-sm text-slate-500 hover:text-slate-700 px-3 py-2">
              ← Edit
            </button>
            <button
              onClick={downloadPDF}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              Download PDF
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">Choose Template</h3>
            <div className="space-y-3">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${template === t.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <p className={`font-semibold text-sm ${template === t.id ? 'text-indigo-700' : 'text-slate-700'}`}>{t.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-medium mb-1">Made by</p>
              <p className="text-sm font-semibold text-slate-800">Arunima Das</p>
              <p className="text-xs text-slate-500">das31arunima@gmail.com</p>
            </div>

            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <ExternalLink size={15} />
              Built for Digital Heroes
            </a>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ maxWidth: '210mm', margin: '0 auto' }}>
              <ResumePreview data={data} template={template} previewRef={previewRef} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // form step
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">ResumeForge</h1>
            <p className="text-xs text-slate-400 mt-0.5">AI-powered resume builder</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 font-medium">Built by Arunima Das</p>
              <p className="text-xs text-slate-400">das31arunima@gmail.com</p>
            </div>
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap"
            >
              <ExternalLink size={13} />
              Built for Digital Heroes
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">

        {/* Personal Info */}
        <div className="bg-white rounded-2xl border border-slate-200 px-6">
          <SectionHeader label="Personal Information" section="personal" openSections={openSections} toggleSection={toggleSection} />
          {openSections.personal && (
            <div className="pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name *" value={data.personalInfo.fullName} onChange={v => updatePersonal('fullName', v)} placeholder="Arunima Das" />
              <Input label="Job Title" value={data.personalInfo.jobTitle} onChange={v => updatePersonal('jobTitle', v)} placeholder="Full Stack Developer" />
              <Input label="Email *" value={data.personalInfo.email} onChange={v => updatePersonal('email', v)} placeholder="das31arunima@gmail.com" type="email" />
              <Input label="Phone" value={data.personalInfo.phone} onChange={v => updatePersonal('phone', v)} placeholder="+91 98765 43210" />
              <Input label="Location" value={data.personalInfo.location} onChange={v => updatePersonal('location', v)} placeholder="Imphal, India" />
              <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                <Input label="LinkedIn URL" value={data.personalInfo.linkedin} onChange={v => updatePersonal('linkedin', v)} placeholder="https://linkedin.com/in/arunima-das" />
                <Input label="LinkedIn Display Text" value={data.personalInfo.linkedinLabel} onChange={v => updatePersonal('linkedinLabel', v)} placeholder="linkedin.com/in/arunima-das" />
              </div>
              <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                <Input label="Portfolio / GitHub URL" value={data.personalInfo.portfolio} onChange={v => updatePersonal('portfolio', v)} placeholder="https://github.com/arunima-das" />
                <Input label="Portfolio Display Text" value={data.personalInfo.portfolioLabel} onChange={v => updatePersonal('portfolioLabel', v)} placeholder="github.com/arunima-das" />
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 px-6">
          <SectionHeader label="Professional Summary" section="summary" openSections={openSections} toggleSection={toggleSection} />
          {openSections.summary && (
            <div className="pb-6">
              <label className="block text-xs font-medium text-slate-600 mb-1">Summary</label>
              <textarea
                value={data.summary}
                onChange={e => setData(p => ({ ...p, summary: e.target.value }))}
                placeholder="Write 2-3 sentences about your professional background and what you bring to the table..."
                rows={4}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
            </div>
          )}
        </div>

        {/* Experience */}
        <div className="bg-white rounded-2xl border border-slate-200 px-6">
          <SectionHeader label="Experience" section="experience" openSections={openSections} toggleSection={toggleSection} />
          {openSections.experience && (
            <div className="pb-6 space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={exp.id} className="border border-slate-100 rounded-xl p-4 relative">
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-3 right-3 text-slate-300 hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Position {idx + 1}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <Input label="Role *" value={exp.role} onChange={v => updateExperience(exp.id, 'role', v)} placeholder="Frontend Developer" />
                    <Input label="Company *" value={exp.company} onChange={v => updateExperience(exp.id, 'company', v)} placeholder="PCS Care" />
                    <Input label="Start Date" value={exp.startDate} onChange={v => updateExperience(exp.id, 'startDate', v)} placeholder="Dec 2025" />
                    {!exp.current && (
                      <Input label="End Date" value={exp.endDate} onChange={v => updateExperience(exp.id, 'endDate', v)} placeholder="Feb 2026" />
                    )}
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-600 mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={e => updateExperience(exp.id, 'current', e.target.checked)}
                      className="rounded"
                    />
                    Currently working here
                  </label>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-600">Key Achievements / Responsibilities</label>
                    {exp.bullets.map((bullet, i) => (
                      <input
                        key={i}
                        value={bullet}
                        onChange={e => updateBullet(exp.id, i, e.target.value)}
                        placeholder={`Bullet point ${i + 1}`}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    ))}
                    <button onClick={() => addBullet(exp.id)} className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                      <Plus size={12} /> Add bullet
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addExperience}
                className="w-full border-2 border-dashed border-slate-200 rounded-xl py-3 text-sm text-slate-400 hover:border-indigo-400 hover:text-indigo-500 flex items-center justify-center gap-2 transition"
              >
                <Plus size={16} /> Add Experience
              </button>
            </div>
          )}
        </div>

        {/* Projects */}
        <div className="bg-white rounded-2xl border border-slate-200 px-6">
          <SectionHeader label="Projects" section="projects" openSections={openSections} toggleSection={toggleSection} />
          {openSections.projects && (
            <div className="pb-6 space-y-4">
              {data.projects.map((proj, idx) => (
                <div key={proj.id} className="border border-slate-100 rounded-xl p-4 relative">
                  <button
                    onClick={() => removeProject(proj.id)}
                    className="absolute top-3 right-3 text-slate-300 hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Project {idx + 1}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <Input label="Project Name *" value={proj.name} onChange={v => updateProject(proj.id, 'name', v)} placeholder="ResumeForge" />
                    <Input label="Live Link / GitHub" value={proj.link} onChange={v => updateProject(proj.id, 'link', v)} placeholder="github.com/you/project" />
                    <div className="sm:col-span-2">
                      <Input label="Tech Stack" value={proj.techStack} onChange={v => updateProject(proj.id, 'techStack', v)} placeholder="Next.js, TypeScript, Tailwind CSS" />
                    </div>
                  </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                  <textarea
                    value={proj.description}
                    onChange={e => updateProject(proj.id, 'description', e.target.value)}
                    placeholder="Briefly describe what the project does, the problem it solves, or any key highlights..."
                    rows={3}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addProject}
              className="w-full border-2 border-dashed border-slate-200 rounded-xl py-3 text-sm text-slate-400 hover:border-indigo-400 hover:text-indigo-500 flex items-center justify-center gap-2 transition"
            >
              <Plus size={16} /> Add Project
            </button>
          </div>
        )}
      </div>

        {/* Education */}
        <div className="bg-white rounded-2xl border border-slate-200 px-6">
          <SectionHeader label="Education" section="education" openSections={openSections} toggleSection={toggleSection} />
          {openSections.education && (
            <div className="pb-6 space-y-4">
              {data.education.map((edu, idx) => (
                <div key={edu.id} className="border border-slate-100 rounded-xl p-4 relative">
                  <button onClick={() => removeEducation(edu.id)} className="absolute top-3 right-3 text-slate-300 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Degree {idx + 1}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label="Institution" value={edu.institution} onChange={v => updateEducation(edu.id, 'institution', v)} placeholder="IIIT Senapati" />
                    <Input label="Degree" value={edu.degree} onChange={v => updateEducation(edu.id, 'degree', v)} placeholder="B.Tech / M.Tech/PhD" />
                    <Input label="Field of Study" value={edu.field} onChange={v => updateEducation(edu.id, 'field', v)} placeholder="Computer Science" />
                    <Input label="GPA (optional)" value={edu.gpa} onChange={v => updateEducation(edu.id, 'gpa', v)} placeholder="8.1 / 10" />
                    <Input label="Start Date" value={edu.startDate} onChange={v => updateEducation(edu.id, 'startDate', v)} placeholder="2023" />
                    <Input label="End Date" value={edu.endDate} onChange={v => updateEducation(edu.id, 'endDate', v)} placeholder="2027" />
                  </div>
                </div>
              ))}
              <button
                onClick={addEducation}
                className="w-full border-2 border-dashed border-slate-200 rounded-xl py-3 text-sm text-slate-400 hover:border-indigo-400 hover:text-indigo-500 flex items-center justify-center gap-2 transition"
              >
                <Plus size={16} /> Add Education
              </button>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl border border-slate-200 px-6">
          <SectionHeader label="Skills" section="skills" openSections={openSections} toggleSection={toggleSection} />
          {openSections.skills && (
            <div className="pb-6">
              <p className="text-xs text-slate-400 mb-3">Add all your skills — when you tailor for a JD, AI will filter only the relevant ones.</p>
              <div className="flex gap-2 mb-3">
                <input
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSkill()}
                  placeholder="e.g. React, Node.js, Python..."
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button onClick={addSkill} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg text-sm font-medium transition">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full">
                    {skill}
                    <button onClick={() => removeSkill(i)} className="hover:text-red-500 transition">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => setStep('mode')}
          disabled={!data.personalInfo.fullName || !data.personalInfo.email}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-base transition shadow-lg shadow-indigo-200"
        >
          <FileText size={20} />
          Continue to Build Resume
        </button>

        <p className="text-center text-xs text-slate-400 pb-4">
          Made by Arunima Das · das31arunima@gmail.com
        </p>
      </div>
    </div>
  );
}