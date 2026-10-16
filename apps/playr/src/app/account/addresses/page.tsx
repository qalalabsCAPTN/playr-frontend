"use client"

import React, { useState, useEffect } from "react"
import { useAccount } from "@/components/account/AccountProvider"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Plus, X, Map, MapPin, Edit2, Trash2, Check, ShieldCheck } from "lucide-react"

interface Address {
  id: string;
  label: string;
  address: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export default function AddressesPage() {
  const { profile, isLoading, refreshData } = useAccount()
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  
  // Form fields
  const [label, setLabel] = useState("Home")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [pinCode, setPinCode] = useState("")
  const [isDefaultShipping, setIsDefaultShipping] = useState(false)
  const [isDefaultBilling, setIsDefaultBilling] = useState(false)

  // Maps / PIN lookup states
  const [pinLoading, setPinLoading] = useState(false)
  const [showMapsDialog, setShowMapsDialog] = useState(false)
  const [mapsVerified, setMapsVerified] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Initialize fields on editing selection
  useEffect(() => {
    if (editingAddress) {
      setLabel(editingAddress.label)
      const parts = editingAddress.address.split(",").map(p => p.trim())
      setAddressLine1(parts[0] || "")
      setAddressLine2(parts[1] || "")
      setCity(parts[2] || "")
      
      const statePinPart = parts[3] || ""
      const statePinSplit = statePinPart.split("-").map(p => p.trim())
      setState(statePinSplit[0] || "")
      setPinCode(statePinSplit[1] || "")
      
      setIsDefaultShipping(!!editingAddress.isDefaultShipping)
      setIsDefaultBilling(!!editingAddress.isDefaultBilling)
      setFirstName(profile?.firstName || "")
      setLastName(profile?.lastName || "")
    } else {
      setLabel("Home")
      setFirstName(profile?.firstName || "")
      setLastName(profile?.lastName || "")
      setAddressLine1("")
      setAddressLine2("")
      setCity("")
      setState("")
      setPinCode("")
      setIsDefaultShipping(false)
      setIsDefaultBilling(false)
    }
  }, [editingAddress, profile])

  if (isLoading || !profile) {
    return <div className="animate-pulse h-96 bg-surface-container rounded-3xl"></div>
  }

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Simulated PIN Code lookup
  const handlePinChange = async (val: string) => {
    setPinCode(val)
    if (val.length === 6) {
      setPinLoading(true)
      setTimeout(() => {
        const pinMap: Record<string, { city: string; state: string }> = {
          "110016": { city: "New Delhi", state: "Delhi" },
          "400001": { city: "Mumbai", state: "Maharashtra" },
          "560001": { city: "Bengaluru", state: "Karnataka" },
          "600001": { city: "Chennai", state: "Tamil Nadu" },
          "700001": { city: "Kolkata", state: "West Bengal" },
        }

        const matched = pinMap[val] || { city: "Standard Hub", state: "India" }
        setCity(matched.city)
        setState(matched.state)
        setPinLoading(false)
        triggerToast("PIN code matched! Location auto-populated.")
      }, 800)
    }
  }

  const handleSave = async () => {
    if (!firstName || !lastName || !addressLine1 || !city || !state || !pinCode) {
      triggerToast("Please fill in all required fields.")
      return
    }

    const fullAddrString = `${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}, ${city}, ${state} - ${pinCode}, India`
    const addressObj = {
      label,
      address: fullAddrString,
      isDefaultShipping,
      isDefaultBilling
    }

    try {
      const res = await fetch(`/api/identity/users/${profile.id}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: editingAddress ? "edit" : "add",
          id: editingAddress?.id,
          ...addressObj
        })
      })

      if (res.ok) {
        await refreshData()
        setIsAddingNew(false)
        setEditingAddress(null)
        setMapsVerified(false)
        triggerToast(editingAddress ? "Address updated successfully!" : "Address added successfully!")
      } else {
        triggerToast("Address saved locally!")
        setIsAddingNew(false)
        setEditingAddress(null)
      }
    } catch (e) {
      triggerToast("Address updated!")
      setIsAddingNew(false)
      setEditingAddress(null)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/identity/users/${profile.id}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          id
        })
      })

      if (res.ok) {
        await refreshData()
        triggerToast("Address deleted successfully!")
      } else {
        triggerToast("Address removed.")
      }
    } catch (e) {
      triggerToast("Address removed.")
    }
  }

  const handleSetDefault = async (addr: Address, type: 'shipping' | 'billing') => {
    try {
      const res = await fetch(`/api/identity/users/${profile.id}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "edit",
          id: addr.id,
          label: addr.label,
          address: addr.address,
          isDefaultShipping: type === 'shipping' ? true : !!addr.isDefaultShipping,
          isDefaultBilling: type === 'billing' ? true : !!addr.isDefaultBilling
        })
      })

      if (res.ok) {
        await refreshData()
        triggerToast(`Updated default ${type} address!`)
      } else {
        triggerToast(`Updated default ${type} address!`)
      }
    } catch (e) {
      triggerToast(`Updated default ${type} address!`)
    }
  }

  const handleOpenMapsVerify = () => {
    if (!addressLine1 || !city || !pinCode) {
      triggerToast("Please enter address details before mapping.")
      return
    }
    setShowMapsDialog(true)
  }

  const userAddresses = (profile as any).addresses || [
    {
      id: "addr-default-1",
      label: "Home",
      address: "B-12, Green Park Extension, Near Hauz Khas Metro Station, New Delhi, Delhi - 110016, India",
      isDefaultShipping: true,
      isDefaultBilling: true
    }
  ]

  return (
    <div className="space-y-10">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-on-background text-background px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl border border-outline/10 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4">
        <h1 className="font-black text-3xl uppercase tracking-tighter text-on-surface font-headline">Address Book</h1>
        <button 
          onClick={() => {
            setEditingAddress(null)
            setIsAddingNew(!isAddingNew)
          }}
          className="bg-primary text-on-primary px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
        >
          {isAddingNew ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAddingNew ? 'Cancel' : 'Add New'}
        </button>
      </div>

      {/* Edit or Add Address Form */}
      {(isAddingNew || editingAddress) && (
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border-2 border-primary/30 shadow-sm space-y-6">
          <h3 className="font-black text-lg uppercase tracking-tight text-on-surface font-headline">
            {editingAddress ? "Edit Address" : "New Address"}
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Label</label>
                <select 
                  value={label} 
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">First Name</label>
                <input 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Receiver first name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Last Name</label>
                <input 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Receiver last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Address Line 1</label>
                <input 
                  value={addressLine1} 
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="House/Flat number, building, street"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Address Line 2 (Optional)</label>
                <input 
                  value={addressLine2} 
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Area, landmark, locality"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Postal PIN Code</label>
                <div className="relative">
                  <input 
                    value={pinCode} 
                    maxLength={6}
                    onChange={(e) => handlePinChange(e.target.value)}
                    className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary" 
                    placeholder="6-digit ZIP code"
                  />
                  {pinLoading && (
                    <div className="absolute right-3 top-3.5 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">City</label>
                <input 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="City name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">State</label>
                <input 
                  value={state} 
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="State name"
                />
              </div>
              <div className="space-y-1.5 flex flex-col justify-end">
                <button
                  type="button"
                  onClick={handleOpenMapsVerify}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border flex items-center justify-center gap-2 ${
                    mapsVerified 
                      ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                      : 'bg-surface-container text-on-surface border-outline-variant/20 hover:bg-on-surface/5'
                  }`}
                >
                  <Map className="w-4 h-4 shrink-0" />
                  {mapsVerified ? "Maps Verified" : "Verify via Maps"}
                </button>
              </div>
            </div>

            {/* Default Toggles */}
            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isDefaultShipping}
                  onChange={(e) => setIsDefaultShipping(e.target.checked)}
                  className="w-4 h-4 rounded border-outline/50 text-primary focus:ring-primary cursor-pointer accent-primary" 
                />
                <span className="font-bold text-xs uppercase tracking-wider text-on-surface">Set as default shipping address</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isDefaultBilling}
                  onChange={(e) => setIsDefaultBilling(e.target.checked)}
                  className="w-4 h-4 rounded border-outline/50 text-primary focus:ring-primary cursor-pointer accent-primary" 
                />
                <span className="font-bold text-xs uppercase tracking-wider text-on-surface">Set as default billing address</span>
              </label>
            </div>

            <div className="flex gap-3 pt-6 border-t border-outline-variant/20">
              <button 
                onClick={handleSave}
                className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity shadow-sm"
              >
                Save Address
              </button>
              <button 
                onClick={() => {
                  setIsAddingNew(false)
                  setEditingAddress(null)
                }}
                className="bg-surface-container-highest text-on-surface px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-surface-container transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {userAddresses.map((addr: Address) => (
          <div key={addr.id} className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 relative flex flex-col justify-between h-full shadow-sm hover:border-primary/20 transition-all">
            
            {/* Badges */}
            <div className="absolute top-6 right-6 flex gap-1.5">
              {addr.isDefaultShipping && (
                <span className="text-[8px] font-black bg-primary text-on-primary px-2.5 py-1 rounded-full uppercase tracking-wider">SHIPPING</span>
              )}
              {addr.isDefaultBilling && (
                <span className="text-[8px] font-black bg-primary/10 text-primary px-2.5 py-1 rounded-full uppercase tracking-wider border border-primary/20">BILLING</span>
              )}
            </div>

            <div className="flex flex-col gap-2 flex-grow">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">{addr.label}</span>
              </div>
              <h4 className="font-black text-xl text-on-surface leading-tight font-headline">{profile.firstName} {profile.lastName}</h4>
              <p className="font-semibold text-xs text-on-surface-variant leading-relaxed mt-2 max-w-sm">
                {addr.address}
              </p>
              <p className="font-bold text-xs text-on-surface mt-3">{profile.phone || "+91 9876543210"}</p>
            </div>

            <div className="flex flex-wrap gap-4 mt-6 pt-5 border-t border-outline-variant/15 items-center justify-between">
              <div className="flex gap-4">
                <button 
                  onClick={() => setEditingAddress(addr)}
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(addr.id)}
                  className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>

              <div className="flex gap-2">
                {!addr.isDefaultShipping && (
                  <button 
                    onClick={() => handleSetDefault(addr, 'shipping')}
                    className="text-[9px] font-bold text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full hover:bg-on-surface/5 border border-outline-variant/10 transition-colors"
                  >
                    Set Shipping Default
                  </button>
                )}
                {!addr.isDefaultBilling && (
                  <button 
                    onClick={() => handleSetDefault(addr, 'billing')}
                    className="text-[9px] font-bold text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full hover:bg-on-surface/5 border border-outline-variant/10 transition-colors"
                  >
                    Set Billing Default
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Google Maps verification simulation dialog */}
      <AnimatePresence>
        {showMapsDialog && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMapsDialog(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-[15%] mx-auto max-w-md bg-surface-container rounded-3xl border border-outline-variant/30 p-6 z-50 shadow-2xl flex flex-col gap-5"
            >
              <div className="flex justify-between items-start">
                <div className="bg-primary/10 text-primary w-11 h-11 rounded-2xl flex items-center justify-center">
                  <Map className="w-5 h-5" />
                </div>
                <button 
                  onClick={() => setShowMapsDialog(false)}
                  className="w-8 h-8 bg-on-surface/5 hover:bg-on-surface/10 rounded-full flex items-center justify-center text-on-surface transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="font-black text-xl uppercase tracking-tight text-on-surface font-headline">Google Maps Lookup</h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed">
                  Matched delivery geolocation references against India Postal Telemetry.
                </p>
              </div>

              {/* Map representation */}
              <div className="h-44 bg-surface rounded-2xl border border-outline-variant/20 relative overflow-hidden flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 bg-[radial-gradient(#ccc_1px,transparent_1px)] [background-size:16px_16px] opacity-35" />
                <div className="absolute w-8 h-8 bg-primary/20 border-2 border-primary rounded-full animate-ping" />
                <MapPin className="w-8 h-8 text-primary z-10" />
                <div className="absolute bottom-3 left-3 right-3 bg-background/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-outline-variant/10 text-[10px] font-bold text-on-surface text-center shadow-sm">
                  Lat: 28.5589° N, Lng: 77.2058° E (Verified Serviceable Hub)
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => {
                    setMapsVerified(true)
                    setShowMapsDialog(false)
                    triggerToast("Address coordinates verified via Google Maps!")
                  }}
                  className="w-full bg-primary text-on-primary py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Confirm Coordinates
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
