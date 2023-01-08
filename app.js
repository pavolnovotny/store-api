import express from 'express'
import * as dotenv from 'dotenv'

import {notFound} from './middleware/not-found.js'
import {errorHandlerMiddleware} from './middleware/error-handler.js'

dotenv.config()
const app = express()

app.use(express.json())

app.get('/', (req,res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')
})

app.use(notFound)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    //   connect DB
    app.listen(port, console.log(`Server is listening on port ${port}...`))
  } catch (e) {
    console.log(e)
  }
}

start()
