import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        verified:
          "border-transparent bg-verified text-verified-foreground hover:bg-verified/80 shadow-trust",
        pending:
          "border-transparent bg-pending text-pending-foreground hover:bg-pending/80",
        bronze:
          "border-transparent bg-[#CD7F32] text-white hover:bg-[#CD7F32]/90",
        silver:
          "border-transparent bg-gray-400 text-white hover:bg-gray-400/90",
        gold:
          "border-transparent bg-yellow-500 text-yellow-950 hover:bg-yellow-500/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
