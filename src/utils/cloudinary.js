import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const cloudinaryResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file upload is successful
    console.log(
      "SUCCESS :: File Uploaded to cloudinary!",
      cloudinaryResponse.url
    );
    return cloudinaryResponse;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log("ERROR :: uploadOnCloudinary :: File upload failed!");
    return null;
  }
};
