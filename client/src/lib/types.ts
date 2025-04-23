import { User, Post, Comment, Event, Group, Connection } from "@shared/schema";

// Extended types with additional frontend properties
export interface PostWithUser extends Post {
  user: User;
  comments?: CommentWithUser[];
  likes?: number;
  liked?: boolean;
}

export interface CommentWithUser extends Comment {
  user: User;
}

export interface EventWithUser extends Event {
  creator: User;
}

export interface GroupWithUser extends Group {
  creator: User;
}

export interface ConnectionWithUser extends Connection {
  requester: User;
  addressee: User;
}

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
};

// Attachment type for post creation
export type Attachment = {
  type: 'photo' | 'video';
  url: string;
  id: string;
};
