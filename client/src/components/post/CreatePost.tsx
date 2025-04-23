import { useState } from "react";
import { 
  Image, 
  Film, 
  CalendarDays, 
  Info 
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";
import { Attachment } from "@/lib/types";

interface CreatePostProps {
  currentUser: User | null;
}

const CreatePost = ({ currentUser }: CreatePostProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const { toast } = useToast();

  const createPostMutation = useMutation({
    mutationFn: async ({ content, images }: { content: string, images: string[] }) => {
      return apiRequest("POST", "/api/posts", {
        content,
        images,
        visibility: "public"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setPostContent("");
      setAttachments([]);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Your post has been published!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleCreatePost = () => {
    if (!postContent.trim()) {
      toast({
        title: "Error",
        description: "Post content cannot be empty",
        variant: "destructive"
      });
      return;
    }

    createPostMutation.mutate({ 
      content: postContent,
      images: attachments.map(a => a.url)
    });
  };

  const handleAddAttachment = (type: 'photo' | 'video') => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = type === 'photo' ? 'image/*' : 'video/*';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In a real app, this would upload the file to the server
        // For now, we'll just add a mock URL
        const mockUrl = URL.createObjectURL(file);
        setAttachments([...attachments, {
          type,
          url: mockUrl,
          id: Date.now().toString()
        }]);
      }
    };
    fileInput.click();
  };

  return (
    <>
      <Card className="bg-white rounded-xl shadow-sm p-4">
        <CardContent className="p-0">
          <div className="flex">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={currentUser?.profileImage} alt="Profile" />
              <AvatarFallback>{currentUser?.fullName?.substring(0, 2) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(true)}
                className="bg-neutral-100 rounded-3xl px-4 py-2.5 cursor-pointer hover:bg-neutral-200 transition w-full justify-start font-normal text-neutral-500"
              >
                What's on your mind?
              </Button>
              <div className="flex justify-between mt-3">
                <Button variant="ghost" className="flex items-center text-neutral-600 hover:text-primary transition" onClick={() => handleAddAttachment('photo')}>
                  <Image className="h-5 w-5 mr-1.5" />
                  Photo
                </Button>
                <Button variant="ghost" className="flex items-center text-neutral-600 hover:text-primary transition" onClick={() => handleAddAttachment('video')}>
                  <Film className="h-5 w-5 mr-1.5" />
                  Video
                </Button>
                <Button variant="ghost" className="flex items-center text-neutral-600 hover:text-primary transition" onClick={() => setIsDialogOpen(true)}>
                  <CalendarDays className="h-5 w-5 mr-1.5" />
                  Event
                </Button>
                <Button variant="ghost" className="flex items-center text-neutral-600 hover:text-primary transition" onClick={() => setIsDialogOpen(true)}>
                  <Info className="h-5 w-5 mr-1.5" />
                  More
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Post Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center">Create Post</DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={currentUser?.profileImage} alt="Profile" />
              <AvatarFallback>{currentUser?.fullName?.substring(0, 2) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{currentUser?.fullName || "User"}</p>
              <p className="text-sm text-neutral-500">Public</p>
            </div>
          </div>

          <Textarea
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="min-h-[120px] resize-none border-none focus-visible:ring-0 p-0 text-base"
          />

          {attachments.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="relative rounded-md overflow-hidden">
                  {attachment.type === 'photo' ? (
                    <img src={attachment.url} alt="Post attachment" className="w-full h-32 object-cover" />
                  ) : (
                    <video src={attachment.url} className="w-full h-32 object-cover" />
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full p-0"
                    onClick={() => setAttachments(attachments.filter(a => a.id !== attachment.id))}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between px-2 py-2 bg-neutral-50 rounded-lg mt-2">
            <span className="text-sm font-medium">Add to your post</span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => handleAddAttachment('photo')}>
                <Image className="h-5 w-5 text-green-500" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleAddAttachment('video')}>
                <Film className="h-5 w-5 text-blue-500" />
              </Button>
              <Button variant="ghost" size="icon">
                <CalendarDays className="h-5 w-5 text-yellow-500" />
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="w-full bg-primary hover:bg-primary-dark"
              onClick={handleCreatePost}
              disabled={!postContent.trim() || createPostMutation.isPending}
            >
              {createPostMutation.isPending ? "Posting..." : "Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePost;
