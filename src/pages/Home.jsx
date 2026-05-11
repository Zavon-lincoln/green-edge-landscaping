import { useState, useEffect, useRef } from 'react'
import { Leaf, Droplets, Scissors, Trees, Star, Phone, Mail, MapPin, ChevronRight, CheckCircle, Shield, Award, Sun, Menu, X, ArrowRight } from 'lucide-react'
import { saveLead } from '../utils/storage'
import { sendConfirmationEmail, sendOwnerNotification } from '../utils/email'

const SERVICES = [
  {
    icon: <Scissors size={28} />,
    title: 'Lawn Maintenance',
    desc: 'Weekly or bi-weekly mowing, edging, blowing, and seasonal cleanup to keep your lawn looking its best year-round.',
  },
  {
    icon: <Leaf size={28} />,
    title: 'Landscape Design',
    desc: 'Custom desert-friendly landscape designs that save water, boost curb appeal, and thrive in the Las Vegas climate.',
  },
  {
    icon: <Droplets size={28} />,
    title: 'Irrigation Systems',
    desc: 'Smart drip and sprinkler system installation, repair, and seasonal adjustments to maximize water efficiency.',
  },
  {
    icon: <Trees size={28} />,
    title: 'Tree Service',
    desc: 'Professional trimming, shaping, removal, and stump grinding by ISA-certified arborists.',
  },
]

const TESTIMONIALS = [
  {
    name: 'David C.',
    location: 'Summerlin',
    stars: 5,
    text: 'Green Edge completely transformed our backyard from a patchy mess to a gorgeous desert oasis. The design team was incredible.',
  },
  {
    name: 'Lisa M.',
    location: 'Henderson',
    stars: 5,
    text: 'They installed a smart irrigation system and our water bill dropped by almost half. Couldn\'t be happier with the results.',
  },
  {
    name: 'Carlos R.',
    location: 'Las Vegas',
    stars: 5,
    text: 'Reliable, professional, and they always show up on schedule. My lawn has never looked better in 10 years of living here.',
  },
]

const FORM_SERVICES = [
  'Lawn Maintenance',
  'Landscape Design',
  'Irrigation Systems',
  'Tree Service',
  'Sod Installation',
  'Weed Control',
  'Seasonal Cleanup',
  'Other',
]

const TIME_OPTIONS = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
]

function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm anim-slide-down">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-brand-dark tracking-tight">
              Green<span className="text-brand-green">Edge</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Services', 'About', 'Reviews', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-600 hover:text-brand-green transition-colors">
                {item}
              </a>
            ))}
            <a href="#booking" className="btn-primary text-sm py-2 px-4">Book Now</a>
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-gray-100" aria-label="Toggle menu">
            {open ? <X size={22} className="text-gray-700" /> : <Menu size={22} className="text-gray-700" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-3 anim-fade-in">
            {['Services', 'About', 'Reviews', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)}
                className="text-sm font-medium text-gray-700 px-2 py-1 hover:text-brand-green">{item}</a>
            ))}
            <a href="#booking" onClick={() => setOpen(false)} className="btn-primary text-sm text-center mt-2">Book Now</a>
          </div>
        )}
      </div>
    </nav>
  )
}

function Hero() {
  const statsRef = useRef(null)
  const statsStarted = useRef(false)
  const [yearsVal, setYearsVal] = useState(0)
  const [propertiesVal, setPropertiesVal] = useState(0)

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !statsStarted.current) {
        statsStarted.current = true
        const steps = 80; let i = 0
        const t = setInterval(() => {
          i++
          const p = 1 - Math.pow(1 - i / steps, 3)
          setYearsVal(Math.round(10 * p))
          setPropertiesVal(Math.round(600 * p))
          if (i >= steps) clearInterval(t)
        }, 1800 / steps)
      }
    }, { threshold: 0.3 })
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="relative min-h-screen flex items-center bg-brand-dark overflow-hidden">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #74C69D 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-green/20 to-transparent" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-light/10 rounded-full blur-3xl" />
      {/* Floating decorative elements */}
      <div className="absolute right-16 top-1/3 w-40 h-40 rounded-full border border-brand-light/10 anim-float hidden lg:block" />
      <div className="absolute right-28 top-1/3 translate-y-12 w-20 h-20 rounded-full border border-brand-light/15 anim-float hidden lg:block" style={{ animationDelay: '1s' }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-brand-green/20 border border-brand-light/30 rounded-full px-4 py-2 mb-6 anim-fade-up delay-1">
            <div className="w-2 h-2 bg-brand-light rounded-full animate-pulse" />
            <span className="text-brand-light text-sm font-semibold">Serving the Entire Las Vegas Valley</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 anim-fade-up delay-2">
            Beautiful Landscapes<br />
            <span className="text-brand-light">Built to Last.</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-xl anim-fade-up delay-3">
            Green Edge Landscaping creates and maintains stunning outdoor spaces across Las Vegas —
            from lush lawn care to water-wise desert designs that thrive in Nevada's heat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12 anim-fade-up delay-4">
            <a href="#booking" className="btn-primary text-base">
              Get a Free Quote <ChevronRight size={18} />
            </a>
            <a href="tel:7025550371"
              className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-brand-dark transition-all duration-200 inline-flex items-center gap-2 text-base">
              <Phone size={18} /> (702) 555-0371
            </a>
          </div>
          <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4 anim-fade-up delay-5">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-display font-bold text-brand-light">{yearsVal}+</p>
              <p className="text-gray-400 text-xs mt-1">Years in Las Vegas</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-display font-bold text-brand-light">{propertiesVal}+</p>
              <p className="text-gray-400 text-xs mt-1">Properties Served</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-display font-bold text-brand-light">5★</p>
              <p className="text-gray-400 text-xs mt-1">Average Rating</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-display font-bold text-brand-light">40%</p>
              <p className="text-gray-400 text-xs mt-1">Avg. Water Savings</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Services({ onServiceClick }) {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 reveal">
          <p className="section-label mb-3">What We Do</p>
          <h2 className="font-display text-4xl font-bold text-brand-dark mb-4">Complete Landscaping Services</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Whether you need routine lawn care or a full desert-scape transformation, Green Edge has the expertise to deliver stunning results.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="card group cursor-pointer reveal hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-green/15 hover:border-brand-green/30"
              style={{ transitionDelay: `${i * 0.12}s` }}
              onClick={() => onServiceClick(s.title)}
            >
              <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-green group-hover:text-white transition-colors duration-200">
                {s.icon}
              </div>
              <h3 className="font-display font-semibold text-lg text-brand-dark mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              <p className="mt-4 text-brand-green text-sm font-semibold flex items-center gap-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                Book Now <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  const features = [
    'Licensed & fully insured in Nevada',
    'ISA-certified arborists on staff',
    'Water-wise design specialists',
    'Residential & commercial properties',
    'Weekly, bi-weekly & monthly plans',
    'Free initial consultation & quote',
  ]
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="reveal">
            <p className="section-label mb-3">About Green Edge</p>
            <h2 className="font-display text-4xl font-bold text-brand-dark mb-5">
              Las Vegas Landscaping Done Right
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Founded in 2015, Green Edge Landscaping was built on one principle: every Las Vegas home deserves an outdoor space that's beautiful, sustainable, and built for the desert. We've grown into one of the valley's most trusted landscaping companies by delivering exactly that — every single time.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Our team of certified landscape professionals combines deep horticultural knowledge with an eye for design, creating outdoor spaces that don't just survive Las Vegas conditions — they thrive in them.
            </p>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-gray-700">
                  <CheckCircle size={18} className="text-brand-green mt-0.5 shrink-0" />
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4 reveal" style={{ transitionDelay: '0.15s' }}>
            {[
              { icon: <Award size={24} />, title: 'Certified Pros', desc: 'ISA-certified arborists and licensed landscape contractors' },
              { icon: <Droplets size={24} />, title: 'Water Smart', desc: 'Designs that cut water usage by up to 40% vs. traditional landscaping' },
              { icon: <Sun size={24} />, title: 'Desert Hardy', desc: 'Plants and materials chosen to thrive in Nevada\'s extreme heat' },
              { icon: <Shield size={24} />, title: 'Guaranteed Work', desc: 'Full satisfaction guarantee on every project and service' },
            ].map((item) => (
              <div key={item.title} className="bg-brand-dark rounded-2xl p-6 text-white hover:-translate-y-1 transition-transform duration-300">
                <div className="w-10 h-10 bg-brand-green/20 text-brand-light rounded-lg flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <h4 className="font-display font-semibold mb-1">{item.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 reveal">
          <p className="section-label mb-3">Customer Reviews</p>
          <h2 className="font-display text-4xl font-bold text-brand-dark mb-4">
            Loved by Las Vegas Homeowners
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="card reveal hover:-translate-y-1 hover:shadow-lg transition-all duration-300" style={{ transitionDelay: `${i * 0.12}s` }}>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 italic text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-brand-dark text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BookingForm({ preselect = '' }) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', service: '', preferredDate: '', preferredTime: '', notes: '',
  })
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const formRef = useRef(null)

  useEffect(() => {
    if (preselect) {
      setForm((f) => ({ ...f, service: preselect }))
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [preselect])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.phone.trim()) e.phone = 'Phone is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.service) e.service = 'Please select a service'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus('loading')
    try {
      const lead = saveLead(form)
      await Promise.all([sendConfirmationEmail(lead), sendOwnerNotification(lead)])
      setStatus('success')
      setForm({ name: '', phone: '', email: '', service: '', preferredDate: '', preferredTime: '', notes: '' })
    } catch {
      setStatus('error')
    }
  }

  const field = (key) => ({
    value: form[key],
    onChange: (e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setErrors((er) => ({ ...er, [key]: '' })) },
  })

  return (
    <section id="booking" className="py-20 bg-brand-dark reveal">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-2 text-white">
            <p className="section-label mb-3">Get Started</p>
            <h2 className="font-display text-4xl font-bold mb-5">Get Your Free Quote</h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              Tell us about your project and we'll schedule a free on-site consultation. Most quotes delivered within 24 hours.
            </p>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-green/20 rounded-lg flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-brand-light" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Call or Text</p>
                  <a href="tel:7025550371" className="font-semibold hover:text-brand-light transition-colors">(702) 555-0371</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-green/20 rounded-lg flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-brand-light" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Email Us</p>
                  <a href="mailto:demo@greenedgelandscaping.com" className="font-semibold hover:text-brand-light transition-colors text-sm">
                    demo@greenedgelandscaping.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-green/20 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-brand-light" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Service Area</p>
                  <p className="font-semibold text-sm">Las Vegas, Henderson, Summerlin, Boulder City</p>
                </div>
              </div>
            </div>
          </div>

          <div ref={formRef} className="lg:col-span-3 bg-white rounded-2xl p-8">
            {status === 'success' ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="font-display text-2xl font-bold text-brand-dark mb-2">Quote Request Sent!</h3>
                <p className="text-gray-500 mb-6">We'll be in touch within one business day to schedule your free consultation.</p>
                <button onClick={() => setStatus('idle')} className="btn-primary">Submit Another Request</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input type="text" placeholder="David Carter" className="input-field" {...field('name')} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                    <input type="tel" placeholder="(702) 555-0000" className="input-field" {...field('phone')} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                  <input type="email" placeholder="you@example.com" className="input-field" {...field('email')} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Needed *</label>
                  <select className="input-field" {...field('service')}>
                    <option value="">Select a service…</option>
                    {FORM_SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Date</label>
                    <input type="date" className="input-field" {...field('preferredDate')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Time</label>
                    <select className="input-field" {...field('preferredTime')}>
                      <option value="">Select a time…</option>
                      {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Project Details</label>
                  <textarea rows={3} placeholder="Property size, current conditions, specific goals…"
                    className="input-field resize-none" {...field('notes')} />
                </div>
                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                    Something went wrong. Please call us at (702) 555-0371.
                  </div>
                )}
                <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center">
                  {status === 'loading' ? 'Submitting…' : 'Request Free Quote'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg">Green Edge Landscaping</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Las Vegas's trusted landscaping company for lawn care, design, irrigation, and tree service since 2015.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {FORM_SERVICES.slice(0, 5).map((s) => (
                <li key={s}><a href="#services" className="hover:text-brand-light transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-brand-light shrink-0" />
                <a href="tel:7025550371" className="hover:text-white transition-colors">(702) 555-0371</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-brand-light shrink-0" />
                <a href="mailto:demo@greenedgelandscaping.com" className="hover:text-white transition-colors">demo@greenedgelandscaping.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-brand-light shrink-0 mt-0.5" />
                <span>Las Vegas, Henderson, Summerlin &amp; Boulder City, NV</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Green Edge Landscaping. All rights reserved.</p>
          <a href="/admin" className="hover:text-gray-300 transition-colors">Admin</a>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  const [preselectService, setPreselectService] = useState('')

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const handleServiceClick = (serviceName) => {
    setPreselectService(serviceName)
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Services onServiceClick={handleServiceClick} />
      <About />
      <Reviews />
      <BookingForm preselect={preselectService} />
      <Footer />
    </div>
  )
}
