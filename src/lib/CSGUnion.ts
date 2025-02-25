import { removeDuplicateIntersections } from "./removeDuplicateIntersection";
import { Intersection, Ray, RTObject } from "./types";

export class CSGUnion implements RTObject {
  constructor(public a: RTObject, public b: RTObject) {}

  intersect(ray: Ray): Intersection[] {
    const a = this.a.intersect(ray);
    const b = this.b.intersect(ray);
    const removed = removeDuplicateIntersections(
      [...a, ...b].sort(({ distance: a }, { distance: b }) => a - b)
    );
    const result: Intersection[] = [];
    let stack = 0;
    for (const i of removed) {
      if (i.front) {
        if (stack === 0) {
          result.push(i);
        }
        stack++;
      } else {
        stack--;
        if (stack === 0) {
          result.push(i);
        }
      }
    }
    return result;
  }
}
