import {
  BinaryExpr,
  Expr,
  GroupingExpr,
  LiteralExpr,
  UnaryExpr,
  Visitor,
} from './expr.ts'
import { Token } from './token.ts'
import { TokenType } from './tokenType.ts'

export class AstPrinter implements Visitor<string> {
  print(expr: Expr): string {
    return expr.accept(this)
  }

  public visitBinaryExpr(expr: BinaryExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right)
  }

  public visitGroupingExpr(expr: GroupingExpr): string {
    return this.parenthesize('group', expr.expression)
  }

  public visitLiteralExpr(expr: LiteralExpr): string {
    if (expr.value === null) {
      return 'nil'
    }

    return expr.value!.toString()
  }

  public visitUnaryExpr(expr: UnaryExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.right)
  }

  private parenthesize(name: string, ...exprs: Expr[]): string {
    const builder = new Array<string>()
    builder.push(`(${name}`)

    for (const expr of exprs) {
      builder.push(` ${expr.accept(this)}`)
    }

    builder.push(')')

    return builder.join('')
  }

  // Just an example
  public static main() {
    const expression = new BinaryExpr(
      new UnaryExpr(
        new Token(TokenType.MINUS, '-', null, 1),
        new LiteralExpr(123),
      ),
      new Token(TokenType.PLUS, '+', null, 1),
      new GroupingExpr(new LiteralExpr(45.67)),
    )

    console.log(new AstPrinter().print(expression))
  }
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  AstPrinter.main()
}
