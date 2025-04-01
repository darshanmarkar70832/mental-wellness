import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/50 bg-background/10 backdrop-blur-lg p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
