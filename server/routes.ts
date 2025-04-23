import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import passport from "passport";
import { hashPassword } from "./index";
import { 
  insertUserSchema, 
  insertPostSchema, 
  insertCommentSchema, 
  insertLikeSchema,
  insertEventSchema,
  insertGroupSchema,
  insertConnectionSchema,
  insertGroupMemberSchema
} from "@shared/schema";

// Auth middleware to check if a user is logged in
const isAuthenticated = (req: Request, res: Response, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API error handling middleware
  app.use("/api/*", (req, res, next) => {
    next();
  });

  // Authentication routes
  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash the password before storing
      const userData = insertUserSchema.parse({
        ...req.body,
        password: hashPassword(req.body.password)
      });

      const user = await storage.createUser(userData);
      
      // Automatically log the user in after registration
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed after registration" });
        }
        
        // Don't expose password
        const { password, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Login
  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    // If this function is called, authentication was successful
    // req.user contains the authenticated user
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  // Current User
  app.get("/api/users/me", isAuthenticated, async (req, res) => {
    try {
      // User is already authenticated via isAuthenticated middleware
      const { password, ...userWithoutPassword } = req.user as any;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Update current user
  app.patch("/api/users/me", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const updatedUser = await storage.updateUser(user.id, req.body);
      
      // Don't expose password
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Get all users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Don't expose passwords
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Get suggested users
  app.get("/api/users/suggested", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Skip the current user if logged in
      const currentUserId = req.isAuthenticated() ? (req.user as any).id : -1;
      
      // Don't expose passwords
      const usersWithoutPasswords = users
        .filter(user => user.id !== currentUserId)
        .map(user => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't expose password
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Get user posts
  app.get("/api/users/me/posts", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const posts = await storage.getPostsByUserId(user.id);
      
      // Attach user data to posts
      const postsWithUser = posts.map(post => ({
        ...post,
        user: {
          ...user,
          password: undefined
        }
      }));
      
      res.json(postsWithUser);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Register user
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Don't expose password
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Get all posts
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      
      // Get users for each post
      const postsWithUser = await Promise.all(
        posts.map(async post => {
          const user = await storage.getUser(post.userId);
          return {
            ...post,
            user: {
              ...user,
              password: undefined
            }
          };
        })
      );
      
      res.json(postsWithUser);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Create post
  app.post("/api/posts", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      const postData = insertPostSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const post = await storage.createPost(postData);
      
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Get post comments
  app.get("/api/posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const comments = await storage.getCommentsByPostId(postId);
      
      // Get users for each comment
      const commentsWithUser = await Promise.all(
        comments.map(async comment => {
          const user = await storage.getUser(comment.userId);
          return {
            ...comment,
            user: {
              ...user,
              password: undefined
            }
          };
        })
      );
      
      res.json(commentsWithUser);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Add comment to post
  app.post("/api/posts/:id/comments", isAuthenticated, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const user = req.user as any;
      
      const commentData = insertCommentSchema.parse({
        ...req.body,
        postId,
        userId: user.id
      });
      
      const comment = await storage.createComment(commentData);
      
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Get post likes count
  app.get("/api/posts/:id/likes/count", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const count = await storage.getLikeCountByPostId(postId);
      
      res.json(count);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Check if current user liked post
  app.get("/api/posts/:id/likes/me", isAuthenticated, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const user = req.user as any;
      
      const liked = await storage.checkUserLikedPost(postId, user.id);
      
      res.json(liked);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Like post
  app.post("/api/posts/:id/likes", isAuthenticated, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const user = req.user as any;
      
      const likeData = insertLikeSchema.parse({
        postId,
        userId: user.id,
        type: "like"
      });
      
      const like = await storage.createLike(likeData);
      
      res.status(201).json(like);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Unlike post
  app.delete("/api/posts/:id/likes", isAuthenticated, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const user = req.user as any;
      
      await storage.deleteLike(postId, user.id);
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Get all events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Get upcoming events
  app.get("/api/events/upcoming", async (req, res) => {
    try {
      const events = await storage.getUpcomingEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Create event
  app.post("/api/events", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      const eventData = insertEventSchema.parse({
        ...req.body,
        createdBy: user.id
      });
      
      const event = await storage.createEvent(eventData);
      
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Get all groups
  app.get("/api/groups", async (req, res) => {
    try {
      const groups = await storage.getAllGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Create group
  app.post("/api/groups", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      const groupData = insertGroupSchema.parse({
        ...req.body,
        createdBy: user.id
      });
      
      const group = await storage.createGroup(groupData);
      
      res.status(201).json(group);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Create connection
  app.post("/api/connections", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      const connectionData = insertConnectionSchema.parse({
        ...req.body,
        requesterId: user.id
      });
      
      const connection = await storage.createConnection(connectionData);
      
      res.status(201).json(connection);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
