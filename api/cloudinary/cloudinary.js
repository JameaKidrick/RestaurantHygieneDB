require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const Formidable = require('formidable');
const express = require('express');
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/', (req, res) => {
  console.log(res)
  const form = new Formidable()
  // TO SAVE FILE INSIDE CLOUDINARY
  // console.log(req.files)
  // form.parse(req, (err, fields, files) => {
  //   console.log(fields, files)
    // console.log(res.end(util.inspect({ fields, files })))
  //   // res.end(util.inspect({ fields, files }))
  // cloudinary.uploader.upload(files.upload.path, (error, result) => {
  //   if(error) {
  //     console.log(error)
  //   }else{
  //     console.log(result)
  //   }
  // })
  // })
})

module.exports = router;