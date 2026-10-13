import { useId } from "react"
import { useTranslation } from "react-i18next"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { i18nNamespace } from "@/i18n"

/** "Rows per page" select. */
export function PageSizeSelect({
  label,
  options,
  value,
  onChange,
}: {
  label?: string
  options: number[]
  value: number
  onChange: (value: number) => void
}) {
  const { t } = useTranslation(i18nNamespace)
  const selectId = useId()

  return (
    <Field orientation="horizontal" className="w-fit gap-4">
      <FieldLabel className="text-sm font-medium" htmlFor={selectId}>
        {label ?? t("ui.pagination.rowsPerPage")}
      </FieldLabel>
      <Select
        value={value.toString()}
        onValueChange={(next) => onChange(Number(next))}
      >
        <SelectTrigger
          className="w-22.5 border-foreground/15 data-[size=default]:h-9"
          id={selectId}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          align="start"
          alignItemWithTrigger={false}
          className="max-h-64 w-auto min-w-(--anchor-width)"
        >
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
