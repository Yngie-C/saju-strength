import { NextResponse } from 'next/server';
import { SURVEY_QUESTIONS } from '@/lib/survey-questions';

export async function GET() {
  return NextResponse.json({
    questions: SURVEY_QUESTIONS,
    total: SURVEY_QUESTIONS.length,
  });
}
