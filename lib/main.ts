import { parse } from 'jsr:@std/jsonc'
import Lox from './lox.ts'

const getVersion = async () => {
  const denoJsonString = await Deno.readTextFile('deno.jsonc')
  const denoJson = parse(denoJsonString) as { version: string }
  if (!denoJson) {
    throw new Error('Failed to parse deno.jsonc')
  }
  const version = denoJson.version

  return version
}

const main = async () => {
  const version = await getVersion()
  console.log(`Lox-ts 🦖 version ${version}`)

  Lox.main()
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  await main()
}
