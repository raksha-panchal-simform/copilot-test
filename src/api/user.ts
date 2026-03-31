import { Router, Request, Response } from "express";
import { ApiResponse } from "./types";
import { User } from "./user.model";
import {
  findAllUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./user.service";

export const userRouter = Router();

// GET /api/users — List all users (paginated)
userRouter.get("/", (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20));

    const { users, totalItems } = findAllUsers(page, limit);
    const totalPages = Math.ceil(totalItems / limit);

    const response: ApiResponse<User[]> = {
      success: true,
      data: users,
      pagination: { page, limit, totalPages, totalItems },
    };
    res.status(200).json(response);
  } catch (err) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to fetch users",
      },
    };
    res.status(500).json(response);
  }
});

// GET /api/users/:id — Get user by ID
userRouter.get("/:id", (req: Request, res: Response) => {
  try {
    const user = findUserById(req.params.id);
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: `User with id '${req.params.id}' not found`,
        },
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<User> = {
      success: true,
      data: user,
      message: "User retrieved successfully",
    };
    res.status(200).json(response);
  } catch (err) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to fetch user",
      },
    };
    res.status(500).json(response);
  }
});

// POST /api/users — Create a new user
userRouter.post("/", (req: Request, res: Response) => {
  try {
    const { age } = req.body;
    const name = typeof req.body.name === "string" ? req.body.name.trim() : req.body.name;
    const email = typeof req.body.email === "string" ? req.body.email.trim() : req.body.email;

    const errors: string[] = [];
    if (!name || typeof name !== "string") errors.push("name is required and must be a string");
    if (!email || typeof email !== "string") errors.push("email is required and must be a string");
    if (age !== undefined && typeof age !== "number") errors.push("age must be a number");

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

    const user = createUser({ name, email, age });
    const response: ApiResponse<User> = {
      success: true,
      data: user,
      message: "User created successfully",
    };
    res.status(201).json(response);
  } catch (err) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to create user",
      },
    };
    res.status(500).json(response);
  }
});

// PUT /api/users/:id — Update a user
userRouter.put("/:id", (req: Request, res: Response) => {
  try {
    const { age } = req.body;
    const name = typeof req.body.name === "string" ? req.body.name.trim() : req.body.name;
    const email = typeof req.body.email === "string" ? req.body.email.trim() : req.body.email;

    const errors: string[] = [];
    if (name !== undefined && typeof name !== "string") errors.push("name must be a string");
    else if (name !== undefined && !name) errors.push("name must be a non-empty string");
    if (email !== undefined && typeof email !== "string") errors.push("email must be a string");
    else if (email !== undefined && !email) errors.push("email must be a non-empty string");
    if (age !== undefined && typeof age !== "number") errors.push("age must be a number");

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

    const user = updateUser(req.params.id, { name, email, age });
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: `User with id '${req.params.id}' not found`,
        },
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<User> = {
      success: true,
      data: user,
      message: "User updated successfully",
    };
    res.status(200).json(response);
  } catch (err) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to update user",
      },
    };
    res.status(500).json(response);
  }
});

// DELETE /api/users/:id — Delete a user
userRouter.delete("/:id", (req: Request, res: Response) => {
  try {
    const deleted = deleteUser(req.params.id);
    if (!deleted) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: `User with id '${req.params.id}' not found`,
        },
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<null> = {
      success: true,
      message: "User deleted successfully",
    };
    res.status(200).json(response);
  } catch (err) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to delete user",
      },
    };
    res.status(500).json(response);
  }
});
