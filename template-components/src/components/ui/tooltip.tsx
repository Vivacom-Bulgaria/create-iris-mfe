import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// The popup and its arrow share --tooltip-bg and --tooltip-border, so they
// always match. A one-off colour needs no new variant:
// className="[--tooltip-bg:var(--chart-2)]" or style={{ "--tooltip-bg": "#2563eb" }}.
const tooltipVariants = cva("[--tooltip-border:transparent]", {
  variants: {
    variant: {
      default:
        "[--tooltip-bg:var(--primary)] [--tooltip-fg:var(--primary-foreground)]",
      dark: "[--tooltip-bg:var(--iris-bg-dark)] [--tooltip-fg:white]",
      info: "[--tooltip-bg:var(--info)] [--tooltip-fg:var(--info-foreground)]",
      destructive: "[--tooltip-bg:var(--destructive)] [--tooltip-fg:white]",
      light:
        "shadow-md [--tooltip-bg:var(--popover)] [--tooltip-border:color-mix(in_oklab,var(--foreground)_10%,transparent)] [--tooltip-fg:var(--popover-foreground)]",
    },
  },
  defaultVariants: { variant: "default" },
})

type TooltipVariant = NonNullable<
  VariantProps<typeof tooltipVariants>["variant"]
>

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider delay={delay} {...props} />
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  variant,
  showArrow = true,
  arrowClassName,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<TooltipPrimitive.Positioner.Props, "align" | "side" | "sideOffset"> &
  VariantProps<typeof tooltipVariants> & {
    /** The arrow sits on `side` and points at the trigger. */
    showArrow?: boolean
    arrowClassName?: string
  }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 w-fit origin-(--transform-origin) rounded-md bg-(--tooltip-bg) px-3 py-1.5 text-xs text-balance text-(--tooltip-fg) ring-1 ring-(--tooltip-border) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            tooltipVariants({ variant }),
            className
          )}
          {...props}
        >
          {/* Above the arrow, so an arrow of any size never covers the text. */}
          <span className="relative z-10">{children}</span>
          {showArrow ? (
            <TooltipPrimitive.Arrow
              className={cn(
                // The border goes only on the two outer edges - the ones facing
                // the trigger - so the arrow joins the popup's ring seamlessly.
                "z-0 size-2.5 rotate-45 rounded-[2px] border-(--tooltip-border) bg-(--tooltip-bg) data-[side=bottom]:-top-1 data-[side=bottom]:border-t data-[side=bottom]:border-l data-[side=left]:-right-1 data-[side=left]:border-t data-[side=left]:border-r data-[side=right]:-left-1 data-[side=right]:border-b data-[side=right]:border-l data-[side=top]:-bottom-1 data-[side=top]:border-r data-[side=top]:border-b",
                arrowClassName
              )}
            />
          ) : null}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type TooltipVariant,
  tooltipVariants,
}
