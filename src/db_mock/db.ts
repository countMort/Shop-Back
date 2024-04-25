import { readFile, writeFile } from "fs/promises"
import path from "path"
import { OrderItem, UserRole } from "../types/db.type"
import { v4 } from "uuid"
import bcrypt from "bcrypt"

export class User {
  private static users?: User[]
  private static path = path.resolve(__dirname, "users.json")

  get role() {
    return this.user_role
  }

  static async initiate() {
    if (!User.users) {
      const users_str = await readFile(User.path, "utf8")
      const raw_users = JSON.parse(users_str) as User[]
      const users = raw_users.map(
        (user) => new User(user.username, user.password, user.role, user.id)
      )
      User.users = users
    }
    return User.find()
  }

  static find() {
    return JSON.parse(JSON.stringify(User.users)) as User[]
  }

  static async findByUsername(username: string) {
    return JSON.parse(
      JSON.stringify(User.users?.find((user) => user.username === username))
    )
  }

  static findById(id: string) {
    return User.users?.find((user) => user.id === id)
  }

  static async deleteById(id: string) {
    let deleted_user: User | undefined
    User.users = User.users?.filter((user) => {
      if (user.id !== id) return true
      else {
        deleted_user = user
      }
    })
    if (deleted_user)
      await writeFile(User.path, JSON.stringify(User.users, null, 2), "utf-8")
    return deleted_user
  }

  constructor(
    public username: string,
    private password: string,
    private user_role: UserRole = "user",
    public id?: string
  ) {}

  async save() {
    if (!User.users) return
    if (!this.id) {
      this.id = v4()
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(this.password, salt)
      this.password = hash
      User.users!.push(this)
    }
    await writeFile(User.path, JSON.stringify(User.users, null, 2), "utf-8")
    return this
  }

  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password)
  }
}

export class Item {
  private static items?: Item[]
  private static path = path.resolve(__dirname, "items.json")
  static async initiate() {
    if (!Item.items) {
      const orders_str = await readFile(Item.path, "utf8")
      const raw_items = JSON.parse(orders_str) as Item[]
      const items = raw_items.map(
        (item) => new Item(item.name, item.price, item.id)
      )
      Item.items = items
    }
    return Item.find()
  }

  static find() {
    return JSON.parse(JSON.stringify(Item.items)) as Item[]
  }

  static async findByName(item_name: string) {
    return JSON.parse(
      JSON.stringify(Item.items?.find((item) => item.name === item_name))
    )
  }

  static async findById(id: string) {
    return JSON.parse(
      JSON.stringify(Item.items?.find((user) => user.id === id))
    )
  }

  static async deleteById(id: string) {
    let deleted_item: Item | undefined
    Item.items = Item.items?.filter((item) => {
      if (item.id !== id) return true
      else {
        deleted_item = item
      }
    })
    if (deleted_item)
      await writeFile(Item.path, JSON.stringify(Item.items, null, 2), "utf-8")
    return deleted_item
  }

  constructor(public name: string, public price: number, public id?: string) {}

  async save() {
    if (!Item.items) return
    if (!this.id) {
      this.id = v4()
      Item.items.push(this)
    }
    await writeFile(Item.path, JSON.stringify(Item.items, null, 2), "utf-8")
    return this
  }
}

export class Order {
  private static orders?: Order[]
  private static path = path.resolve(__dirname, "orders.json")

  static async initiate() {
    if (!Order.orders) {
      const orders_str = await readFile(Order.path, "utf8")
      const raw_orders = JSON.parse(orders_str) as Order[]
      const orders = raw_orders.map(
        (order) =>
          new Order(
            order.customer_name,
            order.customer_address,
            order.items,
            order.total,
            order.date,
            order.id
          )
      )
      Order.orders = orders
    }
    return Order.find()
  }

  static find() {
    return JSON.parse(JSON.stringify(Order.orders)) as Order[]
  }

  static findById(id: string) {
    return Order.orders?.find((user) => user.id === id)
  }

  static async deleteById(id: string) {
    let deleted_order: Order | undefined
    Order.orders = Order.orders?.filter((order) => {
      if (order.id !== id) return true
      else {
        deleted_order = order
      }
    })
    if (deleted_order)
      await writeFile(
        Order.path,
        JSON.stringify(Order.orders, null, 2),
        "utf-8"
      )
    return deleted_order
  }

  constructor(
    public customer_name: string,
    public customer_address: string,
    public items: OrderItem[],
    public total?: number,
    public date = new Date(),
    public id?: string
  ) {}

  async save() {
    if (!Order.orders) return
    if (!this.id) {
      this.id = v4()
      Order.orders.push(this)
    }
    await writeFile(Order.path, JSON.stringify(Order.orders, null, 2), "utf-8")
  }
}

// export class Item {
//   private static store_arr: Item[]
//   private static path?: string
//   private id?: string
//   get _id() {
//     return this.id
//   }
//   date = new Date()

//   static async initiate(path: string) {
//     if (path && !Item.store_arr) {
//       const items_str = await readFile(path, "utf8")
//       Item.store_arr = JSON.parse(items_str) as Item[]
//     }
//   }

//   static async findById(id: string) {
//     return JSON.parse(
//       JSON.stringify(Item.store_arr?.find((item) => item.id === id))
//     )
//   }

//   static async deleteById(id: string) {
//     if (!Item.path) return
//     let deleted_item: Item | undefined
//     Item.store_arr = Item.store_arr?.filter((item) => {
//       if (item.id !== id) return true
//       else {
//         deleted_item = item
//       }
//     })
//     if (deleted_item)
//       await writeFile(
//         Item.path,
//         JSON.stringify(Item.store_arr, null, 2),
//         "utf-8"
//       )
//     return deleted_item
//   }

//   constructor() {}

//   async save() {
//     if (!Item.store_arr || !Item.path) return
//     if (!this.id) {
//       this.id = v4()
//       Item.store_arr.push(this)
//     }
//     await writeFile(Item.path, JSON.stringify(Item.store_arr, null, 2), "utf-8")
//   }
// }
