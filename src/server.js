const express = require('express');
const { SERVER_PORT } = require('./accessEnv');
const rateLimit = require("express-rate-limit")
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errorResponse } = require('./utils/responseHandler');
const { connectMongodbDatabase } = require('./config/connectDb');
const { userRoute, categoryRoute, attributeRoute, configAttrRoute, brandRoute, productRoute, uploadImageRouter } = require('./routes');

const app = express();

// DB Connection
connectMongodbDatabase()

// Middlewares
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    limit: 50,
    statusCode: 429,
    message: { message: 'Your request is rich. Try again' }
})
app.use(limiter)
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: ['http://localhost:3000'],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    })
)
app.use(cookieParser())

// Routes
app.use('/api', userRoute);
app.use('/api', categoryRoute);
app.use('/api', attributeRoute);
app.use('/api', configAttrRoute);
app.use('/api', brandRoute);
app.use('/api', productRoute);
app.use('/api', uploadImageRouter);

// Default route
app.get('/',(req, res) => {
    res.send('Neo-Grocary server running');
})

// Route not found
app.use((req, res, next) => {
    next( createError(404, "route not found") )
})

// Global error handler
app.use((err, req,res, next) => {
    return errorResponse(res, {
        message: err.message,
        statusCode: err.status
    })
   
})

// Server Connection 
app.listen(SERVER_PORT, () => {
    console.log(`Server is Running at http://localhost:${SERVER_PORT}`);
})




