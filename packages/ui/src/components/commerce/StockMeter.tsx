import * as React from "react"
import { cn } from "../../index"

export interface StockMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  count: number
}

export const StockMeter = React.forwardRef<HTMLDivElement, StockMeterProps>(
  ({ className, count, ...props }, ref) => {
    if (count <= 0) return null

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 text-error font-label-md animate-pulse py-2",
          className
        )}
        {...props}
      >
        <span className="material-symbols-outlined text-[20px]">error</span>
        Hurry up! Only {count} left
      </div>
    )
  }
)
StockMeter.displayName = "StockMeter"
