import { Resend } from 'resend'
import type { AthleteIntake } from '@prisma/client'

const resend = new Resend(process.env.RESEND_API_KEY)

// Replace with your real email address
const COACH_EMAIL = 'liamtdavis14@gmail.com'

export async function sendIntakeNotification(submission: AthleteIntake) {
  await resend.emails.send({
    from: 'Liam Davis Coaching <onboarding@resend.dev>', // use resend's default until you add a domain
    to: COACH_EMAIL,
    subject: `New application from ${submission.firstName} ${submission.lastName}`,
    html: `
      <h2>New Athlete Application</h2>
      <p><strong>Submitted:</strong> ${new Date(submission.createdAt).toLocaleString()}</p>

      <h3>About</h3>
      <table>
        <tr><td><strong>Name</strong></td><td>${submission.firstName} ${submission.lastName}</td></tr>
        <tr><td><strong>Email</strong></td><td>${submission.email}</td></tr>
        <tr><td><strong>Age</strong></td><td>${submission.age}</td></tr>
        <tr><td><strong>Location</strong></td><td>${submission.location}</td></tr>
      </table>

      <h3>Running Background</h3>
      <table>
        <tr><td><strong>Weekly mileage</strong></td><td>${submission.mileage}</td></tr>
        <tr><td><strong>Years running</strong></td><td>${submission.yearsRunning}</td></tr>
        <tr><td><strong>Recent race</strong></td><td>${submission.recentRace ?? '—'}</td></tr>
        <tr><td><strong>Injuries</strong></td><td>${submission.injuries ?? '—'}</td></tr>
      </table>

      <h3>Goals</h3>
      <table>
        <tr><td><strong>Primary goal</strong></td><td>${submission.goal}</td></tr>
        <tr><td><strong>Target race</strong></td><td>${submission.targetRace ?? '—'}</td></tr>
        <tr><td><strong>Biggest challenge</strong></td><td>${submission.challenge ?? '—'}</td></tr>
      </table>

      <h3>Logistics</h3>
      <table>
        <tr><td><strong>Days/week</strong></td><td>${submission.daysPerWeek}</td></tr>
        <tr><td><strong>Comms preference</strong></td><td>${submission.commsPref}</td></tr>
        <tr><td><strong>Budget</strong></td><td>${submission.budget}</td></tr>
        <tr><td><strong>Notes</strong></td><td>${submission.notes ?? '—'}</td></tr>
      </table>

      <br />
      <p>Log in to your admin dashboard to update this athlete's status.</p>
    `,
  })
}
