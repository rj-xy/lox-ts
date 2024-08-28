const defineAst = async (
  outputDir: string,
  baseName: string,
  types: string[],
) => {
  const path = `${outputDir}/${baseName.toLowerCase()}.ts`
  const file = await Deno.create(path)
  const writer = file.writable.getWriter()
  const encoder = new TextEncoder()
  const write = async (text?: string) => {
    const fmtText = (text ?? '').replaceAll('"', "'")
    return await writer.write(encoder.encode(fmtText))
  }
  const writeln = (text?: string) => write(text).then(() => write('\n'))

  await writeln(`/*
 * This is an automatically generated AST class.
 * Please do not make edits to this file as they will be overwritten on build.
 * See: tools/generateAst.ts
 */`)
  await writeln('import { Token } from "./token.ts"')
  await writeln()
  await defineVisitorInterface(writeln, baseName, types)
  await writeln()
  await writeln(`abstract class ${baseName} {`)
  await writeln('  abstract accept<R>(visitor: Visitor<R>): R')
  await writeln('}')

  // AST classes
  for (const type of types) {
    const split = type.split('|')
    const className = split[0].trim()
    const fields = split[1].trim()

    await defineType(writeln, baseName, className, fields)
  }

  await writer.close()
}

const defineVisitorInterface = async (
  writeln: (text?: string) => Promise<void>,
  baseName: string,
  types: string[],
) => {
  await writeln('export interface Visitor<R> {')

  for (const type of types) {
    const split = type.split('|')
    const className = split[0].trim()

    await writeln(`  visit${className}${baseName}(expr: ${baseName}): R;`)
  }

  await writeln('}')
}

const defineType = async (
  writeln: (text: string) => Promise<void>,
  baseName: string,
  className: string,
  fields: string,
) => {
  const classDef = `
export class ${className} extends ${baseName} {
  constructor(${fields}) {
    super()
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visit${className}Expr(this)
  }
}`

  await writeln(classDef)
}

const main = async () => {
  const args = Deno.args

  if (args.length !== 1) {
    console.error('Usage: generateAst <output directory>')
    Deno.exit(64)
  }

  const outputDir = args[0]

  await defineAst(outputDir, 'Expr', [
    'Binary   | left: Expr, operator: Token, right: Expr',
    'Grouping | expression: Expr',
    'Literal  | value: unknown',
    'Unary    | operator: Token, right: Expr',
  ])

  // Run `deno fmt` on the generated file
  const fmt = new Deno.Command('deno', {
    args: ['fmt', outputDir],
  })
  fmt.spawn()
}

if (import.meta.main) {
  await main()
}
