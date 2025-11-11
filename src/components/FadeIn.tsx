"use client";
import { motion } from "motion/react";

export const FadeIn = ({ children, className, component = 'div' }: { children: React.ReactNode, className?: string, component?: React.ElementType }) => {
	const Component = motion(component) as React.ElementType;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {children}
    </Component>
  );
};


