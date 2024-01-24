import dotenv from 'dotenv'
import express from "express";
import DB_CONNECT from './db/index.js'

//* --Making environment variables available as soon as project loads
dotenv.config({
    path:'./env'
})

//* --Set up of express server with data and parse incoming JSON payloads from HTTP requests
const app = express();
app.use(express.json());
/* 
When a request is made with a `Content-Type` of `application/json`,
 this middleware automatically parses the JSON payload of the 
 request and makes it available in the `request.body` property. 
 This allows you to easily work with JSON data in your route handlers.
 */

//* --Connecting Datbase with project
DB_CONNECT();

/*
 * Starts the server and listens on the specified port.
 *
 * @param {number} port - The port number to listen on.
 * @param {function} callback - The callback function to execute after the server starts listening.
 */
const port = process.env.PORT;
app.listen(port,(error)=>{
    if(!error){
        console.log(`\n Server listing on Port -> ${port}`);
    }else{
        console.log("ERROR :: Server listening error : ",error);
    }
})