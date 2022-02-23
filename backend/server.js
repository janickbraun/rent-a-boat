const express = require("express")
const app = express()
const server = require("http").createServer(app)
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv").config()
const cors = require("cors")
const path = require("path")
const PORT = 5000
const JWT_SECRET = process.env.JWT_SECRET

const indexRouter = require("./routes/index")
const loginRouter = require("./routes/account/login")
const loggedInRouter = require("./routes/account/loggedin")
const signUpRouter = require("./routes/account/signup")
const addBoatRouter = require("./routes/addboat")
const getBoatsRouter = require("./routes/getboats")
const startBoatRouter = require("./routes/startboat")
const stopBoatRouter = require("./routes/stopboat")
const getPriceRouter = require("./routes/getprice")
const deleteBoatRouter = require("./routes/deleteboat")
const editBoatRouter = require("./routes/editboat")

//connects to the database
mongoose.connect(
  process.env.DB_ADRESS,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => console.log("Connected to Database")
)

app.use(express.json())
app.use(cors())
app.use("/", indexRouter)
app.use("/api/account/login", loginRouter)
app.use("/api/account/loggedin", loggedInRouter)
app.use("/api/addboat", addBoatRouter)
app.use("/api/getboats", getBoatsRouter)
app.use("/api/startboat", startBoatRouter)
app.use("/api/getprice", getPriceRouter)
app.use("/api/stopboat", stopBoatRouter)
app.use("/api/account/signup", signUpRouter)
app.use("/api/deleteboat", deleteBoatRouter)
app.use("/api/editboat", editBoatRouter)

server.listen(process.env.PORT || PORT, () => console.log("Server starting at http://localhost:" + PORT))
