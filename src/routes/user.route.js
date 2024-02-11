import { Router } from "express";
import {
  changeCurrentPassword,
  loginUser,
  logout,
  refreshAccessToken,
  registerUser,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getWatchHistory,
  getUserChannelProfile,
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
  .patch([updateAccountDetailsValidation, verifyJWT], updateAccountDetails);

router
  .route("/update-avatar")
  .patch([verifyJWT, upload.single("avatar")], updateUserAvatar);

router
  .route("/update-coverpic")
  .patch([verifyJWT, upload.single("coverImage")], updateUserCoverImage);

//TODO: Not tested still
router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/channel:username").get(getUserChannelProfile);

router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
