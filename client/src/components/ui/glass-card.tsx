import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardProps } from "@/components/ui/card";

export interface GlassCardProps extends CardProps {
  children: React.ReactNode;
}

export function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <Card
      className={cn(
        "bg-card/70 backdrop-blur-md border border-border",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
