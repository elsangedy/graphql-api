import App from './app'

App.listen(3000, (error) => {
  if (error) {
    console.error('ERROR - Unable to start server.')
  } else {
    console.info(`INFO - Server started on port 3000.`)
  }
})