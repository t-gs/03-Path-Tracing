import { removeDuplicateIntersections } from "./removeDuplicateIntersection";
import { Intersection, Ray, RTObject } from "./types";
import { mul } from "./util";

export class CSGDifference implements RTObject {
  constructor(public a: RTObject, public b: RTObject) {}

  intersect(ray: Ray): Intersection[] {
    const a = this.a.intersect(ray);
    if (a.length === 0) {
      return a;
    }
    const b = this.b.intersect(ray);
    const removed = removeDuplicateIntersections(
      [...a, ...a, ...b].sort(({ distance: a }, { distance: b }) => a - b)
    );
    const result: Intersection[] = [];
    let stack = 0;
    let front = false;
    for (const i of removed) {
      const prevStack = stack;
      if (i.front) {
        stack++;
      } else {
        stack--;
      }
      if (prevStack === 2 || stack === 2) {
        front = !front;
        result.push(
          front === i.front ? i : { ...i, front, normal: mul(i.normal, -1) }
        );
      }
    }
    return removeDuplicateIntersections(result);
  }
}
