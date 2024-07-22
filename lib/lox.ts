import { parseArgs } from 'jsr:@std/cli/parse-args'
import Scanner from './scanner.ts'

export default class Lox {
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
    for await (const chunk of Deno.stdin.readable) {
      const text = decoder.decode(chunk)
      if (text === null) {
        break
      }

      this.run(text.replace(/(\r\n|\n|\r)/gm, ''))
    }
  }

  static async runFile(file: string) {
    console.log(`running ${file}`)

    // read the file
    const source = await Deno.readTextFile(file)

    this.run(source)
  }

  static run(source: string) {
    const scanner = new Scanner(source)
    const tokens = scanner.scanTokens()

    for (const token of tokens) {
      console.log(token)
    }
  }
}
