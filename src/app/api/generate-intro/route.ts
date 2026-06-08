import { NextRequest, NextResponse } from 'next/server';
import { generateMatchIntro, getAlgorithmicIntro } from '@/lib/aiService';

export async function POST(req: NextRequest) {
  try {
    const { customer, match, score } = await req.json();

    if (
      !process.env.GEMINI_API_KEY ||
      process.env.GEMINI_API_KEY.includes('your-key')
    ) {
      return NextResponse.json({
        intro: getAlgorithmicIntro(customer, match, score),
        simulated: true,
      });
    }

    const intro = await generateMatchIntro(customer, match, score);
    return NextResponse.json({ intro });
  } catch (error) {
    console.error('API Router Error:', error);
    return NextResponse.json(
      { error: 'Failed to process matching insight context' },
      { status: 500 }
    );
  }
}
