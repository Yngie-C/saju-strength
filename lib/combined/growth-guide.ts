import { AxisAnalysis } from '@/types/saju';

export interface GrowthGuide {
  summary: string;
  focusAreas: Array<{ area: string; advice: string }>;
  dailyPractice: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  innovation: '혁신 사고',
  influence: '대인 영향',
  collaboration: '협업 공감',
  execution: '철저 실행',
  resilience: '상황 회복',
};

const POTENTIAL_ADVICE: Record<string, string> = {
  innovation: '창의적 프로젝트에 도전하고, 아이디어를 글로 기록하는 습관을 만들어보세요. 타고난 잠재력이 경험을 통해 꽃필 것입니다.',
  influence: '소규모 발표나 팀 내 공유 기회를 적극적으로 찾아보세요. 당신 안의 카리스마가 더 많은 사람들과 만날 준비가 되어 있습니다.',
  collaboration: '팀 프로젝트에서 의견 조율 역할을 맡아보세요. 타고난 공감 능력이 강력한 협업 역량으로 발현될 것입니다.',
  execution: '하루 하나씩 작은 목표를 완수하는 루틴을 만들어보세요. 타고난 집중력이 철저한 실행력으로 전환될 것입니다.',
  resilience: '어려운 상황을 성장의 기회로 재해석하는 일기를 써보세요. 깊은 내면의 힘이 위기 대응력으로 발현될 것입니다.',
};

const UNDEVELOPED_ADVICE: Record<string, string> = {
  innovation: '주 1회 새로운 방식으로 익숙한 문제를 풀어보는 시간을 가져보세요. 작은 창의적 시도들이 혁신 사고의 근육을 키웁니다.',
  influence: '한 명에게라도 자신의 생각을 명확하게 전달하는 연습을 매일 해보세요. 영향력은 작은 설득에서부터 시작됩니다.',
  collaboration: '동료의 이야기를 끝까지 듣고 요약해주는 습관을 들여보세요. 경청이 협업의 가장 강력한 도구입니다.',
  execution: '오늘 할 일 3가지를 정하고 반드시 완수하는 것부터 시작하세요. 작은 완주 경험이 실행력의 기반이 됩니다.',
  resilience: '실패를 기록하고 거기서 배운 점을 적어두는 습관을 만들어보세요. 회복력은 실패를 다루는 방식에서 자랍니다.',
};

const ALIGNMENT_ADVICE: Record<string, string> = {
  innovation: '이미 강점인 혁신 사고를 더욱 날카롭게 다듬어보세요. 업계 트렌드를 앞서 파악하고, 아이디어를 체계화하는 방법을 익히세요.',
  influence: '현재의 영향력을 더 넓은 무대에서 발휘해보세요. 멘토링이나 강연 활동을 통해 당신의 통찰을 더 많은 사람과 나누세요.',
  collaboration: '협업 강점을 살려 팀 내 문화 형성에 기여해보세요. 갈등 중재나 팀 빌딩 역할을 맡아 리더십을 확장하세요.',
  execution: '탁월한 실행력을 팀 전체의 성과로 연결해보세요. 실행 프로세스를 문서화하고 공유하여 조직의 역량을 높이세요.',
  resilience: '회복력을 개인을 넘어 팀의 자산으로 만들어보세요. 위기 상황에서 팀원들을 안정시키는 역할을 적극적으로 맡아보세요.',
};

const DAILY_PRACTICES: Record<string, string> = {
  potential: '매일 아침 "오늘 하나의 잠재력을 발현한다"는 의도를 설정하고, 저녁에 실제로 시도한 것을 기록해보세요.',
  undeveloped: '주 3회, 성장 영역 중 하나에 15분씩 집중적으로 투자하는 연습 시간을 만들어보세요.',
  alignment: '강점 영역을 매일 한 번씩 의식적으로 활용하고, 그 효과를 짧게 기록하여 강점을 더욱 날카롭게 다듬어보세요.',
  developed: '노력으로 만든 역량을 꾸준히 유지하기 위해, 매주 해당 역량을 활용한 성공 사례를 돌아보고 다음 주 목표를 설정하세요.',
  default: '매일 저녁 5분씩 오늘 발휘한 강점과 더 발전시킬 영역을 기록하는 성장 일기를 써보세요.',
};

export function generateGrowthGuide(axes: AxisAnalysis[], archetypeName: string): GrowthGuide {
  const potentials = axes.filter(a => a.type === 'potential');
  const undeveloped = axes.filter(a => a.type === 'undeveloped');
  const alignments = axes.filter(a => a.type === 'alignment');
  const developed = axes.filter(a => a.type === 'developed');

  // summary 생성
  const alignmentNames = alignments.map(a => CATEGORY_LABELS[a.psaCategory] ?? a.psaCategory).join(', ');
  const potentialNames = potentials.map(a => CATEGORY_LABELS[a.psaCategory] ?? a.psaCategory).join(', ');
  const undevelopedNames = undeveloped.map(a => CATEGORY_LABELS[a.psaCategory] ?? a.psaCategory).join(', ');

  let summaryParts: string[] = [];

  if (archetypeName) {
    summaryParts.push(`${archetypeName} 유형인 당신의 성장 로드맵입니다.`);
  }

  if (alignments.length > 0) {
    summaryParts.push(`${alignmentNames} 영역에서 타고난 기질과 현재 역량이 완벽히 일치합니다. 이것이 당신의 핵심 무기입니다.`);
  }

  if (potentials.length > 0) {
    summaryParts.push(`${potentialNames} 영역은 타고난 잠재력이 아직 역량으로 충분히 발현되지 않은 황금 기회 구간입니다.`);
  }

  if (undeveloped.length > 0) {
    summaryParts.push(`${undevelopedNames} 영역은 새로운 성장 기회로, 작은 시도부터 시작하면 큰 변화를 만들 수 있습니다.`);
  }

  const summary = summaryParts.join(' ');

  // focusAreas 생성 (potential > undeveloped > alignment 순 우선순위)
  const focusAreas: Array<{ area: string; advice: string }> = [];

  for (const axis of potentials) {
    const label = CATEGORY_LABELS[axis.psaCategory] ?? axis.psaCategory;
    const advice = POTENTIAL_ADVICE[axis.psaCategory] ?? `${label} 영역의 타고난 잠재력을 발현하기 위한 구체적인 도전을 시작해보세요.`;
    focusAreas.push({ area: `[잠재력] ${label}`, advice });
  }

  for (const axis of undeveloped) {
    const label = CATEGORY_LABELS[axis.psaCategory] ?? axis.psaCategory;
    const advice = UNDEVELOPED_ADVICE[axis.psaCategory] ?? `${label} 영역에서 작은 성장 습관을 만들어보세요.`;
    focusAreas.push({ area: `[성장 기회] ${label}`, advice });
  }

  for (const axis of alignments) {
    const label = CATEGORY_LABELS[axis.psaCategory] ?? axis.psaCategory;
    const advice = ALIGNMENT_ADVICE[axis.psaCategory] ?? `${label} 영역의 핵심 강점을 더욱 강화하고 확장해보세요.`;
    focusAreas.push({ area: `[핵심 강점] ${label}`, advice });
  }

  for (const axis of developed) {
    const label = CATEGORY_LABELS[axis.psaCategory] ?? axis.psaCategory;
    focusAreas.push({
      area: `[노력 강점] ${label}`,
      advice: `후천적으로 키운 ${label} 역량을 꾸준히 유지하고 발전시켜나가세요.`,
    });
  }

  // dailyPractice 결정 (가장 많은 유형 기준)
  let primaryType = 'default';
  const typeCounts = {
    potential: potentials.length,
    undeveloped: undeveloped.length,
    alignment: alignments.length,
    developed: developed.length,
  };
  const maxCount = Math.max(...Object.values(typeCounts));
  if (maxCount > 0) {
    primaryType = Object.entries(typeCounts).find(([, count]) => count === maxCount)?.[0] ?? 'default';
  }

  const dailyPractice = DAILY_PRACTICES[primaryType] ?? DAILY_PRACTICES.default;

  return { summary, focusAreas, dailyPractice };
}
