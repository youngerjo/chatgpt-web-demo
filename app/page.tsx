"use client"

import { useRef, useEffect } from "react"
import { useChat } from "ai/react"

export default function Page() {
  const textField = useRef<HTMLInputElement>()
  const messageEnd = useRef<HTMLLIElement>()

  const { isLoading, messages, input, handleInputChange, handleSubmit } =
    useChat({
      api: `/api/chat`,
      body: {
        model: "gpt-3.5-turbo",
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
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row justify-between gap-2 p-2 border-t">
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
                <span>Waiting</span>
              </div>
            ) : (
              <span>Send</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
