export class Tree<Node> {
  readonly root: Node;
  readonly length: number;
  readonly branches = new Array<Tree<Node>>();
  constructor(public self: Node, public readonly parent?: Tree<Node>) {
    this.root = parent?.root ?? self;
    this.length = (parent?.length ?? 0) + 1;
    this.parent?.branches.push(this);
  }
  /** Checks branch to root for predicate */
  some(predicate: (value: Node, index: number) => unknown, thisArg?: unknown): boolean {
    return Boolean(predicate.call(thisArg, this.self, this.length - 1)) || (this.parent?.some(predicate, thisArg) ?? false);
  }
  *[Symbol.iterator](): Generator<Node, void, unknown> {
    yield* this.parent ?? [];
    yield this.self;
  }
}
