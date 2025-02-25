import { Intersection } from "./types";

export function removeDuplicateIntersections(
  sorted: Intersection[]
): Intersection[] {
  const result: Intersection[] = [];
  for (const i of sorted) {
    const last = result[result.length - 1];
    if (
      last &&
      last.front !== i.front &&
      Math.abs(last.distance - i.distance) < 0.001
    ) {
      result.pop();
    } else {
      result.push(i);
    }
  }
  return result;
}
