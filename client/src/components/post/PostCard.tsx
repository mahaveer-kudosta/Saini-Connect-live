import { useState } from "react";
import { 
  MoreHorizontal, 
  Heart, 
  MessageSquare, 
  Share2, 
  Clock 
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { PostWithUser, CommentWithUser } from "@/lib/types";
import PostComment from "./PostComment";
import { apiRequest } from "@/lib/queryClient";
import { format, formatDistanceToNow } from "date-fns";
import { safeString } from "@/lib/utils";

interface PostCardProps {
  post: PostWithUser;
}

const PostCard = ({ post }: PostCardProps) => {
  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  // Get post comments
  const { data: comments = [] } = useQuery<CommentWithUser[]>({
    queryKey: [`/api/posts/${post.id}/comments`],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch comments');
      return response.json();
    }
  });

  // Get like count
  const { data: likeCount = 0 } = useQuery<number>({
    queryKey: [`/api/posts/${post.id}/likes/count`],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${post.id}/likes/count`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch like count');
      return response.json();
    }
  });

  // Check if current user has liked the post
  const { data: isLiked = false } = useQuery<boolean>({
    queryKey: [`/api/posts/${post.id}/likes/me`],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${post.id}/likes/me`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to check like status');
      return response.json();
    }
  });

  // Like post mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      return isLiked 
        ? apiRequest("DELETE", `/api/posts/${post.id}/likes`) 
        : apiRequest("POST", `/api/posts/${post.id}/likes`, { postId: post.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${post.id}/likes/count`] });
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${post.id}/likes/me`] });
    }
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content: commentText }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to comment");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${post.id}/comments`] });
      setCommentText("");
    },
  });

  // Parse images array from post.images (it's stored as a JSON string in the database)
  const images = Array.isArray(post.images) ? post.images : [];

  // Format the post date
  const postDate = new Date(post.createdAt);
  const timeAgo = formatDistanceToNow(postDate, { addSuffix: false });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      commentMutation.mutate();
    }
  };

  const handleShowComments = () => {
    setShowAllComments(true);
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Post Header */}
      <CardHeader className="p-4 flex flex-row items-start justify-between">
        <div className="flex">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={safeString(post.user?.profileImage)} alt={post.user?.fullName || 'User'} />
            <AvatarFallback>{post.user?.fullName?.substring(0, 2) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-neutral-800">{post.user?.fullName || 'User'}</h4>
            <div className="flex items-center text-xs text-neutral-500">
              <span>{timeAgo}</span>
              <span className="mx-1">•</span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-0.5" />
                {post.visibility === "public" ? "Public" : "Private"}
              </span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-neutral-600">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>

      {/* Post Content */}
      <CardContent className="px-4 pb-3">
        <p className="text-neutral-800 mb-3">{post.content}</p>

        {images.length === 1 && (
          <div className="rounded-lg overflow-hidden">
            <img src={images[0]} alt="Post content" className="w-full h-auto object-cover" />
          </div>
        )}

        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
            {images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`Post content ${index + 1}`} 
                className="w-full h-40 object-cover rounded-lg" 
              />
            ))}
          </div>
        )}

        {images.length > 2 && (
          <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
            {images.slice(0, 4).map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`Post content ${index + 1}`} 
                className="w-full h-40 object-cover rounded-lg" 
              />
            ))}
          </div>
        )}
      </CardContent>

      {/* Post Stats */}
      <div className="px-4 py-2 border-t border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center text-neutral-500 text-sm">
          <div className="flex -space-x-1 mr-2">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <Heart className="h-3 w-3 text-white" />
            </div>
          </div>
          <span>{likeCount} likes</span>
        </div>
        <div className="text-neutral-500 text-sm">
          <span>{comments.length} comments</span>
          <span className="mx-2">•</span>
          <span>0 shares</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 flex border-b border-neutral-100">
        <Button 
          variant="ghost" 
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center py-1.5 rounded-lg transition ${
            isLiked ? "text-primary" : "text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          <Heart className={`h-5 w-5 mr-1.5 ${isLiked ? "fill-current" : ""}`} />
          Like
        </Button>

        <Button 
          variant="ghost" 
          className="flex-1 flex items-center justify-center py-1.5 text-neutral-600 hover:bg-neutral-50 rounded-lg transition"
        >
          <MessageSquare className="h-5 w-5 mr-1.5" />
          Comment
        </Button>

        <Button 
          variant="ghost" 
          className="flex-1 flex items-center justify-center py-1.5 text-neutral-600 hover:bg-neutral-50 rounded-lg transition"
        >
          <Share2 className="h-5 w-5 mr-1.5" />
          Share
        </Button>
      </div>

      {/* Comments */}
      <CardFooter className="px-4 py-2 flex flex-col">
        {/* Comment list */}
        {comments.length > 0 && (
          <div className="w-full mb-3">
            {/* Display latest comment or all comments if showAllComments is true */}
            {(showAllComments ? comments : comments.slice(0, 1)).map((comment) => (
              <PostComment key={comment.id} comment={comment} />
            ))}

            {/* Show more comments button */}
            {!showAllComments && comments.length > 1 && (
              <Button 
                variant="link" 
                onClick={handleShowComments}
                className="text-secondary font-medium text-sm ml-10 hover:text-secondary-dark transition"
              >
                Show more comments
              </Button>
            )}
          </div>
        )}

        {/* Comment input */}
        <form onSubmit={handleComment} className="flex w-full">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Your profile" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Write a comment..."
              className="w-full bg-neutral-100 rounded-3xl px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary transition"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button 
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-3 top-2 text-secondary"
              disabled={!commentText.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
};

export default PostCard;