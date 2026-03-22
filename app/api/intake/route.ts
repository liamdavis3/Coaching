import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendIntakeNotification } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Basic validation — make sure required fields exist
    const required = ['firstName', 'lastName', 'email', 'age', 'location', 'mileage', 'yearsRunning', 'goal', 'daysPerWeek', 'commsPref', 'budget']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Save to database
    const submission = await prisma.athleteIntake.create({
      data: {
        firstName:   body.firstName,
        lastName:    body.lastName,
        email:       body.email,
        age:         body.age,
        location:    body.location,
        mileage:     body.mileage,
        yearsRunning: body.yearsRunning,
        recentRace:  body.recentRace  || null,
        injuries:    body.injuries    || null,
        goal:        body.goal,
        targetRace:  body.targetRace  || null,
        challenge:   body.challenge   || null,
        daysPerWeek: body.daysPerWeek,
        commsPref:   body.commsPref,
        budget:      body.budget,
        notes:       body.notes       || null,
      },
    })

    // Email you the new submission
    await sendIntakeNotification(submission)

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 })
  } catch (error) {
    console.error('[intake POST]', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
