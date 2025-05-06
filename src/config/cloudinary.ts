import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudinaryConfig: ConfigOptions = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
};

cloudinary.config(cloudinaryConfig);

export default cloudinary;
