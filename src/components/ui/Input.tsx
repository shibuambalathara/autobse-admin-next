"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { getFieldClassName } from "@/components/ui/field-styles";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  inputSize?: "sm" | "md" | "lg";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, inputSize = "md", ...props }, ref) => (
    <input
      ref={ref}
      className={getFieldClassName({ error, size: inputSize, className })}
      aria-invalid={error ? true : undefined}
      {...props}
    />
  )
);

Input.displayName = "Input";
