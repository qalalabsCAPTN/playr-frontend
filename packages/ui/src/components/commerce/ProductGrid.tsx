import * as React from "react"
import { cn } from "../../index"

export interface ProductGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const ProductGrid = React.forwardRef<HTMLDivElement, ProductGridProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ProductGrid.displayName = "ProductGrid"
