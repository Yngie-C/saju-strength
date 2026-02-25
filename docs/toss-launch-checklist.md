# 앱인토스 출시 준비 종합 체크리스트

> **작성일**: 2026-02-25 (Phase 1~4 작업 반영 업데이트)
> **대상**: saju-strength (사주강점) — 비게임 미니앱
> **기준 문서**:
> - [비게임 앱 체크리스트](https://developers-apps-in-toss.toss.im/checklist/app-nongame.html)
> - [미니앱 출시 가이드](https://developers-apps-in-toss.toss.im/development/deploy.html)
> - [앱 내 기능 테스트](https://developers-apps-in-toss.toss.im/development/test/function.html)
> - 내부 가이드라인 준수 검토 보고서 (`docs/toss-guideline-compliance-report.md`)

---

## 목차

1. [출시 프로세스 개요](#1-출시-프로세스-개요)
2. [필수 체크리스트 — 현황 대조표](#2-필수-체크리스트--현황-대조표)
3. [선택 체크리스트 — 해당 기능별](#3-선택-체크리스트--해당-기능별)
4. [CRITICAL 미해결 항목](#4-critical-미해결-항목)
5. [WARNING 항목](#5-warning-항목)
6. [앱 내 기능 등록](#6-앱-내-기능-등록)
7. [배포 환경 및 테스트](#7-배포-환경-및-테스트)
8. [작업 로드맵](#8-작업-로드맵)
9. [참조 링크](#9-참조-링크)

---

## 1. 출시 프로세스 개요

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  사전 점검   │ →  │ 번들 업로드  │ →  │  테스트 1회  │ →  │  검토 요청   │ →  │    출시     │
│             │    │  (≤100MB)   │    │   이상 완료  │    │ (최대 3영업일)│    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 핵심 규칙
- 번들 용량: 압축 해제 기준 **100MB 이하** (이미지/사운드/영상 포함)
- 테스트 **1회 이상 완료** 해야 검토 요청 버튼 활성화
- 한 번에 **하나의 버전만** 제출 가능
- 검토 반려 시: 새 번들 업로드 후 재요청
- 출시 버튼 클릭 시 **전체 사용자에게 즉시 공개**

### 환경별 URL
| 환경 | URL |
|------|-----|
| 라이브 | `https://saju-strength.apps.tossmini.com` |
| QR 테스트 | `https://saju-strength.private-apps.tossmini.com` |

> 테스트/라이브 환경 간 CORS 정책 및 네트워크 동작이 상이할 수 있으므로 양쪽 모두 확인 필수

---

## 2. 필수 체크리스트 — 현황 대조표

### 2.1 접속 및 앱 내 기능

| # | 체크항목 | 상태 | 현황 및 비고 |
|---|---------|:----:|-------------|
| 1 | 미니앱이 정상적으로 실행됨 | ⚠️ | `granite build` 성공 (`.ait` 생성), 토스 환경 실제 테스트 필요 |
| 2 | 모든 서비스 기능을 미니앱에서도 동일하게 사용 가능 | ⚠️ | 웹/토스 분기 구현 완료, 실 동작 검증 필요 |
| 3 | 등록된 앱 스킴이 정상 연결됨 | ❌ | **앱 내 기능 미등록** → 콘솔에서 등록 필요 |
| 4 | 앱 스킴 진입 후 뒤로가기 버튼 정상 작동 | ⚠️ | `useTossNavigation` 훅 구현됨, 실제 테스트 필요 |

### 2.2 내비게이션 바

| # | 체크항목 | 상태 | 현황 및 비고 |
|---|---------|:----:|-------------|
| 5 | 좌측 뒤로가기(<) 모든 화면에서 작동 | ✅ | `granite.config.ts`: `leftButton: 'back'` |
| 6 | 중앙에 브랜드 로고 및 미니앱 이름 표시 | ✅ | `granite.config.ts`: `title: '사주강점'` |
| 7 | 토스 내비게이션과 자체 뒤로가기 동시 노출 금지 | ✅ | `privacy-policy` 페이지에서 토스 환경 시 자체 아이콘 숨김 처리 완료 |
| 8 | 더보기 버튼(⋯) 통한 공통 기능 제공 | ✅ | 토스 플랫폼 자동 제공 |
| 9 | 최초 화면 뒤로가기 시 미니앱 종료 | ⚠️ | 확인 필요 |

### 2.3 서비스 이용 동작

| # | 체크항목 | 상태 | 현황 및 비고 |
|---|---------|:----:|-------------|
| 10 | 제스처 확대/축소 비활성화 | ✅ | `layout.tsx`에서 `Viewport` export: `maximumScale: 1, userScalable: false` |
| 11 | 라이트 모드 기본 적용 | ⚠️ | `globals.css`에 다크/라이트 분기 존재 → 라이트 모드 강제 확인 필요 |
| 12 | 모든 UI 컴포넌트 의도대로 작동 | ⚠️ | 토스 환경 실제 테스트 필요 |
| 13 | 스크롤/터치/화면전환 2초 이상 지연 없음 | ⚠️ | AI 분석 API 응답시간 확인 필요 (설문→분석 과정) |
| 14 | 재방문 시 필요 데이터 유지 | ✅ | `StateManager` 3단계 폴백 구현 (session→local→DB) |
| 15 | 서비스 이용 필수 외부 링크 정상 작동 | ⚠️ | 검증 필요 |
| 16 | 공유 기능에서 `intoss://` 스킴 사용 | ⚠️ | `getTossShareLink` 사용 중, 실제 스킴 출력 확인 필요 |
| 17 | `intoss-private://` 스킴 사용하지 않음 | ⚠️ | 확인 필요 |
| 18 | 비속어/은어/과도한 유행어 없음 | ✅ | |
| 19 | 불법/선정적 콘텐츠 없음 | ✅ | |
| 20 | 필요시 TDS 모달 사용 | ⚠️ | 현재 Radix Dialog 사용 중 → TDS 모달로 교체 검토 |
| 21 | RN 권한 요청 전 사용자 동의 | N/A | WebView 기반, RN 권한 요청 없음 |
| 22 | 권한 미동의 시 나머지 기능 작동 | ✅ | 토스 로그인 외 별도 권한 요청 없음 |
| 23 | 네트워크 사용량 비정상 급증 없음 | ⚠️ | 모니터링 필요 |
| 24 | 메모리 사용량 비정상 급증 없음 | ⚠️ | 모니터링 필요 |

### 2.4 UX 정책

| # | 체크항목 | 상태 | 현황 및 비고 |
|---|---------|:----:|-------------|
| 25 | 진입 시 바텀시트 자동 표시 없음 | ✅ | 자동 팝업 없음 |
| 26 | 화면 전환 시 바텀시트로 사용자 행동 강제 유도 없음 | ✅ | |
| 27 | 모든 화면에서 미니앱 종료 방법 명확 | ✅ | 네이티브 네비바 활용 |
| 28 | CTA 버튼으로 다음 행동 예측 가능 | ✅ | |
| 29 | 자사 서비스 이동/앱 설치 유도 없음 | ✅ | |
| 30 | Safe Area 침범 없음 (iOS Dynamic Island 포함) | ⚠️ | 하단만 `env(safe-area-inset-bottom)` 처리됨, 상단은 네이티브 네비바 의존 → 검증 필요 |

---

## 3. 선택 체크리스트 — 해당 기능별

### 3.1 토스 로그인 (해당 — `granite.config.ts`에 `auth: true`)

| # | 체크항목 | 상태 | 현황 및 비고 |
|---|---------|:----:|-------------|
| 31 | 인트로 페이지에서 서비스 설명 제공 | ✅ | 랜딩 페이지(`/`)에 서비스 소개 구현 |
| 32 | 약관 화면 URL 정상 노출 | ⚠️ | 개인정보 처리방침 페이지 존재, 약관 동의 흐름 확인 필요 |
| 33 | 로그인 화면 닫기 선택 시 미니앱 종료 | ⚠️ | 확인 필요 |
| 34 | 연결 해제 후 재접속 시 약관 화면 재노출 | ⚠️ | 연결해제 콜백 구현됨, 실제 흐름 테스트 필요 |
| 35 | 연결 해제 후 사용자 데이터 미잔류 | ✅ | `toss-disconnect` API에서 Supabase 데이터 삭제 구현 |

### 3.2 인앱 결제 (해당 — IAP 2개 상품: ₩1,900 / ₩2,900)

| # | 체크항목 | 상태 | 현황 및 비고 |
|---|---------|:----:|-------------|
| 36 | 결제 진행 중 음악 일시정지 | N/A | 음악/사운드 기능 없음 |
| 37 | 주문 금액 = Google/Apple 결제창 금액 일치 | ⚠️ | 실 결제 테스트 필요 |
| 38 | 결제 정상 완료 (Google 테스트 환경 포함) | ⚠️ | `iap.ts` 구현됨, 실 테스트 필요 |
| 39 | 결제 완료 후 미니앱 복귀 시 결과 즉시 반영 | ⚠️ | 확인 필요 |
| 40 | 결제창 취소 시 주문 화면 복귀 | ⚠️ | 확인 필요 |
| 41 | 결제 실패 시 사유 표시 (잔액 부족 등) | ⚠️ | 확인 필요 |
| 42 | 인앱 결제 취소(환불) 정상 동작 | ⚠️ | 확인 필요 |
| 43 | 사용자가 결제 내역 확인 가능 | ✅ | `PurchaseHistorySection` + `/api/iap/history` 구현 완료 |
| 44 | 기기 변경 시 결제 데이터 유지 | ✅ | Supabase DB 기반 저장 |

### 3.3 인앱 광고

> 해당 없음 — 광고 SDK 미설치, 광고 관련 코드 없음

### 3.4 공유 리워드

> 해당 없음 — 공유 리워드 기능 미사용 (일반 공유 기능만 존재)

---

## 4. CRITICAL 미해결 항목

출시를 위해 **반드시 해결해야 하는** 항목들입니다.

### ~~C-1. `initTossApp()` 호출 누락~~ — 해결 완료

> `TDSProvider.tsx:14`에서 `initTossApp()` 호출 확인. 이미 구현됨.

### C-2. mTLS 통신 미구현 + Vercel 서버리스 제약

| 항목 | 내용 |
|------|------|
| **위치** | `app/api/auth/toss-token/route.ts:16-21` |
| **문제** | mTLS 코드가 주석 처리된 TODO 상태, Vercel 서버리스에서 `https.Agent` 제약 |
| **영향** | 토스 로그인, IAP, 파트너 API **전체 불가** |
| **대안** | (A) Vercel + `node-fetch` (B) 별도 mTLS 프록시 (C) Edge Functions |
| **선행조건** | Vercel 서버리스에서 `node-fetch` + `https.Agent` mTLS 동작 검증 |
| **작업량** | **L** (3~5일, 아키텍처 결정 포함) |

### C-3. 토스 인증 3대 필수 구현 보완

| 항목 | 내용 |
|------|------|
| **문제 (a)** | refreshToken 처리 — 서버 응답에서 refreshToken 전달 누락, 갱신 엔드포인트 필요 |
| **문제 (b)** | AES-256-GCM 복호화 — 암호화된 사용자 정보 복호화 모듈 필요 |
| **문제 (c)** | 연결 해제 콜백 — 구현되어 있으나 실 동작 검증 필요 |
| **영향** | (a) 1시간 후 세션 끊김 (b) 사용자 정보 처리 불가 |
| **참고** | `lib/crypto.ts`(AES), `app/api/auth/toss-refresh/route.ts`, `app/api/auth/toss-disconnect/route.ts`는 코드 존재 — 실 동작 검증 필요 |
| **작업량** | **M~L** (검증 결과에 따라) |

### ~~C-4. `granite build` 빌드 파이프라인 확인~~ — 해결 완료

> `granite.config.ts` import 경로 수정 (`@apps-in-toss/web-framework/config`), 스키마 정규화.
> `build:toss` 스크립트에서 웹 전용 라우트(`app/p`, `app/api`) 임시 제외 + `trap` 복원.
> `granite build` 성공, `saju-strength.ait` 번들 생성 (16MB, 100MB 제한 이내).

### ~~C-5. 개인정보 동의 UI — 토스 환경에서 불가시~~ — 해결 완료

> `birth-info/page.tsx`에서 `IS_TOSS` 분기 + `designTokens.textPrimary/textCaption` 이미 적용됨.

### C-6. 앱 내 기능 미등록

| 항목 | 내용 |
|------|------|
| **근거** | 비게임 앱은 **최소 1개 이상** 앱 내 기능 등록 필수 |
| **해결** | 앱인토스 콘솔에서 기능 등록 (6장 참조) |
| **작업량** | **S** (콘솔 작업) |

### ~~C-7. 번들 용량 100MB 이하 확인~~ — 해결 완료

> `out/` 디렉터리 **16MB** (100MB 제한 대비 여유 충분). CDN 분리 불필요.

---

## 5. WARNING 항목

출시는 가능하지만, **권장 사항** 또는 **향후 문제 방지**를 위해 해결 권장.

| # | 항목 | 현황 | 해결 방향 | 작업량 |
|---|------|------|----------|:---:|
| W-1 | `@apps-in-toss/web-framework` package.json 명시적 선언 없음 | transitive로만 존재 | `package.json`에 명시적 추가 | S |
| W-2 | CORS Origin fallback 도메인 | `middleware.ts`에 하드코딩 | `.env.production` 설정 확인 | S |
| W-3 | 랜딩 CTA/타이틀 TDS 미적용 | `styles` 객체 정의됐으나 미사용 | 정의된 styles 실제 적용 | S |
| W-4 | Sentry 모니터링 미설정 | DSN 환경변수 미설정 | `NEXT_PUBLIC_SENTRY_DSN` 설정 + 초기화 코드 확인 | M |
| W-5 | accessToken 저장 보안 | 현재 메모리 기반 (XSS 방어) | 현재 상태 유지 가능, httpOnly cookie 전환 검토 | M |
| W-6 | CSP 헤더 | `middleware.ts`에 CORS만 존재 | 기본 CSP 헤더 추가 | S |
| ~~W-7~~ | ~~제스처 확대/축소 비활성화~~ | ~~해결~~ | ~~`layout.tsx` Viewport export 추가~~ | ~~완료~~ |
| ~~W-8~~ | ~~`privacy-policy` 자체 뒤로가기 아이콘~~ | ~~해결~~ | ~~토스 환경 `{!IS_TOSS && ...}` 처리~~ | ~~완료~~ |
| ~~W-9~~ | ~~결제 내역 조회 UI~~ | ~~해결~~ | ~~`PurchaseHistorySection` + `/api/iap/history` 구현~~ | ~~완료~~ |
| W-10 | 라이트 모드 강제 적용 | 다크/라이트 분기 존재 | 토스 빌드 시 라이트 모드 고정 확인 | S |

---

## 6. 앱 내 기능 등록

### 요구사항
- 비게임 앱은 **최소 1개 이상** 등록 필수
- 검토 기간: 영업일 1~2일
- 미니앱 출시 검토와 함께 진행 가능

### 등록 절차
1. 앱인토스 콘솔 → 미니앱 선택 → '앱 출시' 메뉴
2. `.ait` 번들 파일 업로드
3. 기능명 + `intoss:///pages` 경로 입력
4. 출시 검토와 함께 제출

### 기능명 작성 가이드

**권장**: `"~하기"` 형태 또는 명사형

| 기능명 (안) | 경로 | 설명 |
|------------|------|------|
| "내 사주 강점 알아보기" | `/` | 메인 — 서비스 소개 + 시작 |
| "강점 설문 시작하기" | `/survey` | Big5 기반 30문항 설문 |
| "분석 결과 확인하기" | `/result` | 사주x강점 교차 분석 리포트 |

**피해야 할 표현**: "확인하기", "보러가기" 등 서비스 맥락 불분명한 것

### 개발 환경 구현 (WebView)
- 라우터 경로를 기능 주소로 매핑
- 예: `intoss://saju-strength/survey` → `/survey` 페이지
- `trailingSlash: true` 설정과의 호환성 확인 필요 (예: `/survey/` vs `/survey`)

---

## 7. 배포 환경 및 테스트

### 7.1 사전 점검

| 항목 | 확인 내용 |
|------|----------|
| `granite build` 성공 | `npm run build:toss` 실행 → 에러 없이 완료 |
| 번들 용량 | `out/` 디렉터리 ≤ 100MB |
| 환경변수 | Supabase, mTLS 인증서, AES 키, Sentry DSN 등 설정 |
| CORS | 테스트/라이브 URL 모두 허용 설정 |

### 7.2 테스트 (1회 이상 필수)

앱인토스 콘솔에서 QR 테스트 수행:

| 테스트 영역 | 확인 항목 |
|------------|----------|
| **기본 동작** | 미니앱 정상 실행, 모든 페이지 접근 가능 |
| **내비게이션** | 뒤로가기, 최초 화면 종료, 딥링크 진입 |
| **로그인** | OAuth 전체 흐름, 토큰 갱신, 연결 해제 |
| **IAP** | 결제/취소/실패/환불 전체 흐름 |
| **공유** | `intoss://` 스킴 공유 링크 정상 동작 |
| **성능** | 화면 전환 2초 이내, 네트워크/메모리 급증 없음 |
| **UX** | Safe Area, 제스처, 라이트 모드 |

### 7.3 출시 후 관리

| 항목 | 내용 |
|------|------|
| 버전 관리 | 새 번들 업로드 → 검토 → 승인 → 출시 (동일 프로세스) |
| 롤백 | 콘솔에서 이전 버전 즉시 전환 가능 (사용자에게도 즉시 반영) |
| 긴급 대응 | 심각한 오류 시 채널톡으로 즉시 연락 |
| 모니터링 | Sentry 오류/크래시 로그, API 응답 성능, 사용자 피드백 |

---

## 8. 작업 로드맵

### Phase 1: 즉시 해결 (1~2일)

빌드/실행에 필요한 기본 조건과 빠르게 수정 가능한 CRITICAL 항목.

| 순서 | 항목 | 관련 | 파일 | 작업량 |
|:---:|------|:---:|------|:---:|
| 1 | `initTossApp()` 호출 추가 | C-1 | `TDSProvider.tsx` | S |
| 2 | 개인정보 동의 UI TDS 색상 분기 | C-5 | `app/birth-info/page.tsx` | S |
| 3 | 제스처 확대/축소 비활성화 | W-7 | `app/layout.tsx` (viewport meta) | S |
| 4 | 라이트 모드 강제 적용 확인 | W-10 | `globals.css`, `TDSProvider.tsx` | S |
| 5 | `privacy-policy` 자체 뒤로가기 아이콘 제거 | W-8 | `app/privacy-policy/page.tsx` | S |
| 6 | 랜딩 CTA/타이틀 TDS styles 적용 | W-3 | `app/page.tsx` | S |
| 7 | CSP 헤더 추가 | W-6 | `middleware.ts` | S |

### Phase 2: 빌드 파이프라인 확립 (3~5일)

`granite build` 정상 동작을 확보하여 이후 모든 테스트의 기반 마련.

| 순서 | 항목 | 관련 | 비고 |
|:---:|------|:---:|------|
| 8 | `granite build` 실행 + 빌드 성공 확인 | C-4 | Next.js static export 양립성 확인 |
| 9 | 번들 용량 100MB 이하 확인 | C-7 | 초과 시 폰트/이미지 CDN 분리 |
| 10 | `package.json`에 `@apps-in-toss/web-framework` 명시 | W-1 | |
| 11 | Sentry DSN 설정 및 모니터링 활성화 | W-4 | granite build 이후 sourcemap 연동 가능 |

### Phase 3: 서버 핵심 기능 (1~2주)

mTLS 기반 토스 인증/결제 전체 흐름 완성.

| 순서 | 항목 | 관련 | 비고 |
|:---:|------|:---:|------|
| 12 | mTLS 아키텍처 결정 + 구현 | C-2 | Vercel 제약 사전 검증 필수 (Phase 3 블로커) |
| 13 | refreshToken 갱신 검증 | C-3a | mTLS 선행 필요 |
| 14 | AES-256-GCM 복호화 검증 | C-3b | `lib/crypto.ts` 실 동작 확인 |
| 15 | 연결 해제 콜백 검증 | C-3c | `toss-disconnect` API 실 동작 확인 |
| 16 | 토큰 저장 보안 검토 | W-5 | C-3과 병행 |

### Phase 4: 기능 보완 + QA (2~3일)

체크리스트 미충족 항목 해결 및 종합 테스트.

| 순서 | 항목 | 관련 | 비고 |
|:---:|------|:---:|------|
| 17 | 결제 내역 조회 UI 구현 | W-9 | 체크리스트 #43 |
| 18 | 앱인토스 콘솔에서 앱 내 기능 등록 | C-6 | 최소 1개 필수 |
| 19 | QR 테스트 수행 (1회 이상) | 필수 | 검토 요청 활성화 조건 |
| 20 | 전체 체크리스트 최종 확인 | - | 본 문서 기준 전수 검사 |

### Phase 5: 출시 (1~2일)

| 순서 | 항목 |
|:---:|------|
| 21 | 앱인토스 콘솔에서 검토 요청 제출 |
| 22 | 검토 피드백 반영 (반려 시 수정 후 재제출) |
| 23 | 승인 후 출시 버튼 클릭 |
| 24 | 출시 후 모니터링 (Sentry, API, 사용자 피드백) |

### 전체 타임라인 요약

```
Phase 1 (1~2일)  ████░░░░░░░░░░░░░░░░  즉시 수정 (S 작업 7건)
Phase 2 (3~5일)  ░░░░████████░░░░░░░░  빌드 파이프라인
Phase 3 (1~2주)  ░░░░░░░░░░░░████████  서버 핵심 (mTLS, 인증)
Phase 4 (2~3일)  ░░░░░░░░░░░░░░░░████  기능 보완 + QA
Phase 5 (1~2일)  ░░░░░░░░░░░░░░░░░░██  출시
                 ──────────────────────
                 예상 총 소요: 3~4주
```

---

## 9. 참조 링크

### 토스 개발자 문서
- [비게임 앱 체크리스트](https://developers-apps-in-toss.toss.im/checklist/app-nongame.html)
- [미니앱 출시 가이드](https://developers-apps-in-toss.toss.im/development/deploy.html)
- [앱 내 기능 테스트](https://developers-apps-in-toss.toss.im/development/test/function.html)
- [WebView 개발하기](https://developers-apps-in-toss.toss.im/tutorials/webview.html)
- [다크패턴 방지 정책](https://developers-apps-in-toss.toss.im/design/consumer-ux-guide.html)
- [토스 로그인 이해하기](https://developers-apps-in-toss.toss.im/login/intro.html)
- [토스 로그인 개발하기](https://developers-apps-in-toss.toss.im/login/develop.html)
- [API 사용하기 (mTLS)](https://developers-apps-in-toss.toss.im/development/integration-process.html)
- [샌드박스 테스트](https://developers-apps-in-toss.toss.im/development/test/sandbox.html)
- [Sentry 모니터링](https://developers-apps-in-toss.toss.im/learn-more/sentry-monitoring.html)
- [TDS Mobile](https://tossmini-docs.toss.im/tds-mobile/)

### 내부 문서
- [가이드라인 준수 검토 보고서](./toss-guideline-compliance-report.md)
- [디자인 가이드](./DESIGN_GUIDE.md)
- [스토어 리스팅](./store-listing.md)
