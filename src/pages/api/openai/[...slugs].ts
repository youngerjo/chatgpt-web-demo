import { NextApiRequest, NextApiResponse } from "next/types"
import NextCors from "nextjs-cors"
import axios, { AxiosError } from "axios"
import axiosRetry from "axios-retry"

axiosRetry(axios, {
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error: AxiosError<unknown, any>) => {
    if (axiosRetry.isNetworkOrIdempotentRequestError(error)) {
      return true
    } else if (error.response && error.response.status == 429) {
      return true
    } else {
      return false
    }
  },
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await NextCors(req, res, {
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      origin: "*",
      optionsSuccessStatus: 200,
    })

    const {
      method,
      query: { slugs },
      body,
    } = req

    const { status, data } = await axios({
      method,
      url: `https://api.openai.com/v1/${(slugs as string[]).join("/")}`,
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      data: body,
    })

    res.status(status).json(data)
  } catch (error) {
    const { message, request, response } = error

    if (response) {
      res.status(response.status).json({ error: response.body })
    } else if (request) {
      res.status(502).end()
    } else {
      res.status(500).json({ error: message })
    }
  }
}
