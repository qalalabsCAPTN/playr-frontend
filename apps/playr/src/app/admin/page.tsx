"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

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
  
  // Forms states
  const [newCouponCode, setNewCouponCode] = useState('')
  const [newCouponType, setNewCouponType] = useState('percentage')
  const [newCouponValue, setNewCouponValue] = useState(10)
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogExcerpt, setNewBlogExcerpt] = useState('')
  const [newBlogContent, setNewBlogContent] = useState('')
  const [ticketReply, setTicketReply] = useState('')

  // Load Admin Data
  const loadAdminData = async () => {
    try {
      const [leadsRes, custsRes, ordsRes, prodsRes, coupsRes, tktsRes, blogsRes, logsRes] = await Promise.all([
        fetch('/api/admin/leads').then(r => r.json()),
        fetch('/api/identity/users/real_usr_8f92a').then(r => [r.json()]), // mock user list derived from search queries
        fetch('/api/admin/orders').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/admin/coupons').then(r => r.json()),
        fetch('/api/admin/support-tickets').then(r => r.json()),
        fetch('/api/admin/blogs').then(r => r.json()),
        fetch('/api/admin/audit-logs').then(r => r.json())
      ]);

      setLeads(leadsRes || []);
      setCustomers(Array.isArray(custsRes) ? custsRes : []);
      setOrders(ordsRes || []);
      setProducts(prodsRes || []);
      setCoupons(coupsRes || []);
      setTickets(tktsRes || []);
      setBlogs(blogsRes || []);
      setAuditLogs(logsRes || []);
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

  useEffect(() => {
    // Session authorization check
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      loadAdminData();
      loadCmsContent(cmsPage);
    }
  }, [status, cmsPage, router])

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
        {activeTab === 'orders' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight">Order Fulfilment & Logistics</h2>
              <p className="text-zinc-500 text-sm mt-1">Fulfill sales checkouts and trigger carrier tracking updates.</p>
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
                  {orders.map((o: any) => (
                    <tr 
                      key={o.id} 
                      onClick={() => setSelectedOrder(o)}
                      className="hover:bg-zinc-800/20 text-sm cursor-pointer"
                    >
                      <td className="p-5 font-bold font-mono text-primary-container">{o.displayId}</td>
                      <td className="p-5 text-zinc-500 font-mono">{new Date(o.date).toLocaleDateString()}</td>
                      <td className="p-5 text-zinc-400">{o.userId}</td>
                      <td className="p-5 text-zinc-400">{(o.items || []).map((i: any) => `${i.title} (x${i.quantity})`).join(', ')}</td>
                      <td className="p-5 font-black">₹{o.total.toLocaleString()}</td>
                      <td className="p-5">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          o.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                          o.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
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
            {selectedOrder && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full relative">
                  <button className="absolute top-4 right-4 text-zinc-500 hover:text-white" onClick={() => setSelectedOrder(null)}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                  <h3 className="text-2xl font-black uppercase tracking-tight">Fulfill Order: {selectedOrder.displayId}</h3>
                  <div className="space-y-4 mt-6 text-sm">
                    <p><strong>Shipping To:</strong> {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}</p>
                    <p><strong>Full Address:</strong> {selectedOrder.shippingAddress?.address}</p>
                    <p><strong>Contact phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                    <p><strong>Carrier Status Flow:</strong></p>
                    <div className="grid grid-cols-2 gap-2">
                      {['processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, status)}
                          className={`text-xs px-3 py-2 rounded-lg border uppercase tracking-wider font-bold ${
                            selectedOrder.status === status
                              ? 'bg-white text-black border-white'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
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

        {/* TAB 5: Inventory Manager */}
        {activeTab === 'inventory' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight">Product Catalog & Inventory</h2>
              <p className="text-zinc-500 text-sm mt-1">Manage price variables, catalog descriptions, and restock counts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p: any) => (
                <div key={p.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between gap-4">
                  <div>
                    <h4 className="font-black text-lg text-white uppercase tracking-tight">{p.title}</h4>
                    <p className="text-zinc-500 text-xs mt-1">SKU: {p.variants[0]?.sku || 'N/A'}</p>
                    <div className="flex gap-4 mt-4">
                      <div className="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg flex-1">
                        <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Price</span>
                        <strong className="text-sm font-black">₹{p.price}</strong>
                      </div>
                      <div className="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg flex-1">
                        <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Inventory</span>
                        <strong className={`text-sm font-black ${p.variants[0]?.inventory < 10 ? 'text-red-400' : 'text-green-400'}`}>{p.variants[0]?.inventory || 0} left</strong>
                      </div>
                    </div>
                  </div>

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
                </div>
              ))}
            </div>
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
