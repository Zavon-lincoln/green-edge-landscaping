/* ── Leads ─────────────────────────────────────────────────────────────── */
const LEADS_KEY = 'greenedge_leads'

export function getLeads() {
  try { return JSON.parse(localStorage.getItem(LEADS_KEY) || '[]') }
  catch { return [] }
}

export function saveLead(lead) {
  const leads = getLeads()
  const newLead = { ...lead, id: Date.now().toString(), submittedAt: new Date().toISOString(), status: 'New' }
  leads.unshift(newLead)
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
  return newLead
}

export function updateLeadStatus(id, status) {
  const leads = getLeads()
  const updated = leads.map(l => l.id === id ? { ...l, status } : l)
  localStorage.setItem(LEADS_KEY, JSON.stringify(updated))
  return updated
}

export function deleteLead(id) {
  const updated = getLeads().filter(l => l.id !== id)
  localStorage.setItem(LEADS_KEY, JSON.stringify(updated))
  return updated
}

/* ── Settings ──────────────────────────────────────────────────────────── */
const SETTINGS_KEY = 'greenedge_settings'

const DEFAULT_SETTINGS = {
  blocked_weekdays: [0],   // 0 = Sunday
  blocked_dates:    [],
  time_slots: [
    '7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM',
    '12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM',
  ],
}

export function getSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
    return { ...DEFAULT_SETTINGS, ...stored }
  } catch { return DEFAULT_SETTINGS }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  return settings
}

/* ── Seed demo data ────────────────────────────────────────────────────── */
export function seedDemoData() {
  // Build dates relative to today so they land in the current month's calendar
  const now   = new Date()
  const y     = now.getFullYear()
  const m     = String(now.getMonth() + 1).padStart(2, '0')
  const d     = (offset) => {
    const dt = new Date(now)
    dt.setDate(dt.getDate() + offset)
    return dt.toISOString().split('T')[0]
  }

  const leads = [
    {
      name: 'David Carter', phone: '(702) 555-0142', email: 'david.c@gmail.com',
      service: 'Lawn Maintenance', preferredDate: d(-6), preferredTime: '9:00 AM',
      notes: 'Weekly mowing — front yard and backyard, needs edging too', status: 'Completed',
    },
    {
      name: 'Lisa Martinez', phone: '(702) 555-3891', email: 'l.martinez@outlook.com',
      service: 'Irrigation Systems', preferredDate: d(-4), preferredTime: '10:00 AM',
      notes: 'Drip system not turning on, may need new controller', status: 'Completed',
    },
    {
      name: 'Carlos Rodriguez', phone: '(702) 555-7204', email: 'c.rodriguez@email.com',
      service: 'Tree Service', preferredDate: d(-2), preferredTime: '8:00 AM',
      notes: 'Large palm tree trimming, two trees in backyard', status: 'Contacted',
    },
    {
      name: 'Sarah Johnson', phone: '(702) 555-4417', email: 'sarah.j@gmail.com',
      service: 'Landscape Design', preferredDate: d(1), preferredTime: '11:00 AM',
      notes: 'Full front yard desert-scape redesign, budget ~$4k', status: 'Booked',
    },
    {
      name: 'Mike Thompson', phone: '(702) 555-8830', email: 'm.thompson@yahoo.com',
      service: 'Weed Control', preferredDate: d(2), preferredTime: '9:00 AM',
      notes: 'Rock yard completely overtaken, needs full spray treatment', status: 'Booked',
    },
    {
      name: 'Jennifer Walsh', phone: '(702) 555-2295', email: 'jen.walsh@gmail.com',
      service: 'Sod Installation', preferredDate: d(4), preferredTime: '7:00 AM',
      notes: 'Install approx 800 sqft of fescue in backyard', status: 'New',
    },
    {
      name: 'Robert Kim', phone: '(702) 555-6603', email: 'robert.k@icloud.com',
      service: 'Lawn Maintenance', preferredDate: d(5), preferredTime: '8:00 AM',
      notes: 'Bi-weekly service, gate code 4491', status: 'New',
    },
    {
      name: 'Amanda Foster', phone: '(702) 555-1187', email: 'a.foster@gmail.com',
      service: 'Seasonal Cleanup', preferredDate: d(7), preferredTime: '10:00 AM',
      notes: 'Spring cleanup — debris removal and fresh mulch', status: 'New',
    },
    {
      name: 'Tom Bradley', phone: '(702) 555-9924', email: 'tom.b@outlook.com',
      service: 'Irrigation Systems', preferredDate: d(-1), preferredTime: '3:00 PM',
      notes: 'Annual spring startup and head inspection', status: 'Cancelled',
    },
    {
      name: 'Nicole Chen', phone: '(702) 555-5512', email: 'n.chen@gmail.com',
      service: 'Landscape Design', preferredDate: d(9), preferredTime: '1:00 PM',
      notes: 'Consultation for pool-surround redesign, Henderson property', status: 'New',
    },
  ]

  const seeded = leads.map((l, i) => ({
    ...l,
    id: `seed_${Date.now()}_${i}`,
    submittedAt: new Date(Date.now() - (10 - i) * 86400000).toISOString(),
  }))

  localStorage.setItem(LEADS_KEY, JSON.stringify(seeded))
  return seeded
}

/* ── Auth ──────────────────────────────────────────────────────────────── */
const AUTH_KEY = 'greenedge_auth'

export function login(password) {
  const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'greenedge2024'
  if (password === adminPass) { sessionStorage.setItem(AUTH_KEY, 'true'); return true }
  return false
}
export function logout()          { sessionStorage.removeItem(AUTH_KEY) }
export function isAuthenticated() { return sessionStorage.getItem(AUTH_KEY) === 'true' }
