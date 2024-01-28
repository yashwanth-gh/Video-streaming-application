import dotenv from "dotenv";
import DB_CONNECT from "./db/index.js";
import { app } from "./app.js";


//* --Making environment variables available as soon as project loads
dotenv.config({
  path: "./.env",
});

//* --Connecting Datbase with project
DB_CONNECT()
  .then((_) => {
    /*
     * Starts the server and listens on the specified port.
     *
     * @param {number} port - The port number to listen on.
     * @param {function} callback - The callback function to execute after the server starts listening.
     */
    const port = process.env.PORT || 8000;
    app.listen(port, (error) => {
      if (!error) {
        console.log(`\n Server listing on Port -> ${port}`);
      } else {
        console.log("ERROR :: Server listening error : ", error);
      }
    });
  })
  .catch((error) => {
    console.log("ERROR :: DB_CONNECT catch :: MongoDB connection failed!");
  });
