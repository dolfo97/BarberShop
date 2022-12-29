import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.js"

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation
    } = req.body

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000)
    })
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ msg: 'User does not exist. ' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials. ' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    delete user.password
    res.status(200).json({ token, user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// const checkToken = (req, res) => {
//   console.log('req.user', req.user)
//   res.json(req.exp)
// }

// const dataController = {
//   async create (req, res, next) {
//     try {
//       const user = await User.create(req.body)
//       // token will be a string
//       const token = createJWT(user)
//       // send back the token as a string
//       // which we need to account for
//       // in the client
//       res.locals.data.user = user
//       res.locals.data.token = token
//       next()
//     } catch (e) {
//       res.status(400).json(e)
//     }
//   },
//   async login (req, res, next) {
//     try {
//       const user = await User.findOne({ email: req.body.email })
//       if (!user) throw new Error()
//       const match = await bcrypt.compare(req.body.password, user.password)
//       if (!match) throw new Error()
//       res.locals.data.user = user
//       res.locals.data.token = createJWT(user)
//       next()
//     } catch {
//       res.status(400).json('Bad Credentials')
//     }
//   }
// }

// const apiController = {
//   auth (req, res) {
//     res.json(res.locals.data.token)
//   }
// }

// module.exports = {
//   checkToken,
//   dataController,
//   apiController
// }

// /* -- Helper Functions -- */

// function createJWT (user) {
//   return jwt.sign(
//     // data payload
//     { user },
//     process.env.SECRET,
//     { expiresIn: '24h' }
//   )
// }
