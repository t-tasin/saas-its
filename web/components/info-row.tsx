import type React from "react"
interface InfoRowProps {
  label: string
  children: React.ReactNode
}

export function InfoRow({ label, children }: InfoRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b last:border-0">
      <dt className="font-medium text-sm text-muted-foreground min-w-[140px]">{label}</dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  )
}
