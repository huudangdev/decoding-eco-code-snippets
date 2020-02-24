const express = require('express')
const route = express.Router()
const multer = require('multer')
const upload = multer({ dest: '../uploads/' })

route.get('/', (req, res) => {
  res.render('index.hbs')
})

route.post('/', upload.single(',=myFile'), (req, res) => {
  if (req.file) {
    console.log('Uploading...')
    var filename = req.file.filename
    var uploadStatus = 'File Upload Successfully'
  } else {
    console.log('No File Uploaded')
    filename = 'FILE NOT UPLOADED'
    uploadStatus = 'File Upload Failed'
  }
  res.render('index.hbs', { status: uploadStatus, filename: `Name Of File: ${filename}` })
})

module.exports = route
