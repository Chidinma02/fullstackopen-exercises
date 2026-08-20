const express = require('express')
const app = express()

const PORT = process.env.PORT || 5000

app.use(express.static('dist'))

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`)
})
