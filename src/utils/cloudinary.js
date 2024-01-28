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
    // console.log(
    //   "SUCCESS :: File Uploaded to cloudinary!",
    //   cloudinaryResponse.url
    // );
    fs.unlinkSync(localFilePath);

    return cloudinaryResponse;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log("ERROR :: uploadOnCloudinary :: File upload failed!");
    return null;
  }
};

export default uploadOnCloudinary;


/* This code defines an asynchronous function called `uploadOnCloudinary` that takes a `localFilePath` as a parameter. 
Inside the function, it first checks if the `localFilePath` is truthy. If it is not, it returns `null` and exits the function.
If the `localFilePath` is provided, it uses the `cloudinary` library to upload the file located at the `localFilePath` to the Cloudinary service. It uses the `uploader.upload` method and sets the `resource_type` to "auto", which allows Cloudinary to determine the resource type based on the file extension.
If the file upload is successful, it logs a success message to the console and returns the `cloudinaryResponse` object.
If there is an error during the file upload, it catches the error, deletes the local file using `fs.unlinkSync`, logs an error message to the console, and returns `null`.
Overall, this code uploads a file to Cloudinary using the provided `localFilePath` and handles any errors that may occur during the upload process. */