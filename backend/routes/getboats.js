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

    const boats = await Boat.find({ ownerId: checkuser.id })

    const sendBoats = []
    boats.forEach((element) => {
      if (element.inUse === true) {
        var timepast = moment.duration(moment(new Date()).diff(moment(element.timeOfRent))).asSeconds()

        var sendElement = {
          inUse: element.inUse,
          _id: element._id,
          boatId: element.boatId,
          boatName: element.boatName,
          timeOfRent: element.timeOfRent,
          price: element.price,
          timePast: moment
            .utc(timepast * 1000)
            .format("HH:mm:ss")
            .toString(),
        }

        sendBoats.push(sendElement)
      } else {
        sendBoats.push(element)
      }
    })
    res.json({
      boats: sendBoats,
    })
  } catch (err) {
    res.json({
      status: "err",
    })
  }
})

module.exports = router
