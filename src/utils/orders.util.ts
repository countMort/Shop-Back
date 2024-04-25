import { Item } from "../db_mock/db"
import { OrderItem } from "../types/db.type"

export const items2Price = (all_items: Item[], req_items: OrderItem[]) => {
  const all_items_to_obj = all_items.reduce((pv, cv) => {
    return { ...pv, [cv.id!]: cv }
  }, {} as Record<string, Item>)

  const total = req_items.reduce((pv, cv) => {
    return (pv += all_items_to_obj[cv.id].price * cv.quantity)
  }, 0)
  const order_items = req_items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }))
  return { total, order_items, all_items_to_obj }
}
