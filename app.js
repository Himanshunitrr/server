const express = require("express")
const mongoose = require("mongoose")
const { MONGOURI } = require("./keys")
const User = require("./models/user")

const app = express()
const PORT = 5000


mongoose
  .connect(
    MONGOURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("Database connected");
  });


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})

