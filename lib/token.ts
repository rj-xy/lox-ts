import { TokenType } from './tokenType.ts'

export class Token {
  constructor(
    public readonly type: TokenType,
    public readonly lexeme: string,
    public readonly literal: any,
    public readonly line: number,
  ) {
  }

  public toString(): string {
    return JSON.stringify(this, null, 2)
  }
}
