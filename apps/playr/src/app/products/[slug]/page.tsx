"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { NectarCommerce, NECTARAnalytics, loyaltyAdapter, drawPersonalizedTemplate } from "@playr/nectar-core"
import type { GamificationProductContext } from "@playr/nectar-core"
import { useCommerce } from "@/components/commerce/CommerceProvider"
import { StockMeter } from "@playr/ui"
import { InteractiveProductCard } from "@/components/commerce/InteractiveProductCard"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { cn } from "@playr/ui"
import ProductView from "@/components/bluorng/ProductView"
import { getProduct as getBluorngProduct } from "@/lib/bluorng-data"

// HTML5 Canvas Jersey Drawing Engine (DPI and Vector-based responsive rendering)
const drawJersey = (
  canvas: HTMLCanvasElement, 
  name: string, 
  number: string, 
  themeColor: string, 
  teamName: string,
  isHighRes: boolean = false
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  if (!isHighRes) {
    // Draw subtle sports studio backdrop
    const bgGrad = ctx.createRadialGradient(width/2, height/2, width/10, width/2, height/2, width/2);
    bgGrad.addColorStop(0, '#1a1917');
    bgGrad.addColorStop(1, '#0c0b0a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Draw grid mesh texture
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    const gridSize = width / 20;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  // Draw T-shirt jersey shape
  const cx = width / 2;
  const cy = height / 2 + (isHighRes ? 20 : 10);
  const scale = width * 0.75;

  let accentColor = '#ffffff';
  let fontColor = '#ffffff';
  let stripeColor = '#ffffff';
  const teamNameLower = teamName.toLowerCase();
  
  if (teamNameLower.includes('csk') || themeColor === '#FFFF00') {
    accentColor = '#005ea6'; // CSK Blue
    fontColor = '#005ea6';
    stripeColor = '#ff6c00'; // CSK Orange
  } else if (teamNameLower.includes('rr') || themeColor === '#FF69B4') {
    accentColor = '#111e38'; // RR Navy
    fontColor = '#ffffff';
    stripeColor = '#e0a96d'; // RR Gold
  } else if (teamNameLower.includes('mi') || themeColor === '#0000FF') {
    accentColor = '#e0a96d'; // MI Gold
    fontColor = '#e0a96d';
    stripeColor = '#003b7a'; // MI Navy
  } else {
    accentColor = '#333333';
    fontColor = '#ffffff';
    stripeColor = '#888888';
  }

  ctx.save();
  ctx.translate(cx, cy - scale * 0.05);

  // Body Outline Path
  ctx.beginPath();
  ctx.moveTo(-scale * 0.15, -scale * 0.35); // Left collar
  ctx.lineTo(-scale * 0.38, -scale * 0.28); // Left shoulder
  ctx.lineTo(-scale * 0.46, -scale * 0.08); // Left sleeve end
  ctx.lineTo(-scale * 0.34, -scale * 0.02); // Left sleeve bottom
  ctx.lineTo(-scale * 0.26, -scale * 0.12); // Left armpit
  ctx.lineTo(-scale * 0.24, scale * 0.35);  // Left side
  ctx.quadraticCurveTo(0, scale * 0.38, scale * 0.24, scale * 0.35); // Bottom curve
  ctx.lineTo(scale * 0.26, -scale * 0.12);  // Right armpit
  ctx.lineTo(scale * 0.34, -scale * 0.02);  // Right sleeve bottom
  ctx.lineTo(scale * 0.46, -scale * 0.08);  // Right sleeve end
  ctx.lineTo(scale * 0.38, -scale * 0.28);  // Right shoulder
  ctx.lineTo(scale * 0.15, -scale * 0.35);   // Right collar
  ctx.quadraticCurveTo(0, -scale * 0.31, -scale * 0.15, -scale * 0.35); // Collar curve
  ctx.closePath();

  // Draw main body shading/mesh gradient
  const jerseyGrad = ctx.createLinearGradient(0, -scale * 0.4, 0, scale * 0.4);
  jerseyGrad.addColorStop(0, themeColor);
  jerseyGrad.addColorStop(1, adjustColorBrightness(themeColor, -25));
  ctx.fillStyle = jerseyGrad;
  ctx.fill();

  // Raglan seams shadows
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.lineWidth = scale * 0.005;
  ctx.beginPath();
  ctx.moveTo(-scale * 0.15, -scale * 0.35);
  ctx.quadraticCurveTo(-scale * 0.2, -scale * 0.2, -scale * 0.26, -scale * 0.12);
  ctx.moveTo(scale * 0.15, -scale * 0.35);
  ctx.quadraticCurveTo(scale * 0.2, -scale * 0.2, scale * 0.26, -scale * 0.12);
  ctx.stroke();

  // Collar collar trim
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.moveTo(-scale * 0.15, -scale * 0.35);
  ctx.quadraticCurveTo(0, -scale * 0.31, scale * 0.15, -scale * 0.35);
  ctx.quadraticCurveTo(0, -scale * 0.34, -scale * 0.15, -scale * 0.35);
  ctx.closePath();
  ctx.fill();

  // Sleeve cuffs trim
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = scale * 0.025;
  ctx.beginPath();
  ctx.moveTo(-scale * 0.46, -scale * 0.08);
  ctx.lineTo(-scale * 0.34, -scale * 0.02);
  ctx.moveTo(scale * 0.46, -scale * 0.08);
  ctx.lineTo(scale * 0.34, -scale * 0.02);
  ctx.stroke();

  // Sleeve stripes accent
  ctx.strokeStyle = stripeColor;
  ctx.lineWidth = scale * 0.012;
  ctx.beginPath();
  ctx.moveTo(-scale * 0.44, -scale * 0.09);
  ctx.lineTo(-scale * 0.35, -scale * 0.04);
  ctx.moveTo(scale * 0.44, -scale * 0.09);
  ctx.lineTo(scale * 0.35, -scale * 0.04);
  ctx.stroke();

  // Side panels stripes
  ctx.fillStyle = stripeColor;
  ctx.beginPath();
  ctx.moveTo(-scale * 0.25, -scale * 0.05);
  ctx.lineTo(-scale * 0.24, scale * 0.35);
  ctx.lineTo(-scale * 0.21, scale * 0.35);
  ctx.lineTo(-scale * 0.23, -scale * 0.05);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(scale * 0.25, -scale * 0.05);
  ctx.lineTo(scale * 0.24, scale * 0.35);
  ctx.lineTo(scale * 0.21, scale * 0.35);
  ctx.lineTo(scale * 0.23, -scale * 0.05);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = scale * 0.005;
  ctx.stroke();

  // Render player name along arc path
  if (name && name.length >= 2) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let nameFontSize = Math.round(scale * 0.065);
    if (name.length > 12) {
      nameFontSize = Math.round(scale * (0.065 - (name.length - 12) * 0.002));
    }
    
    ctx.font = `900 ${nameFontSize}px Impact, "Oswald", "Arial Black", sans-serif`;
    ctx.fillStyle = fontColor;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = scale * 0.015;

    const radius = scale * 0.8;
    const centerArcY = scale * 0.48;
    const chars = name.split('');
    const charSpacingAngle = name.length > 10 ? 0.03 : 0.042;
    const totalAngle = (chars.length - 1) * charSpacingAngle;
    const startAngle = -Math.PI / 2 - totalAngle / 2;

    chars.forEach((char, index) => {
      const angle = startAngle + index * charSpacingAngle;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius + centerArcY;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);
      ctx.strokeText(char, 0, 0);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });

    ctx.restore();
  }

  // Render player number
  if (number) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const numFontSize = Math.round(scale * 0.32);
    ctx.font = `900 ${numFontSize}px Impact, "Oswald", "Arial Black", sans-serif`;
    ctx.fillStyle = fontColor;
    
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = scale * 0.05;
    ctx.strokeText(number, 0, scale * 0.06);
    ctx.fillText(number, 0, scale * 0.06);

    if (teamNameLower.includes('csk') || teamNameLower.includes('mi')) {
      ctx.strokeStyle = stripeColor;
      ctx.lineWidth = scale * 0.018;
      ctx.strokeText(number, 0, scale * 0.06);
      ctx.fillText(number, 0, scale * 0.06);
    }
  }

  ctx.restore();
};

const adjustColorBrightness = (hex: string, percent: number) => {
  let R = parseInt(hex.substring(1, 3), 16);
  let G = parseInt(hex.substring(3, 5), 16);
  let B = parseInt(hex.substring(5, 7), 16);

  R = Math.max(0, Math.min(255, R + (R * percent / 100)));
  G = Math.max(0, Math.min(255, G + (G * percent / 100)));
  B = Math.max(0, Math.min(255, B + (B * percent / 100)));

  const rHex = Math.round(R).toString(16).padStart(2, '0');
  const gHex = Math.round(G).toString(16).padStart(2, '0');
  const bHex = Math.round(B).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
};

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const bluorngProduct = getBluorngProduct(resolvedParams.slug);

  if (bluorngProduct) {
    return <ProductView product={bluorngProduct} />;
  }

  return <DefaultProductDetailPage slug={resolvedParams.slug} />;
}

function DefaultProductDetailPage({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = React.useState<any>(null)
  const [activeImage, setActiveImage] = React.useState("")
  const [activeAccordion, setActiveAccordion] = React.useState("desc")
  const { addToCart, wishlistItems, addToWishlist, removeFromWishlist } = useCommerce()
  const [relatedProducts, setRelatedProducts] = React.useState<any[]>([])
  const [gamificationCtx, setGamificationCtx] = React.useState<GamificationProductContext | null>(null)
  const [recentlyViewed, setRecentlyViewed] = React.useState<any[]>([])

  // Customization States
  const [isCustomizing, setIsCustomizing] = React.useState(false)
  const [playerName, setPlayerName] = React.useState("")
  const [playerNumber, setPlayerNumber] = React.useState("")
  const [isUploading, setIsUploading] = React.useState(false)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  // Selection states
  const [selectedColor, setSelectedColor] = React.useState<any>(null)
  const [selectedSize, setSelectedSize] = React.useState<string>("")

  // Input sanitization & validation
  const maxChars = product?.personalizationTemplate?.nameSettings?.maxCharacters || 18;
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.toUpperCase();
    const cleanVal = rawVal.replace(/[^A-Z\s]/g, "");
    if (cleanVal.length <= maxChars) {
      setPlayerName(cleanVal);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleanVal = rawVal.replace(/[^0-9]/g, "");
    if (cleanVal === "") {
      setPlayerNumber("");
      return;
    }
    if (cleanVal.length <= 2) {
      const numVal = parseInt(cleanVal, 10);
      if (numVal >= 0 && numVal <= 99) {
        setPlayerNumber(cleanVal);
      }
    }
  };

  // Redraw Canvas on changes
  React.useEffect(() => {
    if (!isCustomizing || !canvasRef.current || !product) return;
    if (product.personalizationTemplate && product.personalizationTemplate.enabled) {
      drawPersonalizedTemplate(canvasRef.current, product.personalizationTemplate, playerName, playerNumber, false);
    } else {
      const themeColor = selectedColor?.hex || product.colors[0]?.hex || "#000000";
      drawJersey(canvasRef.current, playerName, playerNumber, themeColor, product.title);
    }
  }, [isCustomizing, playerName, playerNumber, product, selectedColor]);

  // DPI-aware high-resolution upload with local mock fallback
  const handleAddToCartCustomized = async (isBuyNow = false) => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }
    if (playerName.trim().length < 2) {
      alert("Player Name must be at least 2 characters.");
      return;
    }
    if (playerNumber === "") {
      alert("Player Number must be between 0 and 99.");
      return;
    }

    setIsUploading(true);

    try {
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = 2400; 
      exportCanvas.height = 2400;
      
      if (product.personalizationTemplate && product.personalizationTemplate.enabled) {
        drawPersonalizedTemplate(exportCanvas, product.personalizationTemplate, playerName.trim(), playerNumber, false);
      } else {
        const themeColor = selectedColor?.hex || product.colors[0]?.hex || "#000000";
        drawJersey(exportCanvas, playerName.trim(), playerNumber, themeColor, product.title, true);
      }

      const blob = await new Promise<Blob | null>((resolve) => {
        exportCanvas.toBlob((b) => resolve(b), "image/png");
      });

      if (!blob) {
        throw new Error("Failed to generate artwork file.");
      }

      const formData = new FormData();
      formData.append("file", blob, `custom-${product.id}-${playerName}-${playerNumber}.png`);

      const uploadRes = await fetch("/api/personalizations/upload", {
        method: "POST",
        body: formData
      });

      if (!uploadRes.ok) {
        throw new Error("Upload failed");
      }

      const { url } = await uploadRes.json();

      addToCart({
        id: `${product.id}-${selectedColor?.name || 'default'}-${selectedSize}-${playerName}-${playerNumber}`,
        productId: product.id,
        variantId: "default",
        title: `${product.title} (Personalized)`,
        price: product.price,
        imageSrc: url, 
        colorName: selectedColor?.name || "Default",
        size: selectedSize,
        quantity: 1,
        isPersonalized: true,
        playerName: playerName.trim(),
        playerNumber: playerNumber,
        previewImageUrl: url
      } as any);

      if (isBuyNow) {
        router.push("/checkout");
      }
    } catch (err: any) {
      console.error("Personalization upload failed, using local offline fallback:", err);
      
      let dataUrl = "";
      if (canvasRef.current) {
        dataUrl = canvasRef.current.toDataURL("image/png");
      }

      addToCart({
        id: `${product.id}-${selectedColor?.name || 'default'}-${selectedSize}-${playerName}-${playerNumber}`,
        productId: product.id,
        variantId: "default",
        title: `${product.title} (Personalized)`,
        price: product.price,
        imageSrc: dataUrl || product.imageSrc,
        colorName: selectedColor?.name || "Default",
        size: selectedSize,
        quantity: 1,
        isPersonalized: true,
        playerName: playerName.trim(),
        playerNumber: playerNumber,
        previewImageUrl: dataUrl || product.imageSrc
      } as any);

      if (isBuyNow) {
        router.push("/checkout");
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Reviews states
  const [reviews, setReviews] = React.useState<any[]>([])
  const [showReviewForm, setShowReviewForm] = React.useState(false)
  const [reviewName, setReviewName] = React.useState("")
  const [reviewRating, setReviewRating] = React.useState(5)
  const [reviewComment, setReviewComment] = React.useState("")

  const fetchReviews = React.useCallback((prodIdOrSlug: string) => {
    fetch(`/api/products/${prodIdOrSlug}/reviews`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReviews(data)
        }
      })
      .catch(err => console.error("Error fetching reviews", err))
  }, [])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewName.trim() || !reviewComment.trim()) {
      alert("Please fill in all fields.")
      return
    }

    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: reviewName,
          rating: reviewRating,
          comment: reviewComment,
          userId: (session?.user as any)?.id || null
        })
      })

      if (res.ok) {
        setReviewName("")
        setReviewRating(5)
        setReviewComment("")
        setShowReviewForm(false)
        fetchReviews(product.id)
        // Refresh XP context
        loyaltyAdapter.getProductGamificationContext(product.id).then(ctx => setGamificationCtx(ctx))
        alert("Review submitted successfully! You earned +200 XP.")
      } else {
        const err = await res.json()
        alert(err.error || "Failed to submit review")
      }
    } catch (err) {
      console.error(err)
      alert("Error submitting review")
    }
  }

  React.useEffect(() => {
    NectarCommerce.getProduct(slug).then(p => {
      if (p) {
        setProduct(p)
        setActiveImage(p.imageSrc)
        if (p.colors && p.colors.length > 0) {
          setSelectedColor(p.colors[0])
        }
        if (p.sizes && p.sizes.length > 0) {
          setSelectedSize(p.sizes[0])
        }
        NECTARAnalytics.trackProductView(p)
        NectarCommerce.getRelatedProducts(p.specifications).then(related => setRelatedProducts(related))
        // Fetch XP context from NECTAR — never compute on frontend
        loyaltyAdapter.getProductGamificationContext(p.id).then(ctx => setGamificationCtx(ctx))
        fetchReviews(p.id)

        // Save to recently viewed
        try {
          const stored = localStorage.getItem("recently_viewed");
          let list: string[] = stored ? JSON.parse(stored) : [];
          list = [p.slug, ...list.filter(item => item !== p.slug)].slice(0, 5);
          localStorage.setItem("recently_viewed", JSON.stringify(list));
        } catch(e) {
          console.error("Error saving recently viewed", e);
        }
      }
    })
  }, [slug, fetchReviews])

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("recently_viewed");
      if (stored) {
        const list: string[] = JSON.parse(stored);
        const fetchOthers = list.filter(item => item !== slug);
        Promise.all(fetchOthers.map(item => NectarCommerce.getProduct(item)))
          .then(res => setRecentlyViewed(res.filter(Boolean)));
      }
    } catch(e) {
      console.error("Error loading recently viewed", e);
    }
  }, [slug]);

  // Reviews calculations
  const totalReviews = reviews.length
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0"

  const starPercentages = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
    return { star, count, percentage }
  })

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-primary gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} className="material-symbols-outlined text-[18px]">
            {i <= rating ? "star" : "star_outline"}
          </span>
        ))}
      </div>
    )
  }

  if (!product) return (
    <main className="max-w-screen-2xl mx-auto px-4 md:px-container-margin-desktop pt-32 pb-24 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square bg-surface-container rounded-2xl" />
          <div className="flex gap-4">
            {[1,2,3,4].map(i => <div key={i} className="w-24 h-24 bg-surface-container rounded-xl shrink-0" />)}
          </div>
        </div>
        <div className="lg:col-span-5 space-y-6">
          <div className="h-4 bg-surface-container rounded w-24" />
          <div className="h-10 bg-surface-container rounded w-3/4" />
          <div className="h-8 bg-surface-container rounded w-32" />
          <div className="flex gap-3">
            {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full bg-surface-container" />)}
          </div>
          <div className="flex gap-3">
            {[1,2,3,4,5].map(i => <div key={i} className="w-14 h-14 rounded-full bg-surface-container" />)}
          </div>
          <div className="h-14 bg-surface-container rounded-full" />
          <div className="h-14 bg-surface-container rounded-full" />
        </div>
      </div>
    </main>
  )

  return (
    <main className="max-w-screen-2xl mx-auto px-container-margin-mobile md:px-container-margin-desktop py-section-gap-md pt-32">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-8 text-on-surface-variant font-label-md">
        <Link className="hover:text-primary" href="/">Home</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link className="hover:text-primary" href="/collections/premium-polos">{product.category}</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-bold">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-section-gap-md items-start">
        {/* Left Column: Image Gallery / Custom Preview */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="aspect-square bg-surface-container-low rounded-lg overflow-hidden shadow-sm group relative flex items-center justify-center">
            {isCustomizing ? (
              <canvas
                ref={canvasRef}
                width={600}
                height={600}
                className="w-full h-full max-w-full max-h-full object-contain"
                aria-label="Live personalized jersey preview"
              />
            ) : activeImage ? (
              <Image
                fill
                alt={`${product.title} main view`}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                src={activeImage}
              />
            ) : null}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {product.gallery.map((img: string, idx: number) => (
              <button
                key={idx}
                className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-surface-container-low shadow-sm border-2 transition-all ${
                  !isCustomizing && activeImage === img ? "border-primary" : "border-transparent"
                }`}
                onClick={() => {
                  setActiveImage(img);
                  setIsCustomizing(false);
                }}
              >
                <Image fill alt={`Thumbnail ${idx + 1}`} className="object-cover" src={img} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="lg:col-span-5 flex flex-col gap-8 sticky top-32">
          <div className="space-y-2">
            <span className="font-label-md text-primary tracking-widest uppercase">{product.category}</span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">{product.title}</h1>
            <div className="text-label-sm text-on-surface-variant font-medium mt-1">
              SKU: {product.variants[0]?.sku}
            </div>
            <div className="flex items-center gap-4 pt-2">
              <span className="font-headline-md text-headline-md text-on-surface">
                ₹ {product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && (
                <span className="font-body-lg text-body-lg text-on-surface-variant line-through opacity-60">
                  ₹ {product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.badge && (
                <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-md font-bold">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-4">
            <span className="font-label-md text-on-surface font-bold uppercase tracking-wider">
              Color: <span className="font-normal opacity-60">{selectedColor?.name || "Default"}</span>
            </span>
            <div className="flex gap-3">
              {product.colors.map((c: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(c)}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 transition-all hover:scale-110 active:scale-95",
                    selectedColor?.name === c.name ? "border-primary ring-2 ring-primary-container" : "border-surface"
                  )}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-label-md text-on-surface font-bold uppercase tracking-wider">Select Size</span>
              <button className="text-primary font-label-md hover:underline">Size Chart</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((s: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedSize(s)}
                  className={cn(
                    "w-14 h-14 rounded-full border-2 font-bold transition-all active:scale-95 flex items-center justify-center",
                    selectedSize === s ? "border-primary bg-primary text-on-primary" : "border-outline/20 hover:border-primary hover:text-primary"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <StockMeter count={2} />

          {(product.isPersonalized || (product.personalizationTemplate && product.personalizationTemplate.enabled)) && (
            <div className="border border-outline-variant/30 rounded-2xl p-6 bg-surface-container/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">edit_square</span>
                  <span className="font-headline-sm font-bold uppercase tracking-wide">Customize Jersey</span>
                </div>
                <button
                  onClick={() => setIsCustomizing(!isCustomizing)}
                  className={cn(
                    "text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider transition-colors",
                    isCustomizing ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary"
                  )}
                >
                  {isCustomizing ? "Active" : "Configure"}
                </button>
              </div>

              {isCustomizing && (
                <div className="space-y-4 pt-2 border-t border-outline/10 animate-fade-in">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-secondary">
                      <label htmlFor="playerName">Player Name</label>
                      <span>{playerName.length} / {maxChars}</span>
                    </div>
                    <input
                      id="playerName"
                      type="text"
                      className="w-full bg-surface-container border border-outline/20 rounded-xl px-4 py-3 text-body-md outline-none focus:border-primary uppercase font-mono tracking-widest text-on-surface"
                      placeholder="ENTER NAME"
                      value={playerName}
                      onChange={handleNameChange}
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="playerNumber" className="block text-xs font-bold uppercase tracking-wider text-secondary">Player Number (0-99)</label>
                    <input
                      id="playerNumber"
                      type="text"
                      className="w-full bg-surface-container border border-outline/20 rounded-xl px-4 py-3 text-body-md outline-none focus:border-primary font-mono tracking-widest text-on-surface"
                      placeholder="00"
                      value={playerNumber}
                      onChange={handleNumberChange}
                      autoComplete="off"
                    />
                  </div>

                  <p className="text-[10px] text-on-surface-variant leading-relaxed uppercase">
                    * Names are converted to uppercase automatically. Allowed: A-Z and spaces only. Numbers 0-99 only.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-4 pt-4">
            {/* XP context from NECTAR — render only, no calculations */}
            {gamificationCtx && gamificationCtx.totalXPEarned > 0 && (
              <div className="bg-surface-container-low border border-primary/20 rounded-lg p-4 flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">card_membership</span>
                  <span className="font-label-md text-on-surface">
                    Earn{' '}
                    <span className="font-bold text-primary">{gamificationCtx.totalXPEarned.toLocaleString()} XP</span>
                    {gamificationCtx.tierBonus > 0 && (
                      <span className="text-on-surface-variant text-xs ml-1">
                        (incl. {gamificationCtx.tierBonus} tier bonus)
                      </span>
                    )}
                    {' '}on this purchase
                  </span>
                </div>
                <Link href="/rewards" className="material-symbols-outlined text-on-surface-variant text-[20px] hover:text-primary transition-colors">help</Link>
              </div>
            )}
            {/* Loading state */}
            {!gamificationCtx && (
              <div className="bg-surface-container-low border border-outline-variant/20 rounded-lg p-4 flex items-center gap-3 mb-2 animate-pulse">
                <span className="material-symbols-outlined text-on-surface-variant/40">card_membership</span>
                <div className="h-3 bg-surface-container rounded w-48" />
              </div>
            )}
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  if (isCustomizing) {
                    handleAddToCartCustomized(false);
                  } else {
                    if (!selectedSize) {
                      alert("Please select a size first.");
                      return;
                    }
                    addToCart({
                      id: `${product.id}-${selectedColor?.name || 'default'}-${selectedSize}`,
                      productId: product.id,
                      variantId: "default",
                      title: product.title,
                      price: product.price,
                      imageSrc: product.imageSrc,
                      colorName: selectedColor?.name || "Default",
                      size: selectedSize,
                      quantity: 1
                    })
                  }
                }}
                disabled={isUploading}
                className="flex-grow bg-primary-container text-on-primary-container font-bold text-headline-sm py-5 rounded-full shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading Preview..." : "Add to Cart"}
              </button>
              {(() => {
                const isWishlisted = wishlistItems.some(item => item.productId === product.id);
                return (
                  <button
                    onClick={() => {
                      if (isWishlisted) {
                        removeFromWishlist(product.id);
                      } else {
                        addToWishlist({
                          productId: product.id,
                          title: product.title,
                          price: product.price,
                          imageSrc: product.imageSrc,
                          category: product.category
                        });
                      }
                    }}
                    className={cn(
                      "px-6 border-2 rounded-full flex items-center justify-center transition-all active:scale-95",
                      isWishlisted 
                        ? "border-red-500/20 bg-red-50/50 text-red-500" 
                        : "border-secondary text-on-surface hover:bg-surface-container"
                    )}
                    aria-label="Toggle Wishlist"
                  >
                    <span 
                      className="material-symbols-outlined text-[24px]" 
                      style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>
                );
              })()}
            </div>
            <button 
              onClick={() => {
                if (isCustomizing) {
                  handleAddToCartCustomized(true);
                } else {
                  if (!selectedSize) {
                    alert("Please select a size first.");
                    return;
                  }
                  addToCart({
                    id: `${product.id}-${selectedColor?.name || 'default'}-${selectedSize}`,
                    productId: product.id,
                    variantId: "default",
                    title: product.title,
                    price: product.price,
                    imageSrc: product.imageSrc,
                    colorName: selectedColor?.name || "Default",
                    size: selectedSize,
                    quantity: 1
                  });
                  router.push('/checkout');
                }
              }}
              disabled={isUploading}
              className="w-full bg-transparent border-2 border-secondary text-on-surface font-bold text-headline-sm py-5 rounded-full hover:bg-surface-container transition-all active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Please wait..." : "Buy Now"}
            </button>
            <div className="flex items-center gap-4 text-sm text-on-surface-variant pt-4 border-t border-outline/10">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Product link copied to clipboard!");
                }}
                className="flex items-center gap-2 hover:text-primary transition-colors font-bold uppercase tracking-wider text-xs"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                Share
              </button>
              <span className="opacity-20">|</span>
              <span className="flex items-center gap-1.5 text-success font-bold uppercase tracking-wider text-xs">
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                Free Shipping &amp; Returns
              </span>
            </div>
          </div>

          {/* Accordions */}
          <div className="mt-8 border-t border-outline/10 divide-y divide-outline/10">
            <div className="py-4">
              <button className="flex justify-between items-center w-full group" onClick={() => setActiveAccordion(activeAccordion === "desc" ? "" : "desc")}>
                <span className="font-label-md font-bold text-on-surface uppercase tracking-wider">Description</span>
                <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: activeAccordion === "desc" ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
              </button>
              {activeAccordion === "desc" && (
                <div className="mt-4 text-on-surface-variant font-body-md leading-relaxed animate-fade-in">
                  {product.description}
                </div>
              )}
            </div>
            
            <div className="py-4">
              <button className="flex justify-between items-center w-full group" onClick={() => setActiveAccordion(activeAccordion === "specs" ? "" : "specs")}>
                <span className="font-label-md font-bold text-on-surface uppercase tracking-wider">Specifications</span>
                <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: activeAccordion === "specs" ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
              </button>
              {activeAccordion === "specs" && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {product.specifications.map((spec: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="py-4">
              <button className="flex justify-between items-center w-full group" onClick={() => setActiveAccordion(activeAccordion === "material" ? "" : "material")}>
                <span className="font-label-md font-bold text-on-surface uppercase tracking-wider">Material & Care</span>
                <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: activeAccordion === "material" ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
              </button>
              {activeAccordion === "material" && (
                <div className="mt-4 text-on-surface-variant font-body-md space-y-2">
                  <p><strong>Material:</strong> {product.materialAndCare.material}</p>
                  <p><strong>Care:</strong> {product.materialAndCare.care}</p>
                </div>
              )}
            </div>

            <div className="py-4">
              <button className="flex justify-between items-center w-full group" onClick={() => setActiveAccordion(activeAccordion === "shipping" ? "" : "shipping")}>
                <span className="font-label-md font-bold text-on-surface uppercase tracking-wider">Shipping & Returns</span>
                <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: activeAccordion === "shipping" ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
              </button>
              {activeAccordion === "shipping" && (
                <div className="mt-4 text-on-surface-variant font-body-md space-y-2 leading-relaxed">
                  <p><strong>Shipping:</strong> Free standard shipping across India. Orders are processed within 24-48 hours and typically delivered in 3-5 business days. Express shipping option is available at checkout.</p>
                  <p><strong>Returns:</strong> We offer a hassle-free 7-day return and exchange policy. Items must be unused, unwashed, and in their original packaging with tags intact.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-section-gap-lg pt-section-gap-md border-t border-outline/10">
        <h2 className="font-headline-lg text-headline-lg mb-8">Customer Reviews</h2>
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-1/3 p-8 bg-surface-container-low rounded-lg shadow-sm border border-outline/10">
            <div className="text-center space-y-4">
              <div className="text-headline-xl font-bold">{averageRating}</div>
              <div className="flex justify-center text-primary">
                {[1, 2, 3, 4, 5].map(i => (
                  <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: i <= Math.round(Number(averageRating)) ? "'FILL' 1" : "'FILL' 0" }}>
                    star
                  </span>
                ))}
              </div>
              <p className="text-on-surface-variant font-label-md uppercase tracking-wider">{totalReviews} Reviews</p>
              <button 
                onClick={() => {
                  if (session) {
                    setShowReviewForm(!showReviewForm)
                  } else {
                    alert("Please log in to write a review and earn XP.")
                  }
                }}
                className="w-full bg-on-surface text-surface py-4 rounded-full font-bold hover:opacity-90 transition-opacity mt-4"
              >
                {showReviewForm ? "Cancel Review" : "Write a Review"}
              </button>
            </div>
          </div>
          
          <div className="flex-1 space-y-4 w-full">
            {starPercentages.map(({ star, percentage }) => (
              <div key={star} className="flex items-center gap-4 w-full">
                <span className="font-label-md w-4">{star}</span>
                <span className="material-symbols-outlined text-primary text-[16px]">star</span>
                <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="font-label-md w-8 text-right opacity-40">{percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="mt-8 p-6 bg-surface-container-low rounded-lg border border-outline/10 max-w-2xl space-y-4">
            <h3 className="font-headline-sm text-headline-sm">Write an Honest Review</h3>
            <p className="text-sm text-on-surface-variant">Reviewing purchases earns you <span className="text-primary font-bold">+200 XP</span> loyalty rewards!</p>
            
            <div className="space-y-2">
              <label className="block text-label-md font-bold uppercase tracking-wider">Your Name</label>
              <input 
                type="text" 
                value={reviewName} 
                onChange={(e) => setReviewName(e.target.value)} 
                className="w-full bg-surface-container border border-outline/25 rounded-md p-3 text-on-surface"
                placeholder="Enter your name" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-label-md font-bold uppercase tracking-wider">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setReviewRating(val)}
                    className="text-primary focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: val <= reviewRating ? "'FILL' 1" : "'FILL' 0" }}>
                      star
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-label-md font-bold uppercase tracking-wider">Comment</label>
              <textarea 
                value={reviewComment} 
                onChange={(e) => setReviewComment(e.target.value)} 
                className="w-full bg-surface-container border border-outline/25 rounded-md p-3 text-on-surface h-32"
                placeholder="Share your thoughts about this product..." 
                required
              />
            </div>

            <button 
              type="submit" 
              className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold hover:opacity-95 transition-opacity"
            >
              Submit Review
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="mt-12 space-y-6">
          <h3 className="font-headline-sm text-headline-sm border-b border-outline/10 pb-4">Customer Feedback</h3>
          {reviews.length === 0 ? (
            <p className="text-on-surface-variant italic">No reviews yet. Be the first to write a review!</p>
          ) : (
            <div className="divide-y divide-outline/10">
              {reviews.map((r) => (
                <div key={r.id} className="py-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {r.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-on-surface">{r.userName}</div>
                        <div className="text-xs text-on-surface-variant">
                          {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    {renderStars(r.rating)}
                  </div>
                  <p className="text-on-surface-variant leading-relaxed pl-13">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-section-gap-lg">
        <h2 className="font-headline-lg text-headline-lg mb-12 text-center">Complete the Look</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="md:col-span-2 relative overflow-hidden rounded-lg group h-[400px]">
            <Image
              fill
              alt="Premium performance context"
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/ADBb0ujLE56BLAvif6FN48FqWRK9SOl81LorZkCyrxWx5xMWuN_s7a1gIW42OlhEeXRMchiaXx0rG3xqC6kSOw151MzU9JEQTLahkm9dgFCaKS9eG7sNNHrg_yl3fLf-WwRbqiaF7JkqRqUe0UsHcrj-xhUYzrRVcWFw7re518CZbfBDXmjepYA2PNqMk5bOn_Ushcu2oOMv2bDC1bux8Xf3Xvdw2N-ArncR5KvjoPlWEzEnPSXZmhv-TeWOLAw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 to-transparent flex flex-col justify-end p-10">
              <span className="font-label-md text-primary-fixed mb-2">PRO PERFORMANCE</span>
              <h3 className="font-headline-md text-headline-md text-surface-container-lowest max-w-sm">
                Engineered for the elite athlete in you.
              </h3>
            </div>
          </div>
          
          <div className="space-y-gutter">
            {relatedProducts.slice(0, 1).map((related) => (
              <InteractiveProductCard
                key={related.id}
                id={related.id}
                title={related.title}
                price={related.price}
                compareAtPrice={related.compareAtPrice}
                imageSrc={related.imageSrc}
                hoverImageSrc={related.hoverImageSrc}
                colors={related.colors}
                badge={related.badge}
                slug={related.slug}
              />
            ))}
            <div className="bg-primary-container p-8 rounded-lg flex flex-col justify-between h-[180px]">
              <h4 className="font-headline-sm text-headline-sm text-on-primary-container leading-tight">
                Join playR Elite for 15% off your first order.
              </h4>
              <button className="font-label-md uppercase tracking-widest text-on-primary-container border-b-2 border-on-primary-container w-max">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="mt-section-gap-lg pt-section-gap-md border-t border-outline/10">
          <h2 className="font-headline-lg text-headline-lg mb-12 text-center">Recently Viewed Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter">
            {recentlyViewed.map((prod) => (
              <InteractiveProductCard
                key={prod.id}
                id={prod.id}
                title={prod.title}
                price={prod.price}
                compareAtPrice={prod.compareAtPrice}
                imageSrc={prod.imageSrc}
                hoverImageSrc={prod.hoverImageSrc}
                colors={prod.colors}
                badge={prod.badge}
                slug={prod.slug}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
