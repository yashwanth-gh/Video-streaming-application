import { Router } from "express";
import {
  changeCurrentPassword,
  loginUser,
  logout,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  changePasswordValidation,
  loginValidation,
  registerValidation,
  updateAccountDetailsValidation,
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
router.route("/refresh-token").post(refreshAccessToken);
router
  .route("/change-password")
  .post([changePasswordValidation, verifyJWT], changeCurrentPassword);
router
  .route("/update-account")
  .post([updateAccountDetailsValidation, verifyJWT], updateAccountDetails);

export default router;
