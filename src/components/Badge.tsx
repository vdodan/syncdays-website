import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "shipped" | "in-progress" | "planned" | "considering" | "pro";
  className?: string;
}

export function Badge({ children, variant = "shipped", className = "" }: BadgeProps) {
  const variants = {
    "shipped": "bg-green-100 text-green-700 border-green-200",
    "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
    "planned": "bg-purple-100 text-purple-700 border-purple-200",
    "considering": "bg-gray-100 text-gray-600 border-gray-200",
    "pro": "bg-sandy-brown/20 text-sandy-brown border-sandy-brown/30",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
