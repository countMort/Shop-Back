import { RequestHandler, Router } from "express"
import jwt from "jsonwebtoken"
import { verifyToken, isAdmin } from "../middlewares/auth.mid"
import responses from "../middlewares/res.mid"
import {
  DecodingRequest,
  ErrorStatus,
  SuccessStatus,
} from "../types/requests.type"
import { User } from "../db_mock/db"
const AuthRouter = Router()

AuthRouter.post("/signup", async (req, res, next) => {
  try {
    if (!req.body.phone || !req.body.password) {
      responses({
        res,
        status: 400,
        response_titles: ["Please enter your username and password."],
      })
    } else {
      const newUser = new User(req.body.username.trim(), req.body.password)
      await newUser.save()
      const token = jwt.sign(newUser, process.env.SECRET || "", {
        expiresIn: 604800, // 1 week
      })

      responses({
        res,
        status: 201,
        response_titles: ["Your account"],
        results: { token, user: newUser },
      })
    }
  } catch (error: any) {
    next(error)
  }
})

AuthRouter.get(
  "/user",
  verifyToken,
  async (req: DecodingRequest, res, next) => {
    try {
      const foundUser = User.findById(req.decoded?.id!)

      if (foundUser) {
        responses({ res, results: foundUser })
      } else {
        responses({
          res,
          status: ErrorStatus.NotFound,
          response_titles: ["User"],
        })
      }
    } catch (error: any) {
      next(error)
    }
  }
)

AuthRouter.post("/login", async (req, res, next) => {
  try {
    const foundUser = await User.findByUsername(req.body.username)
    if (!foundUser) {
      responses({
        res,
        status: ErrorStatus.NotFound,
        response_titles: ["User & Password"],
      })
    } else {
      if (foundUser.comparePassword(req.body.password)) {
        const token = jwt.sign(foundUser.toJSON(), process.env.SECRET || "", {
          expiresIn: 6048000, // 10 week
        })
        responses({
          res,
          results: token,
        })
      } else {
        responses({
          res,
          status: ErrorStatus.NotFound,
          response_titles: ["User & Password"],
        })
      }
    }
  } catch (error) {
    next(error)
  }
})

AuthRouter.post("/logout", verifyToken, async (req, res, next) => {
  try {
    return responses({ res })
  } catch (error) {
    next(error)
  }
})

AuthRouter.delete("/user/:id", [verifyToken, isAdmin], async function (
  req,
  res,
  next
) {
  try {
    const deletedUser = await User.deleteById(req.params.id)
    if (deletedUser) {
      return responses({
        res,
        status: SuccessStatus.Deleted,
        response_titles: ["User"],
      })
    }
  } catch (error) {
    next(error)
  }
} as RequestHandler)

export default AuthRouter
