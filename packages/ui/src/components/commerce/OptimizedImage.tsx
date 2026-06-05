import * as React from "react"
import { cn } from "../../index"

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  hoverSrc?: string
}

export const OptimizedImage = React.forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ className, src, alt, hoverSrc, ...props }, ref) => {
    if (hoverSrc) {
      return (
        <>
          <img
            ref={ref}
            src={src}
            alt={alt}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0",
              className
            )}
            loading="lazy"
            {...props}
          />
          <img
            src={hoverSrc}
            alt={`${alt} Secondary`}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100",
              className
            )}
            loading="lazy"
          />
        </>
      )
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn("w-full h-full object-cover", className)}
        loading="lazy"
        {...props}
      />
    )
  }
)
OptimizedImage.displayName = "OptimizedImage"
