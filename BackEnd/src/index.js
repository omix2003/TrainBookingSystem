import connectDB from "./DB/index.js"
import { app } from "./app.js"
import dotenv from "dotenv";
import cors from "cors";
dotenv.config({
    path: './.env'
})

app.use(cors({
    origin: process.env.CORS_ORIGIN || "https://trainbookingsystem-fe.onrender.com",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));
connectDB().then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running at port ${process.env.PORT}.`)
    })
}).catch((error) => {
    console.error("MongoDB Connection Failed!!!", error)
})
