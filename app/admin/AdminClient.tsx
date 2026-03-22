'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AthleteIntake } from '@prisma/client'

type Props = {
  isAuthed: boolean
  submissions: AthleteIntake[]
}

const STATUS_COLORS: Record<string, string> = {
  new:       'status-new',
  contacted: 'status-contacted',
  onboarded: 'status-onboarded',
  declined:  'status-declined',
}

const STATUS_LABELS: Record<string, string> = {
  new:       'New',
  contacted: 'Contacted',
  onboarded: 'Onboarded',
  declined:  'Declined',
}

export default function AdminClient({ isAuthed, submissions }: Props) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [selected, setSelected] = useState<AthleteIntake | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // ── Password gate ──────────────────────────────────────────
  if (!isAuthed) {
    return (
      <div className="admin-gate">
        <div className="gate-card">
          <div className="gate-logo">S</div>
          <h1 className="gate-title">Admin access</h1>
          <p className="gate-sub">Enter your password to view submissions</p>
          <div className="gate-field">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              autoFocus
            />
          </div>
          <button className="gate-btn" onClick={handleLogin}>
            Continue
          </button>
        </div>
      </div>
    )
  }

  function handleLogin() {
    router.push(`/admin?password=${encodeURIComponent(password)}`)
  }

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id)
    await fetch('/api/admin/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setUpdatingId(null)
    router.refresh()
  }

  // ── Stats ──────────────────────────────────────────────────
  const stats = {
    total:     submissions.length,
    new:       submissions.filter((s) => s.status === 'new').length,
    contacted: submissions.filter((s) => s.status === 'contacted').length,
    onboarded: submissions.filter((s) => s.status === 'onboarded').length,
  }

  // ── Dashboard ──────────────────────────────────────────────
  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p className="admin-eyebrow">Stride Coaching</p>
          <h1 className="admin-title">Athlete submissions</h1>
        </div>
        <a href="/" className="admin-back">← Back to site</a>
      </div>

      {/* Stats row */}
      <div className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat-num">{stats.total}</div>
          <div className="admin-stat-label">Total</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-num accent">{stats.new}</div>
          <div className="admin-stat-label">New</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-num">{stats.contacted}</div>
          <div className="admin-stat-label">Contacted</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-num green">{stats.onboarded}</div>
          <div className="admin-stat-label">Onboarded</div>
        </div>
      </div>

      {/* Main layout — list + detail */}
      <div className="admin-layout">

        {/* Submissions list */}
        <div className="admin-list">
          {submissions.length === 0 && (
            <p className="admin-empty">No submissions yet.</p>
          )}
          {submissions.map((s) => (
            <div
              key={s.id}
              className={`admin-row ${selected?.id === s.id ? 'admin-row-active' : ''}`}
              onClick={() => setSelected(s)}
            >
              <div className="admin-row-top">
                <span className="admin-row-name">
                  {s.firstName} {s.lastName}
                </span>
                <span className={`admin-badge ${STATUS_COLORS[s.status]}`}>
                  {STATUS_LABELS[s.status]}
                </span>
              </div>
              <div className="admin-row-meta">
                {s.goal} · {s.mileage}
              </div>
              <div className="admin-row-date">
                {new Date(s.createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="admin-detail">
          {!selected ? (
            <div className="admin-detail-empty">
              <p>Select an athlete to view their full application</p>
            </div>
          ) : (
            <div>
              <div className="detail-header">
                <div>
                  <h2 className="detail-name">
                    {selected.firstName} {selected.lastName}
                  </h2>
                  <a href={`mailto:${selected.email}`} className="detail-email">
                    {selected.email}
                  </a>
                </div>
                <select
                  className="detail-status-select"
                  value={selected.status}
                  disabled={updatingId === selected.id}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="onboarded">Onboarded</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              <div className="detail-sections">
                <DetailSection title="About">
                  <DetailRow label="Age" value={selected.age} />
                  <DetailRow label="Location" value={selected.location} />
                </DetailSection>

                <DetailSection title="Running background">
                  <DetailRow label="Weekly mileage" value={selected.mileage} />
                  <DetailRow label="Years running" value={selected.yearsRunning} />
                  <DetailRow label="Recent race" value={selected.recentRace} />
                  <DetailRow label="Injuries" value={selected.injuries} />
                </DetailSection>

                <DetailSection title="Goals">
                  <DetailRow label="Primary goal" value={selected.goal} />
                  <DetailRow label="Target race" value={selected.targetRace} />
                  <DetailRow label="Biggest challenge" value={selected.challenge} />
                </DetailSection>

                <DetailSection title="Logistics">
                  <DetailRow label="Days/week" value={selected.daysPerWeek} />
                  <DetailRow label="Comms preference" value={selected.commsPref} />
                  <DetailRow label="Budget" value={selected.budget} />
                  <DetailRow label="Notes" value={selected.notes} />
                </DetailSection>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

// ── Small reusable sub-components ─────────────────────────────
function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="detail-section">
      <h3 className="detail-section-title">{title}</h3>
      <div className="detail-rows">{children}</div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="detail-row">
      <span className="detail-row-label">{label}</span>
      <span className="detail-row-value">{value ?? '—'}</span>
    </div>
  )
}
