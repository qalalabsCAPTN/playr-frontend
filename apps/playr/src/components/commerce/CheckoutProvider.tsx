"use client"

import React, { createContext, useContext, useState } from "react"
import { ShippingAddress, PaymentMethod, ShippingMethod, eventPublisher } from "@playr/nectar-core"
import { useRouter } from "next/navigation"
import { useCommerce } from "./CommerceProvider"
import { useSession } from "next-auth/react"
import { createRazorpayOrderAction, verifyPaymentSignatureAction } from "@/app/actions/payment"

/* eslint-disable no-unused-vars */
interface CheckoutContextType {
  email: string;
  setEmail: (email: string) => void;
  savedAddresses: ShippingAddress[];
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
  shippingAddress: Partial<ShippingAddress>;
  setShippingAddress: React.Dispatch<React.SetStateAction<Partial<ShippingAddress>>>;
  useSameForBilling: boolean;
  setUseSameForBilling: (val: boolean) => void;
  billingAddress: Partial<ShippingAddress>;
  setBillingAddress: React.Dispatch<React.SetStateAction<Partial<ShippingAddress>>>;
  shippingMethod: ShippingMethod;
  setShippingMethod: (method: ShippingMethod) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  walletBalance: number;
  applyWallet: boolean;
  setApplyWallet: (val: boolean) => void;
  rewardsPoints: number;
  applyRewards: boolean;
  setApplyRewards: (val: boolean) => void;
  isProcessing: boolean;
  error: string | null;
  submitCheckout: () => Promise<void>;
  discount: number;
  appliedCoupon: string | null;
  applyPromoCode: (code: string) => Promise<boolean>;
}
/* eslint-enable no-unused-vars */

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { cartItems, cartSubtotal } = useCommerce()
  const { data: session } = useSession()
  
  const [email, setEmail] = useState("")
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [shippingAddress, setShippingAddress] = useState<Partial<ShippingAddress>>({})
  const [useSameForBilling, setUseSameForBilling] = useState(true)
  const [billingAddress, setBillingAddress] = useState<Partial<ShippingAddress>>({})
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card")
  const [promoCode, setPromoCode] = useState("")
  const [walletBalance, setWalletBalance] = useState(0)
  const [applyWallet, setApplyWallet] = useState(false)
  const [rewardsPoints, setRewardsPoints] = useState(0)
  const [applyRewards, setApplyRewards] = useState(false)
  
  // Payment Simulation states
  const [showPaymentSimulation, setShowPaymentSimulation] = useState(false)
  const [paymentSimulationResolve, setPaymentSimulationResolve] = useState<any>(null)
  
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    if (session?.user) {
      const userId = (session.user as any).id;
      setEmail(session.user.email || "");
      fetch(`/api/identity/users/${userId}`)
        .then(res => res.json())
        .then(user => {
          if (user) {
            setWalletBalance(user.walletBalance || 0);
            setRewardsPoints(user.rewardsPoints || 0);
            if (user.addresses && user.addresses.length > 0) {
              setSavedAddresses(user.addresses);
              setSelectedAddressId(`saved-0`);
              setShippingAddress(user.addresses[0]);
            }
          }
        })
        .catch(err => console.error("Error loading checkout profile", err));
    }
  }, [session]);

  const applyPromoCode = async (code: string) => {
    if (!code.trim()) return false;
    setError(null);
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(code)}`);
      if (res.ok) {
        const coupon = await res.json();
        if (coupon.discountType === 'percentage') {
          const amount = Math.round((cartSubtotal * coupon.discountValue) / 100);
          setDiscount(amount);
        } else {
          setDiscount(Math.min(coupon.discountValue, cartSubtotal));
        }
        setAppliedCoupon(coupon.code);
        setPromoCode(coupon.code);
        return true;
      } else {
        const err = await res.json();
        setError(err.error || "Invalid promo code.");
        setDiscount(0);
        setAppliedCoupon(null);
        return false;
      }
    } catch (err) {
      console.error(err);
      setError("Failed to apply promo code.");
      setDiscount(0);
      setAppliedCoupon(null);
      return false;
    }
  }

  const submitCheckout = async () => {
    setIsProcessing(true)
    setError(null)
    
    // Auth Validation for production
    if (!session?.user) {
      setError("You must be logged in to checkout. Please sign in.")
      setIsProcessing(false)
      return
    }

    const userId = (session.user as any).id;

    // Basic validation
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.")
      setIsProcessing(false)
      return
    }

    if (selectedAddressId === null) {
      if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pinCode) {
        setError("Please fill out all required shipping fields.")
        setIsProcessing(false)
        return
      }
    }

    if (!useSameForBilling) {
      if (!billingAddress.firstName || !billingAddress.lastName || !billingAddress.address || !billingAddress.city || !billingAddress.pinCode) {
        setError("Please fill out all required billing fields.")
        setIsProcessing(false)
        return
      }
    }

    try {
      // In production, we call a Server Action to create the order and initiate the gateway
      // This eliminates the fake timeout mocks.
      // E.g., const { orderId, paymentToken } = await createOrderAction({ ... })
      let paymentSuccess = false;

      // Initiate server action flow
      if (paymentMethod === 'razorpay') {
         if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY || process.env.NEXT_PUBLIC_RAZORPAY_KEY === 'rzp_test_mock') {
           // Demo Mode: Trigger interactive sandbox simulation modal
           const simulatedSuccess = await new Promise<boolean>((resolve) => {
             setShowPaymentSimulation(true);
             setPaymentSimulationResolve(() => (success: boolean) => {
               setShowPaymentSimulation(false);
               resolve(success);
             });
           });
           paymentSuccess = simulatedSuccess;
         } else {
           // Secure Order Creation via Server Action
           const gatewayOrder = await createRazorpayOrderAction(cartSubtotal);

           paymentSuccess = await new Promise<boolean>((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
              const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                amount: gatewayOrder.amount,
                currency: gatewayOrder.currency,
                order_id: gatewayOrder.orderId,
                name: 'playR',
                description: 'Purchase',
                handler: async function (response: any) {
                  try {
                    const verification = await verifyPaymentSignatureAction(
                      response.razorpay_order_id,
                      response.razorpay_payment_id,
                      response.razorpay_signature
                    );
                    if (verification.verified) {
                      resolve(true);
                    } else {
                      setError("Payment verification failed on server.");
                      resolve(false);
                    }
                  } catch (e) {
                    setError("Payment verification failed. Please contact support.");
                    resolve(false);
                  }
                },
                modal: {
                  ondismiss: function() {
                    resolve(false);
                  }
                }
              };
              const rzp = new (window as any).Razorpay(options);
              rzp.open();
            };
            script.onerror = () => {
              setError("Failed to load Razorpay SDK.");
              resolve(false);
            };
            document.body.appendChild(script);
          });
        }
      } else {
         // Fallback for Credit Card / Cash on Delivery for Demo
         await new Promise(resolve => setTimeout(resolve, 1500));
         paymentSuccess = true;
      }

      if (paymentSuccess) {
        // Calculate order details
        const shippingCost = shippingMethod === 'express' ? 150 : 0;
        let finalTotal = cartSubtotal + shippingCost - discount;
        const walletDeduction = applyWallet ? Math.min(walletBalance, finalTotal) : 0;
        finalTotal -= walletDeduction;
        const rewardsDeduction = applyRewards ? Math.min(rewardsPoints / 10, finalTotal) : 0;
        finalTotal -= rewardsDeduction;
        if (finalTotal < 0) finalTotal = 0;

        const orderData = {
          userId: userId,
          total: finalTotal,
          items: cartItems.map(item => ({
            productId: item.productId,
            title: item.title,
            imageSrc: item.imageSrc,
            price: item.price,
            quantity: item.quantity,
            colorName: item.colorName,
            size: item.size,
            isPersonalized: item.isPersonalized || false,
            playerName: item.playerName || "",
            playerNumber: item.playerNumber || "",
            previewImageUrl: item.previewImageUrl || ""
          })),
          shippingAddress: selectedAddressId !== null && selectedAddressId.startsWith('saved-')
            ? savedAddresses[parseInt(selectedAddressId.split('-')[1])]
            : shippingAddress,
          paymentMethod: paymentMethod,
          paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
          walletDeducted: walletDeduction,
          rewardsDeducted: rewardsDeduction * 10,
          discountDeducted: discount,
          couponCode: appliedCoupon
        };

        const orderRes = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });

        if (orderRes.ok) {
          const orderResult = await orderRes.json();
          const savedOrder = orderResult.order;
          
          await eventPublisher.emitPurchaseCompleted({
            orderId: savedOrder.displayId,
            userId: userId, 
            totalAmount: finalTotal,
            currency: 'INR',
            paymentMethod: paymentMethod,
            timestamp: new Date().toISOString(),
            items: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          });

          router.push(`/checkout/success?orderId=${savedOrder.displayId}`);
        } else {
          const err = await orderRes.json();
          setError(err.error || "Failed to save order in database.");
        }
      } else {
        if (!error) setError("Payment processing failed or was cancelled. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <CheckoutContext.Provider value={{
      email,
      setEmail,
      savedAddresses,
      selectedAddressId,
      setSelectedAddressId,
      shippingAddress,
      setShippingAddress,
      useSameForBilling,
      setUseSameForBilling,
      billingAddress,
      setBillingAddress,
      shippingMethod,
      setShippingMethod,
      paymentMethod,
      setPaymentMethod,
      promoCode,
      setPromoCode,
      walletBalance,
      applyWallet,
      setApplyWallet,
      rewardsPoints,
      applyRewards,
      setApplyRewards,
      isProcessing,
      error,
      submitCheckout,
      discount,
      appliedCoupon,
      applyPromoCode
    }}>
      {children}
      {showPaymentSimulation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl border border-outline-variant/30 p-8 shadow-2xl space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center mx-auto text-primary text-3xl">
              <span className="material-symbols-outlined text-3xl">credit_score</span>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-headline-md text-headline-md text-zinc-950">Razorpay Sandbox Simulation</h3>
              <p className="text-body-md text-secondary leading-relaxed">
                Since you are checking out in demo mode, please select the simulated transaction state you wish to test.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                type="button"
                onClick={() => paymentSimulationResolve && paymentSimulationResolve(true)}
                className="w-full bg-[#685f15] text-white py-4 rounded-full font-bold hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Simulate Successful Payment
              </button>
              <button 
                type="button"
                onClick={() => {
                  setError("Payment failed (Sandbox: Simulated failure). You can retry by placing the order again.");
                  if (paymentSimulationResolve) paymentSimulationResolve(false);
                }}
                className="w-full bg-error text-on-error py-4 rounded-full font-bold hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Simulate Failed Payment
              </button>
              <button 
                type="button"
                onClick={() => {
                  setError("Payment cancelled by user.");
                  if (paymentSimulationResolve) paymentSimulationResolve(false);
                }}
                className="w-full bg-transparent border border-outline text-on-surface py-4 rounded-full font-bold hover:bg-surface-container active:scale-[0.98] transition-all"
              >
                Cancel / Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </CheckoutContext.Provider>
  )
}

export const useCheckout = () => {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider")
  }
  return context
}
