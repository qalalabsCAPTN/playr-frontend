import * as React from "react"
import { cn } from "../../index"
import { OptimizedImage } from "./OptimizedImage"

export interface ProductColor {
  name: string
  hex: string
  isWhite?: boolean
}

export interface ProductCardProps {
  id: string
  title: string
  price: number
  compareAtPrice?: number
  imageSrc: string
  hoverImageSrc?: string
  colors?: ProductColor[]
  badge?: string
  className?: string
}

export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ id, title, price, compareAtPrice, imageSrc, hoverImageSrc, colors, badge, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bento-card rounded-2xl overflow-hidden flex flex-col group relative",
          className
        )}
      >
        <div className="aspect-square relative overflow-hidden bg-surface-container-highest">
          <OptimizedImage src={imageSrc} alt={title} hoverSrc={hoverImageSrc} />

          <div className="absolute inset-x-0 bottom-4 px-4 quick-add z-10">
            <button className="w-full bg-primary-container text-on-primary-container font-label-md text-label-md py-3 rounded-lg shadow-lg hover:brightness-95 active:scale-95 transition-all">
              QUICK ADD
            </button>
          </div>

          <button className="absolute top-4 right-4 bg-white/80 backdrop-blur w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-red-500 transition-colors z-10">
            <span className="material-symbols-outlined">favorite</span>
          </button>

          {badge && (
            <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full z-10 uppercase">
              {badge}
            </div>
          )}
        </div>

        <div className="p-3 flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-label-md text-label-sm text-on-background line-clamp-1">
              {title}
            </h3>
            {colors && colors.length > 0 && (
              <div className="flex gap-1">
                {colors.map((color, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      color.isWhite ? "border border-outline/20" : ""
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            )}
          </div>
          <p className="font-headline-md text-headline-md mt-1">
            ₹ {price.toLocaleString('en-IN')}
            {compareAtPrice && (
              <span className="text-label-sm text-outline line-through ml-2">
                ₹ {compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </p>
        </div>
      </div>
    )
  }
)
ProductCard.displayName = "ProductCard"
