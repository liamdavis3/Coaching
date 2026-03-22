'use client'

import { useState } from 'react'

type FormData = {
  firstName: string
  lastName: string
  email: string
  age: string
  location: string
  mileage: string
  yearsRunning: string
  recentRace: string
  injuries: string
  goal: string
  targetRace: string
  challenge: string
  daysPerWeek: string
  commsPref: string
  budget: string
  notes: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

const INITIAL_DATA: FormData = {
  firstName: '', lastName: '', email: '', age: '', location: '',
  mileage: '', yearsRunning: '', recentRace: '', injuries: '',
  goal: '', targetRace: '', challenge: '',
  daysPerWeek: '', commsPref: '', budget: '', notes: '',
}

const GOALS = [
  { value: 'pr',       label: 'PR in a specific race' },
  { value: 'first',    label: 'Complete my first race' },
  { value: 'fitness',  label: 'General fitness & consistency' },
  { value: 'marathon', label: 'Train for marathon / ultra' },
]

const STEPS = ['You', 'Running', 'Goals', 'Logistics']

// ── Validation ───────────────────────────────────────────────
function validateStep(step: number, data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (step === 0) {
    if (!data.firstName.trim())
      errors.firstName = 'First name is required'
    if (!data.lastName.trim())
      errors.lastName = 'Last name is required'
    if (!data.email.trim())
      errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errors.email = 'Enter a valid email address'
    if (!data.age.trim())
      errors.age = 'Age is required'
    else if (isNaN(Number(data.age)) || Number(data.age) < 13 || Number(data.age) > 80)
      errors.age = 'Enter a valid age between 13 and 80'
    if (!data.location.trim())
      errors.location = 'Location is required'
  }

  if (step === 1) {
    if (!data.mileage)
      errors.mileage = 'Please select your weekly mileage'
    if (!data.yearsRunning)
      errors.yearsRunning = 'Please select years running'
  }

  if (step === 2) {
    if (!data.goal)
      errors.goal = 'Please select a primary goal'
  }

  if (step === 3) {
    if (!data.daysPerWeek)
      errors.daysPerWeek = 'Please select days per week'
    if (!data.commsPref)
      errors.commsPref = 'Please select a communication preference'
    if (!data.budget)
      errors.budget = 'Please select a budget range'
  }

  return errors
}

// ── Component ─────────────────────────────────────────────────
export default function IntakeForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(false)

  const update = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const nextStep = () => {
    const stepErrors = validateStep(currentStep, formData)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors({})
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const prevStep = () => {
    setErrors({})
    setCurrentStep((s) => Math.max(s - 1, 0))
  }

  const handleSubmit = async () => {
    const stepErrors = validateStep(currentStep, formData)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }

    setLoading(true)
    setApiError(false)

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('API error')
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setApiError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-card" id="intake-form">

      <div className="form-header">
        <div className="form-header-title">Athlete Application</div>
        <div className="form-header-sub">
          Takes about 3 minutes · I&apos;ll follow up within 24 hours
        </div>
      </div>

      {!submitted && (
        <div className="form-progress">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`progress-step ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}
            >
              <span className="step-num">{i < currentStep ? '✓' : i + 1}</span>
              <span className="step-text">{label}</span>
            </div>
          ))}
        </div>
      )}

      {submitted ? (
        <div className="success-state">
          <div className="success-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="#27a065" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="success-title">Application received!</h3>
          <p className="success-body">
            Thanks for applying. I&apos;ll review your answers and reach out within 24 hours
            to discuss next steps and what a coaching arrangement could look like for you.
          </p>
        </div>
      ) : (
        <div className="form-body">

          {apiError && (
            <div className="api-error-banner">
              <span>Something went wrong — your submission didn&apos;t go through.</span>
              <button className="api-error-retry" onClick={handleSubmit}>
                Try again
              </button>
            </div>
          )}

          {currentStep === 0 && (
            <div>
              <h3 className="form-step-title">Tell me about yourself</h3>
              <p className="form-step-sub">Basic contact info so I can follow up directly.</p>

              <div className="field-grid">
                <Field label="First name" error={errors.firstName}>
                  <input type="text" placeholder="Alex"
                    value={formData.firstName}
                    onChange={(e) => update('firstName', e.target.value)} />
                </Field>
                <Field label="Last name" error={errors.lastName}>
                  <input type="text" placeholder="Johnson"
                    value={formData.lastName}
                    onChange={(e) => update('lastName', e.target.value)} />
                </Field>
              </div>

              <Field label="Email" error={errors.email}>
                <input type="email" placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => update('email', e.target.value)} />
              </Field>

              <div className="field-grid">
                <Field label="Age" error={errors.age}>
                  <input type="number" placeholder="24" min={13} max={80}
                    value={formData.age}
                    onChange={(e) => update('age', e.target.value)} />
                </Field>
                <Field label="Location (city, state)" error={errors.location}>
                  <input type="text" placeholder="Boston, MA"
                    value={formData.location}
                    onChange={(e) => update('location', e.target.value)} />
                </Field>
              </div>

              <FormNav step={0} total={STEPS.length} onNext={nextStep} />
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h3 className="form-step-title">Your running background</h3>
              <p className="form-step-sub">
                No judgment — just helps me understand where you&apos;re starting from.
              </p>

              <Field label="Weekly mileage (current average)" error={errors.mileage}>
                <select value={formData.mileage}
                  onChange={(e) => update('mileage', e.target.value)}>
                  <option value="">Select a range</option>
                  <option>0–10 miles/week (just getting started)</option>
                  <option>11–20 miles/week</option>
                  <option>21–35 miles/week</option>
                  <option>36–50 miles/week</option>
                  <option>50+ miles/week</option>
                </select>
              </Field>

              <Field label="Years running consistently" error={errors.yearsRunning}>
                <select value={formData.yearsRunning}
                  onChange={(e) => update('yearsRunning', e.target.value)}>
                  <option value="">Select</option>
                  <option>Less than 1 year</option>
                  <option>1–2 years</option>
                  <option>3–5 years</option>
                  <option>6–10 years</option>
                  <option>10+ years</option>
                </select>
              </Field>

              <Field label="Most recent race / best result (optional)">
                <input type="text" placeholder="5K in 22:14 at local 5K, Oct 2024"
                  value={formData.recentRace}
                  onChange={(e) => update('recentRace', e.target.value)} />
              </Field>

              <Field label="Any current injuries or physical limitations?">
                <textarea placeholder="e.g. mild plantar fasciitis, none..."
                  value={formData.injuries}
                  onChange={(e) => update('injuries', e.target.value)} />
              </Field>

              <FormNav step={1} total={STEPS.length} onNext={nextStep} onPrev={prevStep} />
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 className="form-step-title">What are your goals?</h3>
              <p className="form-step-sub">
                Pick the one that best describes what you&apos;re training toward.
              </p>

              <Field label="Primary goal" error={errors.goal}>
                <div className="radio-group">
                  {GOALS.map((g) => (
                    <label key={g.value}
                      className={`radio-option ${formData.goal === g.value ? 'selected' : ''}`}>
                      <input type="radio" name="goal" value={g.value}
                        checked={formData.goal === g.value}
                        onChange={() => update('goal', g.value)} />
                      {g.label}
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="Target event or race (if applicable)" style={{ marginTop: '1.25rem' }}>
                <input type="text" placeholder="e.g. Boston Marathon April 2026"
                  value={formData.targetRace}
                  onChange={(e) => update('targetRace', e.target.value)} />
              </Field>

              <Field label="What's your biggest challenge right now?">
                <textarea placeholder="e.g. staying consistent, injury-prone..."
                  value={formData.challenge}
                  onChange={(e) => update('challenge', e.target.value)} />
              </Field>

              <FormNav step={2} total={STEPS.length} onNext={nextStep} onPrev={prevStep} />
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h3 className="form-step-title">Availability &amp; logistics</h3>
              <p className="form-step-sub">
                So I can tailor the coaching format to your schedule.
              </p>

              <Field label="Days per week available to run" error={errors.daysPerWeek}>
                <select value={formData.daysPerWeek}
                  onChange={(e) => update('daysPerWeek', e.target.value)}>
                  <option value="">Select</option>
                  <option>2–3 days/week</option>
                  <option>4–5 days/week</option>
                  <option>6–7 days/week</option>
                </select>
              </Field>

              <Field label="Preferred communication style" error={errors.commsPref}>
                <select value={formData.commsPref}
                  onChange={(e) => update('commsPref', e.target.value)}>
                  <option value="">Select</option>
                  <option>Weekly check-in via email</option>
                  <option>Text / WhatsApp updates</option>
                  <option>Monthly video call + async messages</option>
                  <option>No preference</option>
                </select>
              </Field>

              <Field label="Budget range (monthly)" error={errors.budget}>
                <select value={formData.budget}
                  onChange={(e) => update('budget', e.target.value)}>
                  <option value="">Select</option>
                  <option>$25/month</option>
                  <option>$50/month</option>
                  <option>$100/month</option>
                  <option>Flexible — depends on the plan</option>
                </select>
              </Field>

              <Field label="Anything else you want me to know?">
                <textarea placeholder="Work schedule, race history, what's worked or hasn't..."
                  value={formData.notes}
                  onChange={(e) => update('notes', e.target.value)} />
              </Field>

              <FormNav
                step={3} total={STEPS.length}
                onPrev={prevStep}
                onSubmit={handleSubmit}
                loading={loading}
              />
            </div>
          )}

        </div>
      )}
    </div>
  )
}

// ── Field wrapper with inline error ──────────────────────────
type FieldProps = {
  label: string
  error?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

function Field({ label, error, style, children }: FieldProps) {
  return (
    <div className={`field ${error ? 'field-error' : ''}`} style={style}>
      <label>{label}</label>
      {children}
      {error && <span className="field-error-msg">{error}</span>}
    </div>
  )
}

// ── Nav row ───────────────────────────────────────────────────
type FormNavProps = {
  step: number
  total: number
  onNext?: () => void
  onPrev?: () => void
  onSubmit?: () => void
  loading?: boolean
}

function FormNav({ step, total, onNext, onPrev, onSubmit, loading }: FormNavProps) {
  const isLast = step === total - 1
  return (
    <div className="form-nav">
      {onPrev ? (
        <button className="btn-ghost" onClick={onPrev}>← Back</button>
      ) : (
        <span />
      )}
      <span className="step-counter">Step {step + 1} of {total}</span>
      {isLast ? (
        <button className="btn-primary" onClick={onSubmit} disabled={loading}>
          {loading ? 'Submitting…' : 'Submit application'}
        </button>
      ) : (
        <button className="btn-primary" onClick={onNext}>Next →</button>
      )}
    </div>
  )
}
