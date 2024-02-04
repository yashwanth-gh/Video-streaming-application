import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  /* This code is a function called generateAccessAndRefreshToken that takes a userId as a parameter.
  Inside the function, it first uses the User model to find a user with the given userId using the findById method. This is an asynchronous operation, so it uses the await keyword to wait for the result.
  Once the user is found, it calls the generateAccessToken and generateRefreshToken methods on the user object to generate an access token and a refresh token respectively.
  After that, it saves the user object with the save method. The {validateBeforeSave:false} option is passed to disable validation before saving the user object.
  Finally, it returns an object containing the access token and refresh token.
  Overall, this code retrieves a user by their ID, generates an access token and a refresh token for that user, saves the user object, and returns the tokens. */
  const user = await User.findById(userId);

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;

  // console.log("at", accessToken);
  // console.log("rt", refreshToken);
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  /* 1. Import necessary modules and dependencies.
  2. Define the `registerUser` function as an asynchronous handler.
  3. Extract the `username`, `email`, `fullName`, and `password` from the request body.
  4. Use `User.findOne` to check if a user with the same `username` or `email` already exists.
  5. If a user already exists, throw an `ApiError` with status code 409 and a message indicating that the user already exists.
  6. Check if an avatar file is present in the request files. If not, throw an `ApiError` with status code 400 and a message indicating that the avatar file is required.
  7. Extract the local path of the avatar file from the request files.
  8. Check if a cover image file is present in the request files. If so, extract the local path of the cover image file.
  9. Use the `uploadOnCloudinary` function to upload the avatar and cover image files to a cloud storage service (e.g., Cloudinary).
  10. If the avatar file was not successfully uploaded, throw an `ApiError` with status code 400 and a message indicating that the avatar file was not saved in the database.
  11. Create a new user in the database using the `User.create` method, passing the `fullName`, `avatar.url`, `coverImage.url` (or an empty string if no cover image was provided), `email`, `password`, and `username` (converted to lowercase) as properties.
  12. Use `User.findById` to retrieve the created user from the database, excluding the `password` and `refreshToken` fields.
  13. If the created user is not found, throw an `ApiError` with status code 500 and a message indicating that something went wrong while registering the user.
  14. Return a response with status code 201 and a JSON object containing the created user, wrapped in an `ApiResponse` object with a success status code and a message indicating that the user was registered. */

  const { username, email, fullName, password } = req.body;

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with username or email already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //   const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file not saved in DB");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser)
    throw new ApiError(500, "something went wrong while registering user");

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered"));
});

const loginUser = asyncHandler(async (req, res) => {
  /*   The algorithm of the code block is as follows:
  1. Extract the username, email, and password from the request body.
  2. Find a user in the database based on the provided username or email.
  3. If no user is found, return an error with status code 400 and message "Username or email not found".
  4. Check if the provided password is valid for the user.
  5. If the password is not valid, return an error with status code 401 and message "Invalid user credentials".
  6. Generate access and refresh tokens for the user.
  7. Find the logged-in user in the database and exclude the password and refresh token fields.
  8. Set the options for the cookies, including httpOnly and secure.
  9. Set the access token and refresh token as cookies in the response.
  10. Return a JSON response with status code 200, containing the logged-in user, access token, refresh token, and a success message "User logged in successfully". */

  const { username, email, password } = req.body;

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "Username or email not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // --Create access and refresh Tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  /*
  1. Define a function named "logout" that takes in two parameters: "req" and "res".
  2. Inside the function, use the "await" keyword to wait for the completion of the "User.findByIdAndUpdate" function.
  3. Call the "User.findByIdAndUpdate" function with the following arguments:
  - The ID of the user to be updated, accessed through "req.user._id".
  - An object that specifies the update to be made. In this case, use the "$set" operator to set the "refreshToken" field to "undefined".
  - An options object that specifies additional options for the update. In this case, use the "new" option and set it to "true" to return the updated user object.
  4. Assign the result of the "User.findByIdAndUpdate" function to a variable.
  5. Create an object named "options" with the following properties:
  - "httpOnly" set to "true".
  - "secure" set to "true".
  6. Return a response with the following steps:
  - Set the status of the response to 200.
  - Clear the "accessToken" cookie using the "clearCookie" method with the "accessToken" as the first argument and the "options" object as the second argument.
  - Clear the "refreshToken" cookie using the "clearCookie" method with the "refreshToken" as the first argument and the "options" object as the second argument.
  - Convert the response to JSON format using the "json" method and pass in a new instance of the "ApiResponse" class with the following arguments:
  - 200 as the status code.
  - An empty object as the data.
  - "User logged out successfully!" as the message.
  7. End the function. 
  */

  const data = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  // console.log("data" , data)
  // console.log("rf" , data.refreshToken)

  /*   This block of code is written in JavaScript and is using the `await` keyword to wait for the `User.findByIdAndUpdate` function to complete before moving on to the next line of code. 
The `User.findByIdAndUpdate` function is used to find a user by their ID (`req.user._id`) and update their information. In this case, it is updating the `refreshToken` field of the user object and setting it to `undefined`.
The second argument of the function is an object that specifies the update to be made. In this case, it is using the `$set` operator to set the `refreshToken` field to `undefined`.
The third argument is an options object that specifies additional options for the update. In this case, it is using the `new` option and setting it to `true`, which means that the updated user object will be returned.
Overall, this code is updating the `refreshToken` field of a user object to `undefined` and returning the updated user object. */

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out succesfully!"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incommingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedRefreshToken = jwt.verify(
    incommingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedRefreshToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incommingRefreshToken !== user.refreshToken) {
    throw new ApiError("Refresh token is expired or invalid");
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken: newRefreshToken,
        },
        "Access token refreshed"
      )
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password saved!"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.user, "current user data fetched successfully")
    );
});

const updateAccountDetails = asyncHandler(async (req,res)=>{
  // it is recommended to make a seperate endpoint and a controller if you want to update 
  // user files like avatar and cover picture it is a better approach
  
  const {fullName,email} = req.body;

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set : {
        fullName,
        email
      }
    },{
      new:true
    }
  )

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Acount details updated successfully!"))


})
export {
  registerUser,
  loginUser,
  logout,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
};
