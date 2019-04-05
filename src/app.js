require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const validateBearerToken = require('./validate-bearer-token')
const errorHandler = require('./error-handler')
const bookmarksRouter = require('./bookmarks/bookmarks-router')

const app = express()

// app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
//   skip: () => NODE_ENV === 'test'
// }))

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
+ app.use(morgan(morganSetting))
app.use(cors())
app.use(helmet())
app.use(validateBearerToken)

app.use(bookmarksRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use(errorHandler)

//4 parameters in middleware, express knows to treat this as error handler
app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000

module.exports = app
