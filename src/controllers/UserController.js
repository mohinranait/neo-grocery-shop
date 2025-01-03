const createError = require("http-errors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { productionMode, jwtSecret, CLIENT_URL, JWT_REGISTER_SECRET } = require("../accessEnv");
const { loginSchema, registerSchema } = require("../utils/userValidation");
const { successResponse } = require("../utils/responseHandler");
const User = require("../models/UserModel");
const sendEmailByNodeMailer = require("../utils/email");
const { createJwtToken } = require("../utils/jwt_token");

// Create new user
const registerNewUser = async (req, res,next) => {
    try {
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


        return successResponse(res, {
            message: `Please check ${email} and verify now `,
            payload: token,
            statusCode:200
        })

    
    } catch (error) {
        next(error)
    }
}

const verifyRegisterProcess = async (req, res, next) => {
    try {
        const token = req.body?.token;
        if(!token) throw createError(401, "Token not found");

        const decoded =  jwt.verify(token, JWT_REGISTER_SECRET )
        console.log({decoded});
        
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
        console.log({userData, password});
        
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

// Login User
const loginUser = async (req, res,next) => {
    try {
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
            //    httpOnly: true,
            // secure: true,
            // samesite: "none",

            httpOnly: true,
            secure: productionMode == 'production',
            sameSite: productionMode == 'production' ? 'none' : 'strict'
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


// Find User
const findUserById = async (req, res ,next) => {
    try {
        
        let userId = req.params?.id;
        
        const {id, email} = req.user;
        
        const user = await User.findById(userId).select('-password');
        if(!user) throw createError(404, "User not-found")
        
        return successResponse(res, {
            statusCode: 200,
            message: "Success",
            payload: user,
        })
       
    } catch (error) {
        next(error)
    }
}

// Find authenticated USER
const getAuthenticatedUser = async (req, res, next) => {
    try {
        const {id:userId,email} = req.user;
        const user = await User.findById(userId).select('-password');
        if(!user) throw createError(404, "User not-found")

        return successResponse(res, {
            message: "Success",
            payload:user,
            statusCode:200
        })
       
    } catch (error) {
        next(error)
    }
}


/**
 * Update user information by User ID
 * @param req.params.userId
 * @query accessBy=user || admin || manager
*/
const updateUserById = async (req, res, next) => {
    try {
        const {id:authId, email,role} = req.user;
        const userId = req.params?.userId;
        let body = req.body;

        const {accessBy} = req.query;
        if(!accessBy) throw createError(400, "Access query is required");

        // Check user exists
        const findUser = await User.findById(userId)
        if(!findUser) throw createError(404, "User not-found");

        
        // Authenticated user can update his/her information
        if(authId === userId ){
            // This properties can't be update
            delete body.email;
            delete body.role;
            delete body.status;
            delete body.password;
            
            const user = await User.findByIdAndUpdate(findUser?._id, body, {new:true, runValidators:true}).select('-password');
            if(!user) throw createError(404, "User not-found");
            return successResponse(res, {
                message: "Successfully updated your profile",
                payload:user,
                statusCode:200
            })
        }

        if(role === 'Manager' && accessBy === 'manager'){
            // Manager can update user information
            if( findUser.role !== "User") throw createError(401, "Unauthorized access");
            const user = await User.findByIdAndUpdate(findUser?._id, body, {new:true, runValidators:true}).select('-password');
            return successResponse(res, {
                message: "Updated user information",
                payload:user,
                statusCode:200
            })
        }

        if(role === 'Admin' && accessBy === 'admin'){
            // Admin can update user information and manager information
            const user = await User.findByIdAndUpdate(findUser?._id, body, {new:true, runValidators:true}).select('-password');
            return successResponse(res, {
                message: "Updated user information",
                payload:user,
                statusCode:200
            })
        }

        return successResponse(res, {
            message: "Invalid request",
            statusCode:200
        })

    } catch (error) {
        next(error)
    }
}

/**
 * Get all users
 * @param for admin
*/
const getAllUsers = async (req, res, next) => {
    try {
        const {id:userId, email,role} = req.user;
        
        // Check admin or manager role
        if(role === 'User' ) throw createError(401, "Unauthorized access");

        let query = {
            role: 'User',
            _id: { $ne: userId},
        };
        if(role === 'Manager') query = {role: 'User'}
        if(role === 'Admin') query = {role: { $in: ['User', 'Manager']}}

        const users = await User.find(query).select('-password');
        if(!users) throw createError(404, "Users not-found");

        return successResponse(res, {
            message: "Success",
            payload:users,
            statusCode:200
        })
    } catch (error) {
        next(error)
    }
}

// Logout 
const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json({
            message: "User logout",
            success: true,
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    registerNewUser,
    verifyRegisterProcess,
    loginUser ,
    logoutUser,
    findUserById,
    updateUserById,
    getAllUsers,
    getAuthenticatedUser
}