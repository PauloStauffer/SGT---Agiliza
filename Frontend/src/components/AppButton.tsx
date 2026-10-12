import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const appButtonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        dark: "bg-sidebar text-sidebar-foreground shadow-sm hover:bg-sidebar/90",
        secondary: "border border-border bg-card text-foreground hover:bg-accent",
        ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
        warning: "bg-highlight text-highlight-foreground hover:bg-highlight/90",
      },
      size: {
        sm: "min-h-8 px-3 text-xs",
        default: "min-h-10 px-4",
        icon: "size-10 min-h-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof appButtonVariants> & { asChild?: boolean };

export function AppButton({ className, variant, size, asChild, ...props }: AppButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(appButtonVariants({ variant, size, className }))} {...props} />;
}