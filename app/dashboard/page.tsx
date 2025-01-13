import { ClientDashboard } from '@/components/ClientDashboard/ClientDashboard'

export default function DashboardPage() {
  // In a real application, you would get the clientId from the authenticated user
  const clientId = 1

  return (
    <div className="container mx-auto py-10">
      <ClientDashboard clientId={clientId} />
    </div>
  )
}

