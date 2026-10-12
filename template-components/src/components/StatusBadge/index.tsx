import { Badge, BadgeDot } from "@/components/ui/badge"
import { type Tone, toneOf } from "@/lib/status"

/**
 * Shows the status as the backend sent it; only the colour is derived from the
 * status guide. Pass `tone` for a status the guide does not list.
 */
export const StatusBadge = ({
  status,
  tone,
  className,
}: {
  status: string
  tone?: Tone
  className?: string
}) => (
  <Badge tone={tone ?? toneOf(status)} className={className}>
    <BadgeDot />
    {status}
  </Badge>
)
