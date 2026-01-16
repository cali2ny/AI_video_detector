import { motion } from "framer-motion";
import { Youtube, Scan, Brain, Shield, Sparkles, ArrowRight } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";

export function EmptyState() {
  const features = [
    {
      icon: Scan,
      title: "Frame Analysis",
      description: "Analyzes brightness uniformity, color distribution, and edge density patterns",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Brain,
      title: "Neural Detection",
      description: "Optional deep learning API integration for enhanced accuracy",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: Shield,
      title: "Confidence Score",
      description: "Clear percentage score with evidence-based explanations",
      color: "from-emerald-500 to-green-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <PremiumCard variant="glass" data-testid="card-empty-state">
      <motion.div
        className="py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary shadow-lg mb-6"
            animate={{ 
              boxShadow: [
                "0 0 20px hsl(217 91% 60% / 0.3)",
                "0 0 40px hsl(217 91% 60% / 0.5)",
                "0 0 20px hsl(217 91% 60% / 0.3)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            data-testid="icon-youtube"
          >
            <Youtube className="h-10 w-10 text-white" />
          </motion.div>
          
          <h3 className="text-2xl md:text-3xl font-bold mb-3" data-testid="text-empty-title">
            <span className="gradient-text">Detect AI-Generated Videos</span>
          </h3>
          <p className="text-muted-foreground max-w-lg mx-auto text-base" data-testid="text-empty-description">
            Paste any YouTube video URL above and our neural detection system will analyze it for signs of AI generation
          </p>
        </motion.div>

        <motion.div
          className="grid gap-4 md:grid-cols-3 mb-8"
          variants={containerVariants}
          data-testid="list-features"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative p-5 rounded-xl bg-card/50 border border-card-border hover:border-primary/30 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -4 }}
              data-testid={`card-feature-${index}`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>100% Free to Use</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Privacy-First Analysis</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
            <ArrowRight className="h-4 w-4 text-violet-500" />
            <span>Instant Results</span>
          </div>
        </motion.div>
      </motion.div>
    </PremiumCard>
  );
}
