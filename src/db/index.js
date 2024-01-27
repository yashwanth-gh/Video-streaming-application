import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

/**
 * Establishes a connection to the MongoDB database.
 * @async
 * @function DB_CONNECT
 * @returns {Promise<void>}
 */
const DB_CONNECT = async ()=>{
    try {
        /**
         * Connects to the MongoDB database using the provided URI and database name.
         * @type {mongoose.Connection}
         */
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("\n SUCCESS :: DB_CONNECT :: MongoDB connetion established")
        console.log(`\n DB HOST : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("ERROR :: DB_CONNECT :: MongoDB connection failed!")
        process.exit(1);
    }
}

export default DB_CONNECT;