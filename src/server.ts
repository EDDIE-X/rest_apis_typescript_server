import express from 'express'
import colors from 'colors'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'
import swaggerUI from 'swagger-ui-express'
import swaggerSpec, { swaggerUiOptions } from './config/swagger'
import productsRouter from './router'
import db from './config/db'

export async function connectDB() {
  try {
    await db.authenticate()
    db.sync()
  } catch (error) {
    console.log(colors.red.bold('Error al conectar a la base de datos'))
  }
}
connectDB()

// Creates express server.
const server = express()

// Allow connections
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin === process.env.FRONTEND_URL) {
      callback(null, true)
    } else {
      callback(new Error('Error de CORS'))
    }
  },
}
server.use(cors(corsOptions))

// Read data from forms.
server.use(express.json())

server.use(morgan('dev'))

server.use('/api/products', productsRouter)

// Docs
server.use('/docs/img', express.static('public'))
server.use(
  '/docs',
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec, swaggerUiOptions)
)

export default server
