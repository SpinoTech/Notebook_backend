// for json web token authentication
var jwt = require('jsonwebtoken');

const jwt_secret = "secret@password#p$9a$7r$3i$5c$6h$9a$2y$626";

// it's a middleware and we use this for getting the user id from => req.user.id
const fetchUser = async(req, res, next) => {
    // get the user from the jwt token and add id to the req object
    const token = req.header("authentication_token");
    if (!token) {
        res.status(401).send({ error: " please authenticate using a valid token" })
    }
    try {

        const data = await jwt.verify(token, jwt_secret);
        req.user = data.user;
        next();

    } catch (error) {
        res.status(401).send({ error: " please authenticate using a valid token" })
    }

}
module.exports = fetchUser;