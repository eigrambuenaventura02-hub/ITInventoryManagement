import { useState, useMemo, useRef, useEffect } from 'react'
import { DEFAULT_ASSETS, getDashboardStats, initializeInventoryDb, saveAssets, type Asset, type Category, type DashboardStats, type Status } from './inventoryDb'

type Tab = 'All' | Category

// Demo credentials — replace with real auth in production
const ADMIN_CREDENTIALS = [
  { username: 'eigram', password: 'ddcbf38ejb', name: 'System Administrator', role: 'SUPER_ADMIN' },
  { username: 'it-admin', password: 'M@dinam3t', name: 'IT Administrator', role: 'IT_ADMIN' },
  { username: 'jm', password: 'password123', name: 'IT Support', role: 'IT_ADMIN' },
  { username: 'jeremy', password: 'password321', name: 'IT Operations', role: 'IT_ADMIN' },
  { username: 'testuser', password: 'testinglang', name: 'Test User', role: 'Tester' }
]

function LoginScreen({ onLogin }: { onLogin: (name: string, role: string) => void }) {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)
  const usernameRef = useRef<HTMLInputElement>(null)

  useEffect(() => { usernameRef.current?.focus() }, [])

  useEffect(() => {
    void getDashboardStats().then(setDashboardStats).catch(error => console.error('Failed to load dashboard metrics.', error))
  }, [])

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
        setError('Invalid credentials. Access denied. Please Contact Eigram')
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
            NMS IT Admin<br />Portal
          </h2>
          <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.7, maxWidth: 340 }}>
            Authorized personnel only. All access attempts are logged and monitored. Unauthorized access is a violation of company policy.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'TOTAL ASSETS', value: dashboardStats?.totalAssets ?? '—' },
            { label: 'ACTIVE USERS', value: dashboardStats?.activeUsers ?? '—' },
            { label: 'LAST AUDIT', value: dashboardStats?.lastAudit ?? '—' },
            { label: 'SYSTEM STATUS', value: dashboardStats?.systemStatus ?? '—' },
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
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#FF0000', lineHeight: 1.7 }}>
              Please Contact Admin for Credentials<br />
              
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

const EMPTY_ASSET: Asset = {
  id: '', name: '', category: 'Hardware', assignedTo: null, department: null,
  status: 'Available', location: '', serial: '',
  purchaseDate: new Date().toISOString().slice(0, 10),
  lastUpdated: new Date().toISOString().slice(0, 10), cost: 0, vendor: '',
}

function AddAssetModal({ initialAsset = EMPTY_ASSET, isEditing = false, onClose, onSave }: { initialAsset?: Asset; isEditing?: boolean; onClose: () => void; onSave: (asset: Asset) => Promise<void> }) {
  const [form, setForm] = useState<Asset>(initialAsset)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function updateField<K extends keyof Asset>(field: K, value: Asset[K]) {
    setForm(current => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSave({
        ...form,
        id: form.id.trim(), name: form.name.trim(), location: form.location.trim(),
        serial: form.serial.trim(), vendor: form.vendor.trim(),
        assignedTo: form.assignedTo?.trim() || null, department: form.department?.trim() || null,
      })
      onClose()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this asset.')
    } finally {
      setSaving(false)
    }
  }

  const textFields: { field: keyof Asset; label: string; required?: boolean }[] = [
    { field: 'id', label: 'ASSET ID', required: true }, { field: 'name', label: 'NAME', required: true },
    { field: 'assignedTo', label: 'ASSIGNED TO' }, { field: 'department', label: 'DEPARTMENT' },
    { field: 'location', label: 'LOCATION', required: true }, { field: 'serial', label: 'SERIAL', required: true },
    { field: 'vendor', label: 'VENDOR', required: true },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onMouseDown={onClose}>
      <form onSubmit={handleSubmit} onMouseDown={event => event.stopPropagation()} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-black bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between border-b-2 border-black pb-4">
          <div><div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#FF3B00', letterSpacing: '0.1em' }}>INVENTORY_DATABASE</div><h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700, marginTop: 4 }}>{isEditing ? 'EDIT ASSET' : 'ADD ASSET'}</h2></div>
          <button type="button" onClick={onClose} className="text-2xl leading-none text-gray-500 hover:text-black" aria-label="Close">×</button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {textFields.map(({ field, label, required }) => (
            <label key={field} className="flex flex-col gap-1">
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#666', letterSpacing: '0.08em' }}>{label}{required ? ' *' : ''}</span>
              <input required={required} disabled={isEditing && field === 'id'} value={String(form[field] ?? '')} onChange={event => updateField(field, event.target.value as Asset[typeof field])} className="h-10 border-2 border-gray-300 px-3 text-sm outline-none focus:border-[#FF3B00] disabled:bg-gray-100 disabled:text-gray-500" />
            </label>
          ))}
          <label className="flex flex-col gap-1"><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#666' }}>CATEGORY *</span><select required value={form.category} onChange={event => updateField('category', event.target.value as Category)} className="h-10 border-2 border-gray-300 px-3 text-sm outline-none focus:border-[#FF3B00]">{(['Hardware', 'Software', 'License', 'Network', 'Mobile'] as Category[]).map(category => <option key={category}>{category}</option>)}</select></label>
          <label className="flex flex-col gap-1"><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#666' }}>STATUS *</span><select required value={form.status} onChange={event => updateField('status', event.target.value as Status)} className="h-10 border-2 border-gray-300 px-3 text-sm outline-none focus:border-[#FF3B00]">{(['Active', 'Maintenance', 'Available', 'Retired'] as Status[]).map(status => <option key={status}>{status}</option>)}</select></label>
          <label className="flex flex-col gap-1"><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#666' }}>PURCHASE DATE *</span><input required type="date" value={form.purchaseDate} onChange={event => updateField('purchaseDate', event.target.value)} className="h-10 border-2 border-gray-300 px-3 text-sm outline-none focus:border-[#FF3B00]" /></label>
          <label className="flex flex-col gap-1"><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#666' }}>LAST UPDATED *</span><input required type="date" value={form.lastUpdated} onChange={event => updateField('lastUpdated', event.target.value)} className="h-10 border-2 border-gray-300 px-3 text-sm outline-none focus:border-[#FF3B00]" /></label>
          <label className="flex flex-col gap-1"><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#666' }}>COST *</span><input required min="0" step="0.01" type="number" value={form.cost} onChange={event => updateField('cost', Number(event.target.value))} className="h-10 border-2 border-gray-300 px-3 text-sm outline-none focus:border-[#FF3B00]" /></label>
        </div>
        {error && <div className="mt-4 border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4"><button type="button" onClick={onClose} className="h-10 border-2 border-black px-4 text-xs font-semibold hover:bg-gray-100" style={{ fontFamily: 'JetBrains Mono, monospace' }}>CANCEL</button><button type="submit" disabled={saving} className="h-10 bg-[#FF3B00] px-5 text-xs font-semibold text-white hover:bg-black disabled:opacity-50" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{saving ? 'SAVING...' : isEditing ? 'UPDATE ASSET' : 'SAVE ASSET'}</button></div>
      </form>
    </div>
  )
}

function AssignmentModal({ asset, onClose, onSave }: { asset: Asset; onClose: () => void; onSave: (asset: Asset) => Promise<void> }) {
  const [assignedTo, setAssignedTo] = useState(asset.assignedTo ?? '')
  const [department, setDepartment] = useState(asset.department ?? '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      await onSave({
        ...asset,
        assignedTo: assignedTo.trim() || null,
        department: department.trim() || null,
        lastUpdated: new Date().toISOString().slice(0, 10),
      })
      onClose()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save the assignment.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onMouseDown={onClose}>
      <form onSubmit={handleSubmit} onMouseDown={event => event.stopPropagation()} className="w-full max-w-md border-2 border-black bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between border-b-2 border-black pb-4">
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#FF3B00', letterSpacing: '0.1em' }}>ASSET_ASSIGNMENT</div>
            <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700, marginTop: 4 }}>ASSIGN / REASSIGN</h2>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#777', marginTop: 5 }}>{asset.id} / {asset.name}</div>
          </div>
          <button type="button" onClick={onClose} className="text-2xl leading-none text-gray-500 hover:text-black" aria-label="Close">×</button>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#666', letterSpacing: '0.08em' }}>ASSIGNED TO</span>
            <input value={assignedTo} onChange={event => setAssignedTo(event.target.value)} placeholder="Leave blank to unassign" className="h-10 border-2 border-gray-300 px-3 text-sm outline-none focus:border-[#FF3B00]" autoFocus />
          </label>
          <label className="flex flex-col gap-1">
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#666', letterSpacing: '0.08em' }}>DEPARTMENT</span>
            <input value={department} onChange={event => setDepartment(event.target.value)} placeholder="Department" className="h-10 border-2 border-gray-300 px-3 text-sm outline-none focus:border-[#FF3B00]" />
          </label>
        </div>

        {error && <div className="mt-4 border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
          <button type="button" onClick={onClose} className="h-10 border-2 border-black px-4 text-xs font-semibold hover:bg-gray-100" style={{ fontFamily: 'JetBrains Mono, monospace' }}>CANCEL</button>
          <button type="submit" disabled={saving} className="h-10 bg-[#FF3B00] px-5 text-xs font-semibold text-white hover:bg-black disabled:opacity-50" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{saving ? 'SAVING...' : 'SAVE ASSIGNMENT'}</button>
        </div>
      </form>
    </div>
  )
}

function AssetStatusModal({ asset, onClose, onSave }: { asset: Asset; onClose: () => void; onSave: (asset: Asset) => Promise<void> }) {
  const [status, setStatus] = useState<Status>(asset.status)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      await onSave({
        ...asset,
        status,
        lastUpdated: new Date().toISOString().slice(0, 10),
      })
      onClose()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not update the asset status.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onMouseDown={onClose}>
      <form onSubmit={handleSubmit} onMouseDown={event => event.stopPropagation()} className="w-full max-w-md border-2 border-black bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between border-b-2 border-black pb-4">
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#FF3B00', letterSpacing: '0.1em' }}>ASSET_STATUS</div>
            <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700, marginTop: 4 }}>UPDATE STATUS</h2>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#777', marginTop: 5 }}>{asset.id} / {asset.name}</div>
          </div>
          <button type="button" onClick={onClose} className="text-2xl leading-none text-gray-500 hover:text-black" aria-label="Close">×</button>
        </div>

        <label className="flex flex-col gap-1">
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#666', letterSpacing: '0.08em' }}>STATUS</span>
          <select value={status} onChange={event => setStatus(event.target.value as Status)} className="h-10 border-2 border-gray-300 px-3 text-sm outline-none focus:border-[#FF3B00]">
            {(['Available', 'Active', 'Maintenance'] as Status[]).map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>

        {error && <div className="mt-4 border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
          <button type="button" onClick={onClose} className="h-10 border-2 border-black px-4 text-xs font-semibold hover:bg-gray-100" style={{ fontFamily: 'JetBrains Mono, monospace' }}>CANCEL</button>
          <button type="submit" disabled={saving} className="h-10 bg-[#FF3B00] px-5 text-xs font-semibold text-white hover:bg-black disabled:opacity-50" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{saving ? 'SAVING...' : 'SAVE STATUS'}</button>
        </div>
      </form>
    </div>
  )
}

function Dashboard({ adminName, adminRole, onLogout }: { adminName: string; adminRole: string; onLogout: () => void }) {
  const [assets, setAssets] = useState<Asset[]>(DEFAULT_ASSETS)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [showAddAsset, setShowAddAsset] = useState(false)
  const [showEditAsset, setShowEditAsset] = useState(false)
  const [showAssignment, setShowAssignment] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('All')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All')
  const [sortKey, setSortKey] = useState<SortKey>('id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadAssets() {
      try {
        const stored = await initializeInventoryDb()
        if (active) {
          setAssets(stored)
        }
      } catch (error) {
        console.error('Failed to load inventory assets from IndexedDB.', error)
      }
    }

    void loadAssets()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    void getDashboardStats().then(setDashboardStats).catch(error => console.error('Failed to load dashboard metrics.', error))
  }, [assets])

  const stats = useMemo(() => {
    const total = assets.length
    const active = assets.filter(a => a.status === 'Active').length
    const maintenance = assets.filter(a => a.status === 'Maintenance').length
    const available = assets.filter(a => a.status === 'Available').length
    const totalCost = assets.reduce((sum, asset) => sum + Number(asset.cost), 0)
    return { total, active, maintenance, available, totalCost }
  }, [assets])

  const filtered = useMemo(() => {
    let list = assets
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
  }, [assets, activeTab, statusFilter, search, sortKey, sortDir])

  const selectedAsset = selected ? assets.find(a => a.id === selected) ?? null : null

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
            <button onClick={() => setShowAddAsset(true)}
              className="h-8 px-4 bg-[#FF3B00] text-white border-2 border-black text-xs font-semibold hover:bg-black transition-colors" style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em' }}
            >
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
                { label: 'TOTAL ASSETS', value: dashboardStats?.totalAssets ?? stats.total, sub: 'across all categories' },
                { label: 'ACTIVE', value: stats.active, sub: `${stats.available} available`, accent: '#00A86B' },
                { label: 'IN MAINTENANCE', value: stats.maintenance, sub: 'requires attention', accent: '#F5A623' },
                { label: 'TOTAL VALUE', value: `₱${stats.totalCost.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: 'replacement cost', accent: '#FF3B00' },
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
                            ₱{Number(asset.cost).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                    { label: 'VALUE', value: `₱${Number(selectedAsset.cost).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, mono: true },
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
                  <button onClick={() => setShowEditAsset(true)} className="w-full h-9 bg-black text-white text-xs font-semibold hover:bg-[#FF3B00] transition-colors" style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>
                    EDIT ASSET
                  </button>
                  <button onClick={() => setShowAssignment(true)} className="w-full h-9 border-2 border-black text-xs font-semibold hover:bg-[#F4F3EF] transition-colors" style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>
                    ASSIGN / REASSIGN
                  </button>
                  <button onClick={() => setShowStatusModal(true)} className="w-full h-9 border border-gray-300 text-xs text-gray-500 hover:border-black hover:text-black transition-colors" style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>
                    FLAG FOR MAINTENANCE
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
      {showAddAsset && (
        <AddAssetModal
          onClose={() => setShowAddAsset(false)}
          onSave={async asset => {
            if (assets.some(existing => existing.id.toLowerCase() === asset.id.toLowerCase())) {
              throw new Error('Asset ID already exists. Please use a unique ID.')
            }
            await saveAssets([asset])
            setAssets(current => [...current, asset])
          }}
        />
      )}
      {showEditAsset && selectedAsset && (
        <AddAssetModal
          initialAsset={selectedAsset}
          isEditing
          onClose={() => setShowEditAsset(false)}
          onSave={async asset => {
            await saveAssets([asset])
            setAssets(current => current.map(existing => existing.id === asset.id ? asset : existing))
          }}
        />
      )}
      {showAssignment && selectedAsset && (
        <AssignmentModal
          asset={selectedAsset}
          onClose={() => setShowAssignment(false)}
          onSave={async asset => {
            await saveAssets([asset])
            setAssets(current => current.map(existing => existing.id === asset.id ? asset : existing))
          }}
        />
      )}
      {showStatusModal && selectedAsset && (
        <AssetStatusModal
          asset={selectedAsset}
          onClose={() => setShowStatusModal(false)}
          onSave={async asset => {
            await saveAssets([asset])
            setAssets(current => current.map(existing => existing.id === asset.id ? asset : existing))
          }}
        />
      )}
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
