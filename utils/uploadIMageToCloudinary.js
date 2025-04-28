import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const uploadImageToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export default uploadImageToCloudinary;
