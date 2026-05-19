import { useState, useEffect, useCallback } from 'react'
import {
  LogOut, Calendar, Users, Lock, ChevronLeft, ChevronRight,
  Phone, Mail, XCircle, Trash2, AlertTriangle, CheckCircle,
  Settings, Plus, X as XIcon, Database,
} from 'lucide-react'
import {
  isAuthenticated, login, logout,
  getLeads, updateLeadStatus, deleteLead,
  getSettings, saveSettings, seedDemoData,
} from '../utils/storage'

const STATUS_OPTIONS = ['New', 'Contacted', 'Booked', 'Completed', 'Cancelled']

/* Maps each status to its semantic badge CSS tokens — never brand colors */
const STATUS_BG = {
  New:       'var(--badge-new-bg)',
  Contacted: 'var(--badge-contacted-bg)',
  Booked:    'var(--badge-booked-bg)',
  Completed: 'var(--badge-completed-bg)',
  Cancelled: 'var(--badge-cancelled-bg)',
}
const STATUS_FG = {
  New:       'var(--badge-new-text)',
  Contacted: 'var(--badge-contacted-text)',
  Booked:    'var(--badge-booked-text)',
  Completed: 'var(--badge-completed-text)',
  Cancelled: 'var(--badge-cancelled-text)',
}

const ALL_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const ALL_TIME_SLOTS = [
  '7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM',
  '12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM',
]

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

/* ── Toast ─────────────────────────────────────────────────────────────── */
function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [toast, onDismiss])

  if (!toast) return null
  return (
    <div className={`toast toast--${toast.type}`} role="status" aria-live="polite">
      {toast.type === 'success'
        ? <CheckCircle className="w-4 h-4 shrink-0" />
        : <XCircle     className="w-4 h-4 shrink-0" />
      }
      {toast.message}
    </div>
  )
}

/* ── Delete Confirmation Modal ──────────────────────────────────────────── */
function ConfirmDeleteModal({ lead, onConfirm, onCancel }) {
  if (!lead) return null
  return (
    <div
      className="confirm-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="confirm-modal">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-11 h-11 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 id="confirm-title" className="font-bold text-gray-900 text-lg leading-tight">
              Delete lead?
            </h3>
            <p className="text-gray-500 text-sm mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-gray-700 text-sm mb-6">
          You are about to permanently delete <strong>{lead.name}</strong> and all their
          submission data. Are you sure?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100
                       hover:bg-gray-200 rounded-lg transition-colors"
            style={{ minHeight: 44 }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600
                       hover:bg-red-700 rounded-lg transition-colors"
            style={{ minHeight: 44 }}
          >
            Delete lead
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Admin Page ─────────────────────────────────────────────────────────── */
export default function Admin() {
  const [authed, setAuthed]             = useState(isAuthenticated())
  const [password, setPassword]         = useState('')
  const [loginErr, setLoginErr]         = useState('')
  const [leads, setLeads]               = useState([])
  const [isLoading, setIsLoading]       = useState(false)
  const [view, setView]                 = useState('table')
  const [calYear, setCalYear]           = useState(new Date().getFullYear())
  const [calMonth, setCalMonth]         = useState(new Date().getMonth())
  const [deleteTarget, setDeleteTarget]   = useState(null)  // { id, name }
  const [toast, setToast]                 = useState(null)  // { message, type }
  const [settings, setSettings]           = useState(getSettings())
  const [settingsDateInput, setSettingsDateInput] = useState('')

  const loadLeads = useCallback(() => {
    setIsLoading(true)
    // setTimeout mimics async boundary — swap for Supabase query when connected
    const t = setTimeout(() => {
      setLeads(getLeads())
      setIsLoading(false)
    }, 180)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (authed) return loadLeads()
  }, [authed, loadLeads])

  function handleLogin(e) {
    e.preventDefault()
    if (login(password)) { setAuthed(true); setLoginErr('') }
    else setLoginErr('Incorrect password. Please try again.')
  }

  function handleLogout() { logout(); setAuthed(false); setPassword('') }

  function handleStatusChange(id, status) {
    setLeads(updateLeadStatus(id, status))
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return
    try {
      setLeads(deleteLead(deleteTarget.id))
      setToast({ message: `${deleteTarget.name} has been deleted`, type: 'success' })
    } catch {
      setToast({ message: 'Could not delete lead — please try again', type: 'error' })
    }
    setDeleteTarget(null)
  }

  function handleSaveSettings() {
    saveSettings(settings)
    setToast({ message: 'Availability settings saved', type: 'success' })
  }

  function toggleWeekday(day) {
    setSettings(s => {
      const blocked = s.blocked_weekdays.includes(day)
        ? s.blocked_weekdays.filter(d => d !== day)
        : [...s.blocked_weekdays, day]
      return { ...s, blocked_weekdays: blocked }
    })
  }

  function toggleTimeSlot(slot) {
    setSettings(s => {
      const active = s.time_slots.includes(slot)
        ? s.time_slots.filter(t => t !== slot)
        : [...s.time_slots, slot].sort((a, b) => ALL_TIME_SLOTS.indexOf(a) - ALL_TIME_SLOTS.indexOf(b))
      return { ...s, time_slots: active }
    })
  }

  function handleAddBlockedDate() {
    if (!settingsDateInput) return
    if (settings.blocked_dates.includes(settingsDateInput)) {
      setSettingsDateInput('')
      return
    }
    setSettings(s => ({
      ...s,
      blocked_dates: [...s.blocked_dates, settingsDateInput].sort(),
    }))
    setSettingsDateInput('')
  }

  function handleRemoveBlockedDate(date) {
    setSettings(s => ({ ...s, blocked_dates: s.blocked_dates.filter(d => d !== date) }))
  }

  function handleSeedData() {
    seedDemoData()
    loadLeads()
    setToast({ message: 'Demo leads loaded successfully', type: 'success' })
    setView('table')
  }

  /* ── Login screen ─────────────────────────────────────────────────── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-brand-green rounded-xl flex items-center justify-center mb-4">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-brand-dark font-display">Admin Login</h1>
            <p className="text-gray-500 text-sm mt-1">Green Edge Landscaping Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter admin password"
                required
                autoComplete="current-password"
              />
            </div>
            {loginErr && (
              <p className="text-red-600 text-sm flex items-center gap-1" role="alert">
                <XCircle className="w-4 h-4 shrink-0" /> {loginErr}
              </p>
            )}
            <button type="submit" className="btn-primary w-full justify-center" style={{ minHeight: 48 }}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  /* ── Calendar data ────────────────────────────────────────────────── */
  const appointmentsByDay = {}
  leads.forEach(lead => {
    if (lead.preferredDate) {
      const d = new Date(lead.preferredDate + 'T00:00:00')
      if (d.getFullYear() === calYear && d.getMonth() === calMonth) {
        const day = d.getDate()
        if (!appointmentsByDay[day]) appointmentsByDay[day] = []
        appointmentsByDay[day].push(lead)
      }
    }
  })

  const daysInMonth        = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDay           = new Date(calYear, calMonth, 1).getDay()
  const today              = new Date()
  const monthHasAppts      = Object.keys(appointmentsByDay).length > 0

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) }
    else setCalMonth(m => m - 1)
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) }
    else setCalMonth(m => m + 1)
  }

  const stats = {
    total:     leads.length,
    new:       leads.filter(l => l.status === 'New').length,
    booked:    leads.filter(l => l.status === 'Booked').length,
    completed: leads.filter(l => l.status === 'Completed').length,
  }

  /* ── Skeleton row ─────────────────────────────────────────────────── */
  function SkeletonRow() {
    return (
      <tr className="animate-pulse">
        {Array.from({ length: 9 }).map((_, i) => (
          <td key={i} className="px-4 py-3">
            <div className="h-4 bg-gray-100 rounded w-full" style={{ maxWidth: i === 8 ? 32 : '100%' }} />
          </td>
        ))}
      </tr>
    )
  }

  /* ── Dashboard ────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      <ConfirmDeleteModal
        lead={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Header */}
      <header className="bg-brand-dark shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GE</span>
            </div>
            <div>
              <p className="text-white font-bold leading-tight">Green Edge Landscaping</p>
              <p className="text-gray-400 text-xs">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setView('table')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'table' ? 'bg-brand-green text-white' : 'text-gray-300 hover:text-white'
              }`}
              style={{ minHeight: 44 }}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Leads</span>
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'calendar' ? 'bg-brand-green text-white' : 'text-gray-300 hover:text-white'
              }`}
              style={{ minHeight: 44 }}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
            <button
              onClick={() => setView('settings')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'settings' ? 'bg-brand-green text-white' : 'text-gray-300 hover:text-white'
              }`}
              style={{ minHeight: 44 }}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium
                         text-gray-300 hover:text-white hover:bg-white/10 transition-colors ml-1"
              style={{ minHeight: 44 }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Leads', value: stats.total,     color: 'text-brand-green', bg: 'bg-green-50' },
            { label: 'New',         value: stats.new,        color: 'text-blue-600',   bg: 'bg-blue-50' },
            { label: 'Booked',      value: stats.booked,     color: 'text-green-600',  bg: 'bg-green-50' },
            { label: 'Completed',   value: stats.completed,  color: 'text-gray-600',   bg: 'bg-gray-100' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-5`}>
              {isLoading
                ? <div className="h-9 w-12 bg-white/60 rounded animate-pulse mb-1" />
                : <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              }
              <p className="text-gray-600 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Leads table ─────────────────────────────────────────────── */}
        {view === 'table' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-brand-dark text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-green" /> All Leads
              </h2>
              <span className="text-sm text-gray-500">{isLoading ? '…' : `${leads.length} total`}</span>
            </div>

            {/* Loading state */}
            {isLoading ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                    <tr>
                      {['Name','Phone','Email','Service','Date','Time','Submitted','Status',''].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
                  </tbody>
                </table>
              </div>
            ) : leads.length === 0 ? (
              /* Empty state */
              <div className="py-20 text-center">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-semibold text-gray-700">No leads yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Submissions from the booking form will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                    <tr>
                      {['Name','Phone','Email','Service','Date','Time','Submitted','Status',''].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{lead.name}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-brand-green">
                            <Phone className="w-3 h-3" />{lead.phone}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-brand-green">
                            <Mail className="w-3 h-3" />{lead.email}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{lead.service}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{lead.preferredDate || '—'}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{lead.preferredTime || '—'}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {new Date(lead.submittedAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3">
                          {/* Select uses semantic badge tokens via inline CSS vars */}
                          <select
                            value={lead.status}
                            onChange={e => handleStatusChange(lead.id, e.target.value)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer
                                       border-0 focus:outline-none focus:ring-2 focus:ring-brand-green
                                       focus:ring-offset-1"
                            style={{
                              backgroundColor: STATUS_BG[lead.status] || 'var(--badge-inactive-bg)',
                              color:           STATUS_FG[lead.status] || 'var(--badge-inactive-text)',
                              minHeight: 32,
                            }}
                          >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setDeleteTarget({ id: lead.id, name: lead.name })}
                            className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50
                                       rounded-lg transition-colors flex items-center justify-center"
                            style={{ minWidth: 44, minHeight: 44 }}
                            aria-label={`Delete ${lead.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Calendar view ────────────────────────────────────────────── */}
        {view === 'calendar' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Month nav */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ minWidth: 44, minHeight: 44 }}
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="font-bold text-brand-dark text-lg">{MONTH_NAMES[calMonth]} {calYear}</h2>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ minWidth: 44, minHeight: 44 }}
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {d}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e-${i}`} className="min-h-[80px] border-b border-r border-gray-50 bg-gray-50/50" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day    = i + 1
                const isToday = (
                  today.getFullYear() === calYear &&
                  today.getMonth()    === calMonth &&
                  today.getDate()     === day
                )
                const appts = appointmentsByDay[day] || []
                return (
                  <div
                    key={day}
                    className={`min-h-[80px] border-b border-r border-gray-100 p-2 transition-colors ${
                      isToday ? 'bg-green-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-sm font-semibold inline-flex items-center justify-center w-7 h-7 rounded-full ${
                      isToday ? 'bg-brand-green text-white' : 'text-gray-700'
                    }`}>
                      {day}
                    </span>
                    <div className="mt-1 space-y-1">
                      {appts.slice(0, 2).map(a => (
                        <div key={a.id} className="text-xs bg-brand-green/10 text-brand-green font-medium rounded px-1.5 py-0.5 truncate">
                          {a.name}
                        </div>
                      ))}
                      {appts.length > 2 && (
                        <div className="text-xs text-gray-400 pl-1">+{appts.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Appointment list below calendar */}
            {isLoading ? (
              <div className="px-6 py-8 border-t border-gray-100 text-center">
                <div className="spinner spinner--sm mx-auto" />
              </div>
            ) : monthHasAppts ? (
              <div className="px-6 py-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Appointments this month</p>
                <div className="space-y-2">
                  {Object.entries(appointmentsByDay)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([day, appts]) =>
                      appts.map(a => (
                        <div key={a.id} className="flex items-center gap-3 text-sm flex-wrap">
                          <span className="w-16 text-gray-500 shrink-0">
                            {MONTH_NAMES[calMonth].slice(0, 3)} {day}
                          </span>
                          <span className="font-medium text-gray-800">{a.name}</span>
                          <span className="text-gray-400">—</span>
                          <span className="text-gray-600">{a.service}</span>
                          {/* Status Pill uses semantic badge tokens only */}
                          <span
                            className="status-pill ml-auto"
                            style={{
                              background: STATUS_BG[a.status] || 'var(--badge-inactive-bg)',
                              color:      STATUS_FG[a.status] || 'var(--badge-inactive-text)',
                            }}
                          >
                            {a.status}
                          </span>
                        </div>
                      ))
                    )
                  }
                </div>
              </div>
            ) : (
              /* Calendar empty state */
              <div className="px-6 py-14 border-t border-gray-100 text-center">
                <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="font-semibold text-gray-700">No appointments this month</p>
                <p className="text-sm text-gray-400 mt-1">
                  Book a service from the homepage and it will appear here.
                </p>
              </div>
            )}
          </div>
        )}
        {/* ── Settings view ─────────────────────────────────────────────── */}
        {view === 'settings' && (
          <div className="space-y-6">

            {/* Off Days — weekday toggles */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-brand-dark text-lg mb-1 flex items-center gap-2">
                <Settings className="w-5 h-5 text-brand-green" /> Availability Settings
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Configure which days and times customers can request appointments.
              </p>

              <p className="text-sm font-semibold text-gray-700 mb-3">Days Off (blocked for bookings)</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {ALL_WEEKDAYS.map((label, idx) => {
                  const blocked = settings.blocked_weekdays.includes(idx)
                  return (
                    <button
                      key={label}
                      onClick={() => toggleWeekday(idx)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-colors ${
                        blocked
                          ? 'bg-red-50 border-red-300 text-red-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-brand-green hover:text-brand-green'
                      }`}
                      style={{ minHeight: 44 }}
                    >
                      {label}
                      {blocked && <span className="ml-1.5 text-xs">(off)</span>}
                    </button>
                  )
                })}
              </div>

              {/* Time slots */}
              <p className="text-sm font-semibold text-gray-700 mb-3">Available Time Slots</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {ALL_TIME_SLOTS.map(slot => {
                  const active = settings.time_slots.includes(slot)
                  return (
                    <button
                      key={slot}
                      onClick={() => toggleTimeSlot(slot)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                        active
                          ? 'bg-brand-green/10 border-brand-green/40 text-brand-green'
                          : 'bg-gray-50 border-gray-200 text-gray-400 line-through'
                      }`}
                      style={{ minHeight: 40 }}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>

              {/* Blocked specific dates */}
              <p className="text-sm font-semibold text-gray-700 mb-3">Block Specific Dates</p>
              <div className="flex gap-2 mb-3">
                <input
                  type="date"
                  value={settingsDateInput}
                  onChange={e => setSettingsDateInput(e.target.value)}
                  className="input-field flex-1"
                  style={{ maxWidth: 200 }}
                />
                <button
                  onClick={handleAddBlockedDate}
                  disabled={!settingsDateInput}
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-green text-white rounded-lg text-sm font-semibold
                             hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ minHeight: 44 }}
                >
                  <Plus className="w-4 h-4" /> Block Date
                </button>
              </div>
              {settings.blocked_dates.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No specific dates blocked.</p>
              ) : (
                <ul className="space-y-1.5">
                  {settings.blocked_dates.map(date => (
                    <li key={date} className="flex items-center justify-between bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm">
                      <span className="text-red-700 font-medium">
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
                        })}
                      </span>
                      <button
                        onClick={() => handleRemoveBlockedDate(date)}
                        className="p-1 text-red-400 hover:text-red-600 transition-colors rounded"
                        aria-label={`Remove blocked date ${date}`}
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  className="btn-primary"
                  style={{ minHeight: 44 }}
                >
                  Save Settings
                </button>
              </div>
            </div>

            {/* Demo Data */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-brand-dark text-base mb-1 flex items-center gap-2">
                <Database className="w-4 h-4 text-gray-400" /> Demo Data
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Load 10 sample leads with realistic Las Vegas homeowner data to preview the dashboard.
                This will replace any existing leads.
              </p>
              <button
                onClick={handleSeedData}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700
                           font-semibold text-sm rounded-lg transition-colors"
                style={{ minHeight: 44 }}
              >
                <Database className="w-4 h-4" /> Load Demo Leads
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}
