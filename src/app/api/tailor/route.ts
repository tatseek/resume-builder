import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { resumeData, jobDescription } = await req.json();

    const prompt = `You are a professional resume consultant. A user wants to tailor their resume for a specific job.

Here is their resume data:
- Summary: ${resumeData.summary}
- Skills: ${resumeData.skills.join(', ')}
- Experience: ${resumeData.experience.map((e: { role: string; company: string; bullets: string[] }) => `${e.role} at ${e.company}: ${e.bullets.join('; ')}`).join('\n')}

Here is the job description they are applying to:
${jobDescription}

Your task:
1. Rewrite the summary (2-3 sentences) to align with this specific role and job description. Keep it professional and first-person free (no "I").
2. From the skills list provided, select ONLY the skills that are relevant to this job description. Do not add new skills that weren't in the original list.
3. Reorder the selected skills so the most relevant ones appear first.

Respond ONLY with valid JSON in this exact format, no markdown, no extra text:
{
  "tailoredSummary": "rewritten summary here",
  "tailoredSkills": ["skill1", "skill2", "skill3"]
}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    const cleaned = content.text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Tailor API error:', error);
    return NextResponse.json({ error: 'Failed to tailor resume' }, { status: 500 });
  }
}
