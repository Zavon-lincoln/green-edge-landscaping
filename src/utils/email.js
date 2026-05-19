import emailjs from '@emailjs/browser'

const PUBLIC_KEY       = import.meta.env.VITE_EMAILJS_PUBLIC_KEY       || ''
const SERVICE_ID       = import.meta.env.VITE_EMAILJS_SERVICE_ID       || ''
const CLIENT_TEMPLATE  = import.meta.env.VITE_EMAILJS_CLIENT_TEMPLATE_ID || ''
const OWNER_TEMPLATE   = import.meta.env.VITE_EMAILJS_OWNER_TEMPLATE_ID  || ''
const OWNER_EMAIL      = 'demo@greenedgelandscaping.com'

export async function sendConfirmationEmail(lead) {
  if (!PUBLIC_KEY || PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
    console.warn('EmailJS not configured — add keys to .env')
    return
  }
  try {
    await emailjs.send(SERVICE_ID, CLIENT_TEMPLATE, {
      to_name:  lead.name,
      to_email: lead.email,
      service:  lead.service,
      date:     lead.preferredDate,
      time:     lead.preferredTime,
      company:  'Green Edge Landscaping',
      phone:    '(702) 555-0371',
    }, PUBLIC_KEY)
  } catch (err) {
    console.warn('Confirmation email failed:', err)
  }
}

export async function sendOwnerNotification(lead) {
  if (!PUBLIC_KEY || PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') return
  try {
    await emailjs.send(SERVICE_ID, OWNER_TEMPLATE, {
      owner_email: OWNER_EMAIL,
      lead_name:   lead.name,
      lead_phone:  lead.phone,
      lead_email:  lead.email,
      service:     lead.service,
      date:        lead.preferredDate,
      time:        lead.preferredTime,
      notes:       lead.notes || 'None',
    }, PUBLIC_KEY)
  } catch (err) {
    console.warn('Owner notification failed:', err)
  }
}
