// Utility function to pause execution for a specified duration
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
