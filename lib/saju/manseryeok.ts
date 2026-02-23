import type { BirthInput, FourPillars, Pillar, HeavenlyStem, EarthlyBranch } from '@/types/saju';
import { getStemElement, getBranchElement, getStemYinYang } from './element-map';

function parsePillarHanja(hanja: string): { stem: HeavenlyStem; branch: EarthlyBranch } {
  return {
    stem: hanja[0] as HeavenlyStem,
    branch: hanja[1] as EarthlyBranch,
  };
}

function buildPillar(hanja: string): Pillar {
  const { stem, branch } = parsePillarHanja(hanja);
  return {
    stem,
    branch,
    stemElement: getStemElement(stem),
    branchElement: getBranchElement(branch),
    stemYinYang: getStemYinYang(stem),
  };
}

export async function calculateFourPillars(input: BirthInput): Promise<FourPillars> {
  // Dynamic import required: @fullstackfamily/manseryeok is ESM-only
  const manseryeok = await import('@fullstackfamily/manseryeok');

  let year = input.year;
  let month = input.month;
  let day = input.day;

  // 음력 → 양력 변환
  if (input.isLunar) {
    const converted = manseryeok.lunarToSolar(year, month, day);
    year = converted.solar.year;
    month = converted.solar.month;
    day = converted.solar.day;
  }

  let result;
  if (input.hour !== null) {
    // 시간 보정 없이 계산 (입력 시각 그대로)
    result = manseryeok.calculateSajuSimple(year, month, day, input.hour);
  } else {
    // 시주 미지정: 시간 파라미터 없이 호출 → hourPillar = null
    result = manseryeok.calculateSajuSimple(year, month, day);
  }

  const yearPillar = buildPillar(result.yearPillarHanja);
  const monthPillar = buildPillar(result.monthPillarHanja);
  const dayPillar = buildPillar(result.dayPillarHanja);
  const hourPillar =
    result.hourPillarHanja !== null
      ? buildPillar(result.hourPillarHanja)
      : null;

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
  };
}
