const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const postSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean
    },
    comments: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
)

module.exports = model('Post', postSchema)
