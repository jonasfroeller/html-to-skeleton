export type CodeLanguage = "html" | "jsx"

export async function formatCode(code: string, language: CodeLanguage): Promise<string> {
  try {
    const prettier = await import("prettier/standalone")
    if (language === "html") {
      const htmlPlugin = (await import("prettier/plugins/html")).default
      return prettier.format(code, {
        parser: "html",
        plugins: [htmlPlugin as unknown as any],
      })
    } else {
      const babelPlugin = (await import("prettier/plugins/babel")).default
      const estreePlugin = (await import("prettier/plugins/estree")).default
      return prettier.format(code, {
        parser: "babel",
        plugins: [babelPlugin as unknown as any, estreePlugin as unknown as any],
      })
    }
  } catch {
    return code
  }
}
