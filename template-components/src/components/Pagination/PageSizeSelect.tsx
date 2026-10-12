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
import { uiNamespace } from "@/lib/ui-i18n"

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
  const { t } = useTranslation(uiNamespace)
  const selectId = useId()

  return (
    <Field orientation="horizontal" className="w-fit">
      <FieldLabel className="text-sm font-semibold" htmlFor={selectId}>
        {label ?? t("pagination.rowsPerPage")}
      </FieldLabel>
      <Select
        value={value.toString()}
        onValueChange={(next) => onChange(Number(next))}
      >
        <SelectTrigger className="w-20" id={selectId}>
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
