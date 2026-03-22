import { prisma } from '@/lib/db'
import AdminClient from './AdminClient'

// This page is a server component — it fetches data before rendering
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const enteredPassword = params.password ?? ''
  const isAuthed = enteredPassword === process.env.ADMIN_PASSWORD

  // Only query the DB if the password is correct
  const submissions = isAuthed
    ? await prisma.athleteIntake.findMany({
        orderBy: { createdAt: 'desc' },
      })
    : []

  return <AdminClient isAuthed={isAuthed} submissions={submissions} />
}
