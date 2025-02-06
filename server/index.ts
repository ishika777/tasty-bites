import dotenv from "dotenv"
dotenv.config({path : "../.env"})
import express from "express"
const app = express()
const PORT = process.env.PORT || 3000

import connectDb from "./db/connectDb.js"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"

import UserRouter from "./routes/user.route.js"
import RestaurantRouter from "./routes/restaurant.route.js"
import MenuRouter from "./routes/menu.route.js"
import orderRouter from "./routes/order.route.js"

const DIRNAME = path.resolve()

const corsOption = {
    origin : process.env.FRONTEND_URL,
    credentials : true
}

app.use(bodyParser.json({limit : "10mb"}));
app.use(express.urlencoded({extended : true, limit : "10mb"}));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));

app.use("/api/v1/user", UserRouter)
app.use("/api/v1/restaurant", RestaurantRouter)
app.use("/api/v1/menu", MenuRouter)
app.use("/api/v1/order", orderRouter)

app.use(express.static(path.join(DIRNAME, "/client/dist")))
app.use("*", (_, res) => {    
    res.sendFile(path.resolve(DIRNAME, "client","dist","index.html"))
})


app.listen(PORT, () => {
    connectDb()
    console.log(`server is listening on port ${PORT}`)
})
