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
  const { data: posts, isLoading: isLoadingPosts } = useQuery<PostWithUser[]>({
    queryKey: ["/api/posts"],
    queryFn: async () => {
      const response = await fetch("/api/posts", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    }
  });

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
      {/* Left Sidebar */}
      <LeftSidebar />
      
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Create Post */}
        <CreatePost currentUser={currentUser} />
        
        {/* Community Highlight */}
        <div className="bg-gradient-to-r from-secondary to-secondary-dark rounded-xl shadow-sm p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="font-poppins font-bold text-2xl">Welcome to Saini Community</h2>
              <p className="mt-1 text-secondary-light text-sm">Connect with 5,000+ members around the world</p>
            </div>
            <div>
              <Button className="bg-white text-secondary font-medium hover:bg-neutral-100 transition">
                Invite Members
              </Button>
            </div>
          </div>
        </div>
        
        {/* Posts Feed */}
        <div className="space-y-6">
          {isLoadingPosts ? (
            <div className="text-center py-8">
              <p>Loading posts...</p>
            </div>
          ) : posts && posts.length > 0 ? (
            <>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              
              <div className="text-center py-8">
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
