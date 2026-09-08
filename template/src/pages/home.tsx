import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/toast"
import { i18nNamespace } from "@/i18n"

// Called from module scope rather than from a component, to prove the manager
// works outside React - this is what a TanStack Query `onError` would do.
function reportOutsideReact(title: string, description: string) {
  toast.add({ type: "warning", title, description })
}

const features = tableFeatures({})
const helper = createColumnHelper<typeof features, { id: number }>()
const columns = helper.columns([helper.accessor("id", {})])
const data: { id: number }[] = []

export default function HomePage() {
  const { t } = useTranslation(i18nNamespace)

  useTable({ features, columns, data })

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">{t("home.title")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("home.toast.title")}</CardTitle>
          <CardDescription>{t("home.toast.description")}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-2">
          <Button
            onClick={() =>
              toast.add({
                type: "success",
                title: t("home.toast.successTitle"),
                description: t("home.toast.successDescription"),
              })
            }
          >
            {t("home.toast.success")}
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              toast.add({
                type: "error",
                title: t("home.toast.errorTitle"),
                description: t("home.toast.errorDescription"),
              })
            }
          >
            {t("home.toast.error")}
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              reportOutsideReact(
                t("home.toast.outsideTitle"),
                t("home.toast.outsideDescription")
              )
            }
          >
            {t("home.toast.outside")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
