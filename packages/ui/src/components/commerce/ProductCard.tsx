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
  isWishlisted?: boolean
  onWishlistToggle?: (e: React.MouseEvent) => void
  onQuickAdd?: (e: React.MouseEvent) => void
}

export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ id, title, price, compareAtPrice, imageSrc, hoverImageSrc, colors, badge, className, isWishlisted, onWishlistToggle, onQuickAdd }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl overflow-hidden flex flex-col group relative bg-surface-container-lowest shadow-sm border border-outline-variant/30 hover:shadow-xl hover:border-outline/20 transition-all duration-500 cursor-pointer transform hover:-translate-y-1",
          className
        )}
      >
        <div className="aspect-[4/5] relative overflow-hidden bg-zinc-100">
          <OptimizedImage src={imageSrc} alt={title} hoverSrc={hoverImageSrc} />

          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <div className="absolute inset-x-0 bottom-4 px-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onQuickAdd) onQuickAdd(e);
              }}
              className="w-full bg-black/90 backdrop-blur-xl text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl shadow-2xl hover:bg-black hover:scale-[1.02] active:scale-95 transition-all"
            >
              Quick Add
            </button>
          </div>

          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onWishlistToggle) onWishlistToggle(e);
            }}
            className={cn(
              "absolute top-4 right-4 bg-white/80 backdrop-blur shadow-sm w-10 h-10 rounded-full flex items-center justify-center transition-all z-10",
              isWishlisted ? "text-red-500 hover:scale-110 active:scale-90" : "text-zinc-400 hover:text-red-500 hover:scale-110 active:scale-90"
            )}
            aria-label="Toggle Wishlist"
          >
            <span 
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: isWishlisted ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 400" }}
            >
              favorite
            </span>
          </button>

          {badge && (
            <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full z-10 uppercase shadow-md">
              {badge}
            </div>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-zinc-900 line-clamp-1 uppercase tracking-wider">
              {title}
            </h3>
            {colors && colors.length > 0 && (
              <div className="flex gap-1.5 mt-2">
                {colors.map((color, i) => (
                  <div
                    key={i}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={cn(
                      "w-3.5 h-3.5 rounded-full shadow-inner ring-1 ring-black/5 cursor-pointer hover:scale-110 transition-transform",
                      color.isWhite ? "border border-zinc-200" : ""
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            )}
          </div>
          <p className="font-black text-lg mt-3 text-zinc-900 tracking-tight">
            ₹ {price.toLocaleString('en-IN')}
            {compareAtPrice && (
              <span className="text-sm text-zinc-400 font-medium line-through ml-3">
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
