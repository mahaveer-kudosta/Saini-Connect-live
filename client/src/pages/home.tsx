import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { PostWithUser } from "@/lib/types";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import CreatePost from "@/components/post/CreatePost";
import PostCard from "@/components/post/PostCard";
import { Button } from "@/components/ui/button";

const Home = () => {
  // Get current user
  const { data: currentUser } = useQuery<User | null>({
    queryKey: ["/api/users/me"],
  });

  // Get posts for feed
  const { data: posts = [], isLoading: isLoadingPosts } = useQuery<PostWithUser[]>({
    queryKey: ["/api/posts"],
    queryFn: async () => {
      const response = await fetch("/api/posts", {
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    }
  });

  return (
    <div className="flex gap-4 px-4 py-4 max-w-7xl mx-auto">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <div className="flex-1 max-w-xl w-full mx-auto">
        {/* Create Post */}
        <div className="mb-4">
          <CreatePost />
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {isLoadingPosts ? (
            <div className="text-center py-8">Loading posts...</div>
          ) : posts.length > 0 ? (
            <>
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              <div className="text-center mt-4">
                <Button className="bg-white text-secondary font-medium px-6 py-2 rounded-lg border border-secondary hover:bg-secondary hover:text-white transition">
                  Load More Posts
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium text-lg mb-2">No Posts Yet</h3>
              <p className="text-neutral-600 mb-4">Be the first to share something with the community!</p>
              <Button className="bg-primary text-white hover:bg-primary-dark">
                Create a Post
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
};

export default Home;