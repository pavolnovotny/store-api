import express from 'express'
import * as dotenv from 'dotenv'
import expressAsyncErrors from 'express-async-errors'
dotenv.config()

import { connectDB } from './db/connect.js'
import { notFound } from './middleware/not-found.js'
import { errorHandlerMiddleware } from './middleware/error-handler.js'
import { router as productRouter } from "./routes/products.js";


const app = express()

app.use(express.json())

app.get('/', (req,res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')
})

app.use('/api/v1/products', productRouter)

app.use(notFound)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Server is listening on port ${port}...`))
    console.log('DB is connected...')
  } catch (e) {
    console.log(e)
  }
}

start()
