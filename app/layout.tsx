import { ReactNode } from "react"
import "./global.css"

export default function Layout(props: { children: ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
