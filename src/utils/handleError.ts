export const handleError = (error: Error) => {
  const errorMessage: string = `${error.name}: ${error.message}`

  if (process.env.NODE_ENV !== 'test') console.log(errorMessage)

  return Promise.reject(new Error(errorMessage))
}