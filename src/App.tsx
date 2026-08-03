import { useState, useMemo, useRef, useEffect } from 'react'

type Category = 'Hardware' | 'Software' | 'License' | 'Network' | 'Mobile'
type Status = 'Active' | 'Maintenance' | 'Available' | 'Retired'
type Tab = 'All' | Category

interface Asset {
  id: string
  name: string
  category: Category
  assignedTo: string | null
  department: string | null
  status: Status
  location: string
  serial: string
  purchaseDate: string
  lastUpdated: string
  cost: number
  vendor: string
}

// Demo credentials — replace with real auth in production
const ADMIN_CREDENTIALS = [
  { username: 'admin', password: 'admin123', name: 'System Administrator', role: 'SUPER_ADMIN' },
  { username: 'itops', password: 'itops2026', name: 'IT Operations', role: 'IT_ADMIN' },
]

function LoginScreen({ onLogin }: { onLogin: (name: string, role: string) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)
  const usernameRef = useRef<HTMLInputElement>(null)

  useEffect(() => { usernameRef.current?.focus() }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate auth latency
    setTimeout(() => {
      const match = ADMIN_CREDENTIALS.find(
        c => c.username === username.trim() && c.password === password
      )
      if (match) {
        onLogin(match.name, match.role)
      } else {
        setError('Invalid credentials. Access denied.')
        setShake(true)
        setPassword('')
        setTimeout(() => setShake(false), 600)
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0A0A0A', fontFamily: 'Outfit, sans-serif' }}>
      {/* Left panel — branding */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-14 border-r-2 border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF3B00] flex items-center justify-center shrink-0">
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 15, color: '#fff' }}>IT</span>
          </div>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#6B6B6B', letterSpacing: '0.12em' }}>
            ASSET_INVENTORY
          </span>
        </div>

        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#FF3B00', letterSpacing: '0.14em', marginBottom: 16 }}>
            ◈ RESTRICTED ACCESS
          </div>
          <h2 style={{ fontSize: 42, fontWeight: 700, color: '#F4F3EF', lineHeight: 1.1, marginBottom: 20 }}>
            Admin<br />Portal
          </h2>
          <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.7, maxWidth: 340 }}>
            Authorized personnel only. All access attempts are logged and monitored. Unauthorized access is a violation of company policy.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'TOTAL ASSETS', value: '18' },
            { label: 'ACTIVE USERS', value: '2' },
            { label: 'LAST AUDIT', value: '2026-07-28' },
            { label: 'SYSTEM STATUS', value: 'ONLINE' },
          ].map(s => (
            <div key={s.label} className="border border-zinc-800 p-3">
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#6B6B6B', letterSpacing: '0.1em', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, fontWeight: 700, color: s.label === 'SYSTEM STATUS' ? '#00A86B' : '#F4F3EF' }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div
          className={`w-full max-w-sm ${shake ? 'animate-shake' : ''}`}
          style={shake ? { animation: 'shake 0.5s ease' } : {}}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 md:hidden">
            <div className="w-9 h-9 bg-[#FF3B00] flex items-center justify-center">
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 13, color: '#fff' }}>IT</span>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#6B6B6B', letterSpacing: '0.12em' }}>ASSET_INVENTORY</span>
          </div>

          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#6B6B6B', letterSpacing: '0.14em', marginBottom: 8 }}>
            ADMIN_AUTHENTICATION
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#F4F3EF', marginBottom: 32 }}>Sign in</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username */}
            <div>
              <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#6B6B6B', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>
                USERNAME
              </label>
              <input
                ref={usernameRef}
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError('') }}
                autoComplete="username"
                spellCheck={false}
                className="w-full h-11 px-4 bg-zinc-900 border-2 border-zinc-700 text-white outline-none focus:border-[#FF3B00] transition-colors"
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}
                placeholder="admin"
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#6B6B6B', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  autoComplete="current-password"
                  className="w-full h-11 px-4 pr-12 bg-zinc-900 border-2 border-zinc-700 text-white outline-none focus:border-[#FF3B00] transition-colors"
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
                  tabIndex={-1}
                >
                  {showPass ? '◡' : '○'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 border border-red-900 bg-red-950 px-4 py-3">
                <span style={{ color: '#FF3B00', fontSize: 14 }}>⚠</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#FF8066' }}>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="h-11 mt-2 bg-[#FF3B00] text-white font-semibold hover:bg-white hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.1em' }}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AUTHENTICATING…
                </>
              ) : (
                'SIGN IN →'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#444', lineHeight: 1.7 }}>
              Demo credentials:<br />
              <span style={{ color: '#666' }}>admin / admin123</span><br />
              <span style={{ color: '#666' }}>itops / itops2026</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          90% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}

const ASSETS: Asset[] = [
  { id: 'HW-0041', name: 'MacBook Pro 16in M3', category: 'Hardware', assignedTo: 'Sarah Chen', department: 'Engineering', status: 'Active', location: 'NYC HQ — Floor 4', serial: 'C02ZN4XZMD6T', purchaseDate: '2024-02-14', lastUpdated: '2026-07-28', cost: 3499, vendor: 'Apple Inc.' },
  { id: 'HW-0042', name: 'Dell UltraSharp 27in 4K', category: 'Hardware', assignedTo: 'Sarah Chen', department: 'Engineering', status: 'Active', location: 'NYC HQ — Floor 4', serial: 'DL7X92KQ3814', purchaseDate: '2024-02-14', lastUpdated: '2026-07-28', cost: 899, vendor: 'Dell Technologies' },
  { id: 'HW-0043', name: 'ThinkPad X1 Carbon', category: 'Hardware', assignedTo: 'Marcus Webb', department: 'Sales', status: 'Active', location: 'Remote — Chicago', serial: 'PC3KN7ZL0092', purchaseDate: '2023-11-30', lastUpdated: '2026-07-15', cost: 2199, vendor: 'Lenovo' },
  { id: 'HW-0044', name: 'HP EliteDesk 800 G6', category: 'Hardware', assignedTo: null, department: null, status: 'Available', location: 'NYC HQ — Storage', serial: 'HP9QK2MZ7731', purchaseDate: '2023-06-01', lastUpdated: '2026-05-20', cost: 1450, vendor: 'HP Inc.' },
  { id: 'HW-0045', name: 'MacBook Air 13in M2', category: 'Hardware', assignedTo: 'Priya Nair', department: 'Design', status: 'Active', location: 'NYC HQ — Floor 3', serial: 'C02ZP1ABMD6T', purchaseDate: '2024-05-10', lastUpdated: '2026-07-30', cost: 1299, vendor: 'Apple Inc.' },
  { id: 'HW-0046', name: 'Cisco Catalyst 9200', category: 'Network', assignedTo: null, department: 'IT', status: 'Active', location: 'NYC HQ — Server Room', serial: 'CSC2X4NQKR81', purchaseDate: '2022-09-15', lastUpdated: '2026-07-01', cost: 4800, vendor: 'Cisco Systems' },
  { id: 'HW-0047', name: 'iPhone 15 Pro', category: 'Mobile', assignedTo: 'Jordan Kim', department: 'Executive', status: 'Active', location: 'Remote — LA', serial: 'IP15PNZK0034', purchaseDate: '2024-01-08', lastUpdated: '2026-07-22', cost: 999, vendor: 'Apple Inc.' },
  { id: 'HW-0048', name: 'Synology NAS DS923+', category: 'Hardware', assignedTo: null, department: 'IT', status: 'Maintenance', location: 'NYC HQ — Server Room', serial: 'SY9RL3VQ2201', purchaseDate: '2023-04-20', lastUpdated: '2026-08-01', cost: 1800, vendor: 'Synology' },
  { id: 'HW-0049', name: 'Logitech MX Keys S', category: 'Hardware', assignedTo: 'Tyler Brooks', department: 'Operations', status: 'Active', location: 'NYC HQ — Floor 2', serial: 'LG4XN8WZ0055', purchaseDate: '2025-01-15', lastUpdated: '2026-06-10', cost: 109, vendor: 'Logitech' },
  { id: 'HW-0050', name: 'Dell Precision 5570', category: 'Hardware', assignedTo: null, department: null, status: 'Retired', location: 'NYC HQ — Storage', serial: 'DL2Q7YN4K011', purchaseDate: '2020-03-10', lastUpdated: '2026-02-28', cost: 2800, vendor: 'Dell Technologies' },
  { id: 'SW-0011', name: 'Adobe Creative Cloud', category: 'Software', assignedTo: 'Priya Nair', department: 'Design', status: 'Active', location: '—', serial: 'ADO-CC-7X4N-2024', purchaseDate: '2024-11-01', lastUpdated: '2026-07-01', cost: 659, vendor: 'Adobe Inc.' },
  { id: 'SW-0012', name: 'JetBrains All Products', category: 'Software', assignedTo: 'Sarah Chen', department: 'Engineering', status: 'Active', location: '—', serial: 'JB-ALL-EN-8814', purchaseDate: '2025-02-01', lastUpdated: '2026-07-01', cost: 779, vendor: 'JetBrains' },
  { id: 'SW-0013', name: 'Figma Organization', category: 'Software', assignedTo: null, department: 'Design', status: 'Active', location: '—', serial: 'FIG-ORG-2025-0112', purchaseDate: '2025-01-01', lastUpdated: '2026-07-01', cost: 4200, vendor: 'Figma, Inc.' },
  { id: 'LIC-0001', name: 'Microsoft 365 Business', category: 'License', assignedTo: null, department: 'All', status: 'Active', location: '—', serial: 'MS365-ENT-2025-55STS', purchaseDate: '2025-07-01', lastUpdated: '2026-07-01', cost: 16500, vendor: 'Microsoft' },
  { id: 'LIC-0002', name: 'Slack Pro (75 seats)', category: 'License', assignedTo: null, department: 'All', status: 'Active', location: '—', serial: 'SLK-PRO-0293-Q3', purchaseDate: '2026-04-01', lastUpdated: '2026-07-01', cost: 6750, vendor: 'Salesforce / Slack' },
  { id: 'LIC-0003', name: 'GitHub Enterprise', category: 'License', assignedTo: null, department: 'Engineering', status: 'Active', location: '—', serial: 'GH-ENT-ORGK-0488', purchaseDate: '2026-01-01', lastUpdated: '2026-07-01', cost: 9600, vendor: 'GitHub' },
  { id: 'NET-0001', name: 'Ubiquiti UniFi AP U7', category: 'Network', assignedTo: null, department: 'IT', status: 'Active', location: 'NYC HQ — Floor 3', serial: 'UB7X2QN4K091', purchaseDate: '2025-03-10', lastUpdated: '2026-06-20', cost: 279, vendor: 'Ubiquiti' },
  { id: 'MOB-0007', name: 'iPad Pro 13in M4', category: 'Mobile', assignedTo: 'Marcus Webb', department: 'Sales', status: 'Active', location: 'Remote — Chicago', serial: 'IPAD13M4NZQ04', purchaseDate: '2024-09-20', lastUpdated: '2026-07-10', cost: 1299, vendor: 'Apple Inc.' },
]

const STATUS_STYLES: Record<Status, { bg: string; text: string; dot: string }> = {
  Active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Available: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  Maintenance: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  Retired: { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' },
}

const CATEGORY_ICONS: Record<Category | 'All', string> = {
  All: '◈',
  Hardware: '⬡',
  Software: '◇',
  License: '◻',
  Network: '◎',
  Mobile: '▱',
}

const NAV_ITEMS = [
  { label: 'Dashboard', icon: '▦' },
  { label: 'Assets', icon: '◈', active: true },
  { label: 'Assignments', icon: '⬡' },
  { label: 'Maintenance', icon: '◇' },
  { label: 'Reports', icon: '▣' },
  { label: 'Settings', icon: '◻' },
]

type SortKey = keyof Pick<Asset, 'id' | 'name' | 'category' | 'status' | 'lastUpdated' | 'cost'>

function Dashboard({ adminName, adminRole, onLogout }: { adminName: string; adminRole: string; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('All')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All')
  const [sortKey, setSortKey] = useState<SortKey>('id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [selected, setSelected] = useState<string | null>(null)

  const stats = useMemo(() => {
    const total = ASSETS.length
    const active = ASSETS.filter(a => a.status === 'Active').length
    const maintenance = ASSETS.filter(a => a.status === 'Maintenance').length
    const available = ASSETS.filter(a => a.status === 'Available').length
    const totalCost = ASSETS.reduce((s, a) => s + a.cost, 0)
    return { total, active, maintenance, available, totalCost }
  }, [])

  const filtered = useMemo(() => {
    let list = ASSETS
    if (activeTab !== 'All') list = list.filter(a => a.category === activeTab)
    if (statusFilter !== 'All') list = list.filter(a => a.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.serial.toLowerCase().includes(q) ||
        (a.assignedTo?.toLowerCase().includes(q) ?? false)
      )
    }
    list = [...list].sort((a, b) => {
      const av = String(a[sortKey])
      const bv = String(b[sortKey])
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
    return list
  }, [activeTab, statusFilter, search, sortKey, sortDir])

  const selectedAsset = selected ? ASSETS.find(a => a.id === selected) ?? null : null

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const TABS: Tab[] = ['All', 'Hardware', 'Software', 'License', 'Network', 'Mobile']

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif', background: '#F4F3EF' }}>
      {/* Sidebar */}
      <aside className="w-16 flex flex-col items-center py-6 gap-1 border-r-2 border-black bg-black shrink-0">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-1">
          <div className="w-8 h-8 bg-[#FF3B00] flex items-center justify-center">
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 14, color: '#fff' }}>IT</span>
          </div>
        </div>
        {NAV_ITEMS.map(item => (
          <button
            key={item.label}
            title={item.label}
            className={`w-10 h-10 flex items-center justify-center transition-colors ${item.active ? 'bg-[#FF3B00] text-white' : 'text-gray-500 hover:text-white hover:bg-zinc-800'}`}
            style={{ fontSize: 16 }}
          >
            {item.icon}
          </button>
        ))}
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-6 border-b-2 border-black bg-white shrink-0">
          <div className="flex items-center gap-3">
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em' }}>
              ASSET_INVENTORY
            </h1>
            <span className="text-gray-400" style={{ fontSize: 12 }}>/</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#6B6B6B' }}>
              {filtered.length} records
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search assets, serials, people…"
                className="h-8 pl-3 pr-8 border-2 border-black bg-[#F4F3EF] outline-none focus:bg-white text-sm w-64 transition-colors"
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 12 }}>⌕</span>
            </div>
            <button className="h-8 px-4 bg-[#FF3B00] text-white border-2 border-black text-xs font-semibold hover:bg-black transition-colors" style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em' }}>
              + ADD ASSET
            </button>
            <div className="flex items-center gap-2 border-l-2 border-black pl-3">
              <div className="text-right">
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600 }}>{adminName}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#FF3B00', letterSpacing: '0.08em' }}>{adminRole}</div>
              </div>
              <button
                onClick={onLogout}
                title="Sign out"
                className="w-8 h-8 flex items-center justify-center border-2 border-black hover:bg-[#FF3B00] hover:text-white hover:border-[#FF3B00] transition-colors text-sm"
              >
                ⏻
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Content */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            {/* Stats row */}
            <div className="grid grid-cols-4 border-b-2 border-black shrink-0">
              {[
                { label: 'TOTAL ASSETS', value: stats.total, sub: 'across all categories' },
                { label: 'ACTIVE', value: stats.active, sub: `${stats.available} available`, accent: '#00A86B' },
                { label: 'IN MAINTENANCE', value: stats.maintenance, sub: 'requires attention', accent: '#F5A623' },
                { label: 'TOTAL VALUE', value: `P${stats.totalCost.toLocaleString()}`, sub: 'replacement cost', accent: '#FF3B00' },
              ].map((stat, i) => (
                <div key={stat.label} className={`p-5 bg-white ${i < 3 ? 'border-r-2 border-black' : ''}`}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.1em', color: '#6B6B6B' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 28, fontWeight: 700, color: stat.accent ?? '#0A0A0A', lineHeight: 1.1, marginTop: 4 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B6B6B', marginTop: 2 }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Tabs + Filter bar */}
            <div className="flex items-center justify-between border-b-2 border-black bg-white px-6 shrink-0">
              <div className="flex">
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`h-10 px-4 border-r border-gray-200 flex items-center gap-1.5 text-xs font-medium transition-colors ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-[#F4F3EF] text-gray-600'}`}
                    style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em', fontSize: 11 }}
                  >
                    <span>{CATEGORY_ICONS[tab]}</span>
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#6B6B6B', letterSpacing: '0.08em' }}>STATUS:</span>
                {(['All', 'Active', 'Available', 'Maintenance', 'Retired'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`h-6 px-2.5 text-xs border transition-colors ${statusFilter === s ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-600 hover:border-black'}`}
                    style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.04em' }}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#0A0A0A] text-white">
                    {([
                      { key: 'id', label: 'ASSET ID', w: '100px' },
                      { key: 'name', label: 'NAME', w: 'auto' },
                      { key: 'category', label: 'CATEGORY', w: '110px' },
                      { key: null, label: 'ASSIGNED TO', w: '160px' },
                      { key: 'status', label: 'STATUS', w: '120px' },
                      { key: null, label: 'LOCATION', w: '180px' },
                      { key: 'cost', label: 'VALUE', w: '90px' },
                      { key: 'lastUpdated', label: 'UPDATED', w: '110px' },
                    ] as { key: SortKey | null; label: string; w: string }[]).map(col => (
                      <th
                        key={col.label}
                        onClick={() => col.key && toggleSort(col.key)}
                        style={{ width: col.w, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.1em', padding: '10px 14px', textAlign: 'left', cursor: col.key ? 'pointer' : 'default', fontWeight: 500, whiteSpace: 'nowrap' }}
                        className={col.key ? 'hover:bg-zinc-800 select-none' : ''}
                      >
                        {col.label}
                        {col.key && sortKey === col.key && (
                          <span className="ml-1 text-[#FF3B00]">{sortDir === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((asset, i) => {
                    const st = STATUS_STYLES[asset.status]
                    const isSelected = selected === asset.id
                    return (
                      <tr
                        key={asset.id}
                        onClick={() => setSelected(isSelected ? null : asset.id)}
                        className={`border-b border-gray-200 cursor-pointer transition-colors ${isSelected ? 'bg-[#FFF0EC]' : i % 2 === 0 ? 'bg-white hover:bg-[#F4F3EF]' : 'bg-[#FAFAF8] hover:bg-[#F4F3EF]'}`}
                      >
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, color: isSelected ? '#FF3B00' : '#0A0A0A' }}>
                            {asset.id}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{asset.name}</span>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#999', marginTop: 1 }}>{asset.serial}</div>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#6B6B6B' }}>
                            {CATEGORY_ICONS[asset.category]} {asset.category}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          {asset.assignedTo ? (
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 500 }}>{asset.assignedTo}</div>
                              <div style={{ fontSize: 11, color: '#999' }}>{asset.department}</div>
                            </div>
                          ) : (
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#C0C0C0' }}>UNASSIGNED</span>
                          )}
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 ${st.bg} ${st.text}`} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.05em', fontWeight: 600 }}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                            {asset.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', fontSize: 12, color: '#6B6B6B' }}>{asset.location}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600 }}>
                            P{asset.cost.toLocaleString()}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#999' }}>
                            {asset.lastUpdated}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ padding: '48px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#999' }}>
                        NO_RECORDS_FOUND — adjust filters or search query
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail Panel */}
          {selectedAsset && (
            <aside className="w-72 border-l-2 border-black bg-white overflow-y-auto shrink-0 flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b-2 border-black bg-black text-white">
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.1em' }}>ASSET_DETAIL</span>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-lg leading-none">×</button>
              </div>

              <div className="p-5 flex flex-col gap-5">
                {/* ID + status */}
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#999', letterSpacing: '0.1em' }}>ASSET ID</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 700, color: '#FF3B00', marginTop: 2 }}>{selectedAsset.id}</div>
                </div>

                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#999', letterSpacing: '0.1em', marginBottom: 4 }}>NAME</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedAsset.name}</div>
                </div>

                <div className="flex gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${STATUS_STYLES[selectedAsset.status].bg} ${STATUS_STYLES[selectedAsset.status].text}`} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_STYLES[selectedAsset.status].dot}`} />
                    {selectedAsset.status.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, background: '#F4F3EF', padding: '2px 8px', color: '#6B6B6B' }}>
                    {CATEGORY_ICONS[selectedAsset.category]} {selectedAsset.category}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-5 grid grid-cols-1 gap-4">
                  {[
                    { label: 'SERIAL', value: selectedAsset.serial, mono: true },
                    { label: 'VENDOR', value: selectedAsset.vendor, mono: false },
                    { label: 'VALUE', value: `P${selectedAsset.cost.toLocaleString()}`, mono: true },
                    { label: 'PURCHASED', value: selectedAsset.purchaseDate, mono: true },
                    { label: 'LAST UPDATED', value: selectedAsset.lastUpdated, mono: true },
                    { label: 'LOCATION', value: selectedAsset.location, mono: false },
                  ].map(f => (
                    <div key={f.label}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#999', letterSpacing: '0.1em', marginBottom: 2 }}>{f.label}</div>
                      <div style={{ fontFamily: f.mono ? 'JetBrains Mono, monospace' : 'Outfit, sans-serif', fontSize: f.mono ? 11 : 12, fontWeight: f.mono ? 500 : 400, color: '#0A0A0A' }}>{f.value}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-5">
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#999', letterSpacing: '0.1em', marginBottom: 6 }}>ASSIGNMENT</div>
                  {selectedAsset.assignedTo ? (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedAsset.assignedTo}</div>
                      <div style={{ fontSize: 11, color: '#6B6B6B' }}>{selectedAsset.department}</div>
                    </div>
                  ) : (
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#C0C0C0' }}>UNASSIGNED</div>
                  )}
                </div>

                <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-gray-200">
                  <button className="w-full h-9 bg-black text-white text-xs font-semibold hover:bg-[#FF3B00] transition-colors" style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>
                    EDIT ASSET
                  </button>
                  <button className="w-full h-9 border-2 border-black text-xs font-semibold hover:bg-[#F4F3EF] transition-colors" style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>
                    ASSIGN / REASSIGN
                  </button>
                  <button className="w-full h-9 border border-gray-300 text-xs text-gray-500 hover:border-black hover:text-black transition-colors" style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>
                    FLAG FOR MAINTENANCE
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState<{ name: string; role: string } | null>(null)

  if (!session) {
    return <LoginScreen onLogin={(name, role) => setSession({ name, role })} />
  }

  return <Dashboard adminName={session.name} adminRole={session.role} onLogout={() => setSession(null)} />
}
