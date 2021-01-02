const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try{
        const token = req.header('x-auth-token');
        if(!token){
            return res.status(401).json({ msg: 'No authentication token, authorization denied.'});
        }

        // Verify the token and decode the user id associated with the token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified) {
            return res.status(401).json({ msg: 'Token verification failed, authorization denied.'});
        }

        // Pass along the user id to some waiting function (probably in another route) via req.
        req.user = verified.id;

        // Execute next/waiting steps
        next();
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
};

module.exports = auth;