import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const VALID_STATUSES = ['new', 'contacted', 'onboarded', 'declined']

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json()

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updated = await prisma.athleteIntake.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ success: true, id: updated.id })
  } catch (error) {
    console.error('[admin status PATCH]', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
