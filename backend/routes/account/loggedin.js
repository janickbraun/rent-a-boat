const express = require("express")
const router = express.Router()
const User = require("../../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv").config()

const JWT_SECRET = process.env.JWT_SECRET

router.post("/", async (req, res) => {
  try {
    const token = req.body.token
    const tempuser = jwt.verify(token, JWT_SECRET)
    const _id = tempuser.id

    checkuser = await User.findOne({
      _id,
    })
    res.json({
      loggedin: true,
      email: checkuser.email,
      id: checkuser.id,
    })
  } catch {
    res.json({
      loggedin: false,
    })
  }
})

module.exports = router
