import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "neu-button bg-gradient-primary text-white shadow-neu-light dark:shadow-neu-dark hover:shadow-neu-hover-light dark:hover:shadow-neu-hover-dark",
        destructive:
          "neu-button bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-neu-light dark:shadow-neu-dark hover:shadow-neu-hover-light dark:hover:shadow-neu-hover-dark",
        outline:
          "neu-button border-2 border-vivid-primary/30 text-vivid-primary shadow-neu-light dark:shadow-neu-dark hover:shadow-neu-hover-light dark:hover:shadow-neu-hover-dark",
        secondary:
          "neu-button bg-gradient-secondary text-white shadow-neu-light dark:shadow-neu-dark hover:shadow-neu-hover-light dark:hover:shadow-neu-hover-dark",
        ghost: 
          "neu-nav text-foreground hover:text-vivid-primary hover:shadow-neu-hover-light dark:hover:shadow-neu-hover-dark",
        link: "text-vivid-primary underline-offset-4 hover:underline",
        accent:
          "neu-button bg-gradient-accent text-white shadow-neu-light dark:shadow-neu-dark hover:shadow-neu-hover-light dark:hover:shadow-neu-hover-dark",
        success:
          "neu-button bg-gradient-success text-white shadow-neu-light dark:shadow-neu-dark hover:shadow-neu-hover-light dark:hover:shadow-neu-hover-dark",
        warning:
          "neu-button bg-gradient-warning text-white shadow-neu-light dark:shadow-neu-dark hover:shadow-neu-hover-light dark:hover:shadow-neu-hover-dark",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-xl px-4 text-xs",
        lg: "h-14 rounded-2xl px-8 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
