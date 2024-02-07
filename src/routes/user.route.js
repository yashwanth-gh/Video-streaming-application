import { Router } from "express";
import {
  changeCurrentPassword,
  loginUser,
  logout,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
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

router
  .route("/update-avatar")
  .post([upload.single("avatar"), verifyJWT], updateUserAvatar);

router
  .route("/update-coverpic")
  .post([upload.single("coverImage"), verifyJWT], updateUserCoverImage);


  //TODO: Not tested still
  router
  .route("/channel:username")
  .get(getUserChannelProfile);

export default router;
