const Product = require('../models/Product');
const CustomError = require('../errors');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadProductImageLocal = async (req, res) => {
  //	check if image sent
  if (!req.files) {
    throw new CustomError.BadRequestError('No file uploaded!');
  }

  const productImage = req.files.image;
  //	check if image
  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please upload image');
  }

  //	check max size
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      'Please upload smaller size image only!'
    );
  }
  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(201).json({ image: { src: `/uploads/${productImage.name}` } });
};

const uploadProductImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: 'file-upload',
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);
  return res.status(200).json({ image: { src: result.secure_url } });
};

module.exports = {
  uploadProductImage,
};
