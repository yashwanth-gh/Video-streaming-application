import { body, validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const registerValidation = asyncHandler(async (req, res, next) => {
  const rules = [
    body("fullName").trim().notEmpty().withMessage("Full Name is required"),
    body("username").trim().notEmpty().withMessage("User Name is required"),
    body("email").isEmail().withMessage("Email is invalid"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/^(?=.*[A-Za-z])(?=.*\d).*$/)
      .withMessage("Password must contain atleast one alphabet and one digit"),
  ];

  await Promise.all(rules.map((rule) => rule.run(req)));
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array().map((err) => err.msg));
    throw new ApiError(400, "Register validation failed");
  } else {
    next();
  }
});

const loginValidation = asyncHandler(async (req, res, next) => {
  const rules = [
    body("password").trim().notEmpty().withMessage("Password is required"),
  ];

//* --This is based on asuumption that either username or password is provided by frontend
  if (req.body.username) {
    //* --If only username is sent
    rules.push(
      body("username").trim().notEmpty().withMessage("User Name is required")
    );
  } else if (req.body.email) {
    //* --If only email is sent
    rules.push(body("email").isEmail().withMessage("Email is invalid"));
  } else {
    //* --If username or email is not sent
    //* --You can change body("username") to body("email") also.it works bcz main thing is to send an error
    rules.push(
      body("username")
        .trim()
        .notEmpty()
        .withMessage("Provide either Username or Email")
    );
  }

  await Promise.all(rules.map((rule) => rule.run(req)));
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array().map((err) => err.msg));
    throw new ApiError(400, "Login validation failed");
  } else {
    next();
  }
});

export { registerValidation, loginValidation };
