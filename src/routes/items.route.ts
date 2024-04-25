import { Router } from "express"
import responses from "../middlewares/res.mid"
import { Item } from "../db_mock/db"
const ItemsRouter = Router()

ItemsRouter.get("/", async (req, res, next) => {
  try {
    const items = Item.find() || []
    responses({ res, results: items })
  } catch (error) {
    next(error)
  }
})

export default ItemsRouter
