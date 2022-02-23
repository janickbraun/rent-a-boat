import React from "react"

export default function NotFound() {
  return (
    <div>
      <h2>404 Page not found on this path: {window.location.pathname}</h2>
      <a href="/">
        <button>Back to Home</button>
      </a>
    </div>
  )
}
