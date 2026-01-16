import { motion } from "framer-motion";
import { Youtube, Scan, BarChart3, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState() {
  const features = [
    {
      icon: Scan,
      title: "프레임 분석",
      description: "썸네일과 프레임의 시각적 특성을 분석합니다",
    },
    {
      icon: BarChart3,
      title: "AI 점수 산출",
      description: "휴리스틱 알고리즘으로 AI 생성 가능성을 평가합니다",
    },
    {
      icon: Shield,
      title: "신뢰도 표시",
      description: "명확한 레이블과 근거를 함께 제공합니다",
    },
  ];

  return (
    <Card data-testid="card-empty-state">
      <CardContent className="py-12">
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            data-testid="icon-youtube"
          >
            <Youtube className="h-10 w-10 text-primary" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2" data-testid="text-empty-title">YouTube 영상을 분석해보세요</h3>
          <p className="text-muted-foreground max-w-md mx-auto" data-testid="text-empty-description">
            위 입력창에 YouTube 영상 URL을 붙여넣고 분석하기 버튼을 클릭하세요
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3" data-testid="list-features">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-md bg-muted/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              data-testid={`card-feature-${index}`}
            >
              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-3 border">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-medium mb-1">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
