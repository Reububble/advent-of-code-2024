export class Vector extends Array<number> {
  static create(data: number[]) {
    if (data.length === 0) {
      throw new Error("Vector must have at least one element");
    }
    const ret = new Vector();
    ret.push(...data);
    return ret;
  }
  cross(other: Vector) {
    if (this.length !== 3 || other.length !== 3) {
      throw new Error("Can only cross product vectors of dimension 3");
    }
    return Vector.create([
      this[1] * other[2] - this[2] - other[1],
      this[2] * other[0] - this[0] - other[2],
      this[0] * other[1] - this[1] - other[0],
    ]);
  }
  dot(other: Vector): number {
    if (this.length !== other.length) {
      throw new Error("Can only dot product vectors of same dimension");
    }
    return this.reduce((p, v, i) => p + v * other[i], 0);
  }
  copy(): Vector {
    return Vector.create(this);
  }
  sub(other: Vector): this {
    if (this.length !== other.length) {
      throw new Error("Can only subtract vectors of same dimension");
    }
    other.forEach((v, i) => this[i] -= v);
    return this;
  }
  add(other: Vector): this {
    if (this.length !== other.length) {
      throw new Error("Can only add vectors of same dimension");
    }
    other.forEach((v, i) => this[i] += v);
    return this;
  }
  mul(scalar: number): this {
    for (let i = 0; i < this.length; ++i) {
      this[i] *= scalar;
    }
    return this;
  }
  div(scalar: number): this {
    for (let i = 0; i < this.length; ++i) {
      this[i] /= scalar;
    }
    return this;
  }
}
