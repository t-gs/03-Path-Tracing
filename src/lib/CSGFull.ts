import { Color, Intersection, Ray, RTObject } from "./types";
import { mul } from "./util";

export class CSGFull implements RTObject {
  constructor(public color: Color) {}

  intersect(ray: Ray): Intersection[] {
    return [
      {
        distance: 0,
        normal: mul(ray.direction, -1),
        color: this.color,
        front: true,
      },
      {
        distance: Infinity,
        normal: ray.direction,
        color: this.color,
        front: false,
      },
    ];
  }
}
