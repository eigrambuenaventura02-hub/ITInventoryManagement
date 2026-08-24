export type Category = 'Hardware' | 'Software' | 'License' | 'Network' | 'Mobile'
export type Status = 'Active' | 'Maintenance' | 'Available' | 'Decommissioned'

export interface Asset {
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

export interface DashboardStats {
  totalAssets: number
  activeUsers: number
  lastAudit: string
  systemStatus: string
}

export const DEFAULT_ASSETS: Asset[] = [
  { id: 'HW-0041', name: 'MacBook Pro 16in M3', category: 'Hardware', assignedTo: 'Sarah Chen', department: 'Engineering', status: 'Active', location: 'NYC HQ — Floor 4', serial: 'C02ZN4XZMD6T', purchaseDate: '2024-02-14', lastUpdated: '2026-07-28', cost: 3499, vendor: 'Apple Inc.' },
  { id: 'HW-0042', name: 'Dell UltraSharp 27in 4K', category: 'Hardware', assignedTo: 'Sarah Chen', department: 'Engineering', status: 'Active', location: 'NYC HQ — Floor 4', serial: 'DL7X92KQ3814', purchaseDate: '2024-02-14', lastUpdated: '2026-07-28', cost: 899, vendor: 'Dell Technologies' },
  { id: 'HW-0043', name: 'ThinkPad X1 Carbon', category: 'Hardware', assignedTo: 'Marcus Webb', department: 'Sales', status: 'Active', location: 'Remote — Chicago', serial: 'PC3KN7ZL0092', purchaseDate: '2023-11-30', lastUpdated: '2026-07-15', cost: 2199, vendor: 'Lenovo' },
  { id: 'HW-0044', name: 'HP EliteDesk 800 G6', category: 'Hardware', assignedTo: null, department: null, status: 'Available', location: 'NYC HQ — Storage', serial: 'HP9QK2MZ7731', purchaseDate: '2023-06-01', lastUpdated: '2026-05-20', cost: 1450, vendor: 'HP Inc.' },
  { id: 'HW-0045', name: 'MacBook Air 13in M2', category: 'Hardware', assignedTo: 'Priya Nair', department: 'Design', status: 'Active', location: 'NYC HQ — Floor 3', serial: 'C02ZP1ABMD6T', purchaseDate: '2024-05-10', lastUpdated: '2026-07-30', cost: 1299, vendor: 'Apple Inc.' },
  { id: 'HW-0046', name: 'Cisco Catalyst 9200', category: 'Network', assignedTo: null, department: 'IT', status: 'Active', location: 'NYC HQ — Server Room', serial: 'CSC2X4NQKR81', purchaseDate: '2022-09-15', lastUpdated: '2026-07-01', cost: 4800, vendor: 'Cisco Systems' },
  { id: 'HW-0047', name: 'iPhone 15 Pro', category: 'Mobile', assignedTo: 'Jordan Kim', department: 'Executive', status: 'Active', location: 'Remote — LA', serial: 'IP15PNZK0034', purchaseDate: '2024-01-08', lastUpdated: '2026-07-22', cost: 999, vendor: 'Apple Inc.' },
  { id: 'HW-0048', name: 'Synology NAS DS923+', category: 'Hardware', assignedTo: null, department: 'IT', status: 'Maintenance', location: 'NYC HQ — Server Room', serial: 'SY9RL3VQ2201', purchaseDate: '2023-04-20', lastUpdated: '2026-08-01', cost: 1800, vendor: 'Synology' },
  { id: 'HW-0049', name: 'Logitech MX Keys S', category: 'Hardware', assignedTo: 'Tyler Brooks', department: 'Operations', status: 'Active', location: 'NYC HQ — Floor 2', serial: 'LG4XN8WZ0055', purchaseDate: '2025-01-15', lastUpdated: '2026-06-10', cost: 109, vendor: 'Logitech' },
  { id: 'HW-0050', name: 'Dell Precision 5570', category: 'Hardware', assignedTo: null, department: null, status: 'Decommissioned', location: 'NYC HQ — Storage', serial: 'DL2Q7YN4K011', purchaseDate: '2020-03-10', lastUpdated: '2026-02-28', cost: 2800, vendor: 'Dell Technologies' },
  { id: 'SW-0011', name: 'Adobe Creative Cloud', category: 'Software', assignedTo: 'Priya Nair', department: 'Design', status: 'Active', location: '—', serial: 'ADO-CC-7X4N-2024', purchaseDate: '2024-11-01', lastUpdated: '2026-07-01', cost: 659, vendor: 'Adobe Inc.' },
  { id: 'SW-0012', name: 'JetBrains All Products', category: 'Software', assignedTo: 'Sarah Chen', department: 'Engineering', status: 'Active', location: '—', serial: 'JB-ALL-EN-8814', purchaseDate: '2025-02-01', lastUpdated: '2026-07-01', cost: 779, vendor: 'JetBrains' },
  { id: 'SW-0013', name: 'Figma Organization', category: 'Software', assignedTo: null, department: 'Design', status: 'Active', location: '—', serial: 'FIG-ORG-2025-0112', purchaseDate: '2025-01-01', lastUpdated: '2026-07-01', cost: 4200, vendor: 'Figma, Inc.' },
  { id: 'LIC-0001', name: 'Microsoft 365 Business', category: 'License', assignedTo: null, department: 'All', status: 'Active', location: '—', serial: 'MS365-ENT-2025-55STS', purchaseDate: '2025-07-01', lastUpdated: '2026-07-01', cost: 16500, vendor: 'Microsoft' },
  { id: 'LIC-0002', name: 'Slack Pro (75 seats)', category: 'License', assignedTo: null, department: 'All', status: 'Active', location: '—', serial: 'SLK-PRO-0293-Q3', purchaseDate: '2026-04-01', lastUpdated: '2026-07-01', cost: 6750, vendor: 'Salesforce / Slack' },
  { id: 'LIC-0003', name: 'GitHub Enterprise', category: 'License', assignedTo: null, department: 'Engineering', status: 'Active', location: '—', serial: 'GH-ENT-ORGK-0488', purchaseDate: '2026-01-01', lastUpdated: '2026-07-01', cost: 9600, vendor: 'GitHub' },
  { id: 'NET-0001', name: 'Ubiquiti UniFi AP U7', category: 'Network', assignedTo: null, department: 'IT', status: 'Active', location: 'NYC HQ — Floor 3', serial: 'UB7X2QN4K091', purchaseDate: '2025-03-10', lastUpdated: '2026-06-20', cost: 279, vendor: 'Ubiquiti' },
  { id: 'MOB-0007', name: 'iPad Pro 13in M4', category: 'Mobile', assignedTo: 'Marcus Webb', department: 'Sales', status: 'Active', location: 'Remote — Chicago', serial: 'IPAD13M4NZQ04', purchaseDate: '2024-09-20', lastUpdated: '2026-07-10', cost: 1299, vendor: 'Apple Inc.' },
]

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'https://itinventorymanagement-backend.onrender.com')

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('inventory_account_token')
  const response = await fetch(url.startsWith('http') ? url : `${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  })

  const text = await response.text()
  const payload = text ? (JSON.parse(text) as T) : (null as T)

  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem('inventory_account_token')
    const message = payload && typeof payload === 'object' && 'message' in payload
      ? String((payload as { message?: string }).message)
      : 'Request to the inventory API failed.'
    throw new Error(message)
  }

  return payload
}

export async function login(username: string, password: string): Promise<{ name: string; role: string }> {
  const payload = await apiRequest<{ token: string; user: { name: string; role: string } }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  localStorage.setItem('inventory_account_token', payload.token)
  return payload.user
}

export function logout(): void {
  localStorage.removeItem('inventory_account_token')
}

export async function initializeInventoryDb(): Promise<Asset[]> {
  return getAllAssets()
}

export async function getAllAssets(): Promise<Asset[]> {
  const payload = await apiRequest<{ assets?: Asset[]; message?: string }>('/api/assets')
  return (payload.assets ?? []).map(asset => ({
    ...asset,
    status: (asset.status as string) === 'Retired' ? 'Decommissioned' : asset.status,
  }))
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>('/api/dashboard-stats')
}

export async function getPublicDashboardStats(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>('/api/public-dashboard-stats')
}

export async function saveAssets(assets: Asset[]): Promise<void> {
  await apiRequest('/api/assets', {
    method: 'POST',
    body: JSON.stringify({ assets }),
  })
}
