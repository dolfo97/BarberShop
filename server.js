// require('./config/database')
import express from "express"
import bodyParser from "body-parser"
import path from "path"
import dotenv from "dotenv"
// const favicon = require('serve-favicon')
// const logger = require('morgan')
// const bodyParser = require('body-parser')
import multer from "multer"
import favicon from "serve-favicon"
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import { register } from "./controllers/auth.js"
import { createPost } from "./controllers/posts.js"
import { verifyToken } from "./middleware/auth.js"
const PORT = process.env.PORT || 3001


const __filename = fileURLToPath(import.meta.url)
dotenv.config()
const app = express()
app.use(express.json())// req.body
app.use((req, res, next) => {
  res.locals.data = {}
  next()
})
// app.use(logger('dev'))
// app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')))
// app.use(express.static(path.join(__dirname, 'build')))


app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
// app.use('/images', express.static(path.join(__dirname, 'src/components/images')))

// FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, 'src/components/images')
  },
  filename: function (req, res, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage })

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`I am listening on ${PORT}`)
})
