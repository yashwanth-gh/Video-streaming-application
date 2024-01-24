import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from 'path';
//* --Set up of express server
const app = express();

/**
 * Middleware function to enable CORS for the application.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
app.use(cors({
    /**
     * The origin from which the request is allowed.
     */
    origin: process.env.CORS_ORIGIN,
    /**
     * Indicates whether or not to include credentials (cookies, HTTP authentication, and client-side SSL certificates) in the CORS request.
     */
    credentials: true
}));


//* --Parse incoming JSON payloads from HTTP requests
app.use(express.json({
    limit:"16kb"
}));
/* 
When a request is made with a `Content-Type` of `application/json`,
 this middleware automatically parses the JSON payload of the 
 request and makes it available in the `request.body` property. 
 This allows you to easily work with JSON data in your route handlers.
 */

 //* --Parse data from URL and "extended:true" ensure we can parse nested objects in url data
 app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))

//* --Folder where all the static files will be stored
app.use(express.static(path.resolve("public")))

app.use(cookieParser())

export {app}