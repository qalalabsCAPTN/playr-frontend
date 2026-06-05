import * as React from "react"
import { cn } from "../../index"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  actionLabel: string
  onAction?: () => void
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, title, description, actionLabel, onAction, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center py-stack-lg text-center", className)}
        {...props}
      >
        <h2 className="text-display-lg-mobile md:text-display-lg font-black tracking-tighter mb-4 uppercase">
          {title}
        </h2>
        <p className="font-body-lg text-body-lg text-secondary mb-8 max-w-md">
          {description}
        </p>
        <button
          onClick={onAction}
          className="bg-primary-container text-on-background px-12 py-4 rounded-full text-label-lg font-bold tracking-widest hover:scale-105 transition-transform"
        >
          {actionLabel}
        </button>
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"
