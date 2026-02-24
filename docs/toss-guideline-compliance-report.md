# 앱인토스 개발 가이드라인 준수 검토 — 최종 보고서

> **검토일**: 2026-02-24
> **대상**: saju-strength 코드베이스
> **검토 기준**: 앱인토스 개발 가이드라인 (프로젝트 설정, TDS, 인증, API/네트워크, 출시/배포, 다크패턴, 모니터링)
> **합의 방식**: Planner(초안) → Architect(검증, CONDITIONAL_APPROVE) → Critic(감사, APPROVE 조건부)
> **현재 상태 판정: 출시 불가 (CRITICAL 5건 미해결)**

---

## 1. 종합 요약

| 심각도 | 건수 | 설명 |
|:---:|:---:|------|
| **CRITICAL** | **5건** | 출시 불가 / 심사 반려 사유 |
| **WARNING** | **7건** | 권장사항 미준수, 향후 문제 가능 |
| **INFO** | **2건** | 개선 권장, best practice |

### 심각도 조정 이력 (3자 합의)

| 원래 ID | Planner 초안 | Architect 재조정 | Critic 최종 | 사유 |
|---------|:-----------:|:---------------:|:-----------:|------|
| C-1 (web-framework) | CRITICAL | **WARNING** | **WARNING** | 패키지가 transitive dependency로 이미 존재. 명시적 선언만 추가 |
| C-5 (CORS) | CRITICAL | **WARNING** | **WARNING** | 환경변수로 이미 구성 가능한 설계 |
| C-6 (CTA TDS) | CRITICAL | **WARNING** | **WARNING** | 기능 장애 아닌 디자인 불일치, 빠른 수정 가능 |
| W-2 (initTossApp) | WARNING | **CRITICAL** | **CRITICAL** | 앱 라이프사이클 초기화 누락은 기능 장애 |
| W-3 (동의 UI) | WARNING | WARNING | **CRITICAL** | 흰 배경에 흰 텍스트 = 법적 요구사항(개인정보 동의) 기능 불가 |
| W-5 (ait init) | WARNING | **INFO** | **INFO** | 사후 실행 시 기존 설정 충돌 위험 |

---

## 2. CRITICAL 위반사항 (5건)

---

### C-1. `initTossApp()` / `registerApp` 호출 누락

> _Architect가 WARNING→CRITICAL 승격. 3자 합의 확정._

**관련 가이드라인:**
> "AppsInToss.registerApp은 서비스의 기본 환경을 설정하고, appName만 전달해도 파일 기반 라우팅, 쿼리 파라미터 처리, 뒤로 가기, 화면 가시성 감지 등 핵심 기능을 즉시 사용할 수 있습니다."

**현재 문제:**
- `lib/toss.ts:18-27`: `initTossApp()` 함수가 정의만 되어 있음
- `app/layout.tsx`, `components/adaptive/TDSProvider.tsx` **어디에서도 호출하지 않음**
- 코드베이스 전체 검색: `initTossApp`을 호출하는 곳이 **정의 이외에 존재하지 않음** (Architect 실증 확인)

**영향:**
- 토스 앱에서 백 버튼 이벤트, 딥링크 처리, 앱 상태 관리 **모두 동작 불가**
- SDK 기능 (IAP, 공유, 푸시 등) 전체 비활성화

**수정 방향:**
- `TDSProvider.tsx` 또는 `layout.tsx` 내 클라이언트 컴포넌트에서 `initTossApp()` 호출 추가
- 앱 최초 마운트 시 1회 호출 보장 (`useEffect` 활용)

**작업량: S** (1시간)

---

### C-2. mTLS (Mutual TLS) 통신 미구현 + Vercel 아키텍처 제약

**관련 가이드라인:**
> "mTLS(Mutual TLS) 기반 Server-to-Server 통신이 필수입니다. 파트너 서버와 앱인토스 서버 간 통신을 암호화하고 양측 신원을 검증합니다."
> mTLS 인증서가 필요한 기능: 토스 로그인, 토스 페이, 인앱 결제, 기능성 푸시/알림, 프로모션

**현재 문제:**
- `app/api/auth/toss-token/route.ts:16-21`: mTLS 코드가 주석 처리된 TODO placeholder
  ```typescript
  // TODO: mTLS 인증서 설정 후 활성화
  // const agent = new https.Agent({ cert: ..., key: ... });
  ```
- 라인 34: Production 경로에서도 mTLS agent 없이 plain `fetch` 호출
- 라인 51: `login-me` 사용자 정보 조회도 mTLS 없이 호출
- **N-4 (Architect 추가)**: `TOSS_MTLS_CERT` 환경변수 설정만으로는 mTLS가 동작하지 않음 — agent 구성 코드가 주석 처리 상태

**Vercel 서버리스 아키텍처 제약 (Architect/Critic 보완):**

Vercel의 Node.js 18+ 환경에서 `fetch`는 undici 기반이며, `agent` 옵션을 직접 지원하지 않습니다. mTLS 구현을 위한 대안 아키텍처:

| 대안 | 장점 | 단점 | 비용 | 지연시간 |
|------|------|------|------|---------|
| **A) Vercel + `node-fetch`** | 인프라 단순, 추가 서버 불필요 | undici 우회 의존, cold start 영향 미확인 | 낮음 | 낮음 |
| **B) 별도 mTLS 프록시** (AWS Lambda/Cloud Run) | mTLS 구현 깔끔, Vercel 제약 회피 | 인프라 비용 증가, 배포 복잡도 증가 | 중간 | +50~200ms |
| **C) Vercel Edge Functions** | 저지연 | mTLS 지원 여부 미확인 | 낮음 | 낮음 |

> **Critic 경고**: 이 아키텍처 결정이 지연되면 Phase C 전체(C-2, C-3, W-5)가 블로킹됩니다. 우선적으로 Vercel mTLS 지원 여부를 검증해야 합니다.

**수정 방향:**
1. Vercel Serverless에서 `node-fetch` + `https.Agent` mTLS 지원 여부 사전 검증
2. 불가 시 Option B(별도 프록시) 또는 Option C(Edge) 선택
3. mTLS 인증서를 환경변수(Base64)로 관리하는 체계 구축

**작업량: L** (3~5일, 아키텍처 결정 포함)

---

### C-3. 토스 인증 3대 필수 구현 누락

**관련 가이드라인:**
> OAuth 2.0: accessToken 유효기간 약 1시간, refreshToken 14일
> "모든 개인정보는 암호화된 형태로 제공" (AES-256-GCM)
> 연결 해제 콜백: referrer 값으로 UNLINK, WITHDRAWAL_TERMS, WITHDRAWAL_TOSS 구분

**현재 문제:**

**(a) refreshToken 처리 없음**
- `lib/hooks/useTossAuth.ts:61-105`: `login()` 함수에 refreshToken 관련 로직 전혀 없음
- `app/api/auth/toss-token/route.ts:64-68`: 서버 응답에서 refreshToken을 클라이언트에 전달하지 않음
- accessToken 만료(1시간) 후 **재인증 불가, 사용자 세션 끊김**

**(b) AES-256-GCM 복호화 미구현**
- `app/api/auth/toss-token/route.ts:62`: `userData`를 암호화된 채로 사용
- 코드베이스 전체에 `AES`, `decrypt`, `crypto`, `cipher` 관련 구현 **전무** (Architect grep 확인)
- 암호화된 사용자 정보(이름, 전화번호, 생일 등)를 **처리할 수 없는 상태**

**(c) 로그인 연결 해제 콜백 미구현**
- 사용자가 토스 앱에서 "사주강점" 연결 해제 시 수신할 콜백 엔드포인트 없음
- `disconnect`, `unlink` 관련 핸들러 **미구현** (Architect grep 확인)
- 데이터 삭제 의무 불이행 소지

**수정 방향:**
1. `/api/auth/toss-refresh` — refreshToken 갱신 엔드포인트 구현
2. 서버 사이드 AES-256-GCM 복호화 모듈 구현 (콘솔 제공 복호화 키 + AAD 사용)
3. `/api/auth/toss-disconnect` — 연결 해제 콜백 엔드포인트 구현 (Basic Auth 검증 포함)

**작업량: L** (1~2주)

---

### C-4. `granite build` 미사용 (CRITICAL, 조건부)

**관련 가이드라인:**
> "`granite build` 실행 시 결과물이 `outdir` 경로와 일치해야 합니다."

**현재 문제:**
- `package.json:11`: `"build:toss": "bash -c '... NEXT_PUBLIC_BUILD_TARGET=toss next build'"` — `next build` 직접 호출
- `granite build` 미사용으로 인해:
  1. 앱인토스 번들 크기 제한 검증 미수행
  2. micro-frontend manifest 생성 누락
  3. `granite.config.ts`가 빌드에 통합되지 않음 (dead code)

**근본 원인 (Architect 분석):**
> 앱인토스 공식 빌드 파이프라인(`granite build` + `defineConfig`)을 우회하고 Next.js static export로 대체한 아키텍처 결정이 다수 위반사항의 근본 원인입니다.

**미확인 사항 (Critic 보완):**
- `granite build`가 `next build`를 내부 호출하는지, 별도 빌드 파이프라인인지 불명확
- `app/p` 디렉터리 이동 해킹(`build:toss` 스크립트)이 `granite build` 도입 시 호환되는지 미확인
- 이 판단에 따라 작업량이 M → L로 증가할 수 있음

**수정 방향:**
1. 토스 개발자 문서/커뮤니티에서 `granite build` + Next.js static export 양립성 확인
2. `granite.config.ts`를 `defineConfig`로 재작성 (C-1의 WARNING 항목과 병행)
3. `build:toss` 스크립트를 `granite build` 기반으로 전환

**작업량: M~L** (2~5일, 양립성 확인 결과에 따라)

---

### C-5. 개인정보 동의 UI 토스 빌드에서 기능 불가

> _Critic가 WARNING→CRITICAL 승격. "법적 요구사항이 기능적으로 불가능한 상태"._

**현재 문제:**
- `app/birth-info/page.tsx:135-167`: 개인정보 동의 UI에 `IS_TOSS` 분기가 **전혀 없음**
  - 라인 135: `border-white/10 bg-white/[0.03]` → 토스 흰 배경에서 배경과 **구분 불가**
  - 라인 141: `border-white/30` → 체크박스 경계선 **불가시**
  - 라인 153: `text-white/80` → 흰 배경에 흰 텍스트 = **동의 내용 읽기 불가능**
  - 라인 156: `text-white/40` → 수집 항목 설명 **완전 불가시**
  - 라인 189: `text-white/30` → 안내 문구 **불가시**

**영향:**
- 사용자가 동의 내용을 읽을 수 없음 → **개인정보보호법 위반 소지**
- 토스 심사에서 **반려 사유**

**수정 방향:**
1. 동의 UI 영역 전체에 `IS_TOSS` 분기 스타일 추가
2. TDS 라이트 테마: `text-tds-grey-900`, `border-tds-grey-300`, `bg-tds-grey-50` 등 적용
3. `AdaptiveCheckbox` 컴포넌트 활용 검토

**작업량: S** (1시간)

---

## 3. WARNING 위반사항 (7건)

| # | 항목 | 현재 코드 | 수정 방향 | 작업량 |
|---|------|----------|----------|:---:|
| W-1 | `@apps-in-toss/web-framework` `package.json` 명시적 선언 없음 + `defineConfig` 미사용 | `package.json`에 없음 (transitive로만 존재), `granite.config.ts`에서 plain object | `package.json`에 명시적 추가, `granite.config.ts`에 `defineConfig` 적용 + `brand`/`web`/`permissions` 필수 필드 | S |
| W-2 | CORS Origin fallback 도메인 부정확 | `middleware.ts:5`: `'https://apps-in-toss.com'` | `.env.production`에 `NEXT_PUBLIC_TOSS_ORIGIN=https://saju-strength.apps.tossmini.com` 설정 | S |
| W-3 | 랜딩 CTA/타이틀 TDS 미적용 | `app/page.tsx:82-86,103,234`: `styles.ctaButton`/`heroTitle` 정의했지만 미사용 | 정의된 styles 객체 실제 적용 | S |
| W-4 | Sentry 모니터링 미설정 | 패키지 미설치, 초기화 코드 없음 | `@granite-js/plugin-sentry` 설치 + 초기화 (`enableNative: false`, `useClient: false`) | M |
| W-5 | accessToken localStorage 평문 저장 | `useTossAuth.ts:85-89`: JSON 평문 저장 | httpOnly cookie 또는 메모리 내 저장으로 전환 (토스 WebView는 앱 샌드박스이나 XSS 방어 권장) | M |
| W-6 | CSP 헤더 미설정 _(Architect 추가)_ | `middleware.ts`에 CORS만, CSP 없음 | 기본 CSP 헤더 추가 (XSS 방어) | S |
| W-7 | 히어로 타이틀 `styles.heroTitle` 미적용 _(Architect 추가)_ | `app/page.tsx:82-86`: IS_TOSS에서도 gradient 유지 | `styles.heroTitle` (`text-tds-grey-900`) 실제 적용 | S |

---

## 4. INFO 사항 (2건)

| # | 항목 | 비고 |
|---|------|------|
| I-1 | `ait init` 미실행 | 이미 수동 구성 완료. 사후 실행 시 기존 설정 충돌 가능, 누락 요소를 개별적으로 추가하는 것이 안전 |
| I-2 | `trailingSlash: true`와 앱인토스 딥링크 호환성 | `next.config.js:18`, 앱인토스 스킴(`intoss://saju-strength/path`)과의 호환성 샌드박스에서 확인 필요 |

---

## 5. 다크패턴 검사 결과: **통과** (3자 합의)

| # | 금지 패턴 | 해당 여부 | 근거 |
|:---:|------|:---:|------|
| 1 | 서비스 진입 시 강제 바텀시트 (알림 동의 포함) | **해당 없음** | 바텀시트 컴포넌트 없음. 알림 동의 강제 팝업 없음 |
| 2 | 뒤로가기 버튼 시 알림 유도 바텀시트 | **해당 없음** | 백 버튼 인터셉트 코드 미구현. 알림 유도 UI 없음 |
| 3 | 거절 불가능한 선택지 구조 | **해당 없음** | `birth-info/page.tsx`: 동의 체크 안 하면 폼 비활성화(`isLoading \|\| !hasConsented`) → 거절 가능 |
| 4 | 예상 외 전면 광고 노출 | **해당 없음** | 광고 SDK 미설치. 광고 관련 코드 없음 |
| 5 | 모호한 CTA 버튼 | **해당 없음** | CTA 텍스트 `"무료로 시작하기"` (라인 105) — 명확함 |

> **주의**: 향후 푸시 알림/리뷰 유도 구현 시 1번/2번 항목 재점검 필요

---

## 6. 기존 계획서 검토 (`.omc/plans/apps-in-toss-launch-strategy.md`)

| 계획서 섹션 | 이슈 | 심각도 |
|------------|------|:---:|
| 2.1.7 CORS 미들웨어 | 라인 356에서 `https://apps-in-toss.com`으로 잘못 기재. 올바른 도메인은 `https://<appName>.apps.tossmini.com` | WARNING |
| 2.1.5 granite.config.ts | 코드 예시에서 `brand`, `web`, `permissions` 필수 필드 누락 | WARNING |
| 2.1.2 빌드 파이프라인 | `granite build` 사용 언급 없음. `next build`만 기술 | CRITICAL |
| 2.2.4 백 버튼 처리 | 설문 중 백 버튼 인터셉트는 다크패턴 2번에 저촉 가능 → "진행상황 저장됨" 안내로 제한해야 함 | WARNING |
| 2.5.3 푸시 알림 | "미완료 리마인더" 푸시가 사전 동의 없이 발송될 경우 다크패턴 1번 해당 가능 | WARNING |

---

## 7. 근본 원인 분석 (Architect)

> 앱인토스 공식 빌드 파이프라인(`granite build` + `defineConfig`)을 우회하고 **Next.js static export로 대체한 아키텍처 결정**이 다수 위반사항의 근본 원인입니다.

이로 인해:
1. SDK 라이프사이클 초기화(`initTossApp`/`registerApp`)가 빌드에 자동 통합되지 않아 수동 호출이 필요한데 이를 누락 (C-1)
2. `granite.config.ts`가 실제 빌드에 연결되지 않아 dead code가 됨 (C-4)
3. mTLS, 인증, 번들 크기 등 `granite build`가 자동 처리하는 사항들을 모두 수동 구현해야 하는 부담 발생 (C-2, C-3)

---

## 8. 이중 배포 아키텍처 리스크 (Architect)

| 리스크 | 설명 | 영향도 |
|--------|------|:---:|
| Static Export vs API Route | 토스 빌드(`output: 'export'`)에서 API 라우트 미생성 → `NEXT_PUBLIC_API_BASE_URL`로 절대 URL 설정 필요 (현재 올바르게 구현됨) | 낮음 |
| `granite build` + Next.js 호환성 | `granite build`가 Next.js static export `out/` 디렉터리를 패키징할 수 있는지 미확인 | 높음 |
| `app/p` 디렉터리 이동 해킹 | `build:toss` 스크립트에서 `app/p`를 임시 이동하는 방식은 `granite build` 도입 시 호환 불가 가능 | 중간 |

---

## 9. 권장 실행 순서 (3자 합의 반영)

### Phase A — 즉시 수정 (1~2일)

| 순서 | 항목 | 파일 | 작업량 |
|:---:|------|------|:---:|
| **1 (최우선)** | C-1: `initTossApp()` 호출 추가 | `TDSProvider.tsx` 또는 `layout.tsx` | S |
| 2 | C-5: 개인정보 동의 UI TDS 분기 | `app/birth-info/page.tsx:135-167` | S |
| 3 | W-2: CORS Origin `.env.production` 설정 | `.env.production` | S |
| 4 | W-3 + W-7: CTA/타이틀 styles 적용 | `app/page.tsx` | S |
| 5 | W-6: CSP 헤더 추가 | `middleware.ts` | S |

### Phase B — 프로젝트 설정 (3~5일)

| 순서 | 항목 | 비고 |
|:---:|------|------|
| 6 | W-1: `package.json`에 web-framework 명시 + `defineConfig` 적용 | `granite.config.ts` 리팩터 |
| 7 | C-4: `granite build` 파이프라인 통합 | 토스 측 양립성 확인 선행. Sentry보다 먼저 |
| 8 | W-4: Sentry 연동 | granite build 이후 sourcemap 자동 업로드 가능 |

### Phase C — 서버 핵심 (1~2주)

| 순서 | 항목 | 비고 |
|:---:|------|------|
| 9 | C-2: mTLS 아키텍처 결정 + 구현 | Vercel 제약 사전 검증 필수 (Phase C 블로커) |
| 10 | C-3: 토스 인증 완성 (refreshToken, AES-256-GCM, 연결해제) | mTLS 선행 필요 |
| 11 | W-5: 토큰 저장 보안 개선 | C-3과 병행 |

### Phase D — 검증 (2~3일)

| 순서 | 항목 |
|:---:|------|
| 12 | 번들 용량 100MB 이하 확인 |
| 13 | 샌드박스 앱 테스트 (1회 이상 필수) |
| 14 | I-2: trailingSlash 딥링크 호환성 확인 |

---

## 부록 A: 검토 대상 파일 목록

| 파일 | 관련 위반 |
|------|---------|
| `package.json` | W-1 |
| `granite.config.ts` | W-1, C-4 |
| `middleware.ts` | W-2, W-6 |
| `app/page.tsx` | W-3, W-7 |
| `app/api/auth/toss-token/route.ts` | C-2, C-3 |
| `lib/hooks/useTossAuth.ts` | C-3, W-5 |
| `lib/toss.ts` | C-1 |
| `app/birth-info/page.tsx` | C-5 |
| `app/layout.tsx` | C-1 |
| `components/adaptive/TDSProvider.tsx` | C-1 |
| `next.config.js` | C-4 |

## 부록 B: 참조 가이드라인 문서

- [WebView 개발하기](https://developers-apps-in-toss.toss.im/tutorials/webview.html)
- [다크패턴 방지 정책](https://developers-apps-in-toss.toss.im/design/consumer-ux-guide.html)
- [토스 로그인 이해하기](https://developers-apps-in-toss.toss.im/login/intro.html)
- [토스 로그인 개발하기](https://developers-apps-in-toss.toss.im/login/develop.html)
- [API 사용하기 (mTLS)](https://developers-apps-in-toss.toss.im/development/integration-process.html)
- [미니앱 출시](https://developers-apps-in-toss.toss.im/development/deploy.html)
- [AI 개발 가이드](https://developers-apps-in-toss.toss.im/development/llms.html)
- [TDS Mobile](https://tossmini-docs.toss.im/tds-mobile/)
- [샌드박스 테스트](https://developers-apps-in-toss.toss.im/development/test/sandbox.html)
- [Sentry 모니터링](https://developers-apps-in-toss.toss.im/learn-more/sentry-monitoring.html)
- [Firebase 연동](https://developers-apps-in-toss.toss.im/firebase/intro.html)
