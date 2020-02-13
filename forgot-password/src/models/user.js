const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const Token = require('../models/token')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: 'Your email is required',
    trim: true
  },

  username: {
    type: String,
    unique: true,
    required: 'Your username is required'
  },

  password: {
    type: String,
    required: 'Your password is required',
    max: 100,
    min: 6
  },

  firstName: {
    type: String,
    required: 'First Name is required',
    max: 100
  },

  lastName: {
    type: String,
    required: 'Last Name is required',
    max: 100
  },

  bio: {
    type: String,
    required: false,
    max: 255
  },

  profileImage: {
    type: String,
    required: false,
    max: 255
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  resetPasswordToken: {
    type: String,
    required: false
  },

  resetPasswordExpires: {
    type: Date,
    required: false
  }
}, { timestamps: true })

userSchema.pre('save', function (next) {
  const user = this

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, (err, hashed) => {
      if (err) return next(err)

      user.password = hashed
      next()
    })
  })
})

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

// to gen a token with expiration
userSchema.methods.generateJWT = function () {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 60)

  const payload = {
    id: this._id,
    email: this.email,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
  })
}

// to send mail a token
userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex')
  this.resetPasswordExpires = Date.now() + 3600000 // expires in an hour
}

// return new token after verificate email
userSchema.methods.generateVerificationToken = function () {
  const payload = {
    userId: this._id,
    token: crypto.randomBytes(20).toString('hex')
  }

  return new Token(payload)
}

module.exports = mongoose.model('Users', userSchema)
