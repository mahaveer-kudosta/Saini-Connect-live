import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
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

export async function registerRoutes(app: Express): Promise<Server> {
  // API error handling middleware
  app.use("/api/*", (req, res, next) => {
    next();
  });

  // Current User
  app.get("/api/users/me", async (req, res) => {
    try {
      // In a real app, this would use auth token to get the user
      // For demonstration, return a mock user
      const currentUser = await storage.getUserByUsername("admin");
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't expose password
      const { password, ...userWithoutPassword } = currentUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Update current user
  app.patch("/api/users/me", async (req, res) => {
    try {
      // In a real app, this would use auth token to get and update the user
      const currentUser = await storage.getUserByUsername("admin");
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUser(currentUser.id, req.body);
      
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
      
      // Skip the current user
      const currentUser = await storage.getUserByUsername("admin");
      
      // Don't expose passwords
      const usersWithoutPasswords = users
        .filter(user => user.id !== currentUser?.id)
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
  app.get("/api/users/me/posts", async (req, res) => {
    try {
      // In a real app, this would use auth token to get the user
      const currentUser = await storage.getUserByUsername("admin");
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const posts = await storage.getPostsByUserId(currentUser.id);
      
      // Attach user data to posts
      const postsWithUser = posts.map(post => ({
        ...post,
        user: {
          ...currentUser,
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
  app.post("/api/posts", async (req, res) => {
    try {
      // In a real app, this would use auth token to get the user
      const currentUser = await storage.getUserByUsername("admin");
      
      if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const postData = insertPostSchema.parse({
        ...req.body,
        userId: currentUser.id
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
  app.post("/api/posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      
      // In a real app, this would use auth token to get the user
      const currentUser = await storage.getUserByUsername("admin");
      
      if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const commentData = insertCommentSchema.parse({
        ...req.body,
        postId,
        userId: currentUser.id
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
  app.get("/api/posts/:id/likes/me", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      
      // In a real app, this would use auth token to get the user
      const currentUser = await storage.getUserByUsername("admin");
      
      if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const liked = await storage.checkUserLikedPost(postId, currentUser.id);
      
      res.json(liked);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Like post
  app.post("/api/posts/:id/likes", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      
      // In a real app, this would use auth token to get the user
      const currentUser = await storage.getUserByUsername("admin");
      
      if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const likeData = insertLikeSchema.parse({
        postId,
        userId: currentUser.id,
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
  app.delete("/api/posts/:id/likes", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      
      // In a real app, this would use auth token to get the user
      const currentUser = await storage.getUserByUsername("admin");
      
      if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      await storage.deleteLike(postId, currentUser.id);
      
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
  app.post("/api/events", async (req, res) => {
    try {
      // In a real app, this would use auth token to get the user
      const currentUser = await storage.getUserByUsername("admin");
      
      if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const eventData = insertEventSchema.parse({
        ...req.body,
        createdBy: currentUser.id
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
  app.post("/api/groups", async (req, res) => {
    try {
      // In a real app, this would use auth token to get the user
      const currentUser = await storage.getUserByUsername("admin");
      
      if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const groupData = insertGroupSchema.parse({
        ...req.body,
        createdBy: currentUser.id
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
  app.post("/api/connections", async (req, res) => {
    try {
      // In a real app, this would use auth token to get the user
      const currentUser = await storage.getUserByUsername("admin");
      
      if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const connectionData = insertConnectionSchema.parse({
        ...req.body,
        requesterId: currentUser.id
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
