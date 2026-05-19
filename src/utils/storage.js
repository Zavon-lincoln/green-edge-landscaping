/* ── Leads ─────────────────────────────────────────────────────────────── */
const LEADS_KEY = 'greenedge_leads'

export function getLeads() {
  try { return JSON.parse(localStorage.getItem(LEADS_KEY) || '[]') }
  catch { return [] }
}

export function saveLead(lead) {
  const leads = getLeads()
  const newLead = {
    ...lead,
    id: Date.now().toString(),
    submittedAt: new Date().toISOString(),
    status: 'New',
    jobValue: null,
    followUpDate: null,
    followUpSent: false,
    activityLog: [{
      text: 'Lead submitted via website',
      type: 'system',
      timestamp: new Date().toISOString(),
    }],
  }
  leads.unshift(newLead)
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
  return newLead
}

export function updateLeadStatus(id, status) {
  const leads = getLeads()
  const updated = leads.map(l => {
    if (l.id !== id) return l
    const logEntry = { text: `Status changed to ${status}`, type: 'status', timestamp: new Date().toISOString() }
    const followUpDate = status === 'Contacted'
      ? new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
      : l.followUpDate
    const followUpSent = status === 'Contacted' ? false : l.followUpSent
    return { ...l, status, followUpDate, followUpSent, activityLog: [...(l.activityLog || []), logEntry] }
  })
  localStorage.setItem(LEADS_KEY, JSON.stringify(updated))
  return updated
}

export function deleteLead(id) {
  const updated = getLeads().filter(l => l.id !== id)
  localStorage.setItem(LEADS_KEY, JSON.stringify(updated))
  return updated
}

export function addLeadNote(id, text) {
  const leads = getLeads()
  const updated = leads.map(l => {
    if (l.id !== id) return l
    const entry = { text, type: 'note', timestamp: new Date().toISOString() }
    return { ...l, activityLog: [...(l.activityLog || []), entry] }
  })
  localStorage.setItem(LEADS_KEY, JSON.stringify(updated))
  return updated
}

export function updateLeadJobValue(id, jobValue) {
  const leads = getLeads()
  const updated = leads.map(l => l.id === id ? { ...l, jobValue: parseFloat(jobValue) || null } : l)
  localStorage.setItem(LEADS_KEY, JSON.stringify(updated))
  return updated
}

export function markFollowUpSent(id) {
  const leads = getLeads()
  const updated = leads.map(l => {
    if (l.id !== id) return l
    const entry = { text: 'Automated follow-up email sent to customer', type: 'follow_up', timestamp: new Date().toISOString() }
    return { ...l, followUpSent: true, activityLog: [...(l.activityLog || []), entry] }
  })
  localStorage.setItem(LEADS_KEY, JSON.stringify(updated))
  return updated
}

export function exportLeadsCSV() {
  const leads = getLeads()
  const headers = ['Name','Phone','Email','Service','Preferred Date','Preferred Time','Status','Job Value','Notes','Submitted']
  const rows = leads.map(l => [
    l.name, l.phone, l.email, l.service,
    l.preferredDate || '', l.preferredTime || '',
    l.status,
    l.jobValue != null ? l.jobValue : '',
    (l.notes || '').replace(/"/g, '""'),
    new Date(l.submittedAt).toLocaleDateString('en-US'),
  ])
  const csv = [headers, ...rows]
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `greenedge-leads-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/* ── Settings ──────────────────────────────────────────────────────────── */
const SETTINGS_KEY = 'greenedge_settings'

const DEFAULT_SETTINGS = {
  blocked_weekdays: [0],
  blocked_dates: [],
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
  const now = new Date()
  const d = (offset) => {
    const dt = new Date(now)
    dt.setDate(dt.getDate() + offset)
    return dt.toISOString().split('T')[0]
  }
  const ts = (offsetDays, offsetHours = 0) =>
    new Date(Date.now() - offsetDays * 86400000 - offsetHours * 3600000).toISOString()

  const leads = [
    {
      name: 'David Carter', phone: '(702) 555-0142', email: 'david.c@gmail.com',
      service: 'Lawn Maintenance', preferredDate: d(-6), preferredTime: '9:00 AM',
      notes: 'Weekly mowing — front yard and backyard, needs edging too',
      status: 'Completed', jobValue: 180, followUpDate: null, followUpSent: false,
      activityLog: [
        { text: 'Lead submitted via website', type: 'system', timestamp: ts(10) },
        { text: 'Status changed to Contacted', type: 'status', timestamp: ts(9) },
        { text: 'Automated follow-up email sent to customer', type: 'follow_up', timestamp: ts(7, 4) },
        { text: 'Status changed to Booked', type: 'status', timestamp: ts(7) },
        { text: 'Status changed to Completed', type: 'status', timestamp: ts(1) },
        { text: 'Great customer, wants bi-weekly going forward', type: 'note', timestamp: ts(1) },
      ],
    },
    {
      name: 'Lisa Martinez', phone: '(702) 555-3891', email: 'l.martinez@outlook.com',
      service: 'Irrigation Systems', preferredDate: d(-4), preferredTime: '10:00 AM',
      notes: 'Drip system not turning on, may need new controller',
      status: 'Completed', jobValue: 850, followUpDate: null, followUpSent: false,
      activityLog: [
        { text: 'Lead submitted via website', type: 'system', timestamp: ts(8) },
        { text: 'Status changed to Contacted', type: 'status', timestamp: ts(7) },
        { text: 'Quoted $850 for full controller replacement + labor', type: 'note', timestamp: ts(6) },
        { text: 'Status changed to Quoted', type: 'status', timestamp: ts(6) },
        { text: 'Status changed to Booked', type: 'status', timestamp: ts(5) },
        { text: 'Status changed to Completed', type: 'status', timestamp: ts(2) },
      ],
    },
    {
      name: 'Carlos Rodriguez', phone: '(702) 555-7204', email: 'c.rodriguez@email.com',
      service: 'Tree Service', preferredDate: d(-2), preferredTime: '8:00 AM',
      notes: 'Large palm tree trimming, two trees in backyard',
      status: 'Contacted', jobValue: 1200,
      followUpDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      followUpSent: false,
      activityLog: [
        { text: 'Lead submitted via website', type: 'system', timestamp: ts(5) },
        { text: 'Left voicemail, will try again tomorrow', type: 'note', timestamp: ts(4) },
        { text: 'Status changed to Contacted', type: 'status', timestamp: ts(3) },
        { text: 'Quoted $1,200 for both palms — waiting on approval', type: 'note', timestamp: ts(2) },
      ],
    },
    {
      name: 'Sarah Johnson', phone: '(702) 555-4417', email: 'sarah.j@gmail.com',
      service: 'Landscape Design', preferredDate: d(1), preferredTime: '11:00 AM',
      notes: 'Full front yard desert-scape redesign, budget ~$4k',
      status: 'Booked', jobValue: 4200, followUpDate: null, followUpSent: false,
      activityLog: [
        { text: 'Lead submitted via website', type: 'system', timestamp: ts(6) },
        { text: 'Status changed to Contacted', type: 'status', timestamp: ts(5) },
        { text: 'Met on-site, very clear vision. Quoted $4,200', type: 'note', timestamp: ts(4) },
        { text: 'Status changed to Quoted', type: 'status', timestamp: ts(4) },
        { text: 'Deposit received. Confirmed for next week.', type: 'note', timestamp: ts(2) },
        { text: 'Status changed to Booked', type: 'status', timestamp: ts(2) },
      ],
    },
    {
      name: 'Mike Thompson', phone: '(702) 555-8830', email: 'm.thompson@yahoo.com',
      service: 'Weed Control', preferredDate: d(2), preferredTime: '9:00 AM',
      notes: 'Rock yard completely overtaken, needs full spray treatment',
      status: 'Booked', jobValue: 350, followUpDate: null, followUpSent: false,
      activityLog: [
        { text: 'Lead submitted via website', type: 'system', timestamp: ts(4) },
        { text: 'Status changed to Contacted', type: 'status', timestamp: ts(3) },
        { text: 'Status changed to Booked', type: 'status', timestamp: ts(2) },
      ],
    },
    {
      name: 'Jennifer Walsh', phone: '(702) 555-2295', email: 'jen.walsh@gmail.com',
      service: 'Sod Installation', preferredDate: d(4), preferredTime: '7:00 AM',
      notes: 'Install approx 800 sqft of fescue in backyard',
      status: 'Quoted', jobValue: 2800, followUpDate: null, followUpSent: true,
      activityLog: [
        { text: 'Lead submitted via website', type: 'system', timestamp: ts(3) },
        { text: 'Status changed to Contacted', type: 'status', timestamp: ts(2, 8) },
        { text: 'Automated follow-up email sent to customer', type: 'follow_up', timestamp: ts(1, 4) },
        { text: 'Quoted $2,800 for 800sqft fescue + labor', type: 'note', timestamp: ts(1) },
        { text: 'Status changed to Quoted', type: 'status', timestamp: ts(1) },
      ],
    },
    {
      name: 'Robert Kim', phone: '(702) 555-6603', email: 'robert.k@icloud.com',
      service: 'Lawn Maintenance', preferredDate: d(5), preferredTime: '8:00 AM',
      notes: 'Bi-weekly service, gate code 4491',
      status: 'New', jobValue: null, followUpDate: null, followUpSent: false,
      activityLog: [
        { text: 'Lead submitted via website', type: 'system', timestamp: ts(1) },
      ],
    },
    {
      name: 'Amanda Foster', phone: '(702) 555-1187', email: 'a.foster@gmail.com',
      service: 'Seasonal Cleanup', preferredDate: d(7), preferredTime: '10:00 AM',
      notes: 'Spring cleanup — debris removal and fresh mulch',
      status: 'New', jobValue: null, followUpDate: null, followUpSent: false,
      activityLog: [
        { text: 'Lead submitted via website', type: 'system', timestamp: ts(0, 3) },
      ],
    },
    {
      name: 'Tom Bradley', phone: '(702) 555-9924', email: 'tom.b@outlook.com',
      service: 'Irrigation Systems', preferredDate: d(-1), preferredTime: '3:00 PM',
      notes: 'Annual spring startup and head inspection',
      status: 'Cancelled', jobValue: null, followUpDate: null, followUpSent: false,
      activityLog: [
        { text: 'Lead submitted via website', type: 'system', timestamp: ts(7) },
        { text: 'Status changed to Contacted', type: 'status', timestamp: ts(6) },
        { text: 'Customer called to cancel — going with another company', type: 'note', timestamp: ts(4) },
        { text: 'Status changed to Cancelled', type: 'status', timestamp: ts(4) },
      ],
    },
    {
      name: 'Nicole Chen', phone: '(702) 555-5512', email: 'n.chen@gmail.com',
      service: 'Landscape Design', preferredDate: d(9), preferredTime: '1:00 PM',
      notes: 'Consultation for pool-surround redesign, Henderson property',
      status: 'Quoted', jobValue: 5500, followUpDate: null, followUpSent: false,
      activityLog: [
        { text: 'Lead submitted via website', type: 'system', timestamp: ts(2) },
        { text: 'Status changed to Contacted', type: 'status', timestamp: ts(1, 8) },
        { text: 'Quoted $5,500 for pool surround, client considering', type: 'note', timestamp: ts(0, 4) },
        { text: 'Status changed to Quoted', type: 'status', timestamp: ts(0, 4) },
      ],
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
