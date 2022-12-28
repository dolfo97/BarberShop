const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 6

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    min: 2,
    max: 25
  },
  lastName: {
    type: String,
    required: true,
    min: 2,
    max: 25
  },
  email: {
    type: String,
    required: true,
    min: 5,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 5,
    unique: true
  },
  pictuePath: {
    type: String,
    default: ''
  },
  friends: {
    type: Array,
    default: []
  },
  location: String,
  occupation: String,
  viewedProfile: Number,
  impressions: Number
}, {
  timestamps: true,
  toJSON: {
    transform (doc, ret) {
      delete ret.password
      return ret
    }
  }
})

userSchema.pre('save', async function (next) {
  // 'this' is the user doc
  if (!this.isModified('password')) return next()
  // update the password with the computed hash
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS)
  return next()
})

module.exports = model('User', userSchema)
