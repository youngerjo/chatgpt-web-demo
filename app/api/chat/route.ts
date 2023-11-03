import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"
import cors from "./cors"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = "edge"

export function OPTIONS(request: Request) {
  return cors()(request)
}

export async function POST(req: Request) {
  const handler = cors(async (req) => {
    const json = await req.json()
    const { model, messages, user } = json as OpenAI.Chat.CompletionCreateParams

    const params = {
      model: model ?? "gpt-3.5-turbo",
      max_tokens: 256,
      temperature: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }

    const response = await openai.chat.completions.create({
      ...params,
      messages,
      user,
      stream: true,
    })

    return new StreamingTextResponse(OpenAIStream(response))
  })

  return handler(req)
}
