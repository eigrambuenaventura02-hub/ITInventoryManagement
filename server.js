import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000
const scrypt = promisify(scryptCallback)
const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:5173,http://localhost:8443')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'it_inventory',
  waitForConnections: true,
  connectionLimit: 10,
  ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false
}

const pool = mysql.createPool(dbConfig)

function dateOnly(value) {
  return String(value).slice(0, 10)
}

const createTableSql = `
  CREATE TABLE IF NOT EXISTS assets (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    assignedTo VARCHAR(255),
    department VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    serial VARCHAR(255) NOT NULL,
    purchaseDate DATE NOT NULL,
    lastUpdated DATE NOT NULL,
    cost DECIMAL(12,2) NOT NULL,
    vendor VARCHAR(255) NOT NULL
  )
`

const createMetricsTableSql = `
  CREATE TABLE IF NOT EXISTS system_metrics (
    metric_key VARCHAR(50) PRIMARY KEY,
    metric_value VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`

const createUsersTableSql = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash CHAR(128) NOT NULL,
    password_salt CHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`

const createSessionsTableSql = `
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash CHAR(64) PRIMARY KEY,
    user_id INT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`

const seedAssets = [
  ['HW-0041', 'MacBook Pro 16in M3', 'Hardware', 'Sarah Chen', 'Engineering', 'Active', 'NYC HQ — Floor 4', 'C02ZN4XZMD6T', '2024-02-14', '2026-07-28', 3499, 'Apple Inc.'],
  ['HW-0042', 'Dell UltraSharp 27in 4K', 'Hardware', 'Sarah Chen', 'Engineering', 'Active', 'NYC HQ — Floor 4', 'DL7X92KQ3814', '2024-02-14', '2026-07-28', 899, 'Dell Technologies'],
  ['HW-0043', 'ThinkPad X1 Carbon', 'Hardware', 'Marcus Webb', 'Sales', 'Active', 'Remote — Chicago', 'PC3KN7ZL0092', '2023-11-30', '2026-07-15', 2199, 'Lenovo'],
  ['HW-0044', 'HP EliteDesk 800 G6', 'Hardware', null, null, 'Available', 'NYC HQ — Storage', 'HP9QK2MZ7731', '2023-06-01', '2026-05-20', 1450, 'HP Inc.'],
  ['HW-0045', 'MacBook Air 13in M2', 'Hardware', 'Priya Nair', 'Design', 'Active', 'NYC HQ — Floor 3', 'C02ZP1ABMD6T', '2024-05-10', '2026-07-30', 1299, 'Apple Inc.'],
  ['HW-0046', 'Cisco Catalyst 9200', 'Network', null, 'IT', 'Active', 'NYC HQ — Server Room', 'CSC2X4NQKR81', '2022-09-15', '2026-07-01', 4800, 'Cisco Systems'],
  ['HW-0047', 'iPhone 15 Pro', 'Mobile', 'Jordan Kim', 'Executive', 'Active', 'Remote — LA', 'IP15PNZK0034', '2024-01-08', '2026-07-22', 999, 'Apple Inc.'],
  ['HW-0048', 'Synology NAS DS923+', 'Hardware', null, 'IT', 'Maintenance', 'NYC HQ — Server Room', 'SY9RL3VQ2201', '2023-04-20', '2026-08-01', 1800, 'Synology'],
  ['HW-0049', 'Logitech MX Keys S', 'Hardware', 'Tyler Brooks', 'Operations', 'Active', 'NYC HQ — Floor 2', 'LG4XN8WZ0055', '2025-01-15', '2026-06-10', 109, 'Logitech'],
  ['HW-0050', 'Dell Precision 5570', 'Hardware', null, null, 'Retired', 'NYC HQ — Storage', 'DL2Q7YN4K011', '2020-03-10', '2026-02-28', 2800, 'Dell Technologies'],
  ['SW-0011', 'Adobe Creative Cloud', 'Software', 'Priya Nair', 'Design', 'Active', '—', 'ADO-CC-7X4N-2024', '2024-11-01', '2026-07-01', 659, 'Adobe Inc.'],
  ['SW-0012', 'JetBrains All Products', 'Software', 'Sarah Chen', 'Engineering', 'Active', '—', 'JB-ALL-EN-8814', '2025-02-01', '2026-07-01', 779, 'JetBrains'],
  ['SW-0013', 'Figma Organization', 'Software', null, 'Design', 'Active', '—', 'FIG-ORG-2025-0112', '2025-01-01', '2026-07-01', 4200, 'Figma, Inc.'],
  ['LIC-0001', 'Microsoft 365 Business', 'License', null, 'All', 'Active', '—', 'MS365-ENT-2025-55STS', '2025-07-01', '2026-07-01', 16500, 'Microsoft'],
  ['LIC-0002', 'Slack Pro (75 seats)', 'License', null, 'All', 'Active', '—', 'SLK-PRO-0293-Q3', '2026-04-01', '2026-07-01', 6750, 'Salesforce / Slack'],
  ['LIC-0003', 'GitHub Enterprise', 'License', null, 'Engineering', 'Active', '—', 'GH-ENT-ORGK-0488', '2026-01-01', '2026-07-01', 9600, 'GitHub'],
  ['NET-0001', 'Ubiquiti UniFi AP U7', 'Network', null, 'IT', 'Active', 'NYC HQ — Floor 3', 'UB7X2QN4K091', '2025-03-10', '2026-06-20', 279, 'Ubiquiti'],
  ['MOB-0007', 'iPad Pro 13in M4', 'Mobile', 'Marcus Webb', 'Sales', 'Active', 'Remote — Chicago', 'IPAD13M4NZQ04', '2024-09-20', '2026-07-10', 1299, 'Apple Inc.'],
]

async function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const derivedKey = await scrypt(password, salt, 64)
  return { hash: Buffer.from(derivedKey).toString('hex'), salt }
}

async function verifyPassword(password, hash, salt) {
  const derivedKey = await scrypt(password, salt, 64)
  const expected = Buffer.from(hash, 'hex')
  const actual = Buffer.from(derivedKey)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

function tokenHash(token) {
  return createHash('sha256').update(token).digest('hex')
}

async function seedInitialUser(connection) {
  const [rows] = await connection.query('SELECT COUNT(*) AS total FROM users')
  if (Number(rows[0].total) > 0) return

  const username = process.env.INITIAL_ADMIN_USERNAME?.trim()
  const password = process.env.INITIAL_ADMIN_PASSWORD
  if (!username || !password) {
    console.warn('No users exist. Set INITIAL_ADMIN_USERNAME and INITIAL_ADMIN_PASSWORD in the backend environment.')
    return
  }

  const { hash, salt } = await hashPassword(password)
  await connection.query(
    'INSERT INTO users (username, password_hash, password_salt, name, role) VALUES (?, ?, ?, ?, ?)',
    [username, hash, salt, process.env.INITIAL_ADMIN_NAME || username, process.env.INITIAL_ADMIN_ROLE || 'SUPER_ADMIN'],
  )
}

async function ensureDatabase() {
  try {
    const connection = await pool.getConnection()
    await connection.query(createTableSql)
    await connection.query(createMetricsTableSql)
    await connection.query(createUsersTableSql)
    await connection.query(createSessionsTableSql)
    await seedInitialUser(connection)
    await connection.query(
      `INSERT INTO system_metrics (metric_key, metric_value) VALUES (?, ?), (?, ?)
       ON DUPLICATE KEY UPDATE metric_value = metric_value`,
      ['last_audit', new Date().toISOString().slice(0, 10), 'system_status', 'ONLINE'],
    )

    const [rows] = await connection.query('SELECT COUNT(*) AS total FROM assets')
    const total = Number(rows[0].total)

    if (total === 0) {
      const sql = `
        INSERT INTO assets (id, name, category, assignedTo, department, status, location, serial, purchaseDate, lastUpdated, cost, vendor)
        VALUES ?
      `
      await connection.query(sql, [seedAssets])
    }

    connection.release()
  } catch (error) {
    console.error('Database initialization failed:', error)
    process.exit(1)
  }
}

app.post('/api/auth/login', async (req, res) => {
  try {
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : ''
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' })

    const [rows] = await pool.query(
      'SELECT id, username, password_hash, password_salt, name, role FROM users WHERE username = ? AND active = TRUE LIMIT 1',
      [username],
    )
    const user = rows[0]
    const valid = user ? await verifyPassword(password, user.password_hash, user.password_salt) : false
    if (!valid) return res.status(401).json({ message: 'Invalid credentials.' })

    const token = randomBytes(32).toString('hex')
    await pool.query(
      'INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 8 HOUR))',
      [tokenHash(token), user.id],
    )
    res.json({ token, user: { name: user.name, role: user.role, username: user.username } })
  } catch (error) {
    console.error('Login failed:', error)
    res.status(500).json({ message: 'Unable to sign in.' })
  }
})

async function requireAuth(req, res, next) {
  try {
    const authorization = req.get('authorization') || ''
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : ''
    if (!token) return res.status(401).json({ message: 'Authentication required.' })

    const [rows] = await pool.query(
      `SELECT users.id, users.username, users.name, users.role
       FROM sessions JOIN users ON users.id = sessions.user_id
       WHERE sessions.token_hash = ? AND sessions.expires_at > NOW() AND users.active = TRUE`,
      [tokenHash(token)],
    )
    if (!rows[0]) return res.status(401).json({ message: 'Session expired or invalid.' })
    req.user = rows[0]
    next()
  } catch (error) {
    console.error('Authentication check failed:', error)
    res.status(500).json({ message: 'Authentication service unavailable.' })
  }
}

app.use('/api', requireAuth)

app.get('/api/assets', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM assets ORDER BY id ASC')
    res.json({ assets: rows })
  } catch (error) {
    console.error('Failed to fetch assets:', error)
    res.status(500).json({ message: 'Failed to fetch assets from database.' })
  }
})

app.get('/api/dashboard-stats', async (req, res) => {
  try {
    const [assetRows] = await pool.query(`
      SELECT
        COUNT(*) AS totalAssets,
        COUNT(DISTINCT NULLIF(TRIM(assignedTo), '')) AS activeUsers
      FROM assets
    `)
    const [metricRows] = await pool.query(
      'SELECT metric_key, metric_value FROM system_metrics WHERE metric_key IN (?, ?)',
      ['last_audit', 'system_status'],
    )
    const metrics = Object.fromEntries(metricRows.map(metric => [metric.metric_key, metric.metric_value]))
    res.json({
      totalAssets: Number(assetRows[0].totalAssets),
      activeUsers: Number(assetRows[0].activeUsers),
      lastAudit: metrics.last_audit ?? '—',
      systemStatus: metrics.system_status ?? 'ONLINE',
    })
  } catch (error) {
    console.error('Failed to fetch dashboard metrics:', error)
    res.status(500).json({ message: 'Failed to fetch dashboard metrics.' })
  }
})

app.post('/api/assets', async (req, res) => {
  try {
    const assets = Array.isArray(req.body?.assets) ? req.body.assets : []

    if (!assets.length) {
      return res.status(400).json({ message: 'No assets were provided.' })
    }

    const sql = `
      INSERT INTO assets (id, name, category, assignedTo, department, status, location, serial, purchaseDate, lastUpdated, cost, vendor)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        category = VALUES(category),
        assignedTo = VALUES(assignedTo),
        department = VALUES(department),
        status = VALUES(status),
        location = VALUES(location),
        serial = VALUES(serial),
        purchaseDate = VALUES(purchaseDate),
        lastUpdated = VALUES(lastUpdated),
        cost = VALUES(cost),
        vendor = VALUES(vendor)
    `

    const values = assets.map(asset => [
      asset.id,
      asset.name,
      asset.category,
      asset.assignedTo,
      asset.department,
      asset.status,
      asset.location,
      asset.serial,
      dateOnly(asset.purchaseDate),
      dateOnly(asset.lastUpdated),
      asset.cost,
      asset.vendor,
    ])

    await pool.query(sql, [values])
    res.json({ message: 'Assets saved successfully.' })
  } catch (error) {
    console.error('Failed to save assets:', error)
    res.status(500).json({ message: 'Failed to save assets.' })
  }
})

await ensureDatabase()

app.listen(port, () => {
  console.log(`MySQL inventory API running on http://localhost:${port}`)
})
