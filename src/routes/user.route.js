import { Router } from "express";
import {
  loginUser,
  logout,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  loginValidation,
  registerValidation,
} from "../middlewares/dataValidation.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerValidation,
  registerUser
);

router.route("/login").post(loginValidation, loginUser);

//! ***** SECURED ROUTES ONLY ACCESS IF USER HAS LOGGED IN *****

router.route("/logout").post(verifyJWT, logout);


export default router;
