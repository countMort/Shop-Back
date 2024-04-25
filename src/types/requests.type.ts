import { NextFunction, Request, Response } from "express"
import { User } from "../db_mock/db"

export interface DecodingRequest extends Request {
  decoded?: User
}

export type Status = number

export type ResponseTitles = string[]

export enum ErrorStatus {
  InsufficientEntry = 400,
  Login = 401,
  UnAuthorized = 403,
  NotFound = 404,
  UnsupportedFormat = 415,
}

export enum SuccessStatus {
  OK = 200,
  Created = 201,
  Updated = 202,
  Deleted = 204,
}

export interface ResponsesArgs {
  res: Response
  status?: Status
  response_titles?: string[]
  results?: any
}
