/** Varied placeholder widths, so skeleton rows do not look like a barcode. */
export const SKELETON_WIDTHS = ["w-32", "w-24", "w-40", "w-28", "w-36", "w-20"]

export const skeletonWidth = (index: number) =>
  SKELETON_WIDTHS[index % SKELETON_WIDTHS.length]
