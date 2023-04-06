import axios from "axios"
import { FormEvent, useEffect, useRef, useState } from "react"

interface Message {
  role: string
  content: string
}

interface Choice {
  index: number
  message: Message
  finish_reason: string
}

interface Usage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

interface ChatCompletionData {
  id: string
  object: string
  created: number
  choices: Choice[]
  usage: Usage
}

export default function Page() {
  const textField = useRef<HTMLInputElement>()
  const messageEnd = useRef<HTMLLIElement>()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault()

    let newMessage = {
      role: "user",
      content: inputText,
    }

    setMessages((prevMessages) => [...prevMessages, newMessage])
    setLoading(true)

    const res = await axios.post("/api/openai/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [...messages, newMessage],
    })

    const data: ChatCompletionData = res.data
    console.log(data)

    setMessages((prevMessages) => {
      let newMessages = [...prevMessages]

      data.choices.forEach((choice) => {
        newMessages.push(choice.message)
      })

      return newMessages
    })
    setInputText("")
    setLoading(false)
  }

  useEffect(() => {
    if (!loading) {
      if (textField.current) {
        textField.current.focus()
      }

      if (messageEnd.current) {
        messageEnd.current.scrollIntoView()
      }
    }
  }, [loading])

  return (
    <div className="container mx-auto h-screen flex flex-col justify-between items-stretch">
      <ul className="overflow-auto py-4">
        {messages
          .filter((message) => message.role != "system")
          .map((message, index) => (
            <li
              key={index}
              className={`chat ${
                message.role == "user" ? "chat-end" : "chat-start"
              }`}
            >
              {message.role == "assistant" && (
                <div className="chat-header">ChatGPT</div>
              )}
              <div
                className={`chat-bubble ${
                  message.role == "user"
                    ? "chat-bubble-primary"
                    : "chat-bubble-secondary"
                }`}
              >
                {message.content}
              </div>
            </li>
          ))}
        <li ref={messageEnd} />
      </ul>
      <form onSubmit={sendMessage}>
        <div className="flex flex-row justify-between gap-2 my-4">
          <input
            ref={textField}
            type="text"
            className={`input input-bordered w-full ${
              loading ? "text-gray-600" : "text-primary"
            }`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
          ></input>
          <button
            type="submit"
            className={`btn btn-primary w-32 ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Waiting" : "Send"}
          </button>
        </div>
      </form>
    </div>
  )
}
