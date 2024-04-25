import { ErrorRequestHandler } from "express"
import {
  ErrorStatus,
  ResponseTitles,
  ResponsesArgs,
  Status,
  SuccessStatus,
} from "../types/requests.type"

const error = (status: ErrorStatus, response_titles: ResponseTitles) => {
  const errors = {
    [ErrorStatus.InsufficientEntry]:
      response_titles[0] || "Insufficient Entry.",
    [ErrorStatus.Login]: "Login Required",
    [ErrorStatus.UnAuthorized]: "Not Authorized",
    [ErrorStatus.NotFound]: `${response_titles.join("،")} Not found.`,
    [ErrorStatus.UnsupportedFormat]: `Unsupported Format ${response_titles.join(
      "،"
    )}`,
  }
  return errors[status]
}

const success = (
  status: SuccessStatus = 200,
  response_titles: ResponseTitles
) => {
  const successes = {
    [SuccessStatus.OK]: response_titles.join("،"),
    [SuccessStatus.Created]: `${response_titles.join(
      "،"
    )} Successfully Created.`,
    [SuccessStatus.Deleted]: `${response_titles.join(
      "،"
    )} Successfully Deleted.`,
    [SuccessStatus.Updated]: `${response_titles.join(
      "،"
    )} Successfully Updated.`,
  }
  return successes[status]
}

const responses = ({
  res,
  status = SuccessStatus.OK,
  response_titles = [""],
  results,
}: ResponsesArgs) => {
  const response: any = {}
  if (status >= 400 && status < 500) {
    response.message = error(status, response_titles)
    response.success = false
  } else if (status == 500) {
    response.message = response_titles[0]
    response.success = false
  } else if (status >= 200 && status < 300) {
    response.message = success(status, response_titles)
    response.success = true
    response.results = results
  }
  // return res.status(status).json(response)
  // Adds a fake delay
  setTimeout(() => {
    res.status(status).json(response)
  }, 2000)
}

export default responses

export const ErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const errStatus = err.statusCode || 500
  const errMsg = err.message || "Something went wrong"
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  })
}
