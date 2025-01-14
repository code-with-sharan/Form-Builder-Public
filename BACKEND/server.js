import 'dotenv/config'
import express from 'express'
import { connectDB } from './Database/db.js'
import cors from 'cors'
import fromRouter from './Routes/fromRouter.js'
import userRouter from './Routes/userRouter.js'

const app = express()
const PORT = process.env.PORT

// DB connection
connectDB()

// Middlewares
app.use(express.json()) // whenever there is a 'get' req. from frontend to backend, that will be parsed in json.
app.use(cors())

// api endpoints
app.use("/api/form", fromRouter)
app.use("/api/user", userRouter)


app.get("/", (req, res)=>{ // just to test
    res.send("API working")
})


app.listen(PORT,()=>{
    console.log(`Server started on http://localhost:${PORT}`)
})