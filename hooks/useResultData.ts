"use client";

import { useEffect, useRef, useState } from "react";
import { SajuAnalysis, CombinedAnalysis } from "@/types/saju";
import { BriefAnalysis } from "@/types/survey";
import { apiUrl } from "@/lib/config";
import { WEB_ORIGIN } from '@/lib/config';
import { getStateManager } from '@/lib/state-manager';
import { buildShareUrl, encodeShareData, type SharePayload } from '@/lib/share-encoder';
import { IS_TOSS } from '@/lib/platform';
import { CombinedAnalyzerAgent } from '@/agents/combined-analyzer';
import { saveResultToHistory } from '@/lib/result-history';
import { tossShare, tossShareInternal } from '@/lib/toss';
import { shareResult } from '@/lib/share';

export interface ResultData {
  sajuResult: SajuAnalysis | null;
  psaResult: BriefAnalysis | null;
  combined: CombinedAnalysis | null;
  loading: boolean;
  error: string | null;
  sessionId: string;
  userName: string | null;
  shareStatus: "idle" | "copied" | "shared" | "failed";
  handleShare: () => Promise<void>;
  handleShareToToss: () => Promise<void>;
  resetShareStatus: () => void;
}

export function useResultData(): ResultData {
  const [sajuResult, setSajuResult] = useState<SajuAnalysis | null>(null);
  const [psaResult, setPsaResult] = useState<BriefAnalysis | null>(null);
  const [combined, setCombined] = useState<CombinedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared" | "failed">("idle");
  const [sessionId, setSessionId] = useState<string>('');
  const [userName, setUserName] = useState<string | null>(null);
  const historySavedRef = useRef(false);

  useEffect(() => {
    (async () => {
      let rawSaju = sessionStorage.getItem("sajuResult");
      let rawPsa = sessionStorage.getItem("psaResult");

      // State manager fallback (toss WebView or lost sessionStorage)
      if (!rawSaju || !rawPsa) {
        const sm = getStateManager();
        if (!rawSaju) {
          const dbSaju = await sm.load('sajuResult');
          if (dbSaju) rawSaju = JSON.stringify(dbSaju);
        }
        if (!rawPsa) {
          const dbPsa = await sm.load('psaResult');
          if (dbPsa) rawPsa = JSON.stringify(dbPsa);
        }
      }

      if (!rawSaju || !rawPsa) {
        setError("분석 데이터를 찾을 수 없습니다. 처음부터 다시 시작해주세요.");
        setLoading(false);
        return;
      }

      let parsedSaju: SajuAnalysis;
      let parsedPsa: BriefAnalysis;

      try {
        parsedSaju = JSON.parse(rawSaju) as SajuAnalysis;
        parsedPsa = JSON.parse(rawPsa) as BriefAnalysis;
      } catch {
        setError("데이터 파싱에 실패했습니다. 처음부터 다시 시작해주세요.");
        setLoading(false);
        return;
      }

      setSajuResult(parsedSaju);
      setPsaResult(parsedPsa);

      // userName 로드
      const storedName = sessionStorage.getItem('userName');
      setUserName(storedName);

      // 결과 히스토리 저장 (중복 방지)
      if (!historySavedRef.current) {
        historySavedRef.current = true;
        const birthYear = sessionStorage.getItem('birthYear') ?? '';
        const birthMonth = sessionStorage.getItem('birthMonth') ?? '';
        const birthDay = sessionStorage.getItem('birthDay') ?? '';
        const birthHour = sessionStorage.getItem('birthHour');
        const genderRaw = sessionStorage.getItem('gender');
        const birthDate = birthYear && birthMonth && birthDay
          ? `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`
          : '';
        const birthTime = birthHour ? birthHour.padStart(2, '0') + ':00' : null;
        const gender = genderRaw === 'female' ? 'female' : 'male';
        const topCategories: [string, number][] = (parsedPsa.categoryScores || [])
          .slice()
          .sort((a, b) => b.normalizedScore - a.normalizedScore)
          .slice(0, 2)
          .map((cs) => [cs.category, cs.normalizedScore]);
        saveResultToHistory({
          name: storedName,
          birthDate,
          birthTime,
          gender,
          personaType: parsedPsa.persona.type,
          personaTitle: parsedPsa.persona.title,
          personaTagline: parsedPsa.persona.tagline,
          dominantElement: parsedSaju.dominantElement,
          dayMasterName: parsedSaju.dayMaster.name,
          topCategories,
        });
      }

      const sid = parsedSaju.sessionId ?? crypto.randomUUID();
      setSessionId(sid);

      if (IS_TOSS) {
        // 클라이언트 직접 분석 (API 호출 없음)
        try {
          const agent = new CombinedAnalyzerAgent();
          const result = await agent.process(
            { saju: parsedSaju, psa: parsedPsa },
            { sessionId: sid, data: {} }
          );
          if (!result.success || !result.data) {
            throw new Error(result.error || '교차 분석 실패');
          }
          // analyzedAt Date → ISO string 직렬화
          const serialized = {
            ...result.data,
            analyzedAt: result.data.analyzedAt instanceof Date
              ? result.data.analyzedAt.toISOString()
              : result.data.analyzedAt,
          } as unknown as CombinedAnalysis;
          setCombined(serialized);
          setLoading(false);
        } catch (err) {
          const msg = err instanceof Error ? err.message : '결과를 불러오는 중 문제가 생겼어요. 다시 시도해 볼까요?';
          setError(msg);
          setLoading(false);
        }
      } else {
        // 기존 API 호출 (웹 빌드)
        fetch(apiUrl("/api/combined/analyze"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sid, sajuResult: parsedSaju, psaResult: parsedPsa }),
        })
          .then(async (res) => {
            if (!res.ok) {
              const body = await res.json().catch(() => ({}));
              throw new Error((body as { error?: string }).error ?? "교차 분석 실패");
            }
            return res.json() as Promise<CombinedAnalysis>;
          })
          .then((data) => {
            setCombined(data);
            setLoading(false);
          })
          .catch((err: unknown) => {
            const msg = err instanceof Error ? err.message : "알 수 없는 오류";
            setError(msg);
            setLoading(false);
          });
      }
    })();
  }, []);

  const handleShare = async () => {
    const personaTitle = psaResult?.persona?.title || '강점 분석';
    const personaType = psaResult?.persona?.type || '';
    const personaTagline = psaResult?.persona?.tagline || '';
    const dominantElement = sajuResult?.dominantElement || '';
    const dayMasterName = sajuResult?.dayMaster?.name || '';

    // Top 2 categories by score
    const topCategories: [string, number][] = (psaResult?.categoryScores || [])
      .slice()
      .sort((a, b) => b.normalizedScore - a.normalizedScore)
      .slice(0, 2)
      .map((cs) => [cs.category, cs.normalizedScore]);

    const payload: SharePayload = {
      v: 1,
      pt: personaType,
      tt: personaTitle,
      tg: personaTagline,
      de: dominantElement,
      dm: dayMasterName,
      tc: topCategories,
    };

    if (IS_TOSS) {
      const namePrefix = userName ? `${userName}님의` : '나의';
      const topStr = topCategories.map(([cat, score]) => `${cat} ${Math.round(score)}점`).join(', ');
      const displayText = [
        `${namePrefix} 사주강점: ${personaTitle}!`,
        `일간: ${dayMasterName} | 주요 오행: ${dominantElement}`,
        `Top 강점: ${topStr}`,
      ].join('\n');

      const encoded = encodeShareData(payload);
      const schemeUrl = `intoss://saju-strength/shared?d=${encoded}`;
      const deepLinkSuccess = await tossShareInternal(schemeUrl, displayText);

      if (deepLinkSuccess) {
        setShareStatus('shared');
        return;
      }

      // 2차: shareResult 폴백 (tossShare → Web Share → clipboard 체인)
      const result = await shareResult({
        title: `사주강점 - ${personaTitle}`,
        description: displayText,
      });

      if (result === 'copied') {
        setShareStatus('copied');
      } else if (result === 'shared') {
        setShareStatus('shared');
      } else {
        setShareStatus('failed');
      }
      return;
    }

    const shareUrl = buildShareUrl(payload);
    const sharePath = shareUrl.replace(WEB_ORIGIN, '');

    const result = await shareResult({
      title: `사주강점 - ${personaTitle}`,
      description: `나는 ${personaTitle}! 사주강점 분석 결과를 확인해보세요`,
      path: sharePath,
    });

    if (result === 'copied') {
      setShareStatus('copied');
    } else if (result === 'shared') {
      setShareStatus('shared');
    } else if (result === 'failed') {
      setShareStatus('failed');
    }
  };

  const handleShareToToss = async () => {
    await handleShare();
  };

  const resetShareStatus = () => setShareStatus('idle');

  return { sajuResult, psaResult, combined, loading, error, sessionId, userName, shareStatus, handleShare, handleShareToToss, resetShareStatus };
}
