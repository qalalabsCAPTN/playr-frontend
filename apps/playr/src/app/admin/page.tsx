"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { drawPersonalizedTemplate } from '@playr/nectar-core'

// HTML5 Canvas Jersey Drawing Engine (Shared with storefront for admin edits preview)
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

const downloadArtwork = async (orderDisplayId: string, name: string, num: string, imageUrl: string) => {
  try {
    const filename = `ORDER-${orderDisplayId}-${name.replace(/\s+/g, '_')}-${num}.png`;
    
    if (imageUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (e) {
    console.error("Artwork download failed, opening in new tab instead", e);
    window.open(imageUrl, '_blank');
  }
};

type Tab =
  | 'dashboard'
  | 'leads'
  | 'customers'
  | 'orders'
  | 'inventory'
  | 'coupons'
  | 'loyalty'
  | 'support'
  | 'cms'
  | 'blogs'
  | 'settings'

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  // CRM/CMS states
  const [leads, setLeads] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [coupons, setCoupons] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [blogs, setBlogs] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  
  // Visual CMS page editor state
  const [cmsPage, setCmsPage] = useState<'homepage' | 'about' | 'media'>('homepage')
  const [cmsContent, setCmsContent] = useState<any>({ hero: { heading1: '', heading2: '', description: '' }, brandStory: { heading: '', description1: '' } })

  // Selected item detail modals
  const [selectedLead, setSelectedLead] = useState<any | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null)

  // Personalization Edit & Admin States
  const [personalizations, setPersonalizations] = useState<any[]>([])
  const [isAdminEditingPers, setIsAdminEditingPers] = useState(false)
  const [editingPersItemId, setEditingPersItemId] = useState('')
  const [editingPersName, setEditingPersName] = useState('')
  const [editingPersNumber, setEditingPersNumber] = useState('')
  const [isAdminSavingPers, setIsAdminSavingPers] = useState(false)

  // Personalization Template V2 States
  const [selectedTemplateProduct, setSelectedTemplateProduct] = useState<any | null>(null)
  const [tempEditorState, setTempEditorState] = useState<any | null>(null)
  const [previewName, setPreviewName] = useState('AAYUSH')
  const [previewNumber, setPreviewNumber] = useState('07')
  const [isTemplateInSafeArea, setIsTemplateInSafeArea] = useState(true)
  const [activeTempTab, setActiveTempTab] = useState<'image' | 'name' | 'number' | 'safe'>('image')
  const [isSavingTemplate, setIsSavingTemplate] = useState(false)
  const adminTemplateCanvasRef = React.useRef<HTMLCanvasElement>(null)

  // Filter/Search States for Orders
  const [selectedOrderFilter, setSelectedOrderFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Forms states
  const [newCouponCode, setNewCouponCode] = useState('')
  const [newCouponType, setNewCouponType] = useState('percentage')
  const [newCouponValue, setNewCouponValue] = useState(10)
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogExcerpt, setNewBlogExcerpt] = useState('')
  const [newBlogContent, setNewBlogContent] = useState('')
  const [ticketReply, setTicketReply] = useState('')

  // Upload Product with Personalisation Toggle States
  const [showUploadProductModal, setShowUploadProductModal] = useState(false)
  const [newProductTitle, setNewProductTitle] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('1999')
  const [newProductType, setNewProductType] = useState('Jersey')
  const [newProductSku, setNewProductSku] = useState('')
  const [newProductImage, setNewProductImage] = useState('')
  const [newProductPersonalisation, setNewProductPersonalisation] = useState(true)
  const [isUploadingProduct, setIsUploadingProduct] = useState(false)

  const handleToggleProductPersonalisation = async (product: any) => {
    const isCurrentlyEnabled = Boolean(product.customizable ?? product.personalizationTemplate?.enabled)
    const updated = !isCurrentlyEnabled
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === product.id) {
          return {
            ...p,
            customizable: updated,
            personalizationTemplate: {
              ...(p.personalizationTemplate || {}),
              enabled: updated,
            },
          }
        }
        return p
      })
    )
    try {
      await fetch(`/api/admin/products/${product.id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customizable: updated,
          personalizationTemplate: { ...(product.personalizationTemplate || {}), enabled: updated },
        }),
      })
    } catch (e) {
      console.error('Failed to toggle personalisation', e)
    }
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProductTitle.trim()) return
    setIsUploadingProduct(true)
    const newId = `prod_${Date.now()}`
    const productPayload = {
      id: newId,
      handle: newProductTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newProductTitle.trim(),
      price: Number(newProductPrice) || 1999,
      type: newProductType,
      images: [newProductImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop'],
      customizable: newProductPersonalisation,
      personalizationTemplate: {
        enabled: newProductPersonalisation,
      },
      variants: [
        {
          id: `var_${Date.now()}`,
          sku: newProductSku || `SKU-${Date.now().toString().slice(-6)}`,
          title: 'Standard',
          price: Number(newProductPrice) || 1999,
          inventory: 50,
        },
      ],
    }

    try {
      await fetch('/api/admin/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload),
      }).catch(() => null)
      setProducts((prev) => [productPayload, ...prev])
      setShowUploadProductModal(false)
      setNewProductTitle('')
      setNewProductSku('')
      setNewProductImage('')
      alert(`Product "${productPayload.title}" created successfully with Personalisation ${newProductPersonalisation ? 'ON' : 'OFF'}!`)
    } catch (err) {
      console.error(err)
    } finally {
      setIsUploadingProduct(false)
    }
  }

  // Load Admin Data
  const loadAdminData = async () => {
    try {
      const [leadsRes, custsRes, ordsRes, prodsRes, coupsRes, tktsRes, blogsRes, logsRes, persRes] = await Promise.all([
        fetch('/api/admin/leads').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/identity/users').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/admin/orders').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/products').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/admin/coupons').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/admin/support-tickets').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/admin/blogs').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/admin/audit-logs').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/personalizations').then(r => r.ok ? r.json() : []).catch(() => [])
      ]);

      setLeads(Array.isArray(leadsRes) ? leadsRes : []);
      setCustomers(Array.isArray(custsRes) ? custsRes : []);
      setOrders(Array.isArray(ordsRes) ? ordsRes : []);
      
      if (Array.isArray(prodsRes) && prodsRes.length > 0) {
        setProducts(prodsRes);
      } else {
        // Fallback default catalog if DB store is initially being populated
        setProducts([
          {
            id: 'prod_csk_jersey',
            slug: 'csk-match-jersey',
            title: 'CSK Match Jersey 2026',
            price: 1799,
            type: 'Jersey',
            category: 'Club',
            customizable: true,
            personalizationTemplate: { enabled: true },
            variants: [{ id: 'var-2', sku: 'PR-CSK-JER-L', price: 1799, inventory: 40 }],
          },
          {
            id: 'prod_rr_jersey',
            slug: 'rr-match-jersey',
            title: 'RR Match Jersey 2026',
            price: 1799,
            type: 'Jersey',
            category: 'Club',
            customizable: true,
            personalizationTemplate: { enabled: true },
            variants: [{ id: 'var-4', sku: 'PR-RR-JER-M', price: 1799, inventory: 50 }],
          },
          {
            id: 'prod_mi_jersey',
            slug: 'mi-match-jersey',
            title: 'Mumbai Indians Official Match Jersey',
            price: 1999,
            type: 'Jersey',
            category: 'Club',
            customizable: true,
            personalizationTemplate: { enabled: true },
            variants: [{ id: 'var-5', sku: 'PR-MI-JER-L', price: 1999, inventory: 35 }],
          },
          {
            id: 'prod_pro_tee',
            slug: 'pro-training-tee',
            title: 'Pro Training Tee',
            price: 1299,
            type: 'Tee',
            category: 'Men',
            customizable: false,
            personalizationTemplate: { enabled: false },
            variants: [{ id: 'var-1', sku: 'PR-PRO-TEE-M', price: 1299, inventory: 85 }],
          },
          {
            id: 'prod_shorts',
            slug: 'performance-shorts',
            title: 'Aero Performance Shorts',
            price: 1499,
            type: 'Shorts',
            category: 'Men',
            customizable: false,
            personalizationTemplate: { enabled: false },
            variants: [{ id: 'var-3', sku: 'PR-SHORTS-L', price: 1499, inventory: 60 }],
          }
        ]);
      }

      setCoupons(Array.isArray(coupsRes) ? coupsRes : []);
      setTickets(Array.isArray(tktsRes) ? tktsRes : []);
      setBlogs(Array.isArray(blogsRes) ? blogsRes : []);
      setAuditLogs(Array.isArray(logsRes) ? logsRes : []);
      setPersonalizations(Array.isArray(persRes) ? persRes : []);
    } catch (e) {
      console.error("Failed to load admin data", e);
    }
  }

  // Load CMS Data based on selection
  const loadCmsContent = async (page: 'homepage' | 'about' | 'media') => {
    try {
      const res = await fetch(`/api/cms/${page}`);
      if (res.ok) {
        const data = await res.json();
        setCmsContent(data);
      }
    } catch (e) {
      console.error("Failed to load cms content", e);
    }
  }

  const adminCanvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadAdminData();
    loadCmsContent(cmsPage);
  }, [cmsPage]);

  useEffect(() => {
    if (!isAdminEditingPers || !adminCanvasRef.current) return;
    const item = selectedOrder?.items.find((i: any) => i.id === editingPersItemId);
    if (!item) return;
    const p = products.find(prod => prod.id === item.productId) || {};
    const themeColor = p.colors?.[0]?.hex || "#FFFF00";
    drawJersey(adminCanvasRef.current, editingPersName, editingPersNumber, themeColor, p.title || 'Jersey');
  }, [isAdminEditingPers, editingPersName, editingPersNumber, selectedOrder, editingPersItemId, products]);

  useEffect(() => {
    if (!selectedTemplateProduct || !tempEditorState || !adminTemplateCanvasRef.current) return;
    const { inSafeArea } = drawPersonalizedTemplate(
      adminTemplateCanvasRef.current,
      tempEditorState,
      previewName,
      previewNumber,
      true
    );
    setIsTemplateInSafeArea(inSafeArea);
  }, [selectedTemplateProduct, tempEditorState, previewName, previewNumber]);

  const handleOpenTemplateEditor = (p: any) => {
    setSelectedTemplateProduct(p);
    const existing = p.personalizationTemplate || {};
    setTempEditorState({
      enabled: existing.enabled || false,
      renderImageId: existing.renderImageId || "0",
      renderImageUrl: existing.renderImageUrl || p.imageSrc || "",
      canvasWidth: existing.canvasWidth || 600,
      canvasHeight: existing.canvasHeight || 600,
      nameSettings: {
        x: 300,
        y: 160,
        width: 400,
        height: 50,
        maxCharacters: 18,
        fontFamily: "Impact",
        fontWeight: "900",
        fontSize: 38,
        lineHeight: 1,
        letterSpacing: 2,
        alignment: "center",
        textTransform: "uppercase",
        rotation: 0,
        color: "#ffffff",
        enableOutline: true,
        outlineWidth: 3,
        outlineColor: "#000000",
        enableShadow: false,
        shadowColor: "rgba(0,0,0,0.5)",
        shadowBlur: 4,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        opacity: 1,
        ...existing.nameSettings
      },
      numberSettings: {
        x: 300,
        y: 310,
        width: 300,
        height: 150,
        fontFamily: "Impact",
        fontWeight: "900",
        fontSize: 120,
        alignment: "center",
        rotation: 0,
        color: "#ffffff",
        enableOutline: true,
        outlineWidth: 6,
        outlineColor: "#000000",
        enableShadow: false,
        shadowColor: "rgba(0,0,0,0.5)",
        shadowBlur: 6,
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        opacity: 1,
        ...existing.numberSettings
      },
      safeArea: {
        x: 50,
        y: 50,
        width: 500,
        height: 500,
        ...existing.safeArea
      }
    });
  };

  const handleSaveTemplateSettings = async () => {
    if (!selectedTemplateProduct || !tempEditorState) return;
    setIsSavingTemplate(true);
    try {
      const res = await fetch(`/api/admin/products/${selectedTemplateProduct.id}/personalization-template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tempEditorState)
      });
      if (res.ok) {
        alert("Personalization template saved successfully!");
        setSelectedTemplateProduct(null);
        loadAdminData();
      } else {
        alert("Failed to save personalization template.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving personalization template.");
    } finally {
      setIsSavingTemplate(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="animate-pulse text-lg tracking-widest font-black uppercase text-zinc-400">Loading Management System...</div>
      </div>
    )
  }

  // Operations
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await loadAdminData();
        setSelectedOrder(null);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleSavePersEdit = async (orderId: string, itemId: string, productId: string) => {
    setIsAdminSavingPers(true);
    try {
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = 2400;
      exportCanvas.height = 2400;
      
      const p = products.find(prod => prod.id === productId) || {};
      const themeColor = p.colors?.[0]?.hex || "#FFFF00";
      
      drawJersey(exportCanvas, editingPersName.trim(), editingPersNumber, themeColor, p.title || 'Jersey', true);

      const blob = await new Promise<Blob | null>((resolve) => {
        exportCanvas.toBlob((b) => resolve(b), "image/png");
      });

      if (!blob) {
        throw new Error("Blob creation failed");
      }

      const formData = new FormData();
      formData.append("file", blob, `edit-${orderId}-${editingPersName}-${editingPersNumber}.png`);

      const uploadRes = await fetch("/api/personalizations/upload", {
        method: "POST",
        body: formData
      });

      if (!uploadRes.ok) {
        throw new Error("Upload failed");
      }

      const { url } = await uploadRes.json();

      const editRes = await fetch(`/api/admin/orders/${orderId}/personalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          playerName: editingPersName.trim(),
          playerNumber: editingPersNumber,
          previewImageUrl: url
        })
      });

      if (editRes.ok) {
        const updatedOrder = await editRes.json();
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        setSelectedOrder(updatedOrder);
        setIsAdminEditingPers(false);
        alert("Personalization updated successfully! Created new artwork version.");
        loadAdminData();
      } else {
        alert("Failed to save personalization details on server.");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating or saving new personalization artwork.");
    } finally {
      setIsAdminSavingPers(false);
    }
  }

  const handleUpdateLeadStatus = async (leadId: string, status: string) => {
    try {
      await fetch(`/api/admin/leads/${leadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      await loadAdminData();
      setSelectedLead(null);
    } catch (e) {
      console.error(e);
    }
  }

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCouponCode.toUpperCase(),
          discountType: newCouponType,
          discountValue: Number(newCouponValue)
        })
      });
      if (res.ok) {
        setNewCouponCode('');
        setNewCouponValue(10);
        await loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleDeleteCoupon = async (id: string) => {
    try {
      await fetch(`/api/admin/coupons/${id}/delete`, { method: 'POST', body: JSON.stringify({}) });
      await loadAdminData();
    } catch (e) {
      console.error(e);
    }
  }

  const handleToggleCoupon = async (id: string, currentActive: boolean) => {
    try {
      await fetch(`/api/admin/coupons/${id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive })
      });
      await loadAdminData();
    } catch (e) {
      console.error(e);
    }
  }

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newBlogTitle,
          slug: newBlogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          excerpt: newBlogExcerpt,
          content: newBlogContent,
          image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070'
        })
      });
      if (res.ok) {
        setNewBlogTitle('');
        setNewBlogExcerpt('');
        setNewBlogContent('');
        await loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleDeleteBlog = async (id: string) => {
    try {
      await fetch(`/api/admin/blogs/${id}/delete`, { method: 'POST', body: JSON.stringify({}) });
      await loadAdminData();
    } catch (e) {
      console.error(e);
    }
  }

  const handleTicketReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !ticketReply) return;
    try {
      const res = await fetch(`/api/admin/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'admin@playr.in',
          text: ticketReply,
          status: 'resolved'
        })
      });
      if (res.ok) {
        setTicketReply('');
        setSelectedTicket(null);
        await loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleSaveCMS = async (status: 'draft' | 'published' = 'published') => {
    try {
      const res = await fetch(`/api/cms/${cmsPage}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cmsContent, status })
      });
      if (res.ok) {
        alert(`CMS content saved as ${status} successfully!`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row pt-16">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 shrink-0 p-6 flex flex-col gap-6">
        <div>
          <span className="font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">playR Admin</span>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Enterprise Console</p>
        </div>

        <nav className="flex flex-col gap-1.5 flex-grow">
          {[
            { id: 'dashboard', label: 'CRM Dashboard', icon: 'dashboard' },
            { id: 'leads', label: 'Lead Manager', icon: 'contact_mail' },
            { id: 'customers', label: 'Customers', icon: 'group' },
            { id: 'orders', label: 'Orders & Logistics', icon: 'shopping_cart' },
            { id: 'inventory', label: 'Inventory Manager', icon: 'inventory' },
            { id: 'coupons', label: 'Discount Engine', icon: 'sell' },
            { id: 'loyalty', label: 'Rewards & XP', icon: 'emoji_events' },
            { id: 'support', label: 'Support Tickets', icon: 'support_agent' },
            { id: 'cms', label: 'Visual CMS Editor', icon: 'web' },
            { id: 'blogs', label: 'Blog Compiler', icon: 'article' },
            { id: 'settings', label: 'Audit Logs & Roles', icon: 'settings' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as Tab)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 text-left ${
                activeTab === t.id
                  ? 'bg-white text-black shadow-lg scale-[1.02]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-zinc-800 pt-4 text-xs text-zinc-500">
          Logged in as: <strong className="text-zinc-300">{session?.user?.email}</strong>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* TAB 1: CRM Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight">Executive Dashboard</h2>
              <p className="text-zinc-500 text-sm mt-1">Real-time revenue, visitor conversion, and transactions summary.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Gross Revenue', value: '₹2,48,930', change: '+12.4% this wk', icon: 'payments', color: 'text-green-400' },
                { title: 'Completed Orders', value: orders.length.toString(), change: '+4 new today', icon: 'shopping_bag', color: 'text-blue-400' },
                { title: 'Conversion Rate', value: '3.82%', change: '+0.5% vs avg', icon: 'trending_up', color: 'text-yellow-400' },
                { title: 'Live Visitors', value: '142', change: 'Real-time active', icon: 'sensors', color: 'text-red-400' }
              ].map((m, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{m.title}</span>
                    <span className={`material-symbols-outlined ${m.color} text-2xl`}>{m.icon}</span>
                  </div>
                  <h3 className="text-3xl font-black mt-4 tabular-nums">{m.value}</h3>
                  <p className="text-xs text-zinc-400 mt-2">{m.change}</p>
                </div>
              ))}
            </div>

            {/* Production Dashboard Widgets */}
            <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl">
              <h3 className="font-bold text-lg uppercase tracking-wider mb-6 text-yellow-400 flex items-center gap-2">
                <span className="material-symbols-outlined">print</span>
                Personalized Jersey Production Monitor
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    title: "Today's Personalized Orders", 
                    value: personalizations.filter(p => {
                      const todayStr = new Date().toISOString().split('T')[0];
                      return p.createdAt?.startsWith(todayStr);
                    }).length.toString(), 
                    icon: 'calendar_today', 
                    color: 'text-amber-400',
                    bg: 'bg-amber-500/10'
                  },
                  { 
                    title: 'Pending Print', 
                    value: personalizations.filter(p => 
                      p.status === 'placed' || p.status === 'artwork_generated' || p.status === 'ready_for_print'
                    ).length.toString(), 
                    icon: 'pending_actions', 
                    color: 'text-rose-400',
                    bg: 'bg-rose-500/10'
                  },
                  { 
                    title: 'Printing', 
                    value: personalizations.filter(p => p.status === 'printing').length.toString(), 
                    icon: 'print', 
                    color: 'text-sky-400',
                    bg: 'bg-sky-500/10'
                  },
                  { 
                    title: 'Completed', 
                    value: personalizations.filter(p => 
                      p.status === 'qc' || p.status === 'packed' || p.status === 'shipped' || p.status === 'delivered'
                    ).length.toString(), 
                    icon: 'check_circle', 
                    color: 'text-emerald-400',
                    bg: 'bg-emerald-500/10'
                  }
                ].map((m, i) => (
                  <div key={i} className={`border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors ${m.bg}`}>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-normal">{m.title}</span>
                      <span className={`material-symbols-outlined ${m.color} text-2xl`}>{m.icon}</span>
                    </div>
                    <h3 className="text-3xl font-black mt-4 tabular-nums">{m.value}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Graph Simulation */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
              <h3 className="font-bold text-lg uppercase tracking-wider mb-6">Revenue Trend (Last 7 Days)</h3>
              <div className="h-64 flex items-end gap-6 pt-8 border-b border-l border-zinc-800 px-4">
                {[
                  { day: 'Mon', val: 40, amt: '₹32k' },
                  { day: 'Tue', val: 65, amt: '₹52k' },
                  { day: 'Wed', val: 50, amt: '₹40k' },
                  { day: 'Thu', val: 80, amt: '₹64k' },
                  { day: 'Fri', val: 95, amt: '₹76k' },
                  { day: 'Sat', val: 120, amt: '₹96k' },
                  { day: 'Sun', val: 110, amt: '₹88k' }
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <span className="absolute -top-8 bg-zinc-800 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{bar.amt}</span>
                    <div 
                      className="w-full bg-gradient-to-t from-zinc-800 to-white group-hover:to-primary-container rounded-t transition-all duration-1000 ease-out"
                      style={{ height: `${bar.val * 1.5}px` }}
                    />
                    <span className="text-xs text-zinc-500 mt-2">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Logs */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
              <h3 className="font-bold text-lg uppercase tracking-wider mb-6">Recent Live Events</h3>
              <div className="divide-y divide-zinc-800">
                {auditLogs.slice(0, 5).map((log: any) => (
                  <div key={log.id} className="py-4 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-ping" />
                      <span>User <strong className="text-white">{log.userId}</strong> triggered <strong className="text-zinc-300">{log.action}</strong></span>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">{log.details}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Lead Manager */}
        {activeTab === 'leads' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight">Inbound Lead Pipeline</h2>
              <p className="text-zinc-500 text-sm mt-1">Classify and pipeline inbound newsletter subscribers and contact inquiries.</p>
            </div>

            {/* Kanban columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['new', 'qualified', 'contacting'].map((col) => (
                <div key={col} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                  <h3 className="font-black text-xs uppercase tracking-widest text-zinc-400 mb-6 flex justify-between">
                    <span>{col}</span>
                    <span className="bg-zinc-800 text-[10px] px-2.5 py-0.5 rounded-full text-zinc-400">{leads.filter(l => l.status === col).length}</span>
                  </h3>
                  
                  <div className="space-y-4">
                    {leads.filter(l => l.status === col).map((lead: any) => (
                      <div 
                        key={lead.id} 
                        onClick={() => setSelectedLead(lead)}
                        className="bg-zinc-950 p-4 border border-zinc-800 hover:border-zinc-700 rounded-xl cursor-pointer hover:shadow-lg transition-all"
                      >
                        <h4 className="font-bold text-sm text-white">{lead.name}</h4>
                        <p className="text-xs text-zinc-500 truncate mt-1">{lead.email}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="bg-zinc-800 text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-bold text-zinc-400">{lead.source}</span>
                          <span className="text-[10px] text-zinc-600 font-mono">{new Date(lead.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Lead Detail Modal */}
            {selectedLead && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full relative">
                  <button className="absolute top-4 right-4 text-zinc-500 hover:text-white" onClick={() => setSelectedLead(null)}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                  <h3 className="text-2xl font-black uppercase tracking-tight">{selectedLead.name}</h3>
                  <div className="space-y-4 mt-6 text-sm">
                    <p><strong>Email:</strong> {selectedLead.email}</p>
                    <p><strong>Phone:</strong> {selectedLead.phone || 'N/A'}</p>
                    <p><strong>Inquiry Message:</strong> {selectedLead.message || 'Subscribed to Newsletter'}</p>
                    <p><strong>Pipeline Status:</strong></p>
                    <div className="flex gap-2">
                      {['new', 'qualified', 'contacting'].map(status => (
                        <button 
                          key={status}
                          onClick={() => handleUpdateLeadStatus(selectedLead.id, status)}
                          className={`text-xs px-3 py-1.5 rounded-full border uppercase tracking-wider font-bold ${
                            selectedLead.status === status
                              ? 'bg-white text-black border-white'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Customers */}
        {activeTab === 'customers' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight">Customer Database</h2>
              <p className="text-zinc-500 text-sm mt-1">Manage user profiles, wallet transactions, and kitting addresses.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950 border-b border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <th className="p-5">Customer Name</th>
                    <th className="p-5">Email</th>
                    <th className="p-5">Phone</th>
                    <th className="p-5">Wallet Balance</th>
                    <th className="p-5">XP Rank</th>
                    <th className="p-5">Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {customers.map((c: any) => (
                    <tr key={c.id} className="hover:bg-zinc-800/20 text-sm">
                      <td className="p-5 font-bold">{c.firstName} {c.lastName}</td>
                      <td className="p-5 text-zinc-400">{c.email}</td>
                      <td className="p-5 text-zinc-400">{c.phone}</td>
                      <td className="p-5 font-mono text-green-400">₹{c.walletBalance}</td>
                      <td className="p-5">
                        <span className="bg-primary-container text-on-primary-container text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                          {c.tier} ({c.xp} XP)
                        </span>
                      </td>
                      <td className="p-5 text-zinc-500 font-mono">{c.memberSince}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Orders */}
        {activeTab === 'orders' && (() => {
          const filteredOrders = orders.filter((o: any) => {
            const q = searchQuery.toLowerCase();
            const matchesSearch = q === '' || 
              o.displayId?.toLowerCase().includes(q) ||
              o.userId?.toLowerCase().includes(q) ||
              o.status?.toLowerCase().includes(q) ||
              (o.shippingAddress?.firstName + ' ' + o.shippingAddress?.lastName).toLowerCase().includes(q) ||
              o.items?.some((i: any) => i.title.toLowerCase().includes(q) || i.playerName?.toLowerCase().includes(q) || i.playerNumber?.toString().includes(q));

            if (!matchesSearch) return false;

            if (selectedOrderFilter === 'all') return true;
            if (selectedOrderFilter === 'personalized') {
              return o.items?.some((i: any) => i.isPersonalized);
            }
            if (selectedOrderFilter === 'normal') {
              return !o.items?.some((i: any) => i.isPersonalized);
            }
            return o.status?.toLowerCase() === selectedOrderFilter.toLowerCase();
          });

          return (
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tight">Order Fulfilment & Logistics</h2>
                <p className="text-zinc-500 text-sm mt-1">Fulfill sales checkouts and trigger carrier tracking updates.</p>
              </div>

              {/* Search and Filters Bar */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-950 p-4 border border-zinc-800 rounded-2xl">
                <div className="relative w-full md:w-72">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">search</span>
                  <input
                    type="text"
                    placeholder="Search orders, ID, items..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-zinc-700 text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Filter:</label>
                  <select
                    value={selectedOrderFilter}
                    onChange={(e) => setSelectedOrderFilter(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-zinc-700 font-bold uppercase tracking-wider"
                  >
                    <option value="all">All Orders</option>
                    <option value="personalized">🟡 Personalized Only</option>
                    <option value="normal">Normal Only</option>
                    <option value="placed">Order Placed</option>
                    <option value="artwork_generated">Artwork Generated</option>
                    <option value="ready_for_print">Ready For Print</option>
                    <option value="printing">Printing</option>
                    <option value="qc">QC</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-400">
                      <th className="p-5">Order ID</th>
                      <th className="p-5">Date</th>
                      <th className="p-5">User ID</th>
                      <th className="p-5">Items</th>
                      <th className="p-5">Amount</th>
                      <th className="p-5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {filteredOrders.map((o: any) => (
                      <tr 
                        key={o.id} 
                        onClick={() => setSelectedOrder(o)}
                        className="hover:bg-zinc-800/20 text-sm cursor-pointer"
                      >
                        <td className="p-5 font-bold font-mono text-primary-container">
                          <div className="flex items-center gap-2">
                            <span>{o.displayId}</span>
                            {o.items?.some((i: any) => i.isPersonalized) && (
                              <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                                🟡 Personalized
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-5 text-zinc-500 font-mono">{new Date(o.date).toLocaleDateString()}</td>
                        <td className="p-5 text-zinc-400">{o.userId}</td>
                        <td className="p-5 text-zinc-400">
                          <div className="space-y-1">
                            {(o.items || []).map((i: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <span>{i.title} (x{i.quantity})</span>
                                {i.isPersonalized && (
                                  <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[8px] font-extrabold uppercase px-1 py-0.2 rounded">
                                    {i.playerName} ({i.playerNumber})
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-5 font-black">₹{o.total.toLocaleString()}</td>
                        <td className="p-5">
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            o.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                            o.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                            o.status === 'processing' ? 'bg-zinc-700 text-zinc-300' :
                            o.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Detail Modal */}
              {selectedOrder && (() => {
                const hasPersonalizedItems = selectedOrder.items?.some((i: any) => i.isPersonalized);
                return (
                  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className={`bg-zinc-900 border border-zinc-800 p-8 rounded-2xl relative my-8 ${
                      hasPersonalizedItems ? "max-w-4xl w-full" : "max-w-md w-full"
                    }`}>
                      <button className="absolute top-4 right-4 text-zinc-500 hover:text-white" onClick={() => {
                        setSelectedOrder(null);
                        setIsAdminEditingPers(false);
                      }}>
                        <span className="material-symbols-outlined">close</span>
                      </button>
                      
                      <h3 className="text-2xl font-black uppercase tracking-tight mb-6">Fulfill Order: {selectedOrder.displayId}</h3>
                      
                      <div className={`grid gap-8 ${
                        hasPersonalizedItems ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                      }`}>
                        {/* Column 1: Fulfillment / Shipping Details */}
                        <div className="space-y-6 text-sm">
                          <div className="bg-zinc-950 p-6 border border-zinc-800 rounded-xl space-y-3">
                            <h4 className="font-bold text-xs uppercase text-zinc-400 tracking-wider">Shipping Details</h4>
                            <p><strong>Recipient:</strong> {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}</p>
                            <p><strong>Address:</strong> {selectedOrder.shippingAddress?.address}</p>
                            <p><strong>City/Postal:</strong> {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                            <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                          </div>

                          <div className="bg-zinc-950 p-6 border border-zinc-800 rounded-xl space-y-4">
                            <h4 className="font-bold text-xs uppercase text-zinc-400 tracking-wider">Workflow Status Flow</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { key: 'placed', label: 'Order Placed' },
                                { key: 'artwork_generated', label: 'Artwork Gen' },
                                { key: 'ready_for_print', label: 'Ready for Print' },
                                { key: 'printing', label: 'Printing' },
                                { key: 'qc', label: 'Quality Control' },
                                { key: 'packed', label: 'Packed' },
                                { key: 'shipped', label: 'Shipped' },
                                { key: 'delivered', label: 'Delivered' },
                                { key: 'cancelled', label: 'Cancelled' }
                              ].map(statusObj => (
                                <button
                                  key={statusObj.key}
                                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, statusObj.key)}
                                  className={`text-[10px] px-3 py-2 rounded-lg border uppercase tracking-wider font-extrabold transition-colors ${
                                    selectedOrder.status === statusObj.key
                                      ? 'bg-yellow-400 text-black border-yellow-400'
                                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                                  }`}
                                >
                                  {statusObj.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Personalized Products details (Only rendered if order has personalized items) */}
                        {hasPersonalizedItems && (
                          <div className="space-y-6">
                            <h4 className="font-bold text-xs uppercase text-zinc-400 tracking-wider">Personalized Items & Production</h4>
                            <div className="space-y-6">
                              {selectedOrder.items?.map((item: any, idx: number) => {
                                if (!item.isPersonalized) return null;

                                // Find matching personalization from history
                                const persRecord = personalizations.find(p => p.orderId === selectedOrder.displayId && p.productId === item.productId) || {};

                                return (
                                  <div key={item.id || idx} className="bg-zinc-950 p-6 border border-zinc-800 rounded-xl space-y-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h5 className="font-bold text-sm text-white uppercase">{item.title}</h5>
                                        <p className="text-zinc-500 text-xs">Size: {item.size} | Color: {item.colorName}</p>
                                      </div>
                                      <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                                        Active Artwork
                                      </span>
                                    </div>

                                    {/* Preview image or edit canvas */}
                                    <div className="aspect-square w-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center relative">
                                      {isAdminEditingPers && editingPersItemId === item.id ? (
                                        <canvas
                                          ref={adminCanvasRef}
                                          width={400}
                                          height={400}
                                          className="w-full h-full object-contain"
                                        />
                                      ) : (
                                        <img
                                          src={item.previewImageUrl || item.imageSrc}
                                          alt={item.title}
                                          className="w-full h-full object-cover"
                                        />
                                      )}
                                    </div>

                                    {/* Edit controls / Display stats */}
                                    {isAdminEditingPers && editingPersItemId === item.id ? (
                                      <div className="space-y-3 pt-2 border-t border-zinc-800">
                                        <div className="grid grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">Player Name</label>
                                            <input
                                              type="text"
                                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs uppercase font-mono text-white"
                                              value={editingPersName}
                                              onChange={(e) => {
                                                const val = e.target.value.toUpperCase().replace(/[^A-Z\s]/g, "");
                                                if (val.length <= 18) setEditingPersName(val);
                                              }}
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">Number</label>
                                            <input
                                              type="text"
                                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-white"
                                              value={editingPersNumber}
                                              onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, "");
                                                if (val === "" || (parseInt(val) >= 0 && parseInt(val) <= 99 && val.length <= 2)) {
                                                  setEditingPersNumber(val);
                                                }
                                              }}
                                            />
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => handleSavePersEdit(selectedOrder.id, item.id, item.productId)}
                                            disabled={isAdminSavingPers}
                                            className="flex-grow bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-lg transition-colors uppercase disabled:opacity-50"
                                          >
                                            {isAdminSavingPers ? "Saving..." : "Save Changes"}
                                          </button>
                                          <button
                                            onClick={() => setIsAdminEditingPers(false)}
                                            className="px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs py-2 rounded-lg transition-colors"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-3">
                                        <div className="flex justify-between items-center text-xs bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                                          <div>
                                            <span className="block text-[10px] uppercase text-zinc-500">Player Name</span>
                                            <span className="font-mono font-bold text-white text-sm">{item.playerName}</span>
                                          </div>
                                          <div className="text-right">
                                            <span className="block text-[10px] uppercase text-zinc-500">Number</span>
                                            <span className="font-mono font-bold text-white text-sm">{item.playerNumber}</span>
                                          </div>
                                        </div>

                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => downloadArtwork(selectedOrder.displayId, item.playerName, item.playerNumber, item.previewImageUrl || item.imageSrc)}
                                            className="flex-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
                                          >
                                            <span className="material-symbols-outlined text-[16px]">download</span>
                                            Download PNG
                                          </button>
                                          
                                          <button
                                            onClick={() => {
                                              setEditingPersItemId(item.id);
                                              setEditingPersName(item.playerName || '');
                                              setEditingPersNumber(item.playerNumber || '');
                                              setIsAdminEditingPers(true);
                                            }}
                                            className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-3 rounded-lg flex items-center justify-center transition-colors"
                                            title="Edit personalization details"
                                          >
                                            <span className="material-symbols-outlined text-[16px]">edit</span>
                                          </button>
                                        </div>
                                      </div>
                                    )}

                                    {/* Version History List */}
                                    {persRecord.versions && persRecord.versions.length > 0 && (
                                      <div className="pt-3 border-t border-zinc-800 space-y-2">
                                        <span className="block text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Version History</span>
                                        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                                          {persRecord.versions.map((ver: any, vidx: number) => (
                                            <div key={vidx} className="flex justify-between items-center text-[10px] bg-zinc-900/60 p-2 rounded border border-zinc-900 text-zinc-400">
                                              <span>v{vidx + 1}: <strong className="text-white">{ver.playerName}</strong> ({ver.playerNumber})</span>
                                              <button 
                                                onClick={() => downloadArtwork(selectedOrder.displayId, ver.playerName, ver.playerNumber, ver.previewImageUrl)}
                                                className="material-symbols-outlined text-[14px] text-zinc-500 hover:text-white"
                                              >
                                                download
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })()}

        {/* TAB 5: Inventory Manager */}
        {activeTab === 'inventory' && (
          <div className="space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tight">Product Catalog &amp; Inventory</h2>
                <p className="text-zinc-500 text-sm mt-1">Manage price variables, catalog descriptions, and restock counts.</p>
              </div>
              <button
                onClick={() => setShowUploadProductModal(true)}
                className="bg-amber-400 text-black px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors flex items-center gap-2 shrink-0 cursor-pointer shadow-lg"
              >
                <span className="material-symbols-outlined text-[18px]">add_box</span>
                Upload Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p: any) => (
                <div key={p.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between gap-4">
                  <div>
                    <h4 className="font-black text-lg text-white uppercase tracking-tight flex items-center justify-between gap-2">
                      <span>{p.title}</span>
                      {(p.customizable ?? p.personalizationTemplate?.enabled) && (
                        <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shrink-0">
                          Personalized
                        </span>
                      )}
                    </h4>
                    <p className="text-zinc-500 text-xs mt-1">SKU: {p.variants?.[0]?.sku || 'N/A'}</p>
                    <div className="flex gap-4 mt-4">
                      <div className="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg flex-1">
                        <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Price</span>
                        <strong className="text-sm font-black">₹{p.price}</strong>
                      </div>
                      <div className="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg flex-1">
                        <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Inventory</span>
                        <strong className={`text-sm font-black ${(p.variants?.[0]?.inventory || 0) < 10 ? 'text-red-400' : 'text-green-400'}`}>{p.variants?.[0]?.inventory || 0} left</strong>
                      </div>
                    </div>

                    {/* Direct Personalisation Switch */}
                    <div className="flex items-center justify-between p-3 mt-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-xs text-amber-400">palette</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">Personalisation</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleProductPersonalisation(p)}
                        className={`px-3 py-1 text-[10px] font-black uppercase rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${
                          (p.customizable ?? p.personalizationTemplate?.enabled)
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${(p.customizable ?? p.personalizationTemplate?.enabled) ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                        {(p.customizable ?? p.personalizationTemplate?.enabled) ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const newStock = prompt("Enter new inventory level:", p.variants[0]?.inventory);
                          if (newStock !== null) {
                            const updatedVars = [...p.variants];
                            updatedVars[0] = { ...updatedVars[0], inventory: Number(newStock) };
                            fetch(`/api/admin/products/${p.id}/update`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ variants: updatedVars })
                            }).then(() => loadAdminData());
                          }
                        }}
                        className="flex-1 bg-white text-black text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
                      >
                        Restock Stock
                      </button>
                      <button 
                        onClick={() => {
                          const newPrice = prompt("Enter new price in ₹:", p.price);
                          if (newPrice !== null) {
                            fetch(`/api/admin/products/${p.id}/update`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ price: Number(newPrice) })
                            }).then(() => loadAdminData());
                          }
                        }}
                        className="flex-1 bg-zinc-800 border border-zinc-700 text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg hover:bg-zinc-700 transition-colors"
                      >
                        Edit Price
                      </button>
                    </div>
                    <button 
                      onClick={() => handleOpenTemplateEditor(p)}
                      className="w-full bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      <span className="material-symbols-outlined text-[16px] text-yellow-400">edit_square</span>
                      Personalization Template
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Product Modal with Personalisation Toggle */}
            {showUploadProductModal && (
              <div className="fixed inset-0 bg-black/80 z-[150] flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-lg w-full relative">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                    <div>
                      <h3 className="font-black text-xl text-white uppercase tracking-tight">Upload New Product</h3>
                      <p className="text-zinc-500 text-xs mt-0.5">Add a new item to catalog with personalisation switch</p>
                    </div>
                    <button
                      onClick={() => setShowUploadProductModal(false)}
                      className="text-zinc-500 hover:text-white"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <form onSubmit={handleCreateProduct} className="space-y-4">
                    <div>
                      <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CSK 2026 Official Match Jersey"
                        value={newProductTitle}
                        onChange={(e) => setNewProductTitle(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">
                          SKU / Barcode
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. CSK-JRSY-2026"
                          value={newProductSku}
                          onChange={(e) => setNewProductSku(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          value={newProductPrice}
                          onChange={(e) => setNewProductPrice(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">
                        Product Category / Type
                      </label>
                      <select
                        value={newProductType}
                        onChange={(e) => setNewProductType(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Jersey">Jersey (Partnership / Club)</option>
                        <option value="T-shirt">T-shirt</option>
                        <option value="Cap">Cap</option>
                        <option value="Hoodie">Hoodie</option>
                        <option value="Accessory">Accessory</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">
                        Product Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newProductImage}
                        onChange={(e) => setNewProductImage(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* PERSONALISATION TOGGLE */}
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-amber-400 text-sm">palette</span>
                          <span className="font-bold text-xs text-amber-300 uppercase tracking-wider">
                            Product Personalisation
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1 max-w-xs">
                          Allow customers to customize Name and Squad Number on this jersey in the store.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newProductPersonalisation}
                          onChange={(e) => setNewProductPersonalisation(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
                      </label>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setShowUploadProductModal(false)}
                        className="flex-1 py-3 rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-bold uppercase text-zinc-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUploadingProduct}
                        className="flex-1 py-3 rounded-lg bg-amber-400 text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors cursor-pointer shadow-lg"
                      >
                        {isUploadingProduct ? 'Uploading...' : 'Save Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Personalization Template Editor Modal */}
            {selectedTemplateProduct && tempEditorState && (
              <div className="fixed inset-0 bg-black/85 z-[150] flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-5xl w-full relative my-8">
                  <button 
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white flex items-center" 
                    onClick={() => {
                      setSelectedTemplateProduct(null);
                      setTempEditorState(null);
                    }}
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>

                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-white">
                    Personalization Template: {selectedTemplateProduct.title}
                  </h3>
                  <p className="text-zinc-500 text-xs mb-8">
                    Configure design parameters, coordinates, safe boundaries, and live preview rendering for customization.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Live Canvas Preview */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                      <div className="bg-zinc-950 p-6 border border-zinc-800 rounded-xl space-y-4">
                        <span className="block text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Live Preview Rendering</span>
                        
                        <div className="aspect-square w-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center relative">
                          <canvas
                            ref={adminTemplateCanvasRef}
                            width={400}
                            height={400}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {tempEditorState.enabled && !isTemplateInSafeArea && (
                          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-start gap-2.5 text-xs animate-pulse">
                            <span className="material-symbols-outlined text-[18px]">warning</span>
                            <p className="font-medium text-left">Bounds exceeded: Name or Number settings extend outside the printable safe area!</p>
                          </div>
                        )}

                        {tempEditorState.enabled && isTemplateInSafeArea && (
                          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg flex items-start gap-2.5 text-xs">
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                            <p className="font-medium text-left">Safe: Personalization elements are fully within the printable safe area.</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div>
                            <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 text-left">Name Test Input</label>
                            <input
                              type="text"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs uppercase font-mono text-white outline-none focus:border-zinc-700"
                              value={previewName}
                              onChange={(e) => setPreviewName(e.target.value.toUpperCase())}
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 text-left">Number Test Input</label>
                            <input
                              type="text"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-zinc-700"
                              value={previewNumber}
                              onChange={(e) => setPreviewNumber(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Template Controls */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="flex border-b border-zinc-850 overflow-x-auto">
                        {[
                          { key: 'image', label: 'Image & Canvas' },
                          { key: 'name', label: 'Name Settings' },
                          { key: 'number', label: 'Number Settings' },
                          { key: 'safe', label: 'Safe Area' }
                        ].map(t => (
                          <button
                            key={t.key}
                            onClick={() => setActiveTempTab(t.key as any)}
                            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                              activeTempTab === t.key
                                ? 'border-yellow-400 text-yellow-400'
                                : 'border-transparent text-zinc-400 hover:text-white'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      {/* Tab 1: Image & Canvas */}
                      {activeTempTab === 'image' && (
                        <div className="space-y-6 bg-zinc-950 p-6 border border-zinc-800 rounded-xl">
                          <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
                            <div className="text-left">
                              <span className="block font-bold text-xs uppercase text-white">Enable Personalization</span>
                              <span className="text-[10px] text-zinc-500">Allow customers to customize this product on storefront.</span>
                            </div>
                            <input
                              type="checkbox"
                              className="w-5 h-5 rounded accent-yellow-400 bg-zinc-900 border-zinc-800"
                              checked={tempEditorState.enabled}
                              onChange={(e) => setTempEditorState({ ...tempEditorState, enabled: e.target.checked })}
                            />
                          </div>

                          {tempEditorState.enabled && (
                            <>
                              <div className="space-y-3 text-left">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Select Render Image from Product Media</label>
                                <div className="grid grid-cols-4 gap-3">
                                  {selectedTemplateProduct.gallery?.map((img: string, gIdx: number) => (
                                    <button
                                      key={gIdx}
                                      onClick={() => setTempEditorState({ ...tempEditorState, renderImageId: String(gIdx), renderImageUrl: img })}
                                      className={`relative aspect-square rounded-lg overflow-hidden bg-zinc-900 border-2 transition-all ${
                                        tempEditorState.renderImageUrl === img ? 'border-yellow-400 ring-2 ring-yellow-400/20' : 'border-transparent opacity-60 hover:opacity-100'
                                      }`}
                                    >
                                      <img src={img} alt={`Gallery ${gIdx}`} className="w-full h-full object-cover" />
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 pt-2 text-left">
                                <div>
                                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Reference Canvas Width</label>
                                  <input
                                    type="number"
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white"
                                    value={tempEditorState.canvasWidth}
                                    onChange={(e) => setTempEditorState({ ...tempEditorState, canvasWidth: Number(e.target.value) })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Reference Canvas Height</label>
                                  <input
                                    type="number"
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white"
                                    value={tempEditorState.canvasHeight}
                                    onChange={(e) => setTempEditorState({ ...tempEditorState, canvasHeight: Number(e.target.value) })}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Tab 2: Name Settings */}
                      {activeTempTab === 'name' && (
                        <div className="space-y-6 bg-zinc-950 p-6 border border-zinc-800 rounded-xl max-h-[40vh] overflow-y-auto pr-2 text-left">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">X Coordinate (Center): {tempEditorState.nameSettings.x}</label>
                              <input
                                type="range"
                                min="0"
                                max={tempEditorState.canvasWidth}
                                className="w-full accent-yellow-400"
                                value={tempEditorState.nameSettings.x}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, nameSettings: { ...tempEditorState.nameSettings, x: Number(e.target.value) } })}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Y Coordinate (Center): {tempEditorState.nameSettings.y}</label>
                              <input
                                type="range"
                                min="0"
                                max={tempEditorState.canvasHeight}
                                className="w-full accent-yellow-400"
                                value={tempEditorState.nameSettings.y}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, nameSettings: { ...tempEditorState.nameSettings, y: Number(e.target.value) } })}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Width (Bounding Box): {tempEditorState.nameSettings.width}</label>
                              <input
                                type="range"
                                min="50"
                                max={tempEditorState.canvasWidth}
                                className="w-full accent-yellow-400"
                                value={tempEditorState.nameSettings.width}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, nameSettings: { ...tempEditorState.nameSettings, width: Number(e.target.value) } })}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Height (Bounding Box): {tempEditorState.nameSettings.height}</label>
                              <input
                                type="range"
                                min="10"
                                max="200"
                                className="w-full accent-yellow-400"
                                value={tempEditorState.nameSettings.height}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, nameSettings: { ...tempEditorState.nameSettings, height: Number(e.target.value) } })}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Font Family</label>
                              <select
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white"
                                value={tempEditorState.nameSettings.fontFamily}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, nameSettings: { ...tempEditorState.nameSettings, fontFamily: e.target.value } })}
                              >
                                <option value="Impact">Impact (Bold Athletic)</option>
                                <option value="Sora">Sora (Modern/Round)</option>
                                <option value="Oswald">Oswald (Tall Classic)</option>
                                <option value="Arial">Arial (Standard)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Font Size (px): {tempEditorState.nameSettings.fontSize}</label>
                              <input
                                type="number"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white"
                                value={tempEditorState.nameSettings.fontSize}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, nameSettings: { ...tempEditorState.nameSettings, fontSize: Number(e.target.value) } })}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Font Color (Hex)</label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  className="w-10 h-10 border-0 rounded bg-transparent"
                                  value={tempEditorState.nameSettings.color}
                                  onChange={(e) => setTempEditorState({ ...tempEditorState, nameSettings: { ...tempEditorState.nameSettings, color: e.target.value } })}
                                />
                                <input
                                  type="text"
                                  className="flex-grow bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white font-mono uppercase"
                                  value={tempEditorState.nameSettings.color}
                                  onChange={(e) => setTempEditorState({ ...tempEditorState, nameSettings: { ...tempEditorState.nameSettings, color: e.target.value } })}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Text Alignment</label>
                              <select
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white"
                                value={tempEditorState.nameSettings.alignment}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, nameSettings: { ...tempEditorState.nameSettings, alignment: e.target.value } })}
                              >
                                <option value="center">Center</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Max Characters</label>
                              <input
                                type="number"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white"
                                value={tempEditorState.nameSettings.maxCharacters}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, nameSettings: { ...tempEditorState.nameSettings, maxCharacters: Number(e.target.value) } })}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Rotation (Deg): {tempEditorState.nameSettings.rotation}</label>
                              <input
                                type="range"
                                min="-180"
                                max="180"
                                className="w-full accent-yellow-400"
                                value={tempEditorState.nameSettings.rotation}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, nameSettings: { ...tempEditorState.nameSettings, rotation: Number(e.target.value) } })}
                              />
                            </div>
                          </div>

                          {/* Outline settings */}
                          <div className="pt-4 border-t border-zinc-900 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="block font-bold text-xs uppercase text-zinc-300">Enable Outline</span>
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded accent-yellow-400 bg-zinc-900"
                                checked={tempEditorState.nameSettings.enableOutline}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, nameSettings: { ...tempEditorState.nameSettings, enableOutline: e.target.checked } })}
                              />
                            </div>
                            {tempEditorState.nameSettings.enableOutline && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Outline Width: {tempEditorState.nameSettings.outlineWidth}px</label>
                                  <input
                                    type="range"
                                    min="1"
                                    max="15"
                                    className="w-full accent-yellow-400"
                                    value={tempEditorState.nameSettings.outlineWidth}
                                    onChange={(e) => setTempEditorState({ ...tempEditorState, nameSettings: { ...tempEditorState.nameSettings, outlineWidth: Number(e.target.value) } })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Outline Color</label>
                                  <div className="flex gap-2">
                                    <input
                                      type="color"
                                      className="w-10 h-10 border-0 rounded bg-transparent"
                                      value={tempEditorState.nameSettings.outlineColor}
                                      onChange={(e) => setTempEditorState({ ...tempEditorState, nameSettings: { ...tempEditorState.nameSettings, outlineColor: e.target.value } })}
                                    />
                                    <input
                                      type="text"
                                      className="flex-grow bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white font-mono uppercase"
                                      value={tempEditorState.nameSettings.outlineColor}
                                      onChange={(e) => setTempEditorState({ ...tempEditorState, nameSettings: { ...tempEditorState.nameSettings, outlineColor: e.target.value } })}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tab 3: Number Settings */}
                      {activeTempTab === 'number' && (
                        <div className="space-y-6 bg-zinc-950 p-6 border border-zinc-800 rounded-xl max-h-[40vh] overflow-y-auto pr-2 text-left">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">X Coordinate (Center): {tempEditorState.numberSettings.x}</label>
                              <input
                                type="range"
                                min="0"
                                max={tempEditorState.canvasWidth}
                                className="w-full accent-yellow-400"
                                value={tempEditorState.numberSettings.x}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, numberSettings: { ...tempEditorState.numberSettings, x: Number(e.target.value) } })}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Y Coordinate (Center): {tempEditorState.numberSettings.y}</label>
                              <input
                                type="range"
                                min="0"
                                max={tempEditorState.canvasHeight}
                                className="w-full accent-yellow-400"
                                value={tempEditorState.numberSettings.y}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, numberSettings: { ...tempEditorState.numberSettings, y: Number(e.target.value) } })}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Width (Bounding Box): {tempEditorState.numberSettings.width}</label>
                              <input
                                type="range"
                                min="50"
                                max={tempEditorState.canvasWidth}
                                className="w-full accent-yellow-400"
                                value={tempEditorState.numberSettings.width}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, numberSettings: { ...tempEditorState.numberSettings, width: Number(e.target.value) } })}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Height (Bounding Box): {tempEditorState.numberSettings.height}</label>
                              <input
                                type="range"
                                min="10"
                                max="300"
                                className="w-full accent-yellow-400"
                                value={tempEditorState.numberSettings.height}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, numberSettings: { ...tempEditorState.numberSettings, height: Number(e.target.value) } })}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Font Family</label>
                              <select
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white"
                                value={tempEditorState.numberSettings.fontFamily}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, numberSettings: { ...tempEditorState.numberSettings, fontFamily: e.target.value } })}
                              >
                                <option value="Impact">Impact (Bold Athletic)</option>
                                <option value="Sora">Sora (Modern/Round)</option>
                                <option value="Oswald">Oswald (Tall Classic)</option>
                                <option value="Arial">Arial (Standard)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Font Size (px): {tempEditorState.numberSettings.fontSize}</label>
                              <input
                                type="number"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white"
                                value={tempEditorState.numberSettings.fontSize}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, numberSettings: { ...tempEditorState.numberSettings, fontSize: Number(e.target.value) } })}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Font Color (Hex)</label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  className="w-10 h-10 border-0 rounded bg-transparent"
                                  value={tempEditorState.numberSettings.color}
                                  onChange={(e) => setTempEditorState({ ...tempEditorState, numberSettings: { ...tempEditorState.numberSettings, color: e.target.value } })}
                                />
                                <input
                                  type="text"
                                  className="flex-grow bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white font-mono uppercase"
                                  value={tempEditorState.numberSettings.color}
                                  onChange={(e) => setTempEditorState({ ...tempEditorState, numberSettings: { ...tempEditorState.numberSettings, color: e.target.value } })}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Rotation (Deg): {tempEditorState.numberSettings.rotation}</label>
                              <input
                                type="range"
                                min="-180"
                                max="180"
                                className="w-full accent-yellow-400"
                                value={tempEditorState.numberSettings.rotation}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, numberSettings: { ...tempEditorState.numberSettings, rotation: Number(e.target.value) } })}
                              />
                            </div>
                          </div>

                          {/* Outline settings */}
                          <div className="pt-4 border-t border-zinc-900 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="block font-bold text-xs uppercase text-zinc-300">Enable Outline</span>
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded accent-yellow-400 bg-zinc-900"
                                checked={tempEditorState.numberSettings.enableOutline}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, numberSettings: { ...tempEditorState.numberSettings, enableOutline: e.target.checked } })}
                              />
                            </div>
                            {tempEditorState.numberSettings.enableOutline && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Outline Width: {tempEditorState.numberSettings.outlineWidth}px</label>
                                  <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    className="w-full accent-yellow-400"
                                    value={tempEditorState.numberSettings.outlineWidth}
                                    onChange={(e) => setTempEditorState({ ...tempEditorState, numberSettings: { ...tempEditorState.numberSettings, outlineWidth: Number(e.target.value) } })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Outline Color</label>
                                  <div className="flex gap-2">
                                    <input
                                      type="color"
                                      className="w-10 h-10 border-0 rounded bg-transparent"
                                      value={tempEditorState.numberSettings.outlineColor}
                                      onChange={(e) => setTempEditorState({ ...tempEditorState, numberSettings: { ...tempEditorState.numberSettings, outlineColor: e.target.value } })}
                                    />
                                    <input
                                      type="text"
                                      className="flex-grow bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white font-mono uppercase"
                                      value={tempEditorState.numberSettings.outlineColor}
                                      onChange={(e) => setTempEditorState({ ...tempEditorState, numberSettings: { ...tempEditorState.numberSettings, outlineColor: e.target.value } })}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tab 4: Safe Area settings */}
                      {activeTempTab === 'safe' && (
                        <div className="space-y-6 bg-zinc-950 p-6 border border-zinc-800 rounded-xl text-left">
                          <span className="block text-[10px] text-zinc-500 mb-4 uppercase">
                            Configure bounds for safe printable area. Personalization text entering outside these bounds triggers warning highlights.
                          </span>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">X Margin Offset: {tempEditorState.safeArea.x}</label>
                              <input
                                type="range"
                                min="0"
                                max={tempEditorState.canvasWidth / 2}
                                className="w-full accent-yellow-400"
                                value={tempEditorState.safeArea.x}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, safeArea: { ...tempEditorState.safeArea, x: Number(e.target.value) } })}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Y Margin Offset: {tempEditorState.safeArea.y}</label>
                              <input
                                type="range"
                                min="0"
                                max={tempEditorState.canvasHeight / 2}
                                className="w-full accent-yellow-400"
                                value={tempEditorState.safeArea.y}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, safeArea: { ...tempEditorState.safeArea, y: Number(e.target.value) } })}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Printable Width: {tempEditorState.safeArea.width}</label>
                              <input
                                type="range"
                                min="100"
                                max={tempEditorState.canvasWidth}
                                className="w-full accent-yellow-400"
                                value={tempEditorState.safeArea.width}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, safeArea: { ...tempEditorState.safeArea, width: Number(e.target.value) } })}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Printable Height: {tempEditorState.safeArea.height}</label>
                              <input
                                type="range"
                                min="100"
                                max={tempEditorState.canvasHeight}
                                className="w-full accent-yellow-400"
                                value={tempEditorState.safeArea.height}
                                onChange={(e) => setTempEditorState({ ...tempEditorState, safeArea: { ...tempEditorState.safeArea, height: Number(e.target.value) } })}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-4 pt-4 border-t border-zinc-800 justify-end">
                        <button
                          onClick={() => {
                            setSelectedTemplateProduct(null);
                            setTempEditorState(null);
                          }}
                          className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-lg transition-colors uppercase tracking-wider"
                        >
                          Close
                        </button>
                        <button
                          onClick={handleSaveTemplateSettings}
                          disabled={isSavingTemplate}
                          className="px-8 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-bold text-xs rounded-lg transition-colors uppercase tracking-wider disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSavingTemplate ? (
                            <>
                              <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                              Saving...
                            </>
                          ) : "Save Template"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: Coupons Engine */}
        {activeTab === 'coupons' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight">Coupons & Discounts</h2>
              <p className="text-zinc-500 text-sm mt-1">Configure active promotional codes applicable at checkout.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Add Coupon Form */}
              <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 p-8 rounded-2xl h-fit">
                <h3 className="font-bold text-lg uppercase tracking-wider mb-6">Create Coupon</h3>
                <form onSubmit={handleAddCoupon} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Coupon Code</label>
                    <input 
                      type="text" 
                      required 
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm uppercase tracking-wider" 
                      placeholder="e.g. MONSOON20" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Discount Type</label>
                    <select 
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Flat Rate (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Discount Value</label>
                    <input 
                      type="number" 
                      required 
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm" 
                    />
                  </div>
                  <button type="submit" className="w-full bg-white text-black text-xs font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-zinc-200 transition-colors">
                    Add Coupon
                  </button>
                </form>
              </div>

              {/* Coupons List */}
              <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-400">
                      <th className="p-5">Code</th>
                      <th className="p-5">Discount</th>
                      <th className="p-5">Status</th>
                      <th className="p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {coupons.map((c: any) => (
                      <tr key={c.id} className="text-sm">
                        <td className="p-5 font-black uppercase tracking-wider">{c.code}</td>
                        <td className="p-5 font-bold">{c.discountType === 'percentage' ? `${c.discountValue}% Off` : `₹${c.discountValue} Off`}</td>
                        <td className="p-5">
                          <button 
                            onClick={() => handleToggleCoupon(c.id, c.isActive)}
                            className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                              c.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {c.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="p-5 text-right">
                          <button 
                            onClick={() => handleDeleteCoupon(c.id)}
                            className="text-red-500 hover:text-red-400 font-bold uppercase text-xs tracking-wider"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: Loyalty & XP Rewards */}
        {activeTab === 'loyalty' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight">playR XP loyalty</h2>
              <p className="text-zinc-500 text-sm mt-1">Configure active customer challenges, points structures, and leaderboard ranks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Program Rules */}
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
                <h3 className="font-bold text-lg uppercase tracking-wider mb-6">Active Challenges list</h3>
                <div className="space-y-4">
                  {[
                    { title: 'First Purchase', reward: '+500 XP', icon: 'shopping_bag' },
                    { title: 'Leave a Review', reward: '+200 XP', icon: 'reviews' },
                    { title: 'Refer a Friend', reward: '+1000 XP', icon: 'group_add' },
                    { title: '3-Order Streak', reward: '+750 XP', icon: 'local_fire_department' }
                  ].map((ch, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-xl">{ch.icon}</span>
                        <strong className="text-sm">{ch.title}</strong>
                      </div>
                      <span className="text-sm font-black text-primary-container">{ch.reward}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leaderboard status */}
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
                <h3 className="font-bold text-lg uppercase tracking-wider mb-6">Live Leaderboard Ranks</h3>
                <div className="space-y-4">
                  {customers.map((c: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-zinc-500 w-4">#{idx + 1}</span>
                        <strong className="text-sm">{c.firstName} {c.lastName}</strong>
                      </div>
                      <div className="text-right">
                        <strong className="text-sm text-white font-mono">{c.xp} XP</strong>
                        <span className="block text-[9px] uppercase font-bold text-zinc-500">{c.tier}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: Support Tickets */}
        {activeTab === 'support' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight">Support Desk Inbox</h2>
              <p className="text-zinc-500 text-sm mt-1">Review ticket submissions and dispatch resolving replies.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950 border-b border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <th className="p-5">Ticket ID</th>
                    <th className="p-5">Subject</th>
                    <th className="p-5">Submitted By</th>
                    <th className="p-5">Priority</th>
                    <th className="p-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {tickets.map((t: any) => (
                    <tr 
                      key={t.id} 
                      onClick={() => setSelectedTicket(t)}
                      className="hover:bg-zinc-800/20 text-sm cursor-pointer"
                    >
                      <td className="p-5 font-bold font-mono text-yellow-500">{t.id}</td>
                      <td className="p-5 font-bold text-white">{t.subject}</td>
                      <td className="p-5 text-zinc-400">{t.name} ({t.email})</td>
                      <td className="p-5">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          t.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          t.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ticket Reply Modal */}
            {selectedTicket && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-lg w-full relative">
                  <button className="absolute top-4 right-4 text-zinc-500 hover:text-white" onClick={() => setSelectedTicket(null)}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                  <h3 className="text-2xl font-black uppercase tracking-tight">Support Helpdesk</h3>
                  <div className="space-y-4 mt-6 text-sm">
                    <p className="bg-zinc-950 p-4 border border-zinc-800 rounded-lg text-zinc-300">
                      <strong>Original message:</strong><br />
                      {selectedTicket.message}
                    </p>
                    
                    {/* Reply thread */}
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedTicket.replies?.map((r: any, idx: number) => (
                        <div key={idx} className={`p-2 rounded text-xs ${r.sender === 'admin@playr.in' ? 'bg-zinc-800 text-white text-right' : 'bg-zinc-950 text-zinc-400'}`}>
                          <strong className="block text-[9px] uppercase text-zinc-500">{r.sender}</strong>
                          {r.text}
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleTicketReply} className="space-y-4 pt-4 border-t border-zinc-800">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Reply message</label>
                        <textarea 
                          rows={3} 
                          required 
                          value={ticketReply}
                          onChange={(e) => setTicketReply(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm resize-none" 
                          placeholder="Type reply to customer..." 
                        />
                      </div>
                      <button type="submit" className="w-full bg-white text-black text-xs font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-zinc-200 transition-colors">
                        Resolve & Send Reply
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 9: Visual CMS Page Editor */}
        {activeTab === 'cms' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight">Visual CMS Page Editor</h2>
              <p className="text-zinc-500 text-sm mt-1">Modify page marketing layouts, headings, and CTA blocks visually.</p>
            </div>

            {/* Selector */}
            <div className="flex gap-3 mb-8">
              {['homepage', 'about', 'media'].map(p => (
                <button
                  key={p}
                  onClick={() => setCmsPage(p as any)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    cmsPage === p ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {p} Page Layout
                </button>
              ))}
            </div>

            {/* Block Editor Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-6 bg-zinc-900 border border-zinc-800 p-8 rounded-2xl space-y-6">
                <h3 className="font-bold text-lg uppercase tracking-wider border-b border-zinc-800 pb-3">Hero block Layout</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Header Heading 1</label>
                    <input 
                      type="text" 
                      value={cmsContent.hero?.heading1 || ''}
                      onChange={(e) => setCmsContent({ ...cmsContent, hero: { ...cmsContent.hero, heading1: e.target.value } })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Header Heading 2 (Optional)</label>
                    <input 
                      type="text" 
                      value={cmsContent.hero?.heading2 || ''}
                      onChange={(e) => setCmsContent({ ...cmsContent, hero: { ...cmsContent.hero, heading2: e.target.value } })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Subtext Description</label>
                    <textarea 
                      rows={3} 
                      value={cmsContent.hero?.description || ''}
                      onChange={(e) => setCmsContent({ ...cmsContent, hero: { ...cmsContent.hero, description: e.target.value } })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm resize-none" 
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-zinc-800">
                  <button 
                    onClick={() => handleSaveCMS('draft')}
                    className="flex-1 bg-zinc-850 border border-zinc-700 text-xs font-bold uppercase tracking-wider py-3 rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    Save Draft
                  </button>
                  <button 
                    onClick={() => handleSaveCMS('published')}
                    className="flex-1 bg-white text-black text-xs font-bold uppercase tracking-wider py-3 rounded-lg hover:bg-zinc-200 transition-colors"
                  >
                    Publish Changes
                  </button>
                </div>
              </div>

              {/* Visual Preview */}
              <div className="lg:col-span-6 border border-zinc-800 bg-zinc-950 p-8 rounded-2xl flex flex-col justify-center text-center items-center min-h-[400px]">
                <span className="text-[10px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-500 px-3 py-1 rounded-full uppercase tracking-wider mb-8">Live Layout Mock Preview</span>
                <h1 className="font-black text-4xl uppercase tracking-tighter leading-none">
                  {cmsContent.hero?.heading1}<br />
                  <span className="text-zinc-400">{cmsContent.hero?.heading2}</span>
                </h1>
                <p className="text-zinc-500 text-xs max-w-sm mt-4 leading-relaxed">{cmsContent.hero?.description}</p>
                <button className="mt-8 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-6 py-3.5 rounded-full">
                  {cmsContent.hero?.primaryCta?.label || 'Explore'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: Blog Compiler */}
        {activeTab === 'blogs' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight">Blog Articles Compiler</h2>
              <p className="text-zinc-500 text-sm mt-1">Publish news bulletins, athletic training guides, or partnership blogs.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Compile form */}
              <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 p-8 rounded-2xl h-fit">
                <h3 className="font-bold text-lg uppercase tracking-wider mb-6">Compile Blog Post</h3>
                <form onSubmit={handleAddBlog} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Blog Title</label>
                    <input 
                      type="text" 
                      required 
                      value={newBlogTitle}
                      onChange={(e) => setNewBlogTitle(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Short Excerpt Summary</label>
                    <input 
                      type="text" 
                      required 
                      value={newBlogExcerpt}
                      onChange={(e) => setNewBlogExcerpt(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Markdown Content Body</label>
                    <textarea 
                      rows={5} 
                      required 
                      value={newBlogContent}
                      onChange={(e) => setNewBlogContent(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm resize-none" 
                    />
                  </div>
                  <button type="submit" className="w-full bg-white text-black text-xs font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-zinc-200 transition-colors">
                    Publish Article
                  </button>
                </form>
              </div>

              {/* Blogs Listing */}
              <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-lg uppercase tracking-wider mb-6">Active Blog Articles</h3>
                <div className="space-y-4">
                  {blogs.map((b: any) => (
                    <div key={b.id} className="bg-zinc-950 p-4 border border-zinc-800 rounded-xl flex justify-between items-center gap-4">
                      <div>
                        <h4 className="font-bold text-sm text-white">{b.title}</h4>
                        <p className="text-zinc-500 text-xs mt-1 truncate max-w-md">{b.excerpt}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteBlog(b.id)}
                        className="text-red-500 hover:text-red-400 font-bold uppercase text-xs tracking-wider shrink-0"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight">System Audit Logs & Settings</h2>
              <p className="text-zinc-500 text-sm mt-1">Review live console telemetry and administrative access privileges.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Roles Management */}
              <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 p-8 rounded-2xl h-fit">
                <h3 className="font-bold text-lg uppercase tracking-wider mb-6">Enterprise Roles</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <span>Admin role</span>
                    <span className="bg-primary-container text-on-primary-container text-[9px] font-bold px-2 py-0.5 rounded">FULL ACCESS</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <span>Editor role</span>
                    <span className="bg-zinc-800 text-zinc-400 text-[9px] font-bold px-2 py-0.5 rounded">CMS ONLY</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <span>Viewer role</span>
                    <span className="bg-zinc-800 text-zinc-400 text-[9px] font-bold px-2 py-0.5 rounded">READ ONLY</span>
                  </div>
                </div>
              </div>

              {/* Full Audit Logs */}
              <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
                <h3 className="font-bold text-lg uppercase tracking-wider mb-6">Security Audit History</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {auditLogs.map((log: any) => (
                    <div key={log.id} className="bg-zinc-950 p-4 border border-zinc-800 rounded-xl text-xs font-mono flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                      <div>
                        <span className="text-zinc-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                        <strong className="text-primary-container">{log.userId}</strong>{' '}
                        <span className="text-white">{log.action}</span>
                      </div>
                      <span className="text-zinc-400 truncate max-w-sm">{log.details}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
