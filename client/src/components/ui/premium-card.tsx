import { cn } from "@/lib/utils";

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "bordered";
  glow?: "none" | "primary" | "success" | "warning" | "danger";
}

export function PremiumCard({
  children,
  className,
  variant = "default",
  glow = "none",
}: PremiumCardProps) {
  const baseClasses = "rounded-xl p-6 transition-all duration-300";
  
  const variantClasses = {
    default: "bg-card border border-card-border shadow-lg",
    glass: "glass-card shadow-xl",
    bordered: "bg-card/50 border-2 border-primary/20 shadow-lg",
  };

  const glowClasses = {
    none: "",
    primary: "glow-primary",
    success: "glow-success",
    warning: "glow-warning",
    danger: "glow-danger",
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        glowClasses[glow],
        className
      )}
    >
      {children}
    </div>
  );
}

interface PremiumCardHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PremiumCardHeader({
  icon,
  title,
  subtitle,
  action,
  className,
}: PremiumCardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-4", className)}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
