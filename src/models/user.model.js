import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    refreshToken: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Middleware function that is executed before saving a user document.
 * It hashes the password if it has been modified.
 *
 * @param {Function} next - The next function to be called in the middleware chain.
 * @returns {void}
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Checks if the provided password is correct for the user.
 * @param {string} password - The password to check.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the password is correct.
 */
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

/**
 * Generates an access token for the user.
 * @returns {string} The generated access token.
 */
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
        _id : this._id,
        email : this.email,
        username : this.username,
        fullName : this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

/**
* Generates a refresh token for the user.
* @returns {string} The generated refresh token.
*/
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
        {
        _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};

export const User = mongoose.model("User", userSchema);
