// authMiddleware.js
import jwt from "jsonwebtoken";
import { getUser } from "../service/auth";
import { validateToken } from "./validators"; // Import the validation logic

// Middleware to check for authentication using JWT and Zod validation
function checkForAuthentication(req, res, next) {
  const tokenCookie = req.cookies?.token;
  req.user = null;

  if (!tokenCookie) return next(); // No token, proceed to the next middleware

  try {
    // Verify the JWT token
    const decoded = jwt.verify(tokenCookie, process.env.JWT_SECRET);

    // Validate the token structure using Zod
    const validToken = validateToken(decoded);

    // Fetch the user using the validated token (assuming validToken has an id)
    const user = getUser(validToken.id);

    // Attach the user to the request object
    req.user = user;
  } catch (err) {
    console.error("Token validation failed:", err.message);
    // Optional: Clear the invalid token cookie if validation fails
    res.clearCookie("token");
  }

  return next();
}

// Middleware to restrict access based on roles using the validated token
function restrictTo(roles = []) {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/login"); // No user, redirect to login

    // Check if the user role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).end("Unauthorized");
    }

    return next();
  };
}

export default {
  checkForAuthentication,
  restrictTo,
};
