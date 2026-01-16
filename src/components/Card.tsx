"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "default" | "beige";
}

export function Card({ children, className = "", hover = true, variant = "default" }: CardProps) {
  const variants = {
    default: "bg-white border border-tan/30",
    beige: "bg-warm-beige border border-tan/30",
  };

  const baseStyles = `rounded-2xl p-6 sm:p-8 ${variants[variant]}`;

  if (!hover) {
    return <div className={`${baseStyles} ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      className={`${baseStyles} ${className}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className = "" }: FeatureCardProps) {
  return (
    <Card className={className} variant="beige">
      <div className="mb-4 text-black">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-black">{title}</h3>
      <p className="text-muted leading-relaxed">{description}</p>
    </Card>
  );
}
