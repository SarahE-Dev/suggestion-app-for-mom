'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function AdminWrapper({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/admin/login")
    return null
  }

  return <>{children}</>
}