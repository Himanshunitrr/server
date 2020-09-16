const express = require("express")
const app = express()
const mongoose = require("mongoose")
const { MONGOURI } = require("./keys")
const User = require("./models/user")
const Post = require("./models/post")
const authRoutes = require("./routes/auth")
const postRoutes = require("./routes/post")

const PORT = 5000

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

  
app.use(express.json());
app.use(authRoutes);
app.use(postRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})

