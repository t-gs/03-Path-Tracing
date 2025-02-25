import { removeDuplicateIntersections } from "./removeDuplicateIntersection";
import { Intersection, Ray, RTObject } from "./types";

export class CSGIntersection implements RTObject {
  constructor(public a: RTObject, public b: RTObject) {}

  intersect(ray: Ray): Intersection[] {
    const a = this.a.intersect(ray);
    if (a.length === 0) {
      return a;
    }
    const b = this.b.intersect(ray);
    const removed = removeDuplicateIntersections(
      [...a, ...b].sort(({ distance: a }, { distance: b }) => a - b)
    );
    const result: Intersection[] = [];
    let stack = 0;
    for (const i of removed) {
      if (i.front) {
        stack++;
        if (stack === 2) {
          result.push(i);
        }
      } else {
        if (stack === 2) {
          result.push(i);
        }
        stack--;
      }
    }
    return result;
  }
}
