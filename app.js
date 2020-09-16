const express = require("express")
const mongoose = require("mongoose")
const { MONGOURI } = require("./keys")
const User = require("./models/user")
const authRoutes = require("./routes/auth")

const app = express()
const PORT = 5000

app.use(express.json())
app.use(authRoutes)


mongoose
  .connect(
    MONGOURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    console.log("Database connected");
  });


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})

