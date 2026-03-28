const { Router } = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = Router();

/**
 * @route POST /api/v1/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController);

/**
 * @route POST /api/v1/auth/login
 * @description Login a user
 * @access Public
 */
authRouter.post("/login", authController.loginUserController);

/**
 * @route GET /api/v1/auth/logout
 * @description Logout a user by clearing the token cookie and adding it to blacklist
 * @access Public
 */
authRouter.get("/logout", authController.logoutUserController);

module.exports = authRouter;
