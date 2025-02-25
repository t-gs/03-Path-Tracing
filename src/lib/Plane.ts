import { Color, Intersection, Ray, RTObject, Vec } from "./types";
import { dot, mul } from "./util";

export class Plane implements RTObject {
  constructor(public position: Vec, public normal: Vec, public color: Color) {}

  intersect(ray: Ray): Intersection[] {
    const t =
      -(
        ray.origin.x * this.normal.x +
        ray.origin.y * this.normal.y +
        ray.origin.z * this.normal.z -
        this.normal.x * this.position.x -
        this.normal.y * this.position.y -
        this.normal.z * this.position.z
      ) /
      (ray.direction.x * this.normal.x +
        ray.direction.y * this.normal.y +
        ray.direction.z * this.normal.z);

    if (t < 0) {
      if (dot(this.normal, ray.direction) < 0) {
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
      } else {
        return [];
      }
    }

    if (dot(this.normal, ray.direction) < 0) {
      return [
        { distance: t, normal: this.normal, color: this.color, front: true },
        {
          distance: Infinity,
          normal: ray.direction,
          color: this.color,
          front: false,
        },
      ];
    } else {
      return [
        {
          distance: 0,
          normal: mul(ray.direction, -1),
          color: this.color,
          front: true,
        },
        { distance: t, normal: this.normal, color: this.color, front: false },
      ];
    }
  }
}
