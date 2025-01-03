require('dotenv').config();
const SERVER_PORT = process.env.PORT || 5000;
const DATABASE = process.env.DATABASE_URL;
const productionMode = process.env.NODE_ENV
const jwtSecret = process.env.JWT_SECRET;

const SMTP_USER=process.env.SMTP_USER;
const SMTP_PASS=process.env.SMTP_PASSWORD
const CLIENT_URL=process.env.CLIENT_URL;

module.exports = {
    SERVER_PORT,
    DATABASE,
    productionMode,
    jwtSecret,
    SMTP_USER,
    SMTP_PASS,
    CLIENT_URL
}