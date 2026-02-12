import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_6px_0_0_color-mix(in_srgb,var(--color-primary)_85%,transparent),0_6px_16px_0_color-mix(in_srgb,var(--color-primary)_30%,transparent)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_4px_0_0_color-mix(in_srgb,var(--color-primary)_85%,transparent),0_4px_12px_0_color-mix(in_srgb,var(--color-primary)_30%,transparent)] hover:translate-y-[2px] active:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.2)] active:translate-y-[4px] tracking-wide",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.4),inset_0_-3px_6px_0_rgba(0,0,0,0.2),0_3px_6px_0_rgba(0,0,0,0.15)] active:shadow-[inset_0_3px_8px_0_rgba(0,0,0,0.3)] active:translate-y-[2px]",
        outline:
          "border border-input bg-card hover:bg-accent hover:text-accent-foreground shadow-[inset_0_2px_0_0_rgba(255,255,255,0.6),0_2px_4px_0_rgba(0,0,0,0.08)] active:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.12)] active:translate-y-[1px]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.6),0_2px_4px_0_rgba(0,0,0,0.08)] active:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.12)] active:translate-y-[1px]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        card: "bg-card border-2 border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_2px_4px_0_rgba(0,0,0,0.04)] hover:bg-secondary",
      },
      size: {
        default: "h-12 px-4 py-2 rounded-xl",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
