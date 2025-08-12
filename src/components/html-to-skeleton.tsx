"use client"

import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface HtmlToSkeletonProps {
  domTree: Element | HTMLElement
  className?: string
  detailed?: boolean
}

const SHADCN_COMPONENT_MAP: Record<string, (element: Element, detailed: boolean) => React.ReactNode> = {
  // Button components
  button: (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-10 w-24", getResponsiveClasses(el))} />
  },

  // Card components
  card: (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("rounded-lg p-6", getResponsiveClasses(el))} />
  },
  "card-header": (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-16 w-full mb-4", getResponsiveClasses(el))} />
  },
  "card-content": (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-32 w-full", getResponsiveClasses(el))} />
  },
  "card-footer": (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-12 w-full mt-4", getResponsiveClasses(el))} />
  },

  // Input components
  input: (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-10 w-full", getResponsiveClasses(el))} />
  },
  textarea: (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-24 w-full", getResponsiveClasses(el))} />
  },
  select: (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-10 w-full", getResponsiveClasses(el))} />
  },

  // Avatar components
  avatar: (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-10 w-10 rounded-full", getResponsiveClasses(el))} />
  },

  // Badge components
  badge: (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-6 w-16 rounded-full", getResponsiveClasses(el))} />
  },

  // Alert components
  alert: (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-16 w-full rounded-lg", getResponsiveClasses(el))} />
  },

  // Table components
  table: (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-64 w-full", getResponsiveClasses(el))} />
  },
  "table-row": (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-12 w-full mb-2", getResponsiveClasses(el))} />
  },
  "table-cell": (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-8 flex-1 mr-2", getResponsiveClasses(el))} />
  },

  // Navigation components
  nav: (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-16 w-full", getResponsiveClasses(el))} />
  },

  breadcrumb: (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-6 w-48", getResponsiveClasses(el))} />
  },

  // Dialog components
  dialog: (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-96 w-96 rounded-lg", getResponsiveClasses(el))} />
  },
  "dialog-header": (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-12 w-full mb-4", getResponsiveClasses(el))} />
  },
  "dialog-content": (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-48 w-full", getResponsiveClasses(el))} />
  },
  "dialog-footer": (el, detailed) => {
    if (detailed) {
      const dims = getElementDimensions(el)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton className={getResponsiveClasses(el)} style={style} />
    }
    return <Skeleton className={cn("h-12 w-full mt-4", getResponsiveClasses(el))} />
  },
}

function getResponsiveClasses(element: Element): string {
  const classList = Array.from(element.classList)
  const responsiveClasses = classList.filter(
    (cls) =>
      cls.startsWith("sm:") ||
      cls.startsWith("md:") ||
      cls.startsWith("lg:") ||
      cls.startsWith("xl:") ||
      cls.startsWith("2xl:") ||
      cls.includes("w-") ||
      cls.includes("h-") ||
      cls.includes("max-w") ||
      cls.includes("min-w") ||
      cls.includes("flex") ||
      cls.includes("grid"),
  )
  return responsiveClasses.join(" ")
}

function detectShadcnComponent(element: Element): string | null {
  const classList = Array.from(element.classList)
  const tagName = element.tagName.toLowerCase()

  for (const cls of classList) {
    if (cls.includes("card") && !cls.includes("card-")) return "card"
    if (cls.includes("card-header")) return "card-header"
    if (cls.includes("card-content")) return "card-content"
    if (cls.includes("card-footer")) return "card-footer"
    if (cls.includes("avatar")) return "avatar"
    if (cls.includes("badge")) return "badge"
    if (cls.includes("alert")) return "alert"
    if (cls.includes("dialog") && !cls.includes("dialog-")) return "dialog"
    if (cls.includes("dialog-header")) return "dialog-header"
    if (cls.includes("dialog-content")) return "dialog-content"
    if (cls.includes("dialog-footer")) return "dialog-footer"
  }

  if (tagName === "button") return "button"
  if (tagName === "input") return "input"
  if (tagName === "textarea") return "textarea"
  if (tagName === "select") return "select"
  if (tagName === "table") return "table"
  if (tagName === "tr") return "table-row"
  if (tagName === "td" || tagName === "th") return "table-cell"
  if (tagName === "nav") return "nav"

  return null
}

function getElementDimensions(element: Element) {
  const rect = element.getBoundingClientRect()
  const computedStyle = window.getComputedStyle(element)

  return {
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    paddingTop: Number.parseInt(computedStyle.paddingTop) || 0,
    paddingRight: Number.parseInt(computedStyle.paddingRight) || 0,
    paddingBottom: Number.parseInt(computedStyle.paddingBottom) || 0,
    paddingLeft: Number.parseInt(computedStyle.paddingLeft) || 0,
    marginTop: Number.parseInt(computedStyle.marginTop) || 0,
    marginRight: Number.parseInt(computedStyle.marginRight) || 0,
    marginBottom: Number.parseInt(computedStyle.marginBottom) || 0,
    marginLeft: Number.parseInt(computedStyle.marginLeft) || 0,
    borderRadius: computedStyle.borderRadius || "0px",
    display: computedStyle.display,
    flexDirection: computedStyle.flexDirection,
    gap: Number.parseInt(computedStyle.gap) || 0,
    gridTemplateColumns: computedStyle.gridTemplateColumns,
    gridGap: Number.parseInt(computedStyle.gridGap) || 0,
  }
}

function getDimensionStyles(dimensions: ReturnType<typeof getElementDimensions>, detailed: boolean) {
  const style: React.CSSProperties = {
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    padding: `${dimensions.paddingTop}px ${dimensions.paddingRight}px ${dimensions.paddingBottom}px ${dimensions.paddingLeft}px`,
    margin: `${dimensions.marginTop}px ${dimensions.marginRight}px ${dimensions.marginBottom}px ${dimensions.marginLeft}px`,
    borderRadius: dimensions.borderRadius,
    display: dimensions.display,
    flexDirection: dimensions.flexDirection as any,
    gap: dimensions.gap ? `${dimensions.gap}px` : undefined,
    gridTemplateColumns: dimensions.gridTemplateColumns !== "none" ? dimensions.gridTemplateColumns : undefined,
  }

  return { style }
}

function generateTextSkeleton(element: Element, detailed: boolean): React.ReactNode {
  const textContent = element.textContent?.trim() || ""
  const words = textContent.split(" ").length

  if (words === 0) return null

  if (detailed) {
    const dims = getElementDimensions(element)
    const { style } = getDimensionStyles(dims, true)
    return <Skeleton style={style} className={getResponsiveClasses(element)} />
  }

  const tagName = element.tagName.toLowerCase()
  let height = "h-4"
  let width = "w-24"

  if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)) {
    height = tagName === "h1" ? "h-8" : tagName === "h2" ? "h-7" : "h-6"
    width = words > 5 ? "w-64" : words > 3 ? "w-48" : "w-32"
  } else if (tagName === "p") {
    height = "h-4"
    width = words > 10 ? "w-full" : words > 5 ? "w-3/4" : "w-1/2"
  } else {
    width = words > 8 ? "w-48" : words > 4 ? "w-32" : "w-24"
  }

  return <Skeleton className={cn(height, width, getResponsiveClasses(element))} />
}

function generateContainerSkeleton(element: Element, children: React.ReactNode[], detailed: boolean): React.ReactNode {
  const tagName = element.tagName.toLowerCase()
  const classList = Array.from(element.classList)
  const responsiveClasses = getResponsiveClasses(element)

  if (detailed) {
    const dims = getElementDimensions(element)
    const containerStyle: React.CSSProperties = {
      width: `${dims.width}px`,
      height: `${dims.height}px`,
      padding: `${dims.paddingTop}px ${dims.paddingRight}px ${dims.paddingBottom}px ${dims.paddingLeft}px`,
      margin: `${dims.marginTop}px ${dims.marginRight}px ${dims.marginBottom}px ${dims.marginLeft}px`,
      borderRadius: dims.borderRadius,
      display: dims.display,
      flexDirection: dims.flexDirection as any,
      gap: dims.gap ? `${dims.gap}px` : undefined,
      gridTemplateColumns: dims.gridTemplateColumns !== "none" ? dims.gridTemplateColumns : undefined,
    }

    return (
      <div style={containerStyle} className={responsiveClasses}>
        {children}
      </div>
    )
  }

  if (["div", "section", "article", "main", "aside"].includes(tagName)) {
    const isFlexContainer = classList.some((cls) => cls.includes("flex"))
    const isGridContainer = classList.some((cls) => cls.includes("grid"))

    if (isFlexContainer) {
      return <div className={cn("flex gap-4", responsiveClasses)}>{children}</div>
    } else if (isGridContainer) {
      return <div className={cn("grid gap-4", responsiveClasses)}>{children}</div>
    } else {
      return <div className={cn("space-y-4", responsiveClasses)}>{children}</div>
    }
  }

  if (tagName === "ul" || tagName === "ol") {
    return <div className={cn("space-y-2", responsiveClasses)}>{children}</div>
  }

  if (tagName === "li") {
    return (
      <div className={cn("flex items-center gap-2", responsiveClasses)}>
        <Skeleton className="h-2 w-2 rounded-full" />
        {children}
      </div>
    )
  }

  return <div className={cn("space-y-2", responsiveClasses)}>{children}</div>
}

function convertElementToSkeleton(element: Element, key: string, detailed: boolean, currentDepth = 0): React.ReactNode {
  const maxDepth = detailed ? 3 : 1

  const componentType = detectShadcnComponent(element)
  if (componentType && SHADCN_COMPONENT_MAP[componentType]) {
    return React.cloneElement(SHADCN_COMPONENT_MAP[componentType](element, detailed) as React.ReactElement, { key })
  }

  const children: React.ReactNode[] = []
  const childElements = Array.from(element.children)

  if (childElements.length > 0 && currentDepth < maxDepth) {
    childElements.forEach((child, index) => {
      const childSkeleton = convertElementToSkeleton(child, `${key}-child-${index}`, detailed, currentDepth + 1)
      if (childSkeleton) {
        children.push(childSkeleton)
      }
    })
  } else if (element.textContent?.trim()) {
    const textSkeleton = generateTextSkeleton(element, detailed)
    if (textSkeleton) {
      children.push(textSkeleton)
    }
  }

  if (children.length === 0) {
    const tagName = element.tagName.toLowerCase()

    if (detailed) {
      const dims = getElementDimensions(element)
      const { style } = getDimensionStyles(dims, true)
      return <Skeleton key={key} style={style} className={getResponsiveClasses(element)} />
    }

    if (["img", "video"].includes(tagName)) {
      return <Skeleton key={key} className={cn("h-48 w-full", getResponsiveClasses(element))} />
    } else if (tagName === "hr") {
      return <Skeleton key={key} className={cn("h-px w-full", getResponsiveClasses(element))} />
    } else {
      return <Skeleton key={key} className={cn("h-4 w-24", getResponsiveClasses(element))} />
    }
  }

  return React.cloneElement(generateContainerSkeleton(element, children, detailed) as React.ReactElement, { key })
}

export function HtmlToSkeleton({ domTree, className, detailed = true }: HtmlToSkeletonProps) {
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [domTree, detailed])

  if (!isReady) {
    return (
      <div className={cn("animate-pulse", className)}>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const skeletonTree = convertElementToSkeleton(domTree, "root", detailed, 0)

  return <div className={cn("animate-pulse", className)}>{skeletonTree}</div>
}

export default HtmlToSkeleton
