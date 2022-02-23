const express = require("express")
const router = express.Router()

router.get("/", async (req, res) => {
  res.send("server is online")
})

module.exports = router
