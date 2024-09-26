const { getUser } = require('../service/auth');

function checkForAuthentication(req, res, next) {
    const tokenCookie = req.cookies?.token;
    req.user = null;

    if (!tokenCookie) return next(); // No token means the user is not authenticated

    const token = tokenCookie;
    const user = getUser(token);

    // If user is null, it means the token is invalid or expired
    if (!user) return next(); // Proceed to the next middleware or route handler

    req.user = user; // Set the user object in the request
    return next();
}

// Middleware to restrict access based on user roles
function restrictTo(roles = []) {
    return function(req, res, next) {
        if (!req.user) {
            // User is not authenticated
            return res.redirect("/login");
        }

        if (!roles.includes(req.user.role)) {
            // User's role is not allowed to access this route
            return res.status(403).json({ error: "Forbidden: You do not have permission to access this resource." });
        }

        return next(); // User is authorized, proceed to the next middleware or route handler
    };
}

module.exports = {
    checkForAuthentication,
    restrictTo,
};
