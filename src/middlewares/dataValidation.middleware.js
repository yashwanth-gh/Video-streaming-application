import { body, validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


const registerValidation = asyncHandler(async(req,res,next)=>{
    const rules = [
        body('fullName').trim().notEmpty().withMessage("Full Name is required"),
        body('username').trim().notEmpty().withMessage("User Name is required"),
        body('email').isEmail().withMessage("Email is invalid"),
        body('password').trim().notEmpty().withMessage("Password is required"),
        body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[A-Za-z])(?=.*\d).*$/)
        .withMessage('Password must contain atleast one alphabet and one digit')
    ]

    await Promise.all(rules.map(rule=>rule.run(req)));
    let error = validationResult(req);

    if(!error.isEmpty()){
        console.log(error.array().map(err=>err.msg));
        throw new ApiError(400,"Validation failed");
    }
    else{
        next();
    }
})

export {registerValidation}