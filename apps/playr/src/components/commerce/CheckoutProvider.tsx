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
}
/* eslint-enable no-unused-vars */

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { cartItems, cartSubtotal } = useCommerce()
  const { data: session } = useSession()
  
  const [email, setEmail] = useState("")
  const [savedAddresses] = useState<ShippingAddress[]>([
    { firstName: "Jane", lastName: "Doe", address: "123 PlayR Street", city: "Mumbai", state: "MH", pinCode: "400001", phone: "9876543210" }
  ])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [shippingAddress, setShippingAddress] = useState<Partial<ShippingAddress>>({})
  const [useSameForBilling, setUseSameForBilling] = useState(true)
  const [billingAddress, setBillingAddress] = useState<Partial<ShippingAddress>>({})
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card")
  const [promoCode, setPromoCode] = useState("")
  const [walletBalance] = useState(500)
  const [applyWallet, setApplyWallet] = useState(false)
  const [rewardsPoints] = useState(1250)
  const [applyRewards, setApplyRewards] = useState(false)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      // TODO: Replace with real server action response handling
      if (paymentMethod === 'razorpay') {
         // Secure Order Creation via Server Action
         const gatewayOrder = await createRazorpayOrderAction(cartSubtotal);

         paymentSuccess = await new Promise<boolean>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            const options = {
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_mock',
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
                    response.razorpay_signature || 'mock_signature'
                  );
                  if (verification.verified) {
                    resolve(true);
                  } else {
                    setError("Payment verification failed on server.");
                    resolve(false);
                  }
                } catch (e) {
                  console.error("Signature verification failed", e);
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
      } else {
         setError("Unsupported payment method in production.");
         paymentSuccess = false;
      }

      if (paymentSuccess) {
        // Emit NECTAR Domain Event (must be backed by real server confirmation in prod, but keeping the event hook for tracking)
        await eventPublisher.emitPurchaseCompleted({
          orderId: `PR-${Math.floor(Math.random() * 100000)}`,
          userId: userId, 
          totalAmount: cartSubtotal,
          currency: 'INR',
          paymentMethod: paymentMethod,
          timestamp: new Date().toISOString(),
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        });

        router.push('/checkout/success')
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
      submitCheckout
    }}>
      {children}
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
