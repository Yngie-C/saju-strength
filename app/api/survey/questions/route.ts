import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { SURVEY_QUESTIONS, BASIC_QUESTIONS, PREMIUM_QUESTIONS } from '@/lib/survey-questions';

export async function GET(request: NextRequest) {
  const tier = request.nextUrl.searchParams.get('tier');
  let questions = SURVEY_QUESTIONS;
  if (tier === 'basic') questions = BASIC_QUESTIONS;
  else if (tier === 'premium') questions = PREMIUM_QUESTIONS;

  return NextResponse.json({
    questions,
    total: questions.length,
    tier: tier || 'all',
  });
}
