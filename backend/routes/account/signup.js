const express = require("express")
const router = express.Router()
const User = require("../../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv").config()

const JWT_SECRET = process.env.JWT_SECRET

router.post("/", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  if (req.body.fullName == "" || req.body.username == "" || req.body.email == "" || req.body.password == "") {
    return res.json({ status: "err", msg: "Invalid input" })
  } else if (req.body.password.length < 6) {
    return res.json({ status: "err", msg: "Password has to be at least 6 characters long" })
  }

  const signedUpUser = new User({
    email: req.body.email,
    password: hashedPassword,
  })
  await signedUpUser
    .save()
    .then(async (data) => {
      tempuser = await User.findOne({
        email: req.body.email,
      })

      token = jwt.sign(
        {
          id: tempuser._id,
          email: tempuser.email,
        },
        JWT_SECRET
      )

      return res.json({
        status: "ok",
        token: token,
      })
    })
    .catch((err) => {
      if (err.message.startsWith("E11000")) {
        return res.json({ status: "err", msg: "Username or email is already in use" })
      }
    })
})

module.exports = router
