import Vector from "./Vector";

export function WrapIndex(i: number, length: number) {
	return ((i % length) + length) % length;
}
export function WrapGet<T>(arr: T[], i: number): T {
	return arr[WrapIndex(i, arr.length)];
}
/**
 * Wraps a vector within a defined range, ensuring it stays within the minimum and maximum boundaries.
 *
 * @param vec - The vector to wrap.
 * @param min - The minimum boundary vector.
 * @param size - The size vector, representing the maximum boundary.
 * @returns A new vector wrapped within the specified range.
 */
export function WrapVector(vec: Vector, min: Vector, size: Vector): Vector {
	return vec.mapClone((e, i) => WrapIndex(e, size.get(i)) + min.get(i))
}