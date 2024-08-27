import Lox from './lox.ts'
import { Token } from './token.ts'
import { TokenType } from './tokenType.ts'

export default class Scanner {
  private start = 0
  private current = 0
  private line = 1
  private readonly tokens: Token[] = []

  private static keywords = new Map<string, TokenType>([
    ['and', TokenType.AND],
    ['class', TokenType.CLASS],
    ['else', TokenType.ELSE],
    ['false', TokenType.FALSE],
    ['for', TokenType.FOR],
    ['fun', TokenType.FUN],
    ['if', TokenType.IF],
    ['nil', TokenType.NIL],
    ['or', TokenType.OR],
    ['print', TokenType.PRINT],
    ['return', TokenType.RETURN],
    ['super', TokenType.SUPER],
    ['this', TokenType.THIS],
    ['true', TokenType.TRUE],
    ['var', TokenType.VAR],
    ['while', TokenType.WHILE],
  ])

  constructor(
    public readonly source: string,
  ) {}

  scanTokens() {
    while (!this.isAtEnd()) {
      // We are at the beginning of the next lexeme.
      this.start = this.current
      this.scanToken()
    }

    this.tokens.push(new Token(TokenType.EOF, '', null, this.line))
    return this.tokens
  }

  private isAtEnd() {
    return this.current >= this.source.length
  }

  private scanToken() {
    const char = this.advance()

    switch (char) {
      case '(':
        this.addToken(TokenType.LEFT_PAREN)
        break
      case ')':
        this.addToken(TokenType.RIGHT_PAREN)
        break
      case '{':
        this.addToken(TokenType.LEFT_BRACE)
        break
      case '}':
        this.addToken(TokenType.RIGHT_BRACE)
        break
      case ',':
        this.addToken(TokenType.COMMA)
        break
      case '.':
        this.addToken(TokenType.DOT)
        break
      case '-':
        this.addToken(TokenType.MINUS)
        break
      case '+':
        this.addToken(TokenType.PLUS)
        break
      case ';':
        this.addToken(TokenType.SEMICOLON)
        break
      case '*':
        this.addToken(TokenType.STAR)
        break

      case '!':
        this.addToken(
          this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG,
        )
        break
      case '=':
        this.addToken(
          this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL,
        )
        break
      case '<':
        this.addToken(
          this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS,
        )
        break
      case '>':
        this.addToken(
          this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER,
        )
        break

      case '/':
        if (this.match('/')) {
          // A comment goes until the end of the line.
          while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance()
          }
        } else if (this.match('*')) {
          this.blockComment()
        } else {
          this.addToken(TokenType.SLASH)
        }
        break

      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace.
        break

      case '\n':
        this.line++
        break

      case '"':
        this.string()
        break

      default:
        if (this.isDigit(char)) {
          this.number()
        } else if (this.isAlpha(char)) {
          this.identifier()
        } else {
          Lox.error(this.line, `Unexpected character: ${char}`)
        }
    }
  }

  private match(expected: string) {
    if (this.isAtEnd()) return false
    if (this.source[this.current] !== expected) return false

    this.current++
    return true
  }

  /**
   * Advances the scanner to the next character.
   * current is incremented.
   * @returns the next character
   */
  private advance(steps = 1) {
    let result = ''
    for (let i = 0; i < steps; i++) {
      if (this.isAtEnd()) {
        throw new Error(
          `Advancing past the end of file (start: ${this.start})`,
        )
      }

      result += this.source[this.current++]
    }

    return result
  }

  private addToken(type: TokenType) {
    this.addTokenLiteral(type, null)
  }

  private addTokenLiteral(type: TokenType, literal: any) {
    const text = this.source.substring(this.start, this.current)
    this.tokens.push(new Token(type, text, literal, this.line))
  }

  private string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.line++
      }

      this.advance()
    }

    if (this.isAtEnd()) {
      Lox.error(this.line, 'Unterminated string.')
      return
    }

    // The closing quote
    this.advance()

    // Trim the surrounding quotes.
    const value = this.source.substring(this.start + 1, this.current - 1)
    this.addTokenLiteral(TokenType.STRING, value)
  }

  private isDigit(char: string) {
    if (char.length !== 1) {
      throw new Error(`Invalid char length (${char.length})`)
    }

    return char >= '0' && char <= '9'
  }

  private number() {
    while (this.isDigit(this.peek())) {
      this.advance()
    }

    // Look for a fractional part.
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      // Consume the "."
      this.advance()

      while (this.isDigit(this.peek())) {
        this.advance()
      }
    }

    this.addTokenLiteral(
      TokenType.NUMBER,
      parseFloat(this.source.substring(this.start, this.current)),
    )
  }

  private peek() {
    if (this.isAtEnd()) return '\0'
    return this.source[this.current]
  }

  private peekNext() {
    if (this.current + 1 >= this.source.length) {
      return '\0'
    }

    return this.source[this.current + 1]
  }

  private identifier() {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance()
    }

    const string = this.source.substring(this.start, this.current)
    const type = Scanner.keywords.get(string) ?? TokenType.IDENTIFIER
    this.addToken(type)
  }

  private isAlphaNumeric(char: string) {
    return this.isAlpha(char) || this.isDigit(char)
  }

  private isAlpha(char: string) {
    const isLowercase = char >= 'a' && char <= 'z'
    const isUppercase = char >= 'A' && char <= 'Z'
    const isUnderscore = char === '_'

    return isLowercase || isUppercase || isUnderscore
  }

  private blockComment() {
    while (this.peek() !== '*' || this.peekNext() !== '/') {
      if (this.peek() === '\n') {
        this.line++
      }

      if (this.isAtEnd()) {
        Lox.error(this.line, 'Unterminated block comment')
        return
      }

      this.advance()
    }

    this.advance(2)
  }
}
