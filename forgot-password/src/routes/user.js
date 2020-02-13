const express = require('express')
const { check } = require('express-validator')

const User = require('../controllers/user')

const router = express.Router()

const validate = require('../middlewares/validate')

// INDEX
router.get('/', User.index)

// SHOW
router.get('/:id', User.show)

// UPDATE
router.put('/:id', User.update)

// DELETE
router.delete('/:id', User.destroy)

// UPLOAD
router.post('/upload', User.upload)

module.exports = router
