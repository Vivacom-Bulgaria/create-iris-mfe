import { ArrowRight } from "lucide-react"
import { Link } from "react-router"

import { cn } from "@/lib/utils"

import { INTERACTIVE_VALUE_CLASS } from "./constants"
import type { DetailRow } from "./index"

const isEmptyValue = (value: DetailRow["value"]) =>
  value === null || value === undefined || value === ""

const Arrow = () => (
  <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
)

/**
 * One value: an in-app link (`to`), an external link (`href`), a button
 * (`onSelect`) or plain text. Empty values always render as a muted "-" and
 * are never interactive.
 */
export function DetailValue({ row }: { row: DetailRow }) {
  if (isEmptyValue(row.value)) {
    return <span className="text-muted-foreground">-</span>
  }

  const content = (
    <>
      {row.value}
      {row.arrow ? <Arrow /> : null}
    </>
  )

  if (row.to !== undefined) {
    // Relative targets only - an absolute path escapes the host's route prefix.
    return (
      <Link to={row.to} className={INTERACTIVE_VALUE_CLASS}>
        {content}
      </Link>
    )
  }

  if (row.href) {
    return (
      <a
        href={row.href}
        target="_blank"
        rel="noreferrer"
        className={INTERACTIVE_VALUE_CLASS}
      >
        {content}
      </a>
    )
  }

  if (row.onSelect) {
    return (
      <button
        type="button"
        onClick={row.onSelect}
        className={INTERACTIVE_VALUE_CLASS}
      >
        {content}
      </button>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium text-value-foreground",
        row.underline && "underline underline-offset-4"
      )}
    >
      {content}
    </span>
  )
}
