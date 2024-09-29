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

export class BinaryExpr extends Expr {
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

export class GroupingExpr extends Expr {
  constructor(
    public readonly expression: Expr,
  ) {
    super()
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitGroupingExpr(this)
  }
}

export class LiteralExpr extends Expr {
  constructor(
    public readonly value: unknown,
  ) {
    super()
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitLiteralExpr(this)
  }
}

export class UnaryExpr extends Expr {
  constructor(
    public readonly operator: Token,
    public readonly right: Expr,
  ) {
    super()
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitUnaryExpr(this)
  }
}
