// productRoutes = require("./routes/product"),
// firebase_admin = require("firebase-admin"),
// service_account = require("./assets/mindle-53c21-firebase-adminsdk-t1bty-e86f64f8df.json")
// firebase_admin.initializeApp({
//   credential: firebase_admin.credential.cert(service_account),
// })

// const db = firebase_admin.firestore()
// db.collection("items").add({ foo: "bars" })
import express from "express"
import { ErrorHandler } from "./middlewares/res.mid"
import AuthRoutes from "./routes/auth.route"
import dotenv from "dotenv"
import cors from "cors"
import { Item, Order, User } from "./db_mock/db"
import OrdersRouter from "./routes/order.route"
import ItemsRouter from "./routes/items.route"

User.initiate().then((users) => console.log("users"))
Item.initiate().then((items) => console.log('items'))
Order.initiate().then((order) => console.log("orders"))

const app = express()
const PORT = process.env.PORT || 9905
const env = process.env.NODE_ENV || "dev"
dotenv.config()

// Middlewares
app.use(cors())
app.set("trust proxy", true)
app.use(express.json({ limit: "25mb" }))

app.use("/orders", OrdersRouter)
app.use("/auth", AuthRoutes)
app.use("/items", ItemsRouter)

app.use(ErrorHandler)

app.listen(PORT, () => {
  console.log("Listening on PORT", PORT)
})
