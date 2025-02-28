import connectDB from "./DB/index.js"
import { app } from "./app.js"
import dotenv from "dotenv";
dotenv.config({
    path: './.env'
})

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

connectDB().then(() => {
    app.listen(process.env.PORT || 8800, () => {
        console.log(`Server is running at port ${process.env.PORT}.`)
    })
}).catch((error) => {
    console.error("MongoDB Connection Failed!!!", error)
})
