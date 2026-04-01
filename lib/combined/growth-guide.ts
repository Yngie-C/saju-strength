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

export function generateGrowthGuide(
  axes: AxisAnalysis[],
  archetypeName: string,
  dayMasterInfo?: { keywords: string[]; weaknesses: string[] }
): GrowthGuide {
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
    let advice = POTENTIAL_ADVICE[axis.psaCategory] ?? `${label} 영역의 타고난 잠재력을 발현하기 위한 구체적인 도전을 시작해보세요.`;
    if (dayMasterInfo?.keywords?.[0]) {
      advice += ` ${archetypeName} 유형의 ${dayMasterInfo.keywords[0]} 특성을 살려 더욱 빠르게 성장할 수 있습니다.`;
    }
    focusAreas.push({ area: `[잠재력] ${label}`, advice });
  }

  for (const axis of undeveloped) {
    const label = CATEGORY_LABELS[axis.psaCategory] ?? axis.psaCategory;
    let advice = UNDEVELOPED_ADVICE[axis.psaCategory] ?? `${label} 영역에서 작은 성장 습관을 만들어보세요.`;
    if (dayMasterInfo?.keywords?.[0]) {
      advice += ` ${archetypeName} 유형의 ${dayMasterInfo.keywords[0]} 특성을 살려 더욱 빠르게 성장할 수 있습니다.`;
    }
    focusAreas.push({ area: `[성장 기회] ${label}`, advice });
  }

  for (const axis of alignments) {
    const label = CATEGORY_LABELS[axis.psaCategory] ?? axis.psaCategory;
    let advice = ALIGNMENT_ADVICE[axis.psaCategory] ?? `${label} 영역의 핵심 강점을 더욱 강화하고 확장해보세요.`;
    if (dayMasterInfo?.keywords?.[0]) {
      advice += ` ${archetypeName} 유형의 ${dayMasterInfo.keywords[0]} 특성을 살려 더욱 빠르게 성장할 수 있습니다.`;
    }
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

  let dailyPractice = DAILY_PRACTICES[primaryType] ?? DAILY_PRACTICES.default;
  if (dayMasterInfo?.keywords?.[0]) {
    dailyPractice += ` 특히 ${archetypeName} 유형답게 ${dayMasterInfo.keywords[0]} 특성을 의식하며 실천해보세요.`;
  }

  return { summary, focusAreas, dailyPractice };
}

const WEAKNESS_STRATEGY: Record<string, string> = {
  // 갑목 (甲木)
  '고집과 완고함': '다른 사람의 의견을 먼저 경청한 뒤 내 생각을 정리하는 습관을 들여보세요. 매일 하나의 새로운 관점을 받아들이는 연습이 도움이 됩니다.',
  '타인의 의견을 경청하지 않는 경향': '대화 중 상대방의 말을 끝까지 들은 뒤 요약해보는 훈련을 해보세요. 경청은 더 나은 결론을 이끌어냅니다.',
  '유연성 부족': '일주일에 한 번, 평소와 다른 방법으로 문제를 해결해보세요. 작은 변화가 유연한 사고의 시작입니다.',
  // 을목 (乙木)
  '우유부단한 결정': '중요한 결정은 3가지 선택지로 좁힌 뒤 24시간 내에 하나를 고르는 규칙을 세워보세요.',
  '자기 의견 표현의 어려움': '하루에 한 번, 작은 것이라도 자신의 선호를 먼저 말하는 연습을 해보세요. 의견 표현은 근육처럼 단련됩니다.',
  '의존성 경향': '혼자서 완결할 수 있는 작은 프로젝트를 시작해보세요. 독립적 성취 경험이 자신감을 키워줍니다.',
  // 병화 (丙火)
  '충동적 행동': '중요한 결정 앞에서 "10분 규칙"을 적용해보세요. 잠시 멈추는 것만으로 더 나은 선택을 할 수 있습니다.',
  '자기중심적 경향': '하루를 마무리할 때 "오늘 누군가를 위해 한 일"을 하나 떠올려보세요. 타인에 대한 관심이 관계를 깊게 합니다.',
  '지속력 부족': '목표를 작은 단계로 나누고, 각 단계를 완료할 때마다 스스로를 인정해주세요. 작은 성취가 지속력의 연료입니다.',
  // 정화 (丁火)
  '과도한 감수성으로 인한 상처': '감정 일기를 써보세요. 느낌을 글로 옮기면 객관적 거리가 생기고, 회복 속도가 빨라집니다.',
  '내향적 표현의 한계': '신뢰할 수 있는 한 사람에게 먼저 마음을 열어보세요. 표현의 시작은 안전한 관계에서 출발합니다.',
  '소심함': '매주 한 가지 작은 도전을 설정해보세요. 성공 경험이 쌓이면 자연스럽게 담대해집니다.',
  // 무토 (戊土)
  '변화에 대한 저항': '한 달에 한 번, 새로운 경험(음식, 장소, 사람)을 의도적으로 시도해보세요. 변화는 위협이 아니라 성장의 기회입니다.',
  '느린 행동력': '"일단 시작하고 수정하기" 원칙을 적용해보세요. 완벽한 준비보다 빠른 첫 걸음이 더 멀리 데려다줍니다.',
  '융통성 부족': '예상과 다른 상황이 생겼을 때 "이것도 괜찮을 수 있다"고 먼저 말해보세요. 수용이 융통성의 첫 단계입니다.',
  // 기토 (己土)
  '우유부단함': '결정이 필요할 때 장단점을 종이에 적고, 직감이 가리키는 쪽을 선택해보세요. 결정 근육은 사용할수록 강해집니다.',
  '자기 희생 과다': '"나를 먼저 챙기는 것은 이기적인 것이 아니다"라고 매일 되뇌어보세요. 건강한 자기 돌봄이 진정한 배려의 기반입니다.',
  '소극적 자기 표현': '매일 한 가지씩 자신이 잘한 일을 기록해보세요. 자기 인정이 표현의 용기로 이어집니다.',
  // 경금 (庚金)
  '독단적 판단': '결정을 내리기 전에 최소 한 사람의 의견을 구하는 습관을 들여보세요. 다양한 시각이 더 단단한 판단을 만듭니다.',
  '타협 거부': '"Win-Win" 가능성을 먼저 탐색해보세요. 양보가 아닌 더 나은 해결책을 찾는 과정으로 타협을 바라보면 달라집니다.',
  '감정 표현의 어려움': '가까운 사람에게 짧은 감사 메시지를 보내는 것부터 시작해보세요. 감정 표현은 작은 것에서 시작됩니다.',
  // 신금 (辛金)
  '과도한 완벽주의로 인한 스트레스': '"80%면 충분하다"는 기준을 의식적으로 적용해보세요. 완벽보다 완성이 더 큰 가치를 만듭니다.',
  '비판적 경향': '비판하고 싶을 때, 먼저 긍정적인 점 하나를 찾아 말해보세요. 균형 잡힌 시각이 관계를 보호합니다.',
  '결정 지연': '데드라인을 스스로 설정하고, "충분히 좋은" 결정을 내리는 연습을 해보세요. 완벽한 타이밍은 없습니다.',
  // 임수 (壬水)
  '일관성 부족': '핵심 목표 3가지를 적어두고 매주 점검해보세요. 방향이 흔들릴 때 나침반이 되어줍니다.',
  '산만한 집중력': '중요한 일을 할 때 25분 집중 + 5분 휴식의 리듬을 활용해보세요. 짧은 집중이 깊은 몰입으로 이어집니다.',
  '감정 절제의 어려움': '감정이 격해질 때 깊은 호흡 3회를 먼저 해보세요. 잠깐의 멈춤이 감정의 파도를 가라앉혀줍니다.',
  // 계수 (癸水)
  '과민한 감수성': '외부 자극이 클 때 자신만의 안전한 공간에서 회복하는 시간을 정기적으로 확보하세요. 충전이 감수성의 힘을 지켜줍니다.',
  '내성적 고립 경향': '일주일에 한 번, 편안한 사람과 짧은 대화를 나누는 시간을 만들어보세요. 연결은 고립의 해독제입니다.',
  '결단력 부족': '작은 일부터 즉시 결정하는 연습을 해보세요. 결단은 습관이 되면 점점 수월해집니다.',
};

export function generateWeaknessStrategy(weakness: string): string {
  return WEAKNESS_STRATEGY[weakness]
    ?? `${weakness}이(가) 나타날 때는 잠시 멈추고 반대 관점에서 생각해보세요. 의식적인 인지만으로도 약점은 줄어들 수 있습니다.`;
}
