import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Middleware function to verify JWT token.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 * @throws {ApiError} - Throws an error if token is missing or invalid.
 */
export const verifyJWT = asyncHandler(async(req, _ ,next)=>{
    /**
     * Get the JWT token from the request.
     * @type {string}
     */
    const token = req.cookies?.accessToken
    || req.header("Authorization")?.replace("Bearer ","");

    if(!token){
        throw new ApiError(401,"Unauthorized request");
    }

    /**
     * Decoded JWT token.
     * @type {Object}
     */
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    /**
     * User object retrieved from the database.
     * @type {Object}
     */
    const user = await User
    .findById(decodedToken?._id)
    .select(
        "-password -refreshToken"
    );

    if(!user){
        throw new ApiError(401,"Invalid Access token")
    }

    req.user = user;

    next();
})

/* This code is a middleware function called `verifyJWT` that is used to authenticate and authorize requests in a Node.js application. Here is a breakdown of what the code does:

1. The function takes three parameters: `req` (request), `res` (response), and `next` (a function to call the next middleware in the chain).

2. It first checks if a token exists in the request cookies or in the Authorization header. It uses optional chaining (`?.`) to handle cases where the cookies or header may not exist. If no token is found, it throws an `ApiError` with a status code of 401 (Unauthorized request).

3. If a token is found, it uses the `jwt.verify` method to decode and verify the token using the `ACCESS_TOKEN_SECRET` stored in the environment variables. If the token is invalid or expired, an error will be thrown.

4. It then uses the decoded token to find the corresponding user in the database using the `User.findById` method. It also selects specific fields to include in the user object, excluding the password and refreshToken.

5. If no user is found, it throws an `ApiError` with a status code of 401 (Invalid Access token).

6. If the user is found, it sets the `user` object in the `req` object for further use in the application.

7. Finally, it calls the `next` function to pass control to the next middleware in the chain.

This code ensures that only authenticated and authorized requests can proceed to the next middleware or route handler. */