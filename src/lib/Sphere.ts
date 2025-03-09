import { Color, Intersection, Ray, RTObject, Vec } from "./types";
import { mul, normalize, sq, sub, v } from "./util";

export class Sphere implements RTObject {
  constructor(
    public position: Vec,
    public radius: number,
    public color: Color
  ) {}

  intersect(ray: Ray): Intersection[] {
    const result: Intersection[] = [];

    // 편의상 ray와 sphere의 위치에서 sphere의 위치를 빼서 sphere를 원점으로 만듦
    const origin = sub(ray.origin, this.position);

    const a = sq(ray.direction.x) + sq(ray.direction.y) + sq(ray.direction.z);
    const b =
      2 *
      (origin.x * ray.direction.x +
        origin.y * ray.direction.y +
        origin.z * ray.direction.z);
    const c = sq(origin.x) + sq(origin.y) + sq(origin.z) - sq(this.radius);
    const discriminant = sq(b) - 4 * a * c;

    if (discriminant < 0) {
      return [];
    }

    const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const tMin = t1 < t2 ? t1 : t2;
    const tMax = t1 > t2 ? t1 : t2;

    if (tMax < 0) {
      return [];
    }

    if (tMin < 0) {
      result.push({
        distance: 0,
        normal: mul(ray.direction, -1),
        color: this.color,
        front: true,
      });
    } else {
      const normalX = 2 * (origin.x + ray.direction.x * tMin);
      const normalY = 2 * (origin.y + ray.direction.y * tMin);
      const normalZ = 2 * (origin.z + ray.direction.z * tMin);
      result.push({
        distance: tMin,
        normal: normalize(v(normalX, normalY, normalZ)),
        color: this.color,
        front: true,
      });
    }

    const normalX = 2 * (origin.x + ray.direction.x * tMax);
    const normalY = 2 * (origin.y + ray.direction.y * tMax);
    const normalZ = 2 * (origin.z + ray.direction.z * tMax);
    result.push({
      distance: tMax,
      normal: normalize(v(normalX, normalY, normalZ)),
      color: this.color,
      front: false,
    });

    return result;
  }
}
