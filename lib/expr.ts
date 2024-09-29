/*
 * This is an automatically generated AST class.
 * Please do not make edits to this file as they will be overwritten on build.
 * See: tools/generateAst.ts
 */
import { Token } from './token.ts'

export interface Visitor<R> {
  visitBinaryExpr(expr: Expr): R
  visitGroupingExpr(expr: Expr): R
  visitLiteralExpr(expr: Expr): R
  visitUnaryExpr(expr: Expr): R
}

export abstract class Expr {
  abstract accept<R>(visitor: Visitor<R>): R
}

export class Binary extends Expr {
  constructor(
    public readonly left: Expr,
    public readonly operator: Token,
    public readonly right: Expr,
  ) {
    super()
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitBinaryExpr(this)
  }
}

export class Grouping extends Expr {
  constructor(expression: Expr) {
    super()
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitGroupingExpr(this)
  }
}

export class Literal extends Expr {
  constructor(value: unknown) {
    super()
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitLiteralExpr(this)
  }
}

export class Unary extends Expr {
  constructor(operator: Token, right: Expr) {
    super()
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitUnaryExpr(this)
  }
}
