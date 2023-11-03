"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { useChat } from "ai/react"

export default function Page() {
  const textField = useRef<HTMLInputElement>()
  const messageEnd = useRef<HTMLLIElement>()
  const [inputText, setInputText] = useState("")
  const [loading, setLoading] = useState(false)

  const chat = useChat({
    api: `/api/chat`,
    body: {
      model: "gpt-3.5-turbo",
    },
  })

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault()

    setLoading(true)

    await chat.append({
      role: "user",
      content: inputText,
    })

    setInputText("")
    setLoading(false)
  }

  useEffect(() => {
    if (messageEnd.current) {
      messageEnd.current.scrollIntoView()
    }

    if (!loading) {
      if (textField.current) {
        textField.current.focus()
      }
    }
  }, [loading])

  return (
    <div className="container mx-auto h-screen flex flex-col justify-between items-stretch">
      <ul className="overflow-auto py-4">
        {chat.messages
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
              loading ? "input-disabled" : ""
            }`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
          ></input>
          <button
            type="submit"
            className="btn btn-primary w-32"
            disabled={loading}
          >
            {loading ? (
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
