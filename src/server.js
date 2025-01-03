const express = require('express');
const { SERVER_PORT } = require('./accessEnv');
const rateLimit = require("express-rate-limit")
const createError = require('http-errors');
const cookieParser = require('cookie-parser');

const cors = require('cors');
const { errorResponse } = require('./utils/responseHandler');
const { connectMongodbDatabase } = require('./config/connectDb');
const { userRoute } = require('./routes');

const app = express();

connectMongodbDatabase()

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    limit: 50,
    statusCode: 429,
    message: { message: 'Your request is rich. Try again' }
})

app.use(limiter)
app.use(express.json());



app.use(
    cors({
        origin: ['http://localhost:3000'],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    })
)
app.use(cookieParser())

app.use('/api', userRoute);


app.get('/',(req, res) => {
    res.send('Neo-Grocary server running');
})


app.use((req, res, next) => {
    next( createError(404, "route not found") )
})

app.use((err, req,res, next) => {
    return errorResponse(res, {
        message: err.message,
        statusCode: err.status
    })
   
})


app.listen(SERVER_PORT, () => {
    console.log(`Server is Running at http://localhost:${SERVER_PORT}`);
})




