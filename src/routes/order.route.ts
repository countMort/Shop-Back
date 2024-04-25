import { Router, RequestHandler } from "express"
import { verifyToken, isAdmin } from "../middlewares/auth.mid"
import responses from "../middlewares/res.mid"
import { Item, Order } from "../db_mock/db"
import { ErrorStatus, SuccessStatus } from "../types/requests.type"
import { items2Price } from "../utils/orders.util"
const OrdersRouter = Router()

OrdersRouter.post("", async function (req, res, next) {
  try {
    const all_items = Item.find()
    if (!all_items) return next(new Error("No items available"))
    const { total, order_items } = items2Price(all_items, req.body.items)
    const order = new Order(
      req.body.customer_name.trim(),
      req.body.customer_address.trim(),
      order_items,
      total
    )
    await order.save()
    responses({
      res,
      status: SuccessStatus.Created,
      response_titles: ["Order"],
      results: order,
    })
  } catch (error) {
    next(error)
  }
})

OrdersRouter.get("", async (req, res, next) => {
  try {
    const orders = Order.find() || []
    responses({ res, results: orders.reverse() })
  } catch (error) {
    next(error)
  }
})

OrdersRouter.get("/:id", async (req, res, next) => {
  try {
    const order = Order.findById(req.params.id)
    if (order) {
      const items = Item.find()
      const { all_items_to_obj } = items2Price(items, order.items)
      order.items = order.items.map((item) => ({
        ...item,
        ...all_items_to_obj[item.id],
      }))
      responses({ res, results: order })
    } else {
      responses({
        res,
        status: ErrorStatus.NotFound,
        response_titles: ["Order"],
      })
    }
  } catch (error) {
    next(error)
  }
})

OrdersRouter.put("/:id", async function (req, res, next) {
  try {
    const order = Order.findById(req.params.id)
    if (!order)
      return responses({
        res,
        status: ErrorStatus.NotFound,
        response_titles: ["Order"],
      })
    order.customer_name = req.body.customer_name
    order.customer_address = req.body.customer_address
    if (req.body.items) {
      const all_items = Item.find()
      if (!all_items) return next(new Error("No items available"))

      const { total, order_items } = items2Price(all_items, req.body.items)
      order.items = order_items
      order.total = total
    }
    await order.save()
    responses({
      res,
      status: SuccessStatus.Updated,
      results: order,
      response_titles: ["Order"],
    })
  } catch (error) {
    next(error)
  }
})

OrdersRouter.delete("/:id", async function (req, res, next) {
  try {
    const deletedOrder = await Order.deleteById(req.params.id)
    if (deletedOrder) {
      responses({
        res,
        response_titles: ["Order"],
        status: SuccessStatus.Deleted,
        results: deletedOrder,
      })
    } else {
      responses({
        res,
        status: ErrorStatus.NotFound,
        response_titles: ["Order"],
      })
    }
  } catch (error) {
    next(error)
  }
} as RequestHandler)

export default OrdersRouter
