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

    const allBoats = await Boat.find({ ownerId: checkuser.id })
    for (let i = 0; i < allBoats.length; i++) {
      if (allBoats[i].boatId === req.body.boatId) {
        return res.json({
          msg: "Your boat ID has to be unique",
        })
      }
    }

    const newBoat = new Boat({
      boatId: req.body.boatId,
      boatName: req.body.boatName,
      price: req.body.price,
      ownerId: checkuser.id,
    })
    await newBoat.save().then(() => {
      res.json({
        msg: "Everything went fine",
      })
    })
  } catch (error) {
    res.json({
      msg: "Something went wrong",
    })
  }
})

module.exports = router
