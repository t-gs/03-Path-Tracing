import { DummyTexture, Texture } from "./Texture";
import { Color, Intersection, Ray, RTObject, Vec } from "./types";
import { add, c, mul, normalize, sq, sub, v } from "./util";

export class Sphere implements RTObject {
  private readonly texture: Texture;

  constructor(
    public position: Vec,
    public radius: number,
    public insideColor: Color,
    color: Color | Texture = insideColor
  ) {
    this.texture = color instanceof Texture ? color : new DummyTexture(color);
  }

  intersect(ray: Ray): Intersection[] {
    const result: Intersection[] = [];

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
    const [tMin, tMax] = t1 < t2 ? [t1, t2] : [t2, t1];

    if (tMax < 0) {
      return [];
    }

    if (tMin < 0) {
      result.push({
        distance: 0,
        normal: mul(ray.direction, -1),
        color: this.insideColor,
        front: true,
      });
    } else {
      const normalX = 2 * (origin.x + ray.direction.x * tMin);
      const normalY = 2 * (origin.y + ray.direction.y * tMin);
      const normalZ = 2 * (origin.z + ray.direction.z * tMin);
      result.push({
        distance: tMin,
        normal: normalize(v(normalX, normalY, normalZ)),
        color: this.color(add(ray.origin, mul(ray.direction, tMin))),
        front: true,
      });
    }

    const normalX = 2 * (origin.x + ray.direction.x * tMax);
    const normalY = 2 * (origin.y + ray.direction.y * tMax);
    const normalZ = 2 * (origin.z + ray.direction.z * tMax);
    result.push({
      distance: tMax,
      normal: normalize(v(normalX, normalY, normalZ)),
      color: this.color(add(ray.origin, mul(ray.direction, tMax))),
      front: false,
    });

    return result;
  }

  color(position: Vec): Color {
    const localPos = sub(position, this.position);
    const dir = normalize(localPos);

    const theta = Math.atan2(dir.x, dir.y);
    const phi = Math.acos(dir.z);

    const u = (theta + Math.PI) / (2 * Math.PI);
    const v = phi / Math.PI;

    return c(this.texture.r(u, v), this.texture.g(u, v), this.texture.b(u, v));
  }
}
