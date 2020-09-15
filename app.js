const express = require("express")
const app = express()
const PORT = 5000
const {MONGOURI} = require("./keys")


mongoose.connect(MONGOURI)
mongoose.connection.on("connection", () => {
  console.log("connected successfuly")
})
mongoose.connection.on("error", (error) => {
  console.log(`error connecting ${error}`)
})


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})

