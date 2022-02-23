const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Boat = require("../models/Boat")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv").config()
const moment = require("moment")

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

    var testboat = await Boat.findOne({ boatId: req.body.boatId, ownerId: checkuser.id })
    var timepast = moment.duration(moment(new Date()).diff(moment(testboat.timeOfRent))).asSeconds()

    var finaltime = moment
      .utc(timepast * 1000)
      .format("HH:mm:ss")
      .toString()

    await Boat.updateOne(
      {
        boatId: req.body.boatId,
        ownerId: checkuser.id,
      },
      {
        $set: {
          inUse: false,
        },
      }
    )
    await Boat.findOne({ boatId: req.body.boatId, ownerId: checkuser.id }, (err, boat) => {
      boat.timeOfRent = undefined
      boat.save()
    }).then(() => {
      return res.json({
        status: "ok",
        timePast: finaltime,
      })
    })
  } catch {
    res.json({
      status: "err",
    })
  }
})

module.exports = router
