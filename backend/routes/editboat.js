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

    if (req.body.update == "name") {
      await Boat.findOneAndUpdate({ ownerId: checkuser.id, boatId: req.body.oldboatId }, { boatName: req.body.boatName })
    } else if (req.body.update == "id") {
      await Boat.findOneAndUpdate({ ownerId: checkuser.id, boatId: req.body.oldboatId }, { boatId: req.body.boatId })
    }
    if (req.body.update == "price") {
      await Boat.findOneAndUpdate({ ownerId: checkuser.id, boatId: req.body.oldboatId }, { price: req.body.price })
    }

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
