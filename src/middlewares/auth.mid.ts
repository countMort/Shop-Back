import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { DecodingRequest } from "../types/requests.type"
import responses from "./res.mid"
import { User } from "../db_mock/db"

export const verifyToken = (
  req: DecodingRequest,
  res: Response,
  next: NextFunction
) => {
  let token = getToken(req)
  if (token) {
    const checkBearer = "Bearer "
    if (token.startsWith(checkBearer)) {
      token = token.slice(checkBearer.length, token.length)
    }
    jwt.verify(token, process.env.SECRET || "", (err, decoded) => {
      if (err) {
        res.json({
          success: false,
          message: "Failed to authenticate",
        })
      } else {
        req.decoded = decoded as User
        next()
      }
    })
  } else {
    responses({ res, status: 401 })
  }
}

export const isAdmin = (
  req: DecodingRequest,
  res: Response,
  next: NextFunction
) => {
  if (["admin"].includes(req.decoded?.role || "")) {
    next()
  } else {
    responses({
      res,
      status: 403,
    })
  }
}

function getToken(req: Request) {
  const token = req.headers["x-access-token"] || req.headers["authorization"]
  return token && !Array.isArray(token) ? token : null
}
