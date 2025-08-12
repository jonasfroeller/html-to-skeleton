"use client"

import React from "react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import CodeMirror from "@uiw/react-codemirror"
import { html as htmlLang } from "@codemirror/lang-html"
import { javascript } from "@codemirror/lang-javascript"
import { formatCode } from "@/lib/format"

interface HtmlToSkeletonConverterProps {
  htmlInput: string
  maxDepth?: number
  visibleOnly?: boolean
  codeFormat?: "html" | "jsx"
  componentName?: string
  showCode?: boolean
  editorHeight?: string
  className?: string
  onCodeUpdate?: (code: string) => void
}

export function HtmlToSkeletonConverter({
  htmlInput,
  maxDepth = 3,
  visibleOnly = false,
  codeFormat = "html",
  componentName = "Skeleton",
  showCode = false,
  editorHeight = "60vh",
  className,
  onCodeUpdate,
}: HtmlToSkeletonConverterProps) {
  const [codeText, setCodeText] = useState<string>("")
  const [skeletonElement, setSkeletonElement] = useState<React.ReactNode>(null)

  useEffect(() => {
    if (!htmlInput.trim()) {
      setCodeText("")
      setSkeletonElement(null)
      return
    }

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlInput, "text/html")
      const rootElement = doc.body.firstElementChild

      if (rootElement) {
        const classAttr = codeFormat === "jsx" ? "className" : "class"
        const result = convertToSkeleton(rootElement, 0, maxDepth, visibleOnly, classAttr)

        // Always build both versions deterministically
        const htmlCode = result.jsx
        const jsxCode = buildComponentCode(componentName, result.jsx)

        setCodeText(codeFormat === "jsx" ? jsxCode : htmlCode)
        setSkeletonElement(result.element)
      }
    } catch (error) {
      console.error("Error parsing HTML:", error)
      setCodeText("// Error parsing HTML")
      setSkeletonElement(<div className="text-red-500">Error parsing HTML</div>)
    }
  }, [htmlInput, maxDepth, visibleOnly, codeFormat, componentName])

  const [formattedCode, setFormattedCode] = useState<string>("")

  useEffect(() => {
    if (!showCode) {
      setFormattedCode("")
      return
    }
    let isActive = true
    ;(async () => {
      const pretty = await formatCode(codeText || "", codeFormat)
      if (!isActive) return
      setFormattedCode(pretty || codeText)
    })()
    return () => {
      isActive = false
    }
  }, [codeText, codeFormat, showCode])

  useEffect(() => {
    if (!showCode) return
    const current = (formattedCode || codeText) || ""
    onCodeUpdate?.(current)
  }, [formattedCode, codeText, showCode, onCodeUpdate])

  if (showCode) {
    return (
      <CodeMirror
        value={(formattedCode || codeText) || "// Enter HTML to see skeleton code"}
        readOnly
        theme="light"
        basicSetup={{ lineNumbers: false, highlightActiveLine: false }}
        className="text-sm cm-compact cm-unstyled"
        height={editorHeight}
        extensions={codeFormat === "jsx" ? [javascript({ jsx: true })] : [htmlLang()]}
      />
    )
  }

  return (
    <div className={cn("animate-pulse", className)}>
      {skeletonElement || <div className="text-muted-foreground">Enter HTML to see skeleton preview</div>}
    </div>
  )
}

function convertToSkeleton(
  element: Element,
  depth: number,
  maxDepth: number,
  visibleOnly: boolean,
  classAttr: "class" | "className",
): { jsx: string; element: React.ReactNode } {
  const tagName = element.tagName.toLowerCase()
  const classList = Array.from(element.classList)

  const preservedClasses = classList
    .filter(
      (cls) =>
        // Keep layout, sizing, spacing, positioning
        !cls.startsWith("text-") &&
        !cls.startsWith("bg-") &&
        !cls.startsWith("border") &&
        !cls.startsWith("shadow-") &&
        !cls.startsWith("ring-") &&
        !cls.startsWith("from-") &&
        !cls.startsWith("to-") &&
        !cls.startsWith("via-") &&
        !cls.startsWith("hover:") &&
        !cls.startsWith("focus:") &&
        !cls.startsWith("active:") &&
        !cls.includes("gradient") &&
        !cls.includes("cursor-") &&
        cls !== "border",
    )
    .join(" ")

  const textContent = element.textContent?.trim() || ""
  const isSkeletonElement = ["button", "h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "a", "img"].includes(tagName)
  const hasOnlyText = Array.from(element.childNodes).every((node) => node.nodeType === Node.TEXT_NODE)

  if (isSkeletonElement && textContent) {
    const skeletonClass = getSkeletonClass(tagName, textContent, depth)
    const finalClasses = preservedClasses ? `${preservedClasses} ${skeletonClass}` : skeletonClass

    const jsx = `<div ${classAttr}="${finalClasses}"></div>`
    const reactElement = <div className={finalClasses}></div>
    return { jsx, element: reactElement }
  }

  if (hasOnlyText && textContent) {
    const skeletonClass = getTextSkeletonClass(textContent, depth + 1)
    const finalClasses = preservedClasses ? `${preservedClasses} ${skeletonClass}` : skeletonClass

    const jsx = `<div ${classAttr}="${finalClasses}"></div>`
    const reactElement = <div className={finalClasses}></div>
    return { jsx, element: reactElement }
  }

  const childResults: { jsx: string; element: React.ReactNode }[] = []

  if (depth >= maxDepth) {
    // stop here; don't traverse deeper
  } else {
    Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      if (text) {
        const skeletonClass = getTextSkeletonClass(text, depth + 1)
           const jsx = `<div ${classAttr}="${skeletonClass}"></div>`
        const reactElement = <div className={skeletonClass}></div>
        childResults.push({ jsx, element: reactElement })
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const childResult = convertToSkeleton(node as Element, depth + 1, maxDepth, visibleOnly, classAttr)
      childResults.push(childResult)
    }
    })
  }

  if (childResults.length > 0) {
    const containerClass = getContainerClass(element, preservedClasses, depth, visibleOnly)
    const childrenJsx = childResults.map((child) => `  ${child.jsx}`).join("\n")
    const childrenElements = childResults.map((child, index) =>
      React.cloneElement(child.element as React.ReactElement, { key: index }),
    )

    const jsx = `<div ${classAttr}="${containerClass}">\n${childrenJsx}\n</div>`
    const reactElement = <div className={containerClass}>{childrenElements}</div>
    return { jsx, element: reactElement }
  }

  const containerClass = getContainerClass(element, preservedClasses, depth, visibleOnly)
  const jsx = `<div ${classAttr}="${containerClass}"></div>`
  const reactElement = <div className={containerClass}></div>
  return { jsx, element: reactElement }
}

function getSkeletonClass(tagName: string, textContent: string, depth: number): string {
  const baseColor = getDepthColor(depth)
  const textLength = textContent.length

  const colorPrefix = baseColor ? `${baseColor} ` : ""

  switch (tagName) {
    case "button":
      return `${colorPrefix}h-10 rounded max-w-full overflow-hidden ${getWidthFromText(textLength)}`
    case "h1":
      return `${colorPrefix}h-8 rounded max-w-full overflow-hidden ${getWidthFromText(textLength)}`
    case "h2":
      return `${colorPrefix}h-7 rounded max-w-full overflow-hidden ${getWidthFromText(textLength)}`
    case "h3":
      return `${colorPrefix}h-6 rounded max-w-full overflow-hidden ${getWidthFromText(textLength)}`
    case "h4":
    case "h5":
    case "h6":
      return `${colorPrefix}h-5 rounded max-w-full overflow-hidden ${getWidthFromText(textLength)}`
    case "p":
    case "span":
    case "a":
      return `${colorPrefix}h-4 rounded max-w-full overflow-hidden ${getWidthFromText(textLength)}`
    case "img":
      return `${colorPrefix}rounded max-w-full overflow-hidden`
    default:
      return `${colorPrefix}h-4 rounded max-w-full overflow-hidden ${getWidthFromText(textLength)}`
  }
}

function getTextSkeletonClass(text: string, depth: number): string {
  const baseColor = getDepthColor(depth)
  const width = getWidthFromText(text.length)
  const colorPrefix = baseColor ? `${baseColor} ` : ""
  return `${colorPrefix}h-4 rounded inline-block max-w-full overflow-hidden ${width}`
}

function getContainerClass(element: Element, preservedClasses: string, depth: number, visibleOnly: boolean): string {
  const hasPositioning =
    preservedClasses.includes("absolute") || preservedClasses.includes("fixed") || preservedClasses.includes("sticky")

  if (hasPositioning || !preservedClasses) {
    return preservedClasses
  }

  if (visibleOnly && !elementHasVisibleBox(element)) {
    return preservedClasses
  }

  const bgClass = depth === 0 ? "" : getDepthColor(depth)
  return preservedClasses + (bgClass ? ` ${bgClass}` : "")
}

function elementHasVisibleBox(element: Element): boolean {
  const tagName = element.tagName.toLowerCase()
  const classList = Array.from(element.classList)
  const styleAttr = element.getAttribute("style")?.toLowerCase() || ""

  const inherentlyVisible = ["img", "video", "canvas", "svg", "hr"]
  if (inherentlyVisible.includes(tagName)) return true

  // Tailwind-like classes indicating background, borders, shadows, rings or gradients
  const hasBgClass = classList.some((c) => c.startsWith("bg-") && c !== "bg-transparent")
  const hasGradient = classList.some((c) => c.includes("gradient") || c.startsWith("from-") || c.startsWith("to-") || c.startsWith("via-"))
  const hasBorderClass = classList.some((c) => c === "border" || c.startsWith("border-") || /^border(?:-\d+)?$/.test(c))
  const hasShadow = classList.some((c) => c.startsWith("shadow"))
  const hasRing = classList.some((c) => c.startsWith("ring-"))

  if (hasBgClass || hasGradient || hasBorderClass || hasShadow || hasRing) return true

  // Inline styles
  if (styleAttr.includes("background") && !styleAttr.includes("transparent")) return true
  if (styleAttr.includes("border") && !styleAttr.includes("border: 0") && !styleAttr.includes("border-width: 0")) return true
  if (styleAttr.includes("box-shadow")) return true

  return false
}

function getWidthFromText(length: number): string {
  if (length <= 3) return "w-6"
  if (length <= 6) return "w-12"
  if (length <= 10) return "w-20"
  if (length <= 15) return "w-28"
  if (length <= 25) return "w-40"
  if (length <= 40) return "w-56"
  if (length <= 60) return "w-72"
  return "w-full"
}

function getDepthColor(depth: number): string {
  const colors = [
    "bg-gray-50",
    "bg-gray-100",
    "bg-gray-200",
    "bg-gray-300",
    "bg-gray-400",
    "bg-gray-500",
    "bg-gray-600",
    "bg-gray-700",
    "bg-gray-800",
    "bg-gray-900",
    "bg-gray-950"
  ]
  return colors[Math.min(depth, colors.length - 1)]
}

function buildComponentCode(componentName: string, markup: string): string {
  const indented = markup
    .split("\n")
    .map((line) => (line.length ? `  ${line}` : line))
    .join("\n")
  return `import React from "react"\n\nexport function ${componentName}() {\n  return (\n${indented}\n  )\n}\n`
}
