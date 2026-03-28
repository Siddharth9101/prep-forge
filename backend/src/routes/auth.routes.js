const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

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

/**
 * @route GET /api/v1/auth/get-me
 * @description Get the current logged-in user's information
 * @access Private
 */
authRouter.get(
  "/get-me",
  authMiddleware.authUserMW,
  authController.getMeController,
);

module.exports = authRouter;
