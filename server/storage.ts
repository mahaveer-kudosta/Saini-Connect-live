import { 
  users, 
  type User, 
  type InsertUser, 
  posts, 
  type Post, 
  type InsertPost, 
  comments, 
  type Comment, 
  type InsertComment, 
  likes, 
  type Like, 
  type InsertLike, 
  events, 
  type Event, 
  type InsertEvent, 
  groups, 
  type Group, 
  type InsertGroup, 
  connections, 
  type Connection, 
  type InsertConnection, 
  groupMembers, 
  type GroupMember, 
  type InsertGroupMember 
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gt, or } from "drizzle-orm";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getPost(id: number): Promise<Post | undefined>;
  getAllPosts(): Promise<Post[]>;
  getPostsByUserId(userId: number): Promise<Post[]>;

  // Comment operations
  createComment(comment: InsertComment): Promise<Comment>;
  getComment(id: number): Promise<Comment | undefined>;
  getCommentsByPostId(postId: number): Promise<Comment[]>;

  // Like operations
  createLike(like: InsertLike): Promise<Like>;
  getLike(id: number): Promise<Like | undefined>;
  getLikesByPostId(postId: number): Promise<Like[]>;
  getLikeCountByPostId(postId: number): Promise<number>;
  checkUserLikedPost(postId: number, userId: number): Promise<boolean>;
  deleteLike(postId: number, userId: number): Promise<void>;

  // Event operations
  createEvent(event: InsertEvent): Promise<Event>;
  getEvent(id: number): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  getUpcomingEvents(): Promise<Event[]>;

  // Group operations
  createGroup(group: InsertGroup): Promise<Group>;
  getGroup(id: number): Promise<Group | undefined>;
  getAllGroups(): Promise<Group[]>;
  
  // Group member operations
  addGroupMember(groupMember: InsertGroupMember): Promise<GroupMember>;
  getGroupMembers(groupId: number): Promise<GroupMember[]>;

  // Connection operations
  createConnection(connection: InsertConnection): Promise<Connection>;
  getConnection(id: number): Promise<Connection | undefined>;
  getUserConnections(userId: number): Promise<Connection[]>;
  updateConnectionStatus(id: number, status: string): Promise<Connection>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private comments: Map<number, Comment>;
  private likes: Map<number, Like>;
  private events: Map<number, Event>;
  private groups: Map<number, Group>;
  private groupMembers: Map<number, GroupMember>;
  private connections: Map<number, Connection>;
  
  private userIdCounter: number;
  private postIdCounter: number;
  private commentIdCounter: number;
  private likeIdCounter: number;
  private eventIdCounter: number;
  private groupIdCounter: number;
  private groupMemberIdCounter: number;
  private connectionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.likes = new Map();
    this.events = new Map();
    this.groups = new Map();
    this.groupMembers = new Map();
    this.connections = new Map();
    
    this.userIdCounter = 1;
    this.postIdCounter = 1;
    this.commentIdCounter = 1;
    this.likeIdCounter = 1;
    this.eventIdCounter = 1;
    this.groupIdCounter = 1;
    this.groupMemberIdCounter = 1;
    this.connectionIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData(): void {
    const { hashPassword } = require('./index');
    
    // Create admin user
    this.createUser({
      username: "admin",
      password: hashPassword("password123"),
      fullName: "Anjali Saini",
      email: "anjali@sainiconnect.com",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      coverImage: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80",
      bio: "Software Engineer passionate about connecting the Saini community worldwide.",
      location: "Delhi, India",
      occupation: "Software Engineer"
    });
    
    // Create additional users
    this.createUser({
      username: "rajesh",
      password: hashPassword("password123"),
      fullName: "Rajesh Saini",
      email: "rajesh@sainiconnect.com",
      profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      bio: "Entrepreneur and community leader.",
      location: "Mumbai, India",
      occupation: "Business Owner"
    });
    
    this.createUser({
      username: "priya",
      password: hashPassword("password123"),
      fullName: "Priya Saini",
      email: "priya@sainiconnect.com",
      profileImage: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      bio: "Food blogger and culinary enthusiast.",
      location: "Jaipur, India",
      occupation: "Food Blogger"
    });
    
    this.createUser({
      username: "vikram",
      password: hashPassword("password123"),
      fullName: "Vikram Saini",
      email: "vikram@sainiconnect.com",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      bio: "Tech enthusiast and software developer.",
      location: "Bangalore, India",
      occupation: "Software Engineer"
    });
    
    this.createUser({
      username: "meera",
      password: hashPassword("password123"),
      fullName: "Meera Saini",
      email: "meera@sainiconnect.com",
      profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      bio: "Healthcare professional working in community wellness.",
      location: "Chennai, India",
      occupation: "Doctor"
    });
    
    // Demo user for testing
    this.createUser({
      username: "demo",
      password: hashPassword("demo123"),
      fullName: "Demo User",
      email: "demo@sainiconnect.com",
      profileImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      bio: "This is a demo account for testing the application. Username: demo, Password: demo123",
      location: "New Delhi, India",
      occupation: "Student"
    });
    
    // Create sample posts
    const adminUser = this.getUserByUsername("admin");
    const rajeshUser = this.getUserByUsername("rajesh");
    const priyaUser = this.getUserByUsername("priya");
    
    if (adminUser && rajeshUser && priyaUser) {
      // Post by Rajesh
      const post1 = this.createPost({
        userId: rajeshUser.id,
        content: "Excited to share that our Saini Youth Leadership program is now accepting applications for the summer batch! This is a great opportunity for our community's young talent to develop leadership skills. Tag someone who might be interested.",
        images: ["https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80"],
        visibility: "public"
      });
      
      // Post by Priya
      const post2 = this.createPost({
        userId: priyaUser.id,
        content: "Just tried recreating my grandmother's special Saini-style kadhi recipe. It brings back so many childhood memories! Would love to organize a virtual cooking session where we can share traditional recipes from our community. Who's interested?",
        images: [
          "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1596097635121-14b8433e4bbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        visibility: "public"
      });
      
      // Add comments
      this.createComment({
        postId: post1.id,
        userId: adminUser.id,
        content: "This is such a valuable initiative! Will definitely share with my cousins."
      });
      
      this.createComment({
        postId: post2.id,
        userId: rajeshUser.id,
        content: "Wow! Looks delicious. I'm absolutely interested in the cooking session. My grandmother had a special way to make it too with some secret ingredients!"
      });
      
      // Add likes
      this.createLike({
        postId: post1.id,
        userId: adminUser.id,
        type: "like"
      });
      
      this.createLike({
        postId: post1.id,
        userId: priyaUser.id,
        type: "like"
      });
      
      this.createLike({
        postId: post2.id,
        userId: adminUser.id,
        type: "like"
      });
      
      this.createLike({
        postId: post2.id,
        userId: rajeshUser.id,
        type: "like"
      });
    }
    
    // Create sample events
    this.createEvent({
      title: "Saini Cultural Festival",
      description: "Annual cultural gathering for the Saini community featuring traditional music, dance, and food.",
      location: "Delhi Convention Center",
      date: new Date("2023-06-24T10:00:00Z"),
      endDate: new Date("2023-06-24T17:00:00Z"),
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80",
      createdBy: adminUser?.id || 1
    });
    
    this.createEvent({
      title: "Community Meetup",
      description: "Virtual networking event for Saini community members around the world.",
      location: "Virtual Event",
      date: new Date("2023-07-15T19:00:00Z"),
      endDate: new Date("2023-07-15T20:30:00Z"),
      createdBy: adminUser?.id || 1
    });
    
    // Create sample groups
    const businessGroup = this.createGroup({
      name: "Saini Business Network",
      description: "A group for entrepreneurs and business professionals from the Saini community.",
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80",
      createdBy: rajeshUser?.id || 2
    });
    
    const photographyGroup = this.createGroup({
      name: "Saini Photography Club",
      description: "Share your photography, get feedback, and connect with fellow photographers.",
      image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80",
      createdBy: priyaUser?.id || 3
    });
    
    const heritageGroup = this.createGroup({
      name: "Saini Heritage & Culture",
      description: "Preserving and celebrating our rich cultural heritage and traditions.",
      image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80",
      createdBy: adminUser?.id || 1
    });
    
    // Add group members
    if (businessGroup && adminUser && rajeshUser && priyaUser) {
      this.addGroupMember({
        groupId: businessGroup.id,
        userId: adminUser.id,
        role: "member"
      });
      
      this.addGroupMember({
        groupId: businessGroup.id,
        userId: rajeshUser.id,
        role: "admin"
      });
      
      // Update member count
      this.groups.set(businessGroup.id, {
        ...businessGroup,
        memberCount: 2
      });
    }
    
    if (photographyGroup && adminUser && priyaUser) {
      this.addGroupMember({
        groupId: photographyGroup.id,
        userId: adminUser.id,
        role: "member"
      });
      
      this.addGroupMember({
        groupId: photographyGroup.id,
        userId: priyaUser.id,
        role: "admin"
      });
      
      // Update member count
      this.groups.set(photographyGroup.id, {
        ...photographyGroup,
        memberCount: 2
      });
    }
    
    if (heritageGroup && adminUser && rajeshUser && priyaUser) {
      this.addGroupMember({
        groupId: heritageGroup.id,
        userId: adminUser.id,
        role: "admin"
      });
      
      this.addGroupMember({
        groupId: heritageGroup.id,
        userId: rajeshUser.id,
        role: "member"
      });
      
      this.addGroupMember({
        groupId: heritageGroup.id,
        userId: priyaUser.id,
        role: "member"
      });
      
      // Update member count
      this.groups.set(heritageGroup.id, {
        ...heritageGroup,
        memberCount: 3
      });
    }
  }

  // =========== User Operations ===========
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username.toLowerCase() === username.toLowerCase()) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = {
      id,
      ...userData,
      joinDate: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const existingUser = await this.getUser(id);
    if (!existingUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser: User = {
      ...existingUser,
      ...userData
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // =========== Post Operations ===========
  async createPost(postData: InsertPost): Promise<Post> {
    const id = this.postIdCounter++;
    const now = new Date();
    const post: Post = {
      id,
      ...postData,
      createdAt: now
    };
    this.posts.set(id, post);
    return post;
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPostsByUserId(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // =========== Comment Operations ===========
  async createComment(commentData: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const now = new Date();
    const comment: Comment = {
      id,
      ...commentData,
      createdAt: now
    };
    this.comments.set(id, comment);
    return comment;
  }

  async getComment(id: number): Promise<Comment | undefined> {
    return this.comments.get(id);
  }

  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // =========== Like Operations ===========
  async createLike(likeData: InsertLike): Promise<Like> {
    // Check if the user already liked the post
    const existingLike = await this.getUserPostLike(likeData.postId, likeData.userId);
    if (existingLike) {
      return existingLike;
    }
    
    const id = this.likeIdCounter++;
    const now = new Date();
    const like: Like = {
      id,
      ...likeData,
      createdAt: now
    };
    this.likes.set(id, like);
    return like;
  }

  async getLike(id: number): Promise<Like | undefined> {
    return this.likes.get(id);
  }

  async getLikesByPostId(postId: number): Promise<Like[]> {
    return Array.from(this.likes.values())
      .filter(like => like.postId === postId);
  }

  async getLikeCountByPostId(postId: number): Promise<number> {
    const postLikes = await this.getLikesByPostId(postId);
    return postLikes.length;
  }

  async checkUserLikedPost(postId: number, userId: number): Promise<boolean> {
    const like = await this.getUserPostLike(postId, userId);
    return !!like;
  }

  private async getUserPostLike(postId: number, userId: number): Promise<Like | undefined> {
    return Array.from(this.likes.values())
      .find(like => like.postId === postId && like.userId === userId);
  }

  async deleteLike(postId: number, userId: number): Promise<void> {
    const like = await this.getUserPostLike(postId, userId);
    if (like) {
      this.likes.delete(like.id);
    }
  }

  // =========== Event Operations ===========
  async createEvent(eventData: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const now = new Date();
    const event: Event = {
      id,
      ...eventData,
      createdAt: now
    };
    this.events.set(id, event);
    return event;
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date();
    return Array.from(this.events.values())
      .filter(event => new Date(event.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3); // Return the next 3 upcoming events
  }

  // =========== Group Operations ===========
  async createGroup(groupData: InsertGroup): Promise<Group> {
    const id = this.groupIdCounter++;
    const now = new Date();
    const group: Group = {
      id,
      ...groupData,
      memberCount: 1, // Creator is the first member
      createdAt: now
    };
    this.groups.set(id, group);
    
    // Add the creator as an admin member
    await this.addGroupMember({
      groupId: id,
      userId: groupData.createdBy,
      role: "admin"
    });
    
    return group;
  }

  async getGroup(id: number): Promise<Group | undefined> {
    return this.groups.get(id);
  }

  async getAllGroups(): Promise<Group[]> {
    return Array.from(this.groups.values());
  }

  // =========== Group Member Operations ===========
  async addGroupMember(memberData: InsertGroupMember): Promise<GroupMember> {
    const id = this.groupMemberIdCounter++;
    const now = new Date();
    const groupMember: GroupMember = {
      id,
      ...memberData,
      joinedAt: now
    };
    this.groupMembers.set(id, groupMember);
    
    // Update group member count
    const group = await this.getGroup(memberData.groupId);
    if (group) {
      group.memberCount = (group.memberCount || 0) + 1;
      this.groups.set(group.id, group);
    }
    
    return groupMember;
  }

  async getGroupMembers(groupId: number): Promise<GroupMember[]> {
    return Array.from(this.groupMembers.values())
      .filter(member => member.groupId === groupId);
  }

  // =========== Connection Operations ===========
  async createConnection(connectionData: InsertConnection): Promise<Connection> {
    // Check if connection already exists
    const existingConnection = Array.from(this.connections.values())
      .find(conn => 
        (conn.requesterId === connectionData.requesterId && conn.addresseeId === connectionData.addresseeId) ||
        (conn.requesterId === connectionData.addresseeId && conn.addresseeId === connectionData.requesterId)
      );
    
    if (existingConnection) {
      return existingConnection;
    }
    
    const id = this.connectionIdCounter++;
    const now = new Date();
    const connection: Connection = {
      id,
      ...connectionData,
      createdAt: now
    };
    this.connections.set(id, connection);
    return connection;
  }

  async getConnection(id: number): Promise<Connection | undefined> {
    return this.connections.get(id);
  }

  async getUserConnections(userId: number): Promise<Connection[]> {
    return Array.from(this.connections.values())
      .filter(conn => conn.requesterId === userId || conn.addresseeId === userId);
  }

  async updateConnectionStatus(id: number, status: string): Promise<Connection> {
    const connection = await this.getConnection(id);
    if (!connection) {
      throw new Error(`Connection with ID ${id} not found`);
    }
    
    const updatedConnection: Connection = {
      ...connection,
      status
    };
    
    this.connections.set(id, updatedConnection);
    return updatedConnection;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db
      .insert(posts)
      .values({ ...post, createdAt: new Date() })
      .returning();
    return newPost;
  }

  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async getAllPosts(): Promise<Post[]> {
    return db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  async getPostsByUserId(userId: number): Promise<Post[]> {
    return db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db
      .insert(comments)
      .values({ ...comment, createdAt: new Date() })
      .returning();
    return newComment;
  }

  async getComment(id: number): Promise<Comment | undefined> {
    const [comment] = await db.select().from(comments).where(eq(comments.id, id));
    return comment || undefined;
  }

  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    const results = await db
      .select({
        id: comments.id,
        postId: comments.postId,
        userId: comments.userId,
        content: comments.content,
        createdAt: comments.createdAt,
        parentId: comments.parentId,
        user: {
          id: users.id,
          username: users.username,
          fullName: users.fullName,
          profileImage: users.profileImage
        }
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(comments.createdAt);

    return results.map(result => ({
      ...result,
      user: {
        id: result.user.id,
        username: result.user.username,
        fullName: result.user.fullName,
        profileImage: result.user.profileImage
      }
    }));
  }

  async createLike(like: InsertLike): Promise<Like> {
    // Check if the user already liked the post
    const existingLike = await this.getUserPostLike(like.postId, like.userId);
    if (existingLike) {
      return existingLike;
    }

    const [newLike] = await db
      .insert(likes)
      .values({ ...like, createdAt: new Date() })
      .returning();
    return newLike;
  }

  async getLike(id: number): Promise<Like | undefined> {
    const [like] = await db.select().from(likes).where(eq(likes.id, id));
    return like || undefined;
  }

  async getLikesByPostId(postId: number): Promise<Like[]> {
    return db.select().from(likes).where(eq(likes.postId, postId));
  }

  async getLikeCountByPostId(postId: number): Promise<number> {
    const result = await db.select().from(likes).where(eq(likes.postId, postId));
    return result.length;
  }

  async checkUserLikedPost(postId: number, userId: number): Promise<boolean> {
    const like = await this.getUserPostLike(postId, userId);
    return !!like;
  }

  private async getUserPostLike(postId: number, userId: number): Promise<Like | undefined> {
    const [like] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
    return like || undefined;
  }

  async deleteLike(postId: number, userId: number): Promise<void> {
    await db
      .delete(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db
      .insert(events)
      .values(event)
      .returning();
    return newEvent;
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async getAllEvents(): Promise<Event[]> {
    return db.select().from(events);
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date();
    return db
      .select()
      .from(events)
      .where(gt(events.date, now))
      .orderBy(events.date);
  }

  async createGroup(group: InsertGroup): Promise<Group> {
    const [newGroup] = await db
      .insert(groups)
      .values(group)
      .returning();
    return newGroup;
  }

  async getGroup(id: number): Promise<Group | undefined> {
    const [group] = await db.select().from(groups).where(eq(groups.id, id));
    return group || undefined;
  }

  async getAllGroups(): Promise<Group[]> {
    return db.select().from(groups);
  }

  async addGroupMember(groupMember: InsertGroupMember): Promise<GroupMember> {
    const [newGroupMember] = await db
      .insert(groupMembers)
      .values(groupMember)
      .returning();
    return newGroupMember;
  }

  async getGroupMembers(groupId: number): Promise<GroupMember[]> {
    return db
      .select()
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));
  }

  async createConnection(connection: InsertConnection): Promise<Connection> {
    const [newConnection] = await db
      .insert(connections)
      .values(connection)
      .returning();
    return newConnection;
  }

  async getConnection(id: number): Promise<Connection | undefined> {
    const [connection] = await db.select().from(connections).where(eq(connections.id, id));
    return connection || undefined;
  }

  async getUserConnections(userId: number): Promise<Connection[]> {
    return db
      .select()
      .from(connections)
      .where(
        or(
          eq(connections.requesterId, userId),
          eq(connections.addresseeId, userId)
        )
      );
  }

  async updateConnectionStatus(id: number, status: string): Promise<Connection> {
    const [updatedConnection] = await db
      .update(connections)
      .set({ status })
      .where(eq(connections.id, id))
      .returning();
    return updatedConnection;
  }
}

// Initialize the storage with database
export const storage = new DatabaseStorage();
