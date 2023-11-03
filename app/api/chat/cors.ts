import { Headers } from "cross-fetch"
import { NextRequest } from "next/server"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

type Handler = (req: Request | NextRequest) => Response | Promise<Response>

export default function middleware(handler?: Handler) {
  return async (req: Request) => {
    if (!handler || req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    const result = await handler(req)
    const headers = new Headers()

    result.headers.forEach((value, key) => {
      headers.set(key, value)
    })

    Object.entries(corsHeaders).forEach(([key, value]) => {
      headers.set(key, value)
    })

    return new Response(result.body, {
      status: result.status,
      statusText: result.statusText,
      headers,
    })
  }
}
