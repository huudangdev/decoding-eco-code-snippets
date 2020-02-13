const multer = require('multer')
const Datauri = require('datauri')
const path = require('path')

const User = require('../models/user')
const cloudinary = require('../config/cloudinary')

const multerUpload = multer().single('profileImage')

// @route GET admin/user
// @desc Returns all users
// @access Public
exports.index = async function (req, res) {
  const users = await User.find({})
  res.status(200).json({ users })
}

// @route GET api/user/{id}
// @desc Returns a specific user
// @access Public
exports.show = async function (req, res) {
  try {
    const id = req.params.id

    const user = await User.findById(id)

    if (!user) return res.status(401).json({ message: 'User does not exist' })

    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route PUT api/user/{id}
// @desc Update user details
// @access Public
exports.update = async function (req, res) {
  try {
    const update = req.body
    const id = req.params.id
    const userId = req.user._id

    // Make sure the passed id is that of the logged in user
    if (userId.toString() !== id.toString()) return res.status(401).json({ message: "Sorry, you don't have the permission to update this data." })

    const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true })

    res.status(200).json({ user, message: 'User has been updated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route DESTROY api/user/{id}
// @desc Delete User
// @access Public
exports.destroy = async function (req, res) {
  try {
    const id = req.params.id
    const userId = req.user._id

    // Make sure the passed id is that of the logged in user
    if (userId.toString() !== id.toString()) return res.status(401).json({ message: "Sorry, you don't have the permission to delete this data." })

    await User.findByIdAndDelete(id)
    res.status(200).json({ message: 'User has been deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Upload
exports.upload = function (req, res) {
  multerUpload(req, res, function (err) {
    if (err) return res.status(500).json({ message: err.message })

    const { id } = req.user
    const dUri = new Datauri()
    const image = dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer)

    cloudinary.uploader.upload(image.content)
      .then((result) => User.findByIdAndUpdate(id, { $set: { profileImage: result.url } }, { new: true }))
      .then(user => res.status(200).json({ user }))
      .catch((error) => res.status(500).json({ message: error.message }))
  })
}
