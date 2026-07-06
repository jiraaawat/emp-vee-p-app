import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export function BentoCard({ children, className, glass = false }: BentoCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-4 md:p-6 transition-all duration-300",
        glass ? "glass-card" : "bento-card neon-border-hover",
        className
      )}
    >
      {children}
    </div>
  );
}
