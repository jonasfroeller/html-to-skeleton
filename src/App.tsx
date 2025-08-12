import './App.css'
import { useEffect, useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import CodeMirror from "@uiw/react-codemirror"
import { html as htmlLang } from "@codemirror/lang-html"
import { formatCode } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HtmlToSkeletonConverter } from "@/components/html-to-skeleton-converter"
 
import { Icon } from "@iconify/react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const EXAMPLE_HTML = `<div class="max-w-4xl mx-auto space-y-6 p-6">
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-4">
      <div class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
        <span class="text-white font-semibold">JD</span>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">John Doe</h1>
        <p class="text-gray-600">Senior Product Designer</p>
      </div>
    </div>
    <div class="flex space-x-2">
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Edit Profile</button>
      <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Settings</button>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Projects</h3>
        <span class="text-2xl font-bold text-blue-600">24</span>
      </div>
      <p class="text-sm text-gray-600">Active projects this month</p>
      <div class="mt-4 w-full bg-gray-200 rounded-full h-2">
        <div class="bg-blue-600 h-2 rounded-full" style="width: 75%"></div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Revenue</h3>
        <span class="text-2xl font-bold text-green-600">$12.5k</span>
      </div>
      <p class="text-sm text-gray-600">Monthly earnings</p>
      <div class="mt-4 flex items-center text-sm text-green-600">
        <span>↗ +12.5%</span>
        <span class="ml-2 text-gray-500">vs last month</span>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-6">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Team</h3>
        <span class="text-2xl font-bold text-purple-600">8</span>
      </div>
      <p class="text-sm text-gray-600">Active team members</p>
      <div class="mt-4 flex -space-x-2">
        <div class="w-8 h-8 rounded-full bg-red-500 border-2 border-white"></div>
        <div class="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
        <div class="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
        <div class="w-8 h-8 rounded-full bg-yellow-500 border-2 border-white flex items-center justify-center text-xs text-white">+4</div>
      </div>
    </div>
  </div>

  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 class="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
    <div class="space-y-4">
      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span class="text-blue-600 text-sm font-medium">📊</span>
        </div>
        <div class="flex-1">
          <p class="text-gray-900 font-medium">Project "Dashboard Redesign" completed</p>
          <p class="text-gray-600 text-sm">2 hours ago</p>
        </div>
      </div>
      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <span class="text-green-600 text-sm font-medium">✅</span>
        </div>
        <div class="flex-1">
          <p class="text-gray-900 font-medium">New team member Sarah joined</p>
          <p class="text-gray-600 text-sm">1 day ago</p>
        </div>
      </div>
      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <span class="text-purple-600 text-sm font-medium">🎨</span>
        </div>
        <div class="flex-1">
          <p class="text-gray-900 font-medium">Design system updated to v2.1</p>
          <p class="text-gray-600 text-sm">3 days ago</p>
        </div>
      </div>
    </div>
  </div>
</div>`

export default function App() {
  const [htmlInput, setHtmlInput] = useState(EXAMPLE_HTML)
  const [maxDepth, setMaxDepth] = useState<number>(3)
  const [computedMaxDepth, setComputedMaxDepth] = useState<number>(3)
  const [visibleOnly, setVisibleOnly] = useState<boolean>(true)
  const [codeFormat, setCodeFormat] = useState<"html" | "jsx">("jsx")
  const [componentName, setComponentName] = useState<string>("Skeleton")
  const [outputCode, setOutputCode] = useState<string>("")
  const [copied, setCopied] = useState<boolean>(false)
  

  const toDashedLower = (name: string) =>
    name
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/\s+/g, "-")
      .replace(/_+/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputCode)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1000)
    } catch { }
  }

  const handleDownload = () => {
    const code = outputCode || ""
    const filenameBase = toDashedLower(componentName || "component")
    const ext = codeFormat === "jsx" ? "tsx" : "html"
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filenameBase}.${ext}`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const htmlPreviewRef = useRef<HTMLDivElement | null>(null)
  const skeletonPreviewRef = useRef<HTMLDivElement | null>(null)
  const isSyncingFromHtml = useRef(false)
  const isSyncingFromSkeleton = useRef(false)

  const syncScroll = (source: HTMLDivElement | null, target: HTMLDivElement | null) => {
    if (!source || !target) return
    const sourceMax = source.scrollHeight - source.clientHeight
    const targetMax = target.scrollHeight - target.clientHeight
    if (sourceMax <= 0 || targetMax <= 0) return
    const ratio = source.scrollTop / sourceMax
    target.scrollTop = ratio * targetMax
  }

  const handleHtmlScroll = () => {
    if (isSyncingFromSkeleton.current) return
    isSyncingFromHtml.current = true
    syncScroll(htmlPreviewRef.current, skeletonPreviewRef.current)
    isSyncingFromHtml.current = false
  }

  const handleSkeletonScroll = () => {
    if (isSyncingFromHtml.current) return
    isSyncingFromSkeleton.current = true
    syncScroll(skeletonPreviewRef.current, htmlPreviewRef.current)
    isSyncingFromSkeleton.current = false
  }

  const loadExample = () => {
    setHtmlInput(EXAMPLE_HTML)
  }

  const computeDomDepth = (html: string): number => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")
      const root = doc.body.firstElementChild
      if (!root) return 1
      const dfs = (el: Element): number => {
        const children = Array.from(el.children)
        if (children.length === 0) return 1
        return 1 + Math.max(...children.map((c) => dfs(c)))
      }
      return Math.max(1, dfs(root))
    } catch {
      return 3
    }
  }

  useEffect(() => {
    const depth = computeDomDepth(htmlInput)
    setComputedMaxDepth(depth)
    setMaxDepth(depth)
  }, [htmlInput])

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex min-h-0 flex-grow w-full max-w-full mx-auto p-8">
      <div className="flex h-full min-h-0 w-full flex-col">
      <div className="text-center space-y-4 mb-8 shrink-0">
        <h1 className="text-4xl font-bold">HTML to Skeleton Converter</h1>
        <p className="text-lg text-muted-foreground">
          Paste Tailwind-styled HTML to generate a React skeleton component with live preview-, output uses Tailwind classes too.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4 w-full md:w-auto">
            <Label className="whitespace-nowrap">Layers</Label>
            <div className="min-w-[200px] w-[240px] max-w-[320px]">
              <Slider
                value={[maxDepth]}
                onValueChange={(v) => setMaxDepth(Math.min(computedMaxDepth, Math.max(1, v[0] ?? 1)))}
                min={1}
                max={computedMaxDepth}
                step={1}
              />
            </div>
            <div className="text-sm text-muted-foreground">{maxDepth} / {computedMaxDepth}</div>
            <div className="flex items-center space-x-2">
              <Checkbox id="visibleOnly" checked={visibleOnly} onCheckedChange={(c) => setVisibleOnly(c === true)} />
              <Label htmlFor="visibleOnly" className="whitespace-nowrap">Visible boxes only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="codeFormat" className="whitespace-nowrap">Format</Label>
              <Select value={codeFormat} onValueChange={(v) => setCodeFormat(v as "html" | "jsx")}>
                <SelectTrigger id="codeFormat" className="h-9 w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="jsx">JSX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="componentName">Component</Label>
              <input
                id="componentName"
                type="text"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                disabled={codeFormat !== "jsx"}
                placeholder="Skeleton"
                className="h-9 w-40 rounded-md border px-3 text-sm bg-background disabled:opacity-50"
              />
            </div>
          </div>
          <Button variant="outline" onClick={loadExample} className="shrink-0">
            Load Example
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 flex-1 min-h-0">
        <div className="flex h-full min-h-0 flex-col space-y-4 lg:col-span-2">
          <Label className="text-lg font-semibold">Input</Label>
          <Tabs defaultValue="input" className="w-full h-full min-h-0 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="input">HTML Input</TabsTrigger>
              <TabsTrigger value="preview">HTML Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="input" className="mt-4 flex-1 min-h-0">
              <div className="border rounded-lg h-full flex flex-col min-h-0 bg-background overflow-hidden">
                <div className="flex items-center justify-between gap-2 border-b px-3 py-2 bg-muted/40">
                  <div className="text-xs text-muted-foreground">input.html</div>
                </div>
                <div className="flex-1 min-h-0 overflow-auto">
                  <CodeMirror
                    value={htmlInput}
                    theme="light"
                    basicSetup={{ lineNumbers: true, foldGutter: true }}
                    height="100%"
                    className="cm-compact cm-unstyled"
                    extensions={[htmlLang()]}
                    onChange={(value) => {
                      setHtmlInput(value)
                    }}
                    onBlur={async () => {
                      const pretty = await formatCode(htmlInput, "html")
                      if (pretty !== htmlInput) setHtmlInput(pretty)
                    }}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="preview" className="mt-4 flex-1 min-h-0">
              <div
                ref={htmlPreviewRef}
                onScroll={handleHtmlScroll}
                className="border rounded-lg p-4 h-full bg-background overflow-auto"
              >
                <div dangerouslySetInnerHTML={{ __html: htmlInput }} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex h-full min-h-0 flex-col space-y-4">
          <Label className="text-lg font-semibold">Output</Label>
          <Tabs defaultValue="preview" className="w-full h-full min-h-0 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">{codeFormat === "jsx" ? "JSX Code" : "HTML Code"}</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-4 flex-1 min-h-0">
              <div
                ref={skeletonPreviewRef}
                onScroll={handleSkeletonScroll}
                className="border rounded-lg p-4 h-full bg-background overflow-auto"
              >
                <HtmlToSkeletonConverter htmlInput={htmlInput} maxDepth={maxDepth} visibleOnly={visibleOnly} codeFormat={codeFormat} componentName={componentName} />
              </div>
            </TabsContent>
            <TabsContent value="code" className="mt-4 flex-1 min-h-0">
              <div className="border rounded-lg h-full flex flex-col min-h-0 overflow-hidden bg-background">
                <div className="flex items-center justify-between gap-2 border-b px-3 py-2 bg-muted/40">
                  <div className="text-xs text-muted-foreground">
                    {toDashedLower(componentName || "component") + (codeFormat === "jsx" ? ".tsx" : ".html")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-2">
                      <Icon icon={copied ? "lucide:check" : "lucide:copy"} className="size-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDownload} className="h-8 px-2">
                      <Icon icon="lucide:download" className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 min-h-0 overflow-auto">
                  <HtmlToSkeletonConverter
                    htmlInput={htmlInput}
                    maxDepth={maxDepth}
                    visibleOnly={visibleOnly}
                    codeFormat={codeFormat}
                    componentName={componentName}
                    showCode
                    editorHeight="100%"
                    onCodeUpdate={setOutputCode}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      </div>
      </main>
      <Footer />
    </div>
  )
}
