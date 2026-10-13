import type { ComponentProps } from "react"

import { StatusBadge } from "@/components/StatusBadge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { cn } from "@/lib/utils"

/*
 * The dark page header, built from shadcn parts: Card for the panel, Item +
 * Avatar for the identity. Layout and styling only - no data, routing or
 * translations - so any micro-frontend can assemble the header it needs.
 *
 *   <InfoHeader>
 *     <InfoHeaderAside><InfoHeaderStatus status={status} /></InfoHeaderAside>
 *     <InfoHeaderBreadcrumbs><Breadcrumbs crumbs={crumbs} /></InfoHeaderBreadcrumbs>
 *     <InfoHeaderBody>
 *       <InfoHeaderIdentity>
 *         <InfoHeaderAvatar name={name} />
 *         <InfoHeaderText>
 *           <InfoHeaderTitle>{name}</InfoHeaderTitle>
 *           <InfoHeaderSubtitle><IdCard />{t("egn")}: {egn}</InfoHeaderSubtitle>
 *         </InfoHeaderText>
 *       </InfoHeaderIdentity>
 *     </InfoHeaderBody>
 *   </InfoHeader>
 */

function InfoHeader({ className, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card
      data-slot="info-header"
      className={cn(
        "relative min-h-35 gap-0 rounded-card bg-iris-bg-dark py-4 pr-4 pl-5 text-header-text shadow-sm ring-0",
        className
      )}
      {...props}
    />
  )
}

/** Top-right corner: the status and any other header badges. */
function InfoHeaderAside({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="info-header-aside"
      className={cn("absolute top-3 right-4 flex gap-2", className)}
      {...props}
    />
  )
}

/** The status pill shown in the aside - the regular StatusBadge. */
function InfoHeaderStatus(props: ComponentProps<typeof StatusBadge>) {
  return <StatusBadge {...props} />
}

function InfoHeaderBreadcrumbs({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="info-header-breadcrumbs"
      className={cn("min-h-4 pt-5", className)}
      {...props}
    />
  )
}

/** Bottom row: the identity on the left, alerts on the right. */
function InfoHeaderBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="info-header-body"
      className={cn("mt-5 flex items-end justify-between gap-3", className)}
      {...props}
    />
  )
}

/** Avatar and text side by side - shadcn's Item without its padding and border. */
function InfoHeaderIdentity({
  className,
  ...props
}: ComponentProps<typeof Item>) {
  return (
    <Item
      className={cn("w-auto min-w-0 flex-nowrap gap-5 border-0 p-0", className)}
      {...props}
    />
  )
}

/** shadcn's Avatar as a rounded square; shows the first letter of `name` unless children are given. */
function InfoHeaderAvatar({
  name,
  className,
  children,
  ...props
}: ComponentProps<typeof Avatar> & { name?: string | null }) {
  return (
    // Centered next to the text - shadcn's Item would align it to the top.
    <ItemMedia className="group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-center">
      <Avatar
        size="lg"
        className={cn(
          "rounded-md shadow-sm after:hidden data-[size=lg]:size-10.5",
          className
        )}
        {...props}
      >
        <AvatarFallback className="rounded-md bg-avatar text-2xl font-semibold tracking-tighter text-avatar-foreground">
          {children ?? name?.trim().charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </ItemMedia>
  )
}

/** Holds the title and subtitle; keeps its height while they load. */
function InfoHeaderText({
  className,
  ...props
}: ComponentProps<typeof ItemContent>) {
  return (
    <ItemContent
      className={cn("min-h-12 min-w-0 justify-center gap-0.5", className)}
      {...props}
    />
  )
}

/**
 * One line, cut with an ellipsis. shadcn's ItemTitle is `flex`, which turns
 * its own line-clamp off, so the text truncates in an inner span.
 */
function InfoHeaderTitle({
  className,
  children,
  ...props
}: ComponentProps<typeof ItemTitle>) {
  return (
    <ItemTitle
      className={cn(
        "w-full text-xl leading-6 font-semibold text-header-foreground",
        className
      )}
      {...props}
    >
      <span className="min-w-0 truncate">{children}</span>
    </ItemTitle>
  )
}

/**
 * One line, cut with an ellipsis (`line-clamp-1` - no flex, which would turn
 * it off). Put an icon before the text as a child: `<InfoHeaderSubtitle><IdCard />...`.
 */
function InfoHeaderSubtitle({
  className,
  ...props
}: ComponentProps<typeof ItemDescription>) {
  return (
    <ItemDescription
      className={cn(
        "line-clamp-1 text-xs font-medium text-header-foreground [&_svg]:mr-1.5 [&_svg]:inline [&_svg]:size-3.5 [&_svg]:align-text-bottom",
        className
      )}
      {...props}
    />
  )
}

/** Right side of the body, e.g. the design's "active issue" pills. */
function InfoHeaderAlerts({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="info-header-alerts"
      className={cn("flex flex-col items-end", className)}
      {...props}
    />
  )
}

export {
  InfoHeader,
  InfoHeaderAlerts,
  InfoHeaderAside,
  InfoHeaderAvatar,
  InfoHeaderBody,
  InfoHeaderBreadcrumbs,
  InfoHeaderIdentity,
  InfoHeaderStatus,
  InfoHeaderSubtitle,
  InfoHeaderText,
  InfoHeaderTitle,
}
