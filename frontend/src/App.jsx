import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import "./styles/app.css"

import Home from "./components/Home"
import Login from "./components/account/Login"
import NotFound from "./components/NotFound"
import Control from "./components/Control"
import SignUp from "./components/account/SignUp"

export default function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/account/login" component={Login} />
          <Route path="/account/signup" component={SignUp} />
          <Route path="/control" component={Control} />

          <Route path="/" component={NotFound} />
        </Switch>
      </Router>
    </div>
  )
}
