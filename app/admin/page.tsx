import { requireAuth } from '@/lib/auth'
import { AdminDashboard } from './admin-dashboard'
import { AdminWrapper } from './admin-wrapper'

export default async function AdminPage() {
  
  await requireAuth()

  return (<AdminWrapper>
      <AdminDashboard />
    </AdminWrapper>)
}





