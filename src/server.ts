import express from 'express'
import dotenv from 'dotenv'
import { connect_db } from '@core/database'
import router from './app.routes'
import { connectRabbitMQ } from '@services/rabbitmq'
dotenv.config()


const app = express()
const port = process.env.PORT

connect_db()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//router
app.use('/api/v1/user',router)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
