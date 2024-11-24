// Utility function to pause execution for a specified duration
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const dateToTimeString = (date: Date): string => {
  const newDate = new Date(date); // have to make a new copy if pulled from an api
  const day = newDate.getDate();
  const month = newDate.toLocaleString("default", { month: "short" });
  const year = newDate.getFullYear();

  return day + " " + month + " " + year;
};
/**
 * Filters out undefined values from an array, maintaining type safety
 *
 * @template T The type of elements in the array
 * @param array The input array that may contain undefined values
 * @returns An array with only defined values
 *
 * @example
 * const mixedArray = [1, undefined, 2, undefined, 3];
 * const definedArray = filterOutUndefined(mixedArray); // [1, 2, 3]
 *
 * interface User { id: number; name: string; }
 * const users: (User | undefined)[] = [user1, undefined, user2];
 * const validUsers = filterOutUndefined(users); // User[]
 */
export function filterOutUndefined<T>(array: (T | undefined)[]): T[] {
  return array.filter((item): item is T => item !== undefined);
}
