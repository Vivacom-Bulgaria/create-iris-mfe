import type { VariantProps } from "class-variance-authority"

import type { badgeVariants } from "@/components/ui/badge"

/** The tones `ui/badge` actually offers - no parallel palette here. */
export type Tone = NonNullable<VariantProps<typeof badgeVariants>["tone"]>

/*
 * Statuses are shown exactly as the backend sends them - never translated.
 * Values are the raw status normalised (trimmed, lower-case); services send
 * English, Bulgarian or system values.
 */
export const Status = {
  // Success / Active
  Active: "active",
  ServiceActive: "активна", // service, app, group issue
  DeviceActive: "активен", // device (STB)
  Completed: "приключен", // order / request done and closed
  Successful: "успешна", // action finished successfully
  Redirected: "redirected",
  Ready: "ready", // EON Mobile device

  // In progress / Pending
  Processing: "в обработка",
  Scheduled: "планиран", // job ticket scheduled
  JobNew: "нов", // job ticket not yet scheduled
  InWork: "работи", // technician working on the job ticket
  RedirectionInProgress: "redirection_in_progress",
  // Service status from Siebel - Bulgarian and English
  Reinstalling: "в процес на възстановяване",
  ReinstallingEn: "reinstallation in progress",
  SuspensionPending: "в процес на ограничаване",
  SuspensionPendingEn: "suspension pending",
  ReactivationPending: "в процес на реактивация",
  ReactivationPendingEn: "reactivation pending",
  ResettingPin: "нулиране на pin",
  ResettingPinEn: "resetting pin",

  // New / Assigned
  IssueNew: "нова", // issue not yet taken
  Assigned: "назначен", // job ticket assigned to a technician

  // Info
  NotRedirected: "not redirected",
  NotRedirectedSystem: "not_redirected",

  // Neutral / Inactive
  Inactive: "inactive",
  ServiceInactive: "неактивна",
  DeviceInactive: "неактивен",
  Closed: "закрита", // service closed for good
  Returned: "върнат", // job ticket returned with a result
  Cancelled: "анулиран", // not in the guide

  // Error / Suspended
  Suspended: "временно изключен",
  Failed: "неуспешна",
  SuspendedEn: "suspended", // Siebel
  Terminated: "закрит", // Siebel service status
  TerminatedEn: "terminated",
} as const

export type Status = (typeof Status)[keyof typeof Status]

const KNOWN_STATUSES = new Set<string>(Object.values(Status))

const isKnownStatus = (value: string): value is Status =>
  KNOWN_STATUSES.has(value)

export const parseStatus = (raw: string | null | undefined) => {
  const value = raw?.trim().toLowerCase()
  return value && isKnownStatus(value) ? value : undefined
}

export const isStatus = (raw: string | null | undefined, status: Status) =>
  parseStatus(raw) === status

/**
 * Badge colour per status, following the status guide. Exhaustive: a status
 * added above without a tone fails to compile.
 */
const TONE_BY_STATUS: Record<Status, Tone> = {
  [Status.Active]: "success",
  [Status.ServiceActive]: "success",
  [Status.DeviceActive]: "success",
  [Status.Completed]: "success",
  [Status.Successful]: "success",
  [Status.Redirected]: "success",
  [Status.Ready]: "success",

  [Status.Processing]: "pending",
  [Status.Scheduled]: "pending",
  [Status.JobNew]: "pending",
  [Status.InWork]: "pending",
  [Status.RedirectionInProgress]: "pending",
  [Status.Reinstalling]: "pending",
  [Status.ReinstallingEn]: "pending",
  [Status.SuspensionPending]: "pending",
  [Status.SuspensionPendingEn]: "pending",
  [Status.ReactivationPending]: "pending",
  [Status.ReactivationPendingEn]: "pending",
  [Status.ResettingPin]: "pending",
  [Status.ResettingPinEn]: "pending",

  [Status.IssueNew]: "assigned",
  [Status.Assigned]: "assigned",

  [Status.NotRedirected]: "info",
  [Status.NotRedirectedSystem]: "info",

  [Status.Inactive]: "neutral",
  [Status.ServiceInactive]: "neutral",
  [Status.DeviceInactive]: "neutral",
  [Status.Closed]: "neutral",
  [Status.Returned]: "neutral",
  [Status.Cancelled]: "neutral",

  [Status.Suspended]: "error",
  [Status.Failed]: "error",
  [Status.SuspendedEn]: "error",
  [Status.Terminated]: "error",
  [Status.TerminatedEn]: "error",
}

export const toneOf = (raw: string): Tone => {
  const status = parseStatus(raw)
  return status ? TONE_BY_STATUS[status] : "neutral"
}
