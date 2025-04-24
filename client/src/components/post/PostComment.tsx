
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CommentWithUser } from "@/lib/types";

interface PostCommentProps {
  comment: CommentWithUser;
  postId: number;
}

const PostComment = ({ comment, postId }: PostCommentProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const queryClient = useQueryClient();
  const commentDate = new Date(comment.createdAt);
  const timeAgo = formatDistanceToNow(commentDate, { addSuffix: true });

  const replyMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content: replyText,
          parentId: comment.id
        }),
      });
      if (!response.ok) throw new Error("Failed to reply");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/comments`] });
      setReplyText("");
      setIsReplying(false);
    },
  });

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      replyMutation.mutate();
    }
  };

  return (
    <div className="flex mb-3">
      <Avatar className="h-8 w-8 mr-2">
        <AvatarImage src={comment.user.profileImage} alt={comment.user.fullName} />
        <AvatarFallback>{comment.user.fullName.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-neutral-100 rounded-2xl px-3 py-2">
          <div className="flex justify-between">
            <h5 className="font-medium text-sm text-neutral-800">{comment.user.fullName}</h5>
            <span className="text-xs text-neutral-500">{timeAgo}</span>
          </div>
          <p className="text-sm text-neutral-700">{comment.content}</p>
        </div>
        
        <div className="mt-1 ml-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-neutral-500 hover:text-neutral-700"
            onClick={() => setIsReplying(!isReplying)}
          >
            Reply
          </Button>
          
          {isReplying && (
            <form onSubmit={handleReply} className="mt-2 flex gap-2">
              <Input
                type="text"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 text-sm h-8"
              />
              <Button 
                type="submit" 
                size="sm"
                disabled={!replyText.trim() || replyMutation.isPending}
              >
                Send
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostComment;
