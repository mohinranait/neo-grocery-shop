
const User = require("../models/UserModel");
const sendEmailByNodeMailer = require("../utils/email");
const { createJwtToken } = require("../utils/jwt_token");
const { successResponse } = require("../utils/responseHandler");
const { registerSchema, loginSchema } = require("../utils/userValidation");
const createError = require("http-errors");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret, CLIENT_URL, productionMode,JWT_REGISTER_SECRET } = require("../accessEnv");

/**
 * @api {post} /user/create Register new user
 */ 
const registerNewUser = async (req, res,next) => {
    try {
        // Get data from request body
        const {name, email, password } = req.body || {};
        const {firstName, lastName} = name || {};

        // Input validation
        if(!name) throw createError(409, "Name is required")
        const {error, value} = registerSchema.validate({firstName, lastName, email, password});
        if(error) throw createError(400, error.details[0].message)
       

       // Duplicate user OR email check
       const isExists = await User.findOne({email});
       if(isExists)  throw createError(409, "This email already exists");
       
       
        // Create token from register data
        const token = await createJwtToken( {
            firstName,
            lastName,
            email,
            password,

        }, JWT_REGISTER_SECRET, '30m')

        // Formate email template
        const emailData = {
            emails: email,
            subject: "Account verify email",
            text: "Hello world",
            html: `
            <h2>Hello ${firstName} </h2>
            <p> <a href='${CLIENT_URL}/verify/${token}'>Click here for verify your account</a> </p>
            `
        }

        try {
            // Send email for email verification
            await sendEmailByNodeMailer(emailData)
        } catch (emailError) {
            next( createError(500, "Send to fail verification email") )
        }

        // Send response
        return successResponse(res, {
            message: `Please check ${email} and verify now `,
            payload: token,
            statusCode:200
        })

    
    } catch (error) {
        next(error)
    }
}

/**
 * @api {post} /user Verify email and create user 
*/
const verifyRegisterProcess = async (req, res, next) => {
    try {
        const token = req.body?.token;
        if(!token) throw createError(401, "Token not found");

        const decoded =  jwt.verify(token, JWT_REGISTER_SECRET )
        
        const userData = {
            name: {
                firstName: decoded?.firstName,
                lastName: decoded?.lastName,
            },
            email: decoded?.email,
            verify:{
                email:true,
            }
        }

        const password = decoded.password;
        
        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        let user =  await User.create({...userData, password: hashPassword })
        user = user.toObject()
        delete user.password;
    
        if(!user) throw createError(404, "User don't created")

        return successResponse(res, {
            message:"Success",
            statusCode:201,
            payload: user
        })

    } catch (error) {
        next(error)
    }
}

/**
 * @api {post} /user/login Login user by email and password
*/
const loginUser = async (req, res,next) => {
    try {
        // Get data from request body
        const { email, password } = req.body || {};
        const {error, value} = loginSchema.validate({email, password});

        if(error) throw createError(400, error.details[0].message )
        
        // Duplicate user OR email check
        let isExists = await User.findOne({email});
        if(!isExists)  throw createError(404, "not found");
       

        // Match password
        const matchPass = await bcrypt.compare(password, isExists?.password);
        if(!matchPass) throw createError(401, "Invalid credentials")

        // convert to plain object and remove password
        isExists = isExists.toObject();
        delete isExists.password


        // create token
        const token = await jwt.sign(
            {
                id: isExists?._id,
                email: isExists?.email,
                role: isExists?.role,
                status: isExists?.status,

            }, jwtSecret, { expiresIn: '1d' });


        // send response 
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite:  'none',

            // httpOnly: true,
            // secure: productionMode == 'production',
            // sameSite: productionMode == 'production' ? 'none' : 'strict'
        })
      
        return successResponse(res, {
            message: "Login successfull",
            payload: isExists,
            statusCode:200
        })

    } catch (error) {
        next(error)
    }
}

// Forgot password
const forgotPassword = async (req, res, next) => {
    try {
        // Get email from request body
        const {email} = req.body;
        if(!email) throw createError(400, "Email is required");
        const user = await User.findOne({email});
        if(!user) throw createError(404, "User not-found");

        // Create token from register data
        const token = await createJwtToken( {
            email,
        }, JWT_REGISTER_SECRET, '10m')

        // Formate email template
        const emailData = {
            emails: email,
            subject: "Reset password",
            text: "Hello world",
            html: `
            <h2>Hello ${user?.name?.firstName} ${user?.name?.lastName} </h2>
            <p> <a href='${CLIENT_URL}/reset-password/${token}'>Click here for reset your password</a> </p>
            `
        }

        try { 
            // Send email for email verification
            await sendEmailByNodeMailer(emailData)
        } catch (emailError) {
            next( createError(500, "Send to fail verification email") )
        }

        // Send response
        return successResponse(res, {
            message: `Please check ${email} and reset your password `,
            payload: token,
            statusCode:200
        })
    } catch (error) {
        next(error)
    }
}

// Reset password
const resetPassword = async (req, res, next) => {
    try {
        // Get token and password from request body
        const token = req.body?.token;
        const {password} = req.body || {};
        if(!token) throw createError(401, "Token not found");
        if(!password) throw createError(401, "Password is required");

        // Verify token
        const decoded =  jwt.verify(token, JWT_REGISTER_SECRET )
        const email = decoded.email;

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        // Update password
        let user =  await User.findOneAndUpdate({email}, {password: hashPassword}, {new:true})
        if(!user) throw createError(404, "User don't created")

        // convert to plain object and remove password
        user = user.toObject()
        delete user.password;

        // Send response
        return successResponse(res, {
            message:"Success",
            statusCode:201,
            payload: user
        })

    } catch (error) {
        next(error)
    }
}

/**
 * @api {post} /user/logout Logout user
 */ 
const logoutUser = async (req, res, next) => {
    try {
        // Clear the access_token cookie
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: true,
            sameSite: 'none', 
        });

        // Send response
        return res.status(200).send({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerNewUser,
    verifyRegisterProcess,
    loginUser ,
    logoutUser,
    forgotPassword,
    resetPassword,
   
}