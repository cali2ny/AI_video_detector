import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Brain, Scan, FileText, Link2, Sparkles, AlertCircle, Sun, Palette, Layers, Grid3X3, Waves, Focus, Radio, Contrast, Thermometer, ChevronDown, Users, Zap, Shield, Clock, Gauge, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

const detectionMetrics = [
  { icon: Sun, title: "밝기 균일성", desc: "AI 이미지는 밝기가 인위적으로 균일한 경향이 있습니다" },
  { icon: Palette, title: "색상 채도", desc: "과도하게 선명하거나 비정상적인 채도를 감지합니다" },
  { icon: Layers, title: "색상 밴딩", desc: "그라데이션에서 나타나는 계단식 색상 변화를 탐지합니다" },
  { icon: Grid3X3, title: "텍스처 반복", desc: "AI 특유의 반복되는 패턴을 분석합니다" },
  { icon: Waves, title: "표면 매끄러움", desc: "자연스럽지 않은 과도한 매끄러움을 감지합니다" },
  { icon: Focus, title: "경계선 선명도", desc: "인위적으로 날카롭거나 흐린 경계를 분석합니다" },
  { icon: Radio, title: "노이즈 레벨", desc: "자연 촬영에서 나타나는 노이즈 패턴을 확인합니다" },
  { icon: Contrast, title: "대비 변화량", desc: "영역별 대비의 자연스러운 변화를 측정합니다" },
  { icon: Thermometer, title: "색온도 일관성", desc: "자연광에서의 색온도 변화 패턴을 분석합니다" },
];

const processSteps = [
  { step: "01", title: "URL 입력", desc: "YouTube 영상 링크를 입력하면 분석이 시작됩니다", icon: Link2 },
  { step: "02", title: "썸네일 추출", desc: "영상의 고화질 썸네일을 가져와 분석 준비를 합니다", icon: Scan },
  { step: "03", title: "AI 분석", desc: "9가지 탐지 메트릭으로 이미지를 정밀 분석합니다", icon: Brain },
  { step: "04", title: "결과 도출", desc: "종합 점수와 상세 분석 근거를 제공합니다", icon: Zap },
];

export default function Landing() {
  const [url, setUrl] = useState("");
  const [, navigate] = useLocation();
  const whyRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isValidYoutubeUrl = (url: string) => {
    const patterns = [
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/,
    ];
    return patterns.some((pattern) => pattern.test(url));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && isValidYoutubeUrl(url)) {
      navigate(`/analysis?url=${encodeURIComponent(url.trim())}`);
    }
  };

  const showValidation = url.length > 0 && !isValidYoutubeUrl(url);
  const features = [
    { icon: Brain, text: "딥러닝 기반 탐지" },
    { icon: Scan, text: "화면/프레임 분석" },
    { icon: FileText, text: "설명 가능한 결과" },
  ];

  return (
    <div className="premium-bg noise-overlay text-foreground" data-testid="page-landing">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/20 backdrop-blur-md border-b border-border/30" data-testid="container-header">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <span className="text-sm font-semibold text-foreground/90" data-testid="text-logo">
            AI Video Inspector
          </span>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <button onClick={() => scrollToSection(whyRef)} className="hover:text-foreground transition-colors" data-testid="link-why">Why</button>
            <button onClick={() => scrollToSection(howItWorksRef)} className="hover:text-foreground transition-colors" data-testid="link-how-it-works">How it works</button>
            <button onClick={() => scrollToSection(featuresRef)} className="hover:text-foreground transition-colors" data-testid="link-features">Features</button>
            <button onClick={() => scrollToSection(faqRef)} className="hover:text-foreground transition-colors" data-testid="link-faq">FAQ</button>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="fixed top-14 left-0 right-0 z-40 bg-primary/10 border-b border-primary/20" data-testid="banner-beta">
        <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-xs text-primary">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Beta · 분석 결과는 확률적 추정이며 100% 정확하지 않을 수 있습니다.</span>
        </div>
      </div>

      <main className="relative z-10 min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 pt-28">
        <div className="w-full max-w-xl space-y-12">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            data-testid="container-hero"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight" data-testid="text-headline">
              <span className="gradient-text">AI가 만든 영상인지,</span>
              <br />
              <span className="text-foreground">한 번에 확인하세요.</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto" data-testid="text-subheadline">
              YouTube 링크를 입력하면 화면 기반 딥러닝 탐지기로
              <br className="hidden sm:block" />
              AI 생성 가능성을 분석해 드립니다.
            </p>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-3 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              data-testid="list-features"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary"
                  data-testid={`badge-feature-${index}`}
                >
                  <feature.icon className="h-3.5 w-3.5" />
                  {feature.text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="spotlight"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="input-card-glow rounded-2xl p-6 md:p-8" data-testid="card-input">
              <form onSubmit={handleSubmit} className="space-y-5" data-testid="form-analyze">
                <div className="space-y-3">
                  <label
                    htmlFor="youtube-url"
                    className="text-sm font-medium text-muted-foreground"
                    data-testid="label-url"
                  >
                    YouTube 링크를 입력하세요
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="youtube-url"
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="pl-11 h-14 text-base bg-background/50 border-2 border-input focus:border-primary transition-colors"
                      data-testid="input-youtube-url"
                    />
                  </div>
                  {showValidation && (
                    <p className="text-sm text-destructive flex items-center gap-1.5" data-testid="text-validation-error">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                      올바른 YouTube URL을 입력해 주세요
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-base font-semibold gradient-primary border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={!url.trim() || showValidation}
                  data-testid="button-analyze"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  분석하기
                </Button>
              </form>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <button
            onClick={() => scrollToSection(howItWorksRef)}
            className="flex flex-col items-center gap-2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            data-testid="button-scroll-down"
          >
            <span className="text-xs">더 알아보기</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </button>
        </motion.div>
      </main>

      <section
        ref={whyRef}
        className="relative z-10 py-24 px-4 border-t border-border/20"
        data-testid="section-why"
      >
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4" data-testid="text-why-title">
              <span className="gradient-text">왜 AI Video Detector인가요?</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8" data-testid="text-why-desc">
              AI 생성 영상이 급증하는 시대, 진짜와 가짜를 구별하는 것이 점점 어려워지고 있습니다.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            data-testid="list-why-cards"
          >
            <div className="glass-card rounded-xl p-6" data-testid="card-why-0">
              <h3 className="font-semibold text-lg mb-3 text-primary">딥페이크 위협 증가</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sora, Runway, Pika 등 AI 영상 생성 도구가 발전하면서 
                누구나 쉽게 사실적인 가짜 영상을 만들 수 있게 되었습니다. 
                가짜 뉴스, 사기, 명예훼손 등 악용 사례가 늘어나고 있습니다.
              </p>
            </div>
            <div className="glass-card rounded-xl p-6" data-testid="card-why-1">
              <h3 className="font-semibold text-lg mb-3 text-primary">신뢰할 수 있는 정보 확인</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                SNS와 뉴스에서 본 충격적인 영상, 과연 진짜일까요? 
                AI Video Inspector는 객관적인 기술 분석을 통해 
                영상의 진위 여부를 판단하는 데 도움을 드립니다.
              </p>
            </div>
            <div className="glass-card rounded-xl p-6" data-testid="card-why-2">
              <h3 className="font-semibold text-lg mb-3 text-primary">미디어 리터러시 향상</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                단순히 결과만 보여주지 않습니다. 
                AI 생성 영상의 특징적인 패턴을 설명하여 
                스스로 가짜 영상을 판별하는 능력을 키울 수 있도록 돕습니다.
              </p>
            </div>
            <div className="glass-card rounded-xl p-6" data-testid="card-why-3">
              <h3 className="font-semibold text-lg mb-3 text-primary">커뮤니티 집단지성 활용</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                기술적 분석뿐만 아니라 YouTube 댓글을 분석하여 
                다른 시청자들의 의견도 함께 제공합니다. 
                집단지성을 활용한 종합적인 판단이 가능합니다.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="mt-10 glass-card rounded-xl p-5 border-l-4 border-l-amber-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            data-testid="card-beta-notice"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">베타 버전 안내</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  현재 베타 버전으로, <strong className="text-foreground">영상의 썸네일 이미지만 분석</strong>합니다. 
                  영상 전체 프레임을 분석하는 기능은 추후 업데이트 예정입니다. 
                  분석 결과는 확률적 추정이며 100% 정확하지 않을 수 있으니 참고용으로 활용해 주세요.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        ref={howItWorksRef}
        className="relative z-10 py-24 px-4 border-t border-border/20"
        data-testid="section-how-it-works"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4" data-testid="text-section-title">
              <span className="gradient-text">어떻게 작동하나요?</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-section-desc">
              AI Video Inspector는 정교한 이미지 분석 알고리즘을 사용하여
              AI 생성 영상의 특징적인 패턴을 탐지합니다.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            data-testid="list-process-steps"
          >
            {processSteps.map((item, index) => (
              <div
                key={index}
                className="relative glass-card rounded-xl p-5 text-center group hover-elevate"
                data-testid={`card-step-${index}`}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-bold text-primary">
                  {item.step}
                </div>
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl md:text-2xl font-bold mb-3" data-testid="text-metrics-title">
              9가지 정밀 탐지 메트릭
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto" data-testid="text-metrics-desc">
              각 메트릭은 AI 생성 이미지에서 나타나는 특징적인 패턴을 분석합니다.
              이러한 특성들을 종합하여 AI 생성 가능성을 판단합니다.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            data-testid="list-metrics"
          >
            {detectionMetrics.map((metric, index) => (
              <motion.div
                key={index}
                className="glass-card rounded-xl p-4 flex items-start gap-4 hover-elevate"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                data-testid={`card-metric-${index}`}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                  <metric.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{metric.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{metric.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-16 glass-card rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            data-testid="card-community"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-bold">커뮤니티 의견 분석</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-4">
              YouTube 댓글을 분석하여 시청자들의 의견도 함께 제공합니다.
              "AI로 만든 것 같다", "가짜 영상" 등의 키워드를 감지하여
              커뮤니티의 반응을 종합적으로 보여드립니다.
            </p>
            <p className="text-xs text-muted-foreground/60">
              * YouTube API 키가 설정된 경우에만 이용 가능합니다
            </p>
          </motion.div>
        </div>
      </section>

      <section
        ref={featuresRef}
        className="relative z-10 py-24 px-4 border-t border-border/20"
        data-testid="section-features"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4" data-testid="text-features-title">
              <span className="gradient-text">주요 기능</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              AI Video Inspector가 제공하는 핵심 기능들을 소개합니다.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            data-testid="list-features-cards"
          >
            <div className="glass-card rounded-2xl p-6 text-center hover-elevate" data-testid="card-feature-0">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">빠른 분석</h3>
              <p className="text-sm text-muted-foreground">
                URL 입력 후 3초 이내에 분석 결과를 확인할 수 있습니다.
                복잡한 설정 없이 바로 사용 가능합니다.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center hover-elevate" data-testid="card-feature-1">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-500/10 flex items-center justify-center">
                <Shield className="h-7 w-7 text-emerald-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">개인정보 보호</h3>
              <p className="text-sm text-muted-foreground">
                분석한 영상 URL이나 결과를 저장하지 않습니다.
                완전히 프라이빗하게 사용할 수 있습니다.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center hover-elevate" data-testid="card-feature-2">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-violet-500/30 to-violet-500/10 flex items-center justify-center">
                <Fingerprint className="h-7 w-7 text-violet-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">무료 이용</h3>
              <p className="text-sm text-muted-foreground">
                회원가입이나 결제 없이 무료로 이용 가능합니다.
                횟수 제한 없이 자유롭게 분석하세요.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card rounded-2xl p-6 flex items-start gap-5 hover-elevate" data-testid="card-feature-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-500/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">상세한 분석 근거</h3>
                <p className="text-sm text-muted-foreground">
                  단순 점수가 아닌, 왜 그런 판정이 나왔는지 상세한 근거를 제공합니다.
                  각 탐지 메트릭별로 어떤 특성이 감지되었는지 확인할 수 있습니다.
                </p>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6 flex items-start gap-5 hover-elevate" data-testid="card-feature-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-cyan-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">커뮤니티 의견</h3>
                <p className="text-sm text-muted-foreground">
                  YouTube 댓글에서 다른 시청자들의 의견을 분석하여 함께 보여드립니다.
                  기술적 분석과 커뮤니티 반응을 종합적으로 판단할 수 있습니다.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        ref={faqRef}
        className="relative z-10 py-24 px-4 border-t border-border/20"
        data-testid="section-faq"
      >
        <div className="container mx-auto max-w-3xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4" data-testid="text-faq-title">
              <span className="gradient-text">자주 묻는 질문</span>
            </h2>
            <p className="text-muted-foreground">
              AI Video Inspector에 대해 궁금한 점을 확인하세요.
            </p>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            data-testid="list-faq"
          >
            <div className="glass-card rounded-xl p-5" data-testid="card-faq-0">
              <h3 className="font-semibold mb-2">분석 결과는 얼마나 정확한가요?</h3>
              <p className="text-sm text-muted-foreground">
                현재 베타 버전으로, 9가지 휴리스틱 메트릭을 사용하여 AI 생성 가능성을 추정합니다. 
                100% 정확하지는 않으며, 중요한 판단에는 다른 정보와 함께 참고하시기 바랍니다.
                지속적으로 알고리즘을 개선하고 있습니다.
              </p>
            </div>
            <div className="glass-card rounded-xl p-5" data-testid="card-faq-1">
              <h3 className="font-semibold mb-2">어떤 영상을 분석할 수 있나요?</h3>
              <p className="text-sm text-muted-foreground">
                YouTube에 공개된 모든 영상을 분석할 수 있습니다. 
                일반 영상, Shorts, 비공개 영상(URL로 접근 가능한 경우)도 분석 가능합니다.
                현재 YouTube 외 다른 플랫폼은 지원하지 않습니다.
              </p>
            </div>
            <div className="glass-card rounded-xl p-5" data-testid="card-faq-2">
              <h3 className="font-semibold mb-2">분석 데이터는 어떻게 처리되나요?</h3>
              <p className="text-sm text-muted-foreground">
                입력한 URL이나 분석 결과를 서버에 저장하지 않습니다. 
                분석은 실시간으로 이루어지며, 세션 종료 후 모든 데이터는 삭제됩니다.
                안심하고 사용하세요.
              </p>
            </div>
            <div className="glass-card rounded-xl p-5" data-testid="card-faq-3">
              <h3 className="font-semibold mb-2">커뮤니티 분석은 어떻게 작동하나요?</h3>
              <p className="text-sm text-muted-foreground">
                YouTube API를 통해 영상의 상위 댓글을 가져와 키워드 분석을 수행합니다.
                "AI로 만든 것 같다", "가짜", "fake" 등의 키워드를 감지하여 
                시청자들의 의견을 AI 의심/실제 영상/중립으로 분류합니다.
              </p>
            </div>
            <div className="glass-card rounded-xl p-5" data-testid="card-faq-4">
              <h3 className="font-semibold mb-2">"UNCLEAR" 판정은 무엇인가요?</h3>
              <p className="text-sm text-muted-foreground">
                점수가 40~69% 사이인 경우 "판단 불확실"로 표시됩니다.
                이는 AI 생성과 실제 촬영 영상 모두의 특성이 혼재되어 있거나,
                판단하기 어려운 경우를 의미합니다. 다른 정보와 함께 종합적으로 판단하세요.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 py-8 border-t border-border/20" data-testid="container-footer">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground/60 mb-2" data-testid="text-disclaimer">
            이 분석 결과는 통계적 추정치이며, 100% 정확하지 않을 수 있습니다.
          </p>
          <p className="text-xs text-muted-foreground/40">
            중요한 판단에는 다른 정보와 출처를 함께 참고해 주세요.
          </p>
        </div>
      </footer>
    </div>
  );
}
