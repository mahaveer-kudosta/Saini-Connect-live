import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentWithUser } from "@/lib/types";

interface PostCommentProps {
  comment: CommentWithUser;
}

const PostComment = ({ comment }: PostCommentProps) => {
  const commentDate = new Date(comment.createdAt);
  const timeAgo = formatDistanceToNow(commentDate, { addSuffix: true });

  return (
    <div className="flex mb-3">
      <Avatar className="h-8 w-8 mr-2">
        <AvatarImage src={comment.user.profileImage} alt={comment.user.fullName} />
        <AvatarFallback>{comment.user.fullName.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 bg-neutral-100 rounded-2xl px-3 py-2">
        <div className="flex justify-between">
          <h5 className="font-medium text-sm text-neutral-800">{comment.user.fullName}</h5>
          <span className="text-xs text-neutral-500">{timeAgo}</span>
        </div>
        <p className="text-sm text-neutral-700">{comment.content}</p>
      </div>
    </div>
  );
};

export default PostComment;
