import i18n from "i18next"

/**
 * Texts of the shared UI components (pagination, empty state), kept in their
 * own namespace so the components work in any micro-frontend - not only where
 * this remote's `dth` namespace is registered.
 */
export const uiNamespace = "iris-ui" as const

const bg = {
  pagination: {
    navigation: "Навигация по страници",
    currentPage: "Страница {{page}} от {{totalPages}}",
    firstPage: "Първа страница",
    previousPage: "Предишна страница",
    nextPage: "Следваща страница",
    lastPage: "Последна страница",
    rowsPerPage: "Редове на страница",
  },
  emptyState: {
    noData: "Няма намерени данни",
  },
  modal: {
    close: "Затвори",
  },
  rowActions: {
    more: "Още действия",
  },
  breadcrumbs: {
    label: "Навигационна пътека",
  },
}

const en: typeof bg = {
  pagination: {
    navigation: "Page navigation",
    currentPage: "Page {{page}} of {{totalPages}}",
    firstPage: "First page",
    previousPage: "Previous page",
    nextPage: "Next page",
    lastPage: "Last page",
    rowsPerPage: "Rows per page",
  },
  emptyState: {
    noData: "No data found",
  },
  modal: {
    close: "Close",
  },
  rowActions: {
    more: "More actions",
  },
  breadcrumbs: {
    label: "Breadcrumb",
  },
}

// Same ordering concern as src/i18n.ts: federated, the host has initialised
// i18next already; standalone, `init()` may still be pending.
const addBundles = () => {
  if (!i18n.hasResourceBundle("bg", uiNamespace)) {
    i18n.addResourceBundle("bg", uiNamespace, bg, true, true)
  }
  if (!i18n.hasResourceBundle("en", uiNamespace)) {
    i18n.addResourceBundle("en", uiNamespace, en, true, true)
  }
}

if (i18n.isInitialized) {
  addBundles()
} else {
  i18n.on("initialized", addBundles)
}
