const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Boat = require("../models/Boat")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv").config()

const JWT_SECRET = process.env.JWT_SECRET

router.post("/", async (req, res) => {
  try {
    const token = req.body.token
    const tempuser = jwt.verify(token, JWT_SECRET)
    const _id = tempuser.id

    //checks if the user is loggedin
    checkuser = await User.findOne({
      _id,
    })

    await Boat.deleteOne({ ownerId: checkuser.id, boatId: req.body.boatId })

    res.json({
      status: "ok",
    })
  } catch (err) {
    res.json({
      status: "err",
    })
  }
})

module.exports = router
