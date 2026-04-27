"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export type HoverButtonVariant = "default" | "primary" | "danger" | "risk"
export type HoverButtonSize = "sm" | "default" | "lg" | "icon"

type CircleState = {
  id: number
  x: number
  y: number
  color: string
  fadeState: "in" | "out" | null
}

const variantClasses: Record<HoverButtonVariant, string> = {
  default: cn(
    "border border-black/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,248,248,0.94)_38%,rgba(235,235,235,0.9)_100%)] text-slate-950",
    "hover:bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(250,250,250,0.96)_38%,rgba(238,238,238,0.92)_100%)]"
  ),
  primary: cn(
    "border border-black/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,248,248,0.94)_38%,rgba(235,235,235,0.9)_100%)] text-slate-950",
    "hover:bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(250,250,250,0.96)_38%,rgba(238,238,238,0.92)_100%)]"
  ),
  danger: cn(
    "border border-black/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,248,248,0.94)_38%,rgba(235,235,235,0.9)_100%)] text-slate-950",
    "hover:bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(250,250,250,0.96)_38%,rgba(238,238,238,0.92)_100%)]"
  ),
  risk: cn(
    "border border-black/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,248,248,0.94)_38%,rgba(235,235,235,0.9)_100%)] text-slate-950",
    "hover:bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(250,250,250,0.96)_38%,rgba(238,238,238,0.92)_100%)]"
  ),
}

const sizeClasses: Record<HoverButtonSize, string> = {
  sm: "px-4 py-2.5 text-sm",
  default: "px-8 py-3 text-base leading-6",
  lg: "px-8 py-4 text-lg",
  icon: "h-10 w-10 p-0",
}

function getCircleVars(variant: HoverButtonVariant): React.CSSProperties {
  if (variant === "primary") {
    return {
      "--circle-start": "#f87171",
      "--circle-end": "#dc2626",
    } as React.CSSProperties
  }

  if (variant === "danger") {
    return {
      "--circle-start": "#ff8aa0",
      "--circle-end": "#ff4d6a",
    } as React.CSSProperties
  }

  if (variant === "risk") {
    return {
      "--circle-start": "var(--btn-accent, var(--accent))",
      "--circle-end": "var(--btn-accent, var(--accent))",
    } as React.CSSProperties
  }

  return {
    "--circle-start": "var(--tw-gradient-from, #a0d9f8)",
    "--circle-end": "var(--tw-gradient-to, #3a5bbf)",
  } as React.CSSProperties
}

function useCircleTrail() {
  const [isListening, setIsListening] = React.useState(false)
  const [circles, setCircles] = React.useState<CircleState[]>([])
  const lastAddedRef = React.useRef(0)
  const timeoutIds = React.useRef<number[]>([])

  const createCircle = React.useCallback((width: number, x: number, y: number) => {
    const safeWidth = width || 1
    const xPos = x / safeWidth
    const color = `linear-gradient(to right, var(--circle-start) ${xPos * 100}%, var(--circle-end) ${
      xPos * 100
    }%)`

    setCircles((prev) => [...prev, { id: Date.now() + Math.random(), x, y, color, fadeState: null }])
  }, [])

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!isListening) return

      const currentTime = Date.now()
      if (currentTime - lastAddedRef.current <= 100) return

      lastAddedRef.current = currentTime
      const rect = event.currentTarget.getBoundingClientRect()
      createCircle(rect.width, event.clientX - rect.left, event.clientY - rect.top)
    },
    [createCircle, isListening]
  )

  React.useEffect(() => {
    circles.forEach((circle) => {
      if (circle.fadeState) return

      timeoutIds.current.push(
        window.setTimeout(() => {
          setCircles((prev) => prev.map((item) => (item.id === circle.id ? { ...item, fadeState: "in" } : item)))
        }, 0)
      )

      timeoutIds.current.push(
        window.setTimeout(() => {
          setCircles((prev) => prev.map((item) => (item.id === circle.id ? { ...item, fadeState: "out" } : item)))
        }, 1000)
      )

      timeoutIds.current.push(
        window.setTimeout(() => {
          setCircles((prev) => prev.filter((item) => item.id !== circle.id))
        }, 2200)
      )
    })
  }, [circles])

  React.useEffect(() => {
    return () => {
      timeoutIds.current.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  return {
    circles,
    handlePointerMove,
    handlePointerEnter: () => setIsListening(true),
    handlePointerLeave: () => setIsListening(false),
  }
}

function renderCircles(circles: CircleState[]) {
  return circles.map(({ id, x, y, color, fadeState }) => (
    <div
      key={id}
      className={cn(
        "pointer-events-none absolute z-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-lg transition-opacity duration-300",
        fadeState === "in" && "opacity-75",
        fadeState === "out" && "opacity-0 duration-[1.2s]",
        !fadeState && "opacity-0"
      )}
      style={{
        left: x,
        top: y,
        background: color,
      }}
    />
  ))
}

function getButtonClasses(variant: HoverButtonVariant, size: HoverButtonSize, className?: string) {
  const isRiskActive = className?.includes("risk-active")

  return cn(
    "relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-3xl font-medium",
    "cursor-pointer whitespace-nowrap backdrop-blur-lg transition-all duration-300",
    "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit]",
    "before:shadow-[inset_0_10px_18px_rgba(255,255,255,0.82),inset_0_-10px_16px_rgba(0,0,0,0.08),0_8px_20px_rgba(0,0,0,0.16)]",
    "before:mix-blend-multiply before:transition-transform before:duration-300 active:before:scale-[0.975]",
    "disabled:pointer-events-none disabled:opacity-45",
    sizeClasses[size],
    variantClasses[variant],
    variant === "risk" &&
      isRiskActive &&
      "border-[var(--btn-accent,var(--accent))] text-[var(--btn-accent,var(--accent))]",
    className
  )
}

export interface HoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: HoverButtonVariant
  size?: HoverButtonSize
}

export const HoverButton = React.forwardRef<HTMLButtonElement, HoverButtonProps>(
  ({ className, children, variant = "default", size = "default", style, ...props }, forwardedRef) => {
    const { circles, handlePointerMove, handlePointerEnter, handlePointerLeave } = useCircleTrail()

    const setRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        if (typeof forwardedRef === "function") {
          forwardedRef(node)
        } else if (forwardedRef) {
          forwardedRef.current = node
        }
      },
      [forwardedRef]
    )

    return (
      <button
        ref={setRefs}
        className={getButtonClasses(variant, size, className)}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        {...props}
        style={{
          ...getCircleVars(variant),
          ...style,
        }}
      >
        {renderCircles(circles)}
        <span className="relative z-[2] inline-flex items-center justify-center gap-2">{children}</span>
      </button>
    )
  }
)

HoverButton.displayName = "HoverButton"

export interface HoverButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: HoverButtonVariant
  size?: HoverButtonSize
}

export function HoverButtonLink({
  href,
  className,
  children,
  variant = "default",
  size = "default",
  style,
  ...props
}: HoverButtonLinkProps) {
  const { circles, handlePointerMove, handlePointerEnter, handlePointerLeave } = useCircleTrail()

  return (
    <Link
      href={href}
      className={getButtonClasses(variant, size, className)}
      onPointerMove={handlePointerMove as React.PointerEventHandler<HTMLAnchorElement>}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      {...props}
      style={{
        ...getCircleVars(variant),
        ...style,
      }}
    >
      {renderCircles(circles)}
      <span className="relative z-[2] inline-flex items-center justify-center gap-2">{children}</span>
    </Link>
  )
}
