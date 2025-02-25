import { Plane } from "./Plane";
import { Sphere } from "./Sphere";
import { Scene } from "./types";
import { c, v } from "./util";

export const scene: Scene = {
  objects: [
    new Plane(v(0, 0, -5), v(0, 0, 1), c(0.9, 0.9, 0.9)),
    new Plane(v(-5, 0, 0), v(1, 0, 0), c(0.9, 0.4, 0.4)),
    new Plane(v(5, 0, 0), v(-1, 0, 0), c(0.4, 0.9, 0.4)),
    new Plane(v(0, 0, 5), v(0, 0, -1), c(0.9, 0.9, 0.9)),
    new Plane(v(0, 5, 0), v(0, -1, 0), c(0.9, 0.9, 0.9)),
    new Sphere(v(-1, 0, -2), 3, c(0.4, 0.4, 0.9)),
  ],
  lights: [new Sphere(v(0, 0, 9.5), 5, c(2, 2, 2))],
};
