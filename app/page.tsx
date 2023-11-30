"use client"

import { useRef, useEffect, useState } from "react"
import { useChat } from "ai/react"

const models = [
  {
    name: "GPT-4-Turbo",
    value: "gpt-4-1106-preview",
  },
  {
    name: "GPT-3.5-Turbo",
    value: "gpt-3.5-turbo",
  },
]

export default function Page() {
  const textField = useRef<HTMLInputElement>()
  const messageEnd = useRef<HTMLLIElement>()
  const [selectedModel, setSelectedModel] = useState(models[0].value)

  const {
    isLoading,
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat({
    api: `/api/chat`,
    body: {
      model: selectedModel,
    },
  })

  useEffect(() => {
    if (messageEnd.current) {
      messageEnd.current.scrollIntoView()
    }
  }, [messages])

  useEffect(() => {
    if (textField.current && !isLoading) {
      textField.current.focus()
    }
  }, [isLoading])

  return (
    <div className="h-screen flex flex-col items-stretch">
      <div className="border-b bg-base-100">
        <div className="container mx-auto max-w-2xl flex flex-row items-center justify-between gap-2">
          <select
            className="select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {models.map((model) => (
              <option key={model.value} value={model.value}>
                {model.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setMessages([])}
            className="btn btn-sm btn-ghost btn-error uppercase"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <ul className="container mx-auto max-w-2xl p-4">
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
      </div>
      <form onSubmit={handleSubmit}>
        <div className="border-t bg-base-100">
          <div className="container mx-auto max-w-2xl flex flex-row justify-between gap-2 p-2">
            <input
              ref={textField}
              type="text"
              className={`input input-bordered w-full ${
                isLoading ? "input-disabled" : ""
              }`}
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="btn btn-primary uppercase w-32"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex flex-row items-center gap-2">
                  <span className="loading loading-spinner" />
                </div>
              ) : (
                <span>Send</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
