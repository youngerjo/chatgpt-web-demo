import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = "edge"

export async function POST(req: Request) {
  const json = await req.json()
  const { model, messages, user } =
    json as OpenAI.ChatCompletionCreateParamsStreaming

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
}
