# AI Video Detector - YouTube AI 생성 영상 탐지 서비스

## Overview
YouTube 영상 URL을 입력하면 해당 영상의 썸네일/프레임을 분석하여 AI 생성 가능성을 점수로 보여주는 웹 서비스입니다.

## Project Architecture

### Frontend (React + TypeScript + Vite)
- **Location**: `client/src/`
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React hooks + TanStack Query
- **Animation**: Framer Motion for smooth transitions
- **Key Components**:
  - `components/header.tsx` - 프리미엄 그라디언트 헤더
  - `components/url-input-form.tsx` - YouTube URL 입력 폼 (글래스모피즘 스타일)
  - `components/score-gauge.tsx` - SVG 그라디언트 원형 점수 게이지
  - `components/analysis-result.tsx` - 분석 결과 표시 (프리미엄 카드 레이아웃)
  - `components/loading-state.tsx` - 애니메이션 로딩 상태 + 스켈레톤
  - `components/error-state.tsx` - 에러 상태
  - `components/empty-state.tsx` - 기능 소개 카드 포함 초기 상태
- **Reusable UI Components**:
  - `components/ui/section-header.tsx` - 그라디언트 텍스트 섹션 헤더
  - `components/ui/premium-card.tsx` - 글래스/보더 변형 프리미엄 카드
  - `components/ui/skeleton-card.tsx` - 쉬머 애니메이션 스켈레톤

### Backend (Express + TypeScript)
- **Location**: `server/`
- **Main Routes**: `server/routes.ts`
- **Detection Algorithm** (3-layer structure):
  1. **Heuristic Layer** (`server/utils/image-analysis.ts`)
     - 밝기 균일성 분석
     - 색상 분포 분석
     - 에지 밀도 계산
     - 노이즈 레벨 측정
     - 고주파 성분 비율 분석
  2. **External API Layer** (`server/utils/external-api.ts`)
     - 환경변수: `AI_DETECT_API_BASE_URL`, `AI_DETECT_API_KEY`
     - 둘 다 설정시에만 외부 딥러닝 API 호출
  3. **Score Combiner** (`server/utils/score-combiner.ts`)
     - 휴리스틱만: `finalScore = heuristicScore`
     - 외부 API 포함: `finalScore = heuristicScore * 0.3 + externalScore * 0.7`

### Shared Types
- **Location**: `shared/schema.ts`
- Key types: `AnalyzeVideoRequest`, `AnalyzeVideoResponse`, `HeuristicResult`

## API Endpoints

### POST /api/analyze
YouTube 영상 분석을 수행합니다.

**Request Body:**
```json
{
  "videoUrl": "https://www.youtube.com/watch?v=..."
}
```

**Response:**
```json
{
  "score": 45,
  "label": "UNCLEAR",
  "reasons": ["분석 근거 1", "분석 근거 2"],
  "tips": ["확인 팁 1", "확인 팁 2"],
  "meta": {
    "source": "heuristic_only",
    "thumbnailUrl": "https://img.youtube.com/vi/xxx/maxresdefault.jpg",
    "analyzedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Score Labels
- **LIKELY_AI** (70-100%): AI 생성 가능성 높음
- **UNCLEAR** (40-69%): 판단 불확실
- **LIKELY_HUMAN** (0-39%): 실제 영상 가능성 높음

## Environment Variables (Optional)
- `AI_DETECT_API_BASE_URL` - 외부 딥러닝 탐지 API URL
- `AI_DETECT_API_KEY` - 외부 API 인증 키

## Development
```bash
npm install
npm run dev
```

## Design System (Premium SaaS Theme)
- **Background**: Dark navy (222 47% 7%) / Light (222 47% 98%)
- **Primary**: Blue (217 91% 60%)
- **Accent Gradients**: Blue → Cyan, Violet → Purple, Emerald → Green
- **Card Styles**: Glass morphism with backdrop blur, premium bordered
- **Effects**: Glow effects (primary/success/warning/danger)
- **Animation**: Skeleton shimmer, pulse glow, gradient score ring
- **Font**: Inter (sans-serif)
- **Icons**: Lucide React (no emojis)

### CSS Utilities (index.css)
- `gradient-primary` / `gradient-accent` / `gradient-success` / etc.
- `gradient-text` - 그라디언트 텍스트
- `glass-card` - 글래스모피즘 카드
- `skeleton-shimmer` - 스켈레톤 로딩 애니메이션
- `glow-primary` / `glow-success` / etc. - 글로우 이펙트
