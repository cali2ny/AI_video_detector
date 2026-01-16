interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`space-y-2 ${align === "center" ? "text-center" : "text-left"} ${className}`}
      data-testid="container-section-header"
    >
      <h2
        className="text-3xl md:text-4xl font-bold tracking-tight"
        data-testid="text-section-title"
      >
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && (
        <p
          className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
          data-testid="text-section-subtitle"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
