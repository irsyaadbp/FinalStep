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
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_5px_0_0_color-mix(in_srgb,var(--color-primary),black_20%),0_5px_15px_0_color-mix(in_srgb,var(--color-primary)_30%,transparent)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_2px_0_0_color-mix(in_srgb,var(--color-primary),black_20%),0_2px_8px_0_color-mix(in_srgb,var(--color-primary)_30%,transparent)] hover:translate-y-[2px] active:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.2)] active:translate-y-[4px] tracking-wide",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_5px_0_0_color-mix(in_srgb,var(--color-destructive),black_20%),0_5px_15px_0_color-mix(in_srgb,var(--color-destructive)_30%,transparent)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_2px_0_0_color-mix(in_srgb,var(--color-destructive),black_20%),0_2px_8px_0_color-mix(in_srgb,var(--color-destructive)_30%,transparent)] hover:translate-y-[2px] active:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.2)] active:translate-y-[4px] tracking-wide",
        outline:
          "border border-border bg-white text-foreground hover:bg-neutral-50 shadow-[0_5px_0_0_var(--color-secondary),0_5px_15px_0_rgba(0,0,0,0.05)] hover:shadow-[0_2px_0_0_var(--color-secondary),0_2px_8px_0_rgba(0,0,0,0.05)] hover:translate-y-[2px] active:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1)] active:translate-y-[4px]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_5px_0_0_color-mix(in_srgb,var(--color-secondary),black_10%),0_5px_15px_0_rgba(0,0,0,0.05)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_2px_0_0_color-mix(in_srgb,var(--color-secondary),black_10%),0_2px_8px_0_rgba(0,0,0,0.05)] hover:translate-y-[2px] active:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1)] active:translate-y-[4px]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        card:
          "border border-border bg-card text-card-foreground hover:bg-secondary/50 shadow-[0_5px_0_0_var(--color-secondary),0_5px_15px_0_rgba(0,0,0,0.05)] hover:shadow-[0_2px_0_0_var(--color-secondary),0_2px_8px_0_rgba(0,0,0,0.05)] hover:translate-y-[2px] active:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1)] active:translate-y-[4px]",
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
