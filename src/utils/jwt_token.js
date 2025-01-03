
const jwt = require("jsonwebtoken");
const createJwtToken = async (payload, secret, time) => {
    const token = await jwt.sign(payload, secret, {expiresIn:time})
    return token;
}

module.exports = {
    createJwtToken,
}