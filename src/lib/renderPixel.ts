import { Pixel } from "../common/types";
import { Context } from "./Context";
import { scene } from "./scene";
import { Color, Intersection, Ray, Vec } from "./types";
import { add, c, cross, mul, normalize, v } from "./util";

const MAX_DEPTH = 10;
const SAMPLE_COUNT = 100;

function orthonormalBasis(normal: Vec): [tangent: Vec, bitangent: Vec] {
  const tangent =
    Math.abs(normal.x) > Math.abs(normal.z)
      ? normalize(v(-normal.y, normal.x, 0))
      : normalize(v(0, -normal.z, normal.y));
  const bitangent = cross(normal, tangent);
  return [tangent, bitangent];
}

function sample(normal: Vec): Vec {
  const r1 = Math.random();
  const r2 = Math.random();
  const theta = Math.acos(Math.sqrt(1 - r1));
  const phi = 2 * Math.PI * r2;
  const x = Math.cos(phi) * Math.sin(theta);
  const y = Math.sin(phi) * Math.sin(theta);
  const z = Math.cos(theta);
  const [tangent, bitangent] = orthonormalBasis(normal);
  const sampledDirection = add(
    add(mul(tangent, x), mul(bitangent, y)),
    mul(normal, z)
  );
  return normalize(sampledDirection);
}

function intersect(
  ray: Ray
): [intersection: Intersection, point: Vec, isLight: boolean] | undefined {
  let distance = Infinity;
  let result:
    | [intersection: Intersection, point: Vec, isLight: boolean]
    | undefined;
  for (const object of scene.objects) {
    const intersection = object.intersect(ray)[0];
    if (intersection && intersection.distance < distance) {
      distance = intersection.distance;
      const point = add(
        add(ray.origin, mul(ray.direction, intersection.distance)),
        mul(intersection.normal, 0.0001)
      );
      result = [intersection, point, false];
    }
  }
  for (const light of scene.lights) {
    const intersection = light.intersect(ray)[0];
    if (intersection && intersection.distance < distance) {
      distance = intersection.distance;
      const point = add(ray.origin, mul(ray.direction, intersection.distance));
      result = [intersection, point, true];
    }
  }
  return result;
}

function trace(ray: Ray, depth: number): Color {
  if (depth > MAX_DEPTH) {
    return c(0, 0, 0);
  }

  const hit = intersect(ray);
  if (!hit) {
    return c(0, 0, 0); // sky
  }
  const [{ normal, color }, point, isLight] = hit;

  if (isLight) {
    return color;
  }

  const { r, g, b } = trace(
    { origin: point, direction: sample(normal) },
    depth + 1
  );
  return c(r * color.r, g * color.g, b * color.b);
}

export function renderPixel(context: Context, x: number, y: number): Pixel {
  const ray: Ray = {
    origin: v(0, -10, 0),
    direction: normalize(
      v(context.tanFovX * (x * 2 - 1), 1, -context.tanFovY * (y * 2 - 1))
    ),
  };

  let color = c(0, 0, 0);
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const { r, g, b } = trace(ray, 0);
    color.r += r / SAMPLE_COUNT;
    color.g += g / SAMPLE_COUNT;
    color.b += b / SAMPLE_COUNT;
  }

  return color;
}
