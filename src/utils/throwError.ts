export const throwError = (condition: boolean, message: string): void => {
  if (condition) throw new Error(message)
}