const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

exports.login = (payload) => {
    const token = jwt.sign(payload, secretKey);
    return token;
};

exports.verify = (token) => {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
};