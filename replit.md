# AI Video Detector - YouTube AI 생성 영상 탐지 서비스

## Overview
YouTube 영상 URL을 입력하면 해당 영상의 썸네일/프레임을 분석하여 AI 생성 가능성을 점수로 보여주는 웹 서비스입니다. 추가로 YouTube 댓글을 분석하여 시청자들의 의견도 함께 제공합니다.

## Project Architecture

### Two-Page SPA Structure
- **Landing Page (`/`)**: 미니멀한 입력 전용 페이지
- **Analysis Page (`/analysis`)**: 분석 결과 전용 페이지

### Frontend (React + TypeScript + Vite)
- **Location**: `client/src/`
- **Styling**: Tailwind CSS with premium SaaS theme
- **State Management**: React hooks + TanStack Query
- **Animation**: Framer Motion for smooth transitions
- **Routing**: Wouter with URL query parameter for state

### Pages
- `pages/landing.tsx` - 미니멀 랜딩 페이지 (URL 입력 전용)
- `pages/analysis.tsx` - 분석 결과 페이지 (점수, 근거, 팁 표시)

### Key Components
- `components/score-gauge.tsx` - SVG 그라디언트 원형 점수 게이지
- `components/analysis-result.tsx` - 분석 결과 카드 레이아웃 (3열 그리드)
- `components/community-opinions.tsx` - 시청자 의견 카드 (댓글 분석 결과)
- `components/loading-state.tsx` - 단계별 애니메이션 로딩
- `components/error-state.tsx` - 에러 상태
- `components/theme-toggle.tsx` - 다크/라이트 모드 토글

### Reusable UI Components
- `components/ui/premium-card.tsx` - 글래스/보더 변형 프리미엄 카드
- `components/ui/skeleton-card.tsx` - 쉬머 애니메이션 스켈레톤

### Backend (Express + TypeScript)
- **Location**: `server/`
- **Main Routes**: `server/routes.ts`
- **Detection Algorithm** (3-layer structure):
  1. **Heuristic Layer** (`server/utils/image-analysis.ts`)
     - Uses `sharp` library for proper image decoding (not raw byte sampling)
     - 9 detection metrics with tuned thresholds:
       1. 밝기 균일성 분석 (Brightness Uniformity)
       2. 색상 채도 분석 (Color Saturation)
       3. 색상 밴딩 감지 (Color Banding)
       4. 텍스처 반복 패턴 감지 (Texture Repetition)
       5. 표면 매끄러움 분석 (Surface Smoothness)
       6. 경계선 선명도 감지 (Edge Sharpness)
       7. 노이즈 레벨 측정 (Noise Level)
       8. 대비 변화량 분석 (Contrast Variance)
       9. 색온도 일관성 분석 (Color Temperature Consistency)
     - Validated: 77% score on known fake video vs 10% with previous algorithm
  2. **External API Layer** (`server/utils/external-api.ts`)
     - 환경변수: `AI_DETECT_API_BASE_URL`, `AI_DETECT_API_KEY`
     - 둘 다 설정시에만 외부 딥러닝 API 호출
  3. **Community Layer** (`server/utils/comments.ts`)
     - YouTube Data API v3로 상위 50개 댓글 수집
     - 키워드 기반 AI/REAL/NEUTRAL 분류
     - 커뮤니티 보정: aiVotes >= 30% → +10점, aiVotes <= 5% → -5점
  4. **Temporal Analysis Layer** (`server/utils/temporal-analysis.ts`)
     - 영상을 4~16개 시간 구간으로 분할하여 각 프레임 분석
     - yt-dlp로 스트림 URL 획득, ffmpeg spawn으로 프레임 추출
     - 구간별 AI 점수 및 전체 평가 (FULL_AI, PARTIAL_AI, LIKELY_REAL)
     - 전환 구간 감지: 인접 구간 점수 차이 ≥25% 시 경고
     - 상태 추적: success, partial, failed + errorReason 제공
  5. **Score Combiner** (`server/utils/score-combiner.ts`)
     - 휴리스틱만: `finalScore = heuristicScore + communityAdjustment`
     - 외부 API 포함: `finalScore = heuristicScore * 0.3 + externalScore * 0.7 + communityAdjustment`
     - 시간 분석 결과 notes를 reasons에 추가

### Key Components (Updated)
- `components/temporal-timeline.tsx` - 시간대별 분석 타임라인 시각화

### Shared Types
- **Location**: `shared/schema.ts`
- Key types: `AnalyzeVideoRequest`, `AnalyzeVideoResponse`, `HeuristicResult`, `CommunityAnalysis`, `TemporalSegment`, `TemporalAnalysis`

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
    "sourceType": "YOUTUBE_URL",
    "source": "heuristic_only",
    "videoId": "dQw4w9WgXcQ",
    "thumbnailUrl": "https://img.youtube.com/vi/xxx/maxresdefault.jpg",
    "channelTitle": "채널명",
    "durationSeconds": 212,
    "analyzedAt": "2024-01-01T00:00:00.000Z"
  },
  "debug": {
    "heuristicScore": 45,
    "externalApiScore": null,
    "communityAdjustment": 10,
    "finalScore": 55
  },
  "community": {
    "totalComments": 50,
    "aiVotes": 20,
    "realVotes": 5,
    "neutralVotes": 25,
    "topAiComments": [
      { "author": "user1", "text": "이건 AI로 만든 거 아니야?", "likeCount": 42 }
    ],
    "topRealComments": [
      { "author": "user2", "text": "실제 촬영 영상이네요", "likeCount": 15 }
    ]
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
- `YT_API_KEY` - YouTube Data API v3 키 (채널명, 영상 길이, 댓글 가져오기용)

## Development
```bash
npm install
npm run dev
```

## Design System (Premium SaaS Theme)
- **Background**: Dark gradient (navy → near-black) with radial highlights
- **Primary**: Blue (217 91% 60%)
- **Accent Gradients**: Blue → Cyan, Violet → Purple, Emerald → Green
- **Card Styles**: Glass morphism with backdrop blur
- **Effects**: Spotlight glow, input card glow, noise texture overlay
- **Animation**: Skeleton shimmer, pulse glow, gradient score ring
- **Font**: Inter (sans-serif)
- **Icons**: Lucide React (no emojis)

### CSS Utilities (index.css)
- `premium-bg` - 프리미엄 다크 그라디언트 배경
- `spotlight` - 카드 뒤 스포트라이트 효과
- `input-card-glow` - 입력 카드 글로우 효과
- `noise-overlay` - 노이즈 텍스처 오버레이
- `glass-card` - 글래스모피즘 카드
- `gradient-text` - 그라디언트 텍스트
- `glow-primary` / `glow-success` / etc. - 글로우 이펙트
