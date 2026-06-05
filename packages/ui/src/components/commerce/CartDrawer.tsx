import * as React from "react"
import { cn } from "../../index"

export interface CartDrawerItem {
  id: string
  title: string
  price: number
  imageSrc: string
  colorName: string
  size: string
  quantity: number
}

export interface CartDrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  items: CartDrawerItem[]
  subtotal: number
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onCheckout: () => void
}

export const CartDrawer = React.forwardRef<HTMLDivElement, CartDrawerProps>(
  ({ className, isOpen, onClose, items, subtotal, onUpdateQuantity, onRemoveItem, onCheckout, ...props }, ref) => {
    
    // Trap focus/scroll lock would go here in a full implementation
    
    if (!isOpen) return null;

    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Drawer */}
        <div
          ref={ref}
          className={cn(
            "fixed inset-y-0 right-0 z-50 w-full max-w-md bg-surface border-l border-on-surface shadow-2xl flex flex-col transform transition-transform duration-300",
            className
          )}
          {...props}
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-2xl uppercase tracking-tighter">
                Your Cart ({items.length})
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors" aria-label="Close cart">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {/* Free Shipping Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                <span>{subtotal >= 10000 ? "✨ You've unlocked free shipping!" : `₹${(10000 - subtotal).toLocaleString('en-IN')} away from free shipping`}</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-black transition-all duration-500 ease-out" 
                  style={{ width: `${Math.min((subtotal / 10000) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-4xl text-secondary mb-4">shopping_bag</span>
                <p className="font-body-md text-secondary">Your cart is empty.</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border border-on-surface/20 rounded-xl bg-surface-container-low">
                  <div className="w-24 h-24 bg-surface-container rounded-lg overflow-hidden shrink-0">
                    <img src={item.imageSrc} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-label-md font-bold uppercase truncate max-w-[150px]">{item.title}</h3>
                        <span className="font-headline-sm font-bold">₹{item.price}</span>
                      </div>
                      <p className="text-secondary font-label-sm mt-1">Color: {item.colorName}</p>
                      <p className="text-secondary font-label-sm">Size: {item.size}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-on-surface/30 rounded-full px-2 py-1 gap-2 bg-surface">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="hover:text-primary px-1" aria-label="Decrease quantity">-</button>
                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="hover:text-primary px-1" aria-label="Increase quantity">+</button>
                      </div>
                      <button onClick={() => onRemoveItem(item.id)} className="text-secondary hover:text-error" aria-label="Remove item">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-on-surface/10 bg-surface-container-lowest">
              <div className="flex justify-between items-center mb-4">
                <span className="font-headline-md text-headline-md uppercase">Subtotal</span>
                <span className="font-headline-md text-headline-md font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-label-sm text-secondary mb-6">Shipping and taxes calculated at checkout.</p>
              <button 
                onClick={onCheckout}
                className="w-full py-4 bg-black text-white font-bold text-sm tracking-[0.2em] uppercase rounded-full hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
              >
                Checkout
              </button>
              <button 
                onClick={onClose}
                className="w-full mt-4 py-4 bg-transparent border-2 border-black text-black font-bold text-sm tracking-[0.2em] uppercase rounded-full hover:bg-zinc-50 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </>
    )
  }
)
CartDrawer.displayName = "CartDrawer"
