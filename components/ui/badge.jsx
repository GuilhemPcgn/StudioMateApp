import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-xl border-2 px-3 py-1 text-xs font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "neu-button bg-gradient-primary text-white shadow-neu-light dark:shadow-neu-dark",
        secondary:
          "neu-button bg-gradient-secondary text-white shadow-neu-light dark:shadow-neu-dark",
        destructive:
          "neu-button bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-neu-light dark:shadow-neu-dark",
        outline: 
          "neu-button border-2 border-vivid-primary/30 text-vivid-primary shadow-neu-light dark:shadow-neu-dark",
        accent:
          "neu-button bg-gradient-accent text-white shadow-neu-light dark:shadow-neu-dark",
        success:
          "neu-button bg-gradient-success text-white shadow-neu-light dark:shadow-neu-dark",
        warning:
          "neu-button bg-gradient-warning text-white shadow-neu-light dark:shadow-neu-dark",
        primary:
          "neu-button bg-gradient-primary text-white shadow-neu-light dark:shadow-neu-dark",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
