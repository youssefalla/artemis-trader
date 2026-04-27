import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  "glass-button relative isolate all-unset cursor-pointer rounded-full transition-all",
  {
    variants: {
      size: {
        default: "text-base font-medium",
        sm: "text-sm font-medium",
        lg: "text-lg font-medium",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const glassButtonTextVariants = cva(
  "glass-button-text relative block select-none tracking-tight",
  {
    variants: {
      size: {
        default: "px-6 py-3.5",
        sm: "px-4 py-2.5",
        lg: "px-8 py-4",
        icon: "flex h-10 w-10 items-center justify-center",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, disabled, ...props }, ref) => {
    return (
      <div
        className={cn(
          "glass-button-wrap cursor-pointer rounded-full",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
      >
        <button
          className={cn(glassButtonVariants({ size }))}
          ref={ref}
          disabled={disabled}
          {...props}
        >
          <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>
            {children}
          </span>
        </button>
        <div className="glass-button-shadow rounded-full" />
      </div>
    );
  }
);
GlassButton.displayName = "GlassButton";

export interface GlassButtonLinkProps
  extends VariantProps<typeof glassButtonVariants> {
  href: string;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

const GlassButtonLink = ({
  href,
  className,
  children,
  size,
  contentClassName,
  ...props
}: GlassButtonLinkProps) => {
  return (
    <div className={cn("glass-button-wrap cursor-pointer rounded-full", className)}>
      <Link
        href={href}
        className={cn(glassButtonVariants({ size }), "no-underline")}
        {...props}
      >
        <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>
          {children}
        </span>
      </Link>
      <div className="glass-button-shadow rounded-full" />
    </div>
  );
};
GlassButtonLink.displayName = "GlassButtonLink";

export { GlassButton, GlassButtonLink, glassButtonVariants };
