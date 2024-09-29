import { Binary, Expr, Grouping, Literal, Unary, Visitor } from './expr.ts'

export class AstPrinter implements Visitor<string> {
  print(expr: Expr): string {
    return expr.accept(this)
  }

  visitBinaryExpr(expr: Binary): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right)
  }

  visitGroupingExpr(expr: Grouping): string {
    throw new Error('Method not implemented.')
  }

  visitLiteralExpr(expr: Literal): string {
    throw new Error('Method not implemented.')
  }

  visitUnaryExpr(expr: Unary): string {
    throw new Error('Method not implemented.')
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
}
