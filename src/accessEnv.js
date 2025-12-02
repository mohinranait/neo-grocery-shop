require('dotenv').config();
const SERVER_PORT = process.env.PORT || 5000;
const DATABASE = process.env.DATABASE_URL;
const productionMode = process.env.NODE_ENV
const jwtSecret = process.env.JWT_SECRET;

const CLIENT_URL=process.env.CLIENT_URL;
const JWT_REGISTER_SECRET=process.env.JWT_REGISTER_SECRET;

module.exports = {
    SERVER_PORT,
    DATABASE,
    productionMode,
    jwtSecret,
    CLIENT_URL,
    JWT_REGISTER_SECRET
}