const express = require("express")
const router = express.Router()
const User = require("../../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv").config()

const JWT_SECRET = process.env.JWT_SECRET

router.post("/", async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password

    tempuser = await User.findOne({
      email: email,
    })

    if (await bcrypt.compare(password, tempuser.password)) {
      token = jwt.sign(
        {
          id: tempuser._id,
          email: tempuser.email,
        },
        JWT_SECRET
      )

      if (token == "undefined" || token == null) return res.json({ status: "err", msg: "Email or password wrong" })
      return res.json({
        status: "ok",
        token: token,
      })
    } else {
      return res.json({ status: "err", msg: "Email or password wrong" })
    }
  } catch {
    return res.json({ status: "err", msg: "Something went wrong" })
  }
})

module.exports = router
