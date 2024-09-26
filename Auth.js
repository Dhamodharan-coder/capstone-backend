const jwt = require("jsonwebtoken");
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY_USER;


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user; // Attach user data to the request
        next();
    });
};

module.exports =  authenticateToken;