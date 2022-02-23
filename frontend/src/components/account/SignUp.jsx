import React, { useState, useEffect } from "react"
import axios from "axios"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errMsg, setErrMsg] = useState("")

  useEffect(() => {
    //checks if you logged in
    axios
      .post(process.env.REACT_APP_DOMAIN + "api/account/loggedin", {
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        if (res.data.loggedin === true) {
          return (window.location.href = "/")
        }
      })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    const signedin = {
      email: email.toLowerCase(),
      password: password,
    }

    //send the user data to the api
    axios.post(process.env.REACT_APP_DOMAIN + "api/account/signup", signedin).then((res) => {
      if (res.data.status === "ok") {
        localStorage.setItem("token", res.data.token)
        setErrMsg("Everything went fine")
      } else {
        setErrMsg(res.data.msg)
      }
    })
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input type="email" placeholder="E-mail" onChange={(event) => setEmail(event.target.value)} />
          <input type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button type="submit">Sign Up</button>
      </form>
      {errMsg}

      <a href="/">
        <button>Back</button>
      </a>
    </div>
  )
}
