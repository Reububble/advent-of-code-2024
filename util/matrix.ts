import { Vector } from "util/vector.ts";

export class Matrix extends Array<Array<number>> {
  static create(data: number[][]) {
    if (data.length === 0) {
      throw new Error("Matrix must have at least one row");
    }
    if (data.slice(1).some((v) => v.length !== data[0].length)) {
      throw new Error("Matrix rows must be of the same length");
    }
    const ret = new Matrix();
    ret.push(...data);
    return ret;
  }
  mul(vec: Vector) {
    if (this[0].length !== vec.length) {
      throw new Error("Can only multiply vector with dimension matching column count");
    }
    return Vector.create(vec.map((_, i) => Vector.create(this[i]).dot(vec)));
  }
  transposed() {
    return Matrix.create(this[0].map((_, i) => this.map((_, j) => this[j][i])));
  }
}
