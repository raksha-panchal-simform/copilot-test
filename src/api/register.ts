import { Router, Request, Response } from "express";
import { ApiResponse } from "./types";
import { User } from "./user.model";
import { createUser } from "./user.service";

export const registerRouter = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s.@]+(?:\.[^\s.@]+)+$/;

// POST /api/register — Register a new user
registerRouter.post("/", (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const errors: string[] = [];

    if (!username || typeof username !== "string" || username.trim().length === 0) {
      errors.push("username is required and must not be empty");
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      errors.push("email must be a valid email address");
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      errors.push("password must be at least 8 characters");
    }

    if (errors.length > 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body",
          details: errors,
        },
      };
      res.status(400).json(response);
      return;
    }

    const user = createUser({ name: username.trim(), email });
    const response: ApiResponse<User> = {
      success: true,
      data: user,
      message: "Registration successful",
    };
    res.status(201).json(response);
  } catch (err) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Registration failed",
      },
    };
    res.status(500).json(response);
  }
});
