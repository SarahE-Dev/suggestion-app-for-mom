'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function AdminWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    router.push("/admin/login")
    return null
  }

  return <>{children}</>
}

