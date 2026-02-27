"use client";

import { useEffect, useState } from "react";
import { SajuAnalysis, CombinedAnalysis } from "@/types/saju";
import { BriefAnalysis } from "@/types/survey";
import { apiUrl } from "@/lib/config";
import { shareResult } from '@/lib/share';
import { getStateManager } from '@/lib/state-manager';

export interface ResultData {
  sajuResult: SajuAnalysis | null;
  psaResult: BriefAnalysis | null;
  combined: CombinedAnalysis | null;
  loading: boolean;
  error: string | null;
  sessionId: string;
  shareStatus: "idle" | "copied" | "shared";
  handleShare: () => Promise<void>;
}

export function useResultData(): ResultData {
  const [sajuResult, setSajuResult] = useState<SajuAnalysis | null>(null);
  const [psaResult, setPsaResult] = useState<BriefAnalysis | null>(null);
  const [combined, setCombined] = useState<CombinedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared">("idle");
  const [sessionId, setSessionId] = useState<string>('');

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

      const sid = parsedSaju.sessionId ?? crypto.randomUUID();
      setSessionId(sid);

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
    })();
  }, []);

  const handleShare = async () => {
    const personaTitle = psaResult?.persona?.title || '강점 분석';
    const result = await shareResult({
      title: `사주강점 - ${personaTitle}`,
      description: '나의 사주-강점 교차 분석 결과를 확인해보세요!',
      path: '/result',
    });

    if (result === 'copied') {
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 2000);
    } else if (result === 'shared') {
      setShareStatus('shared');
    }
  };

  return { sajuResult, psaResult, combined, loading, error, sessionId, shareStatus, handleShare };
}
