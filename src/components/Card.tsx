"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = true }: CardProps) {
  const baseStyles = "bg-white/60 backdrop-blur-sm rounded-2xl border border-pale-oak/20 p-6 sm:p-8";

  if (!hover) {
    return <div className={`${baseStyles} ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      className={`${baseStyles} ${className}`}
      whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
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
    <Card className={className}>
      <div className="mb-4 text-sandy-brown">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-jet-black">{title}</h3>
      <p className="text-pale-oak leading-relaxed">{description}</p>
    </Card>
  );
}
