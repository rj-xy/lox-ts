import { parseArgs } from 'jsr:@std/cli/parse-args'

import Scanner from './scanner.ts'

export default class Lox {
  static hadError = false

  static async main() {
    const flags = parseArgs(Deno.args, {
      string: ['file'],
    })

    if (!Deno.args.length) {
      await this.runPrompt()
    }

    if (flags.file) {
      this.runFile(flags.file)
    }
  }

  static async runPrompt() {
    // read a line from the user
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()
    const prompt = encoder.encode('> ')
    const reader = Deno.stdin.readable.getReader()

    do {
      Deno.stdout.write(prompt)
      const chunk = (await reader.read()).value
      const line = decoder.decode(chunk)

      if (!chunk) {
        break
      }

      this.run(line)
      Lox.hadError = false
    } while (true)
  }

  static async runFile(file: string) {
    console.log(`running ${file}`)

    // read the file
    const source = await Deno.readTextFile(file)

    this.run(source)

    if (Lox.hadError) {
      Deno.exit(65)
    }
  }

  static run(source: string) {
    const scanner = new Scanner(source)
    const tokens = scanner.scanTokens()

    for (const token of tokens) {
      console.log(token)
    }
  }

  static error(line: number, message: string) {
    Lox.report(line, '', message)
  }

  static report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error:${where} ${message}`)
    Lox.hadError = true
  }
}
