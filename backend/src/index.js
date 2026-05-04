const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

const app = express()

app.use(helmet())
app.use(cors({
  origin: [
    'http://localhost:8082',
    'http://localhost:19006',
    'https://fluentra.app',
  ]
}))
app.use(express.json())

// Routes
app.use('/api/rate',
  require('./routes/rate'))
app.use('/api/grade',
  require('./routes/grade'))
app.use('/api/admin',
  require('./routes/admin'))
app.use('/api/health',
  (req, res) => res.json({
    status: 'ok',
    version: '1.0.0'
  }))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Fluentra API running on port ${PORT}`)
})
