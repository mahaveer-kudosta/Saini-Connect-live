import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { PostWithUser } from "@/lib/types";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import PostCard from "@/components/post/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Pencil, MapPin, Briefcase, Calendar, Image } from "lucide-react";

const Profile = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState<Partial<User>>({});
  const { toast } = useToast();

  // Get current user
  const { data: currentUser } = useQuery<User | null>({
    queryKey: ["/api/users/me"],
  });

  // Get user posts
  const { data: userPosts, isLoading: isLoadingPosts } = useQuery<
    PostWithUser[]
  >({
    queryKey: ["/api/users/me/posts"],
    enabled: !!currentUser,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: Partial<User>) => {
      return apiRequest("PATCH", "/api/users/me", updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
      setIsEditDialogOpen(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    },
  });

  // Handle profile image change
  const handleProfileImageChange = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In a real app, this would upload the file to the server
        // and update the profileImage field with the URL
        toast({
          title: "Feature Coming Soon",
          description: "Profile image upload will be available soon.",
        });
      }
    };
    fileInput.click();
  };

  // Open edit dialog with current user data
  const openEditDialog = () => {
    if (currentUser) {
      setProfileData({
        fullName: currentUser.fullName,
        occupation: currentUser.occupation,
        location: currentUser.location,
        bio: currentUser.bio,
      });
      setIsEditDialogOpen(true);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit profile update
  const handleSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileData) {
      updateProfileMutation.mutate(profileData);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Profile Header */}
        <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-secondary to-secondary-dark relative">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 bg-white/20 text-white hover:bg-white/30"
              onClick={() =>
                toast({
                  title: "Feature Coming Soon",
                  description: "Cover image upload will be available soon.",
                })
              }
            >
              <Image className="h-5 w-5" />
            </Button>
          </div>
          <CardContent className="px-6 pb-6 relative">
            <div className="absolute -top-16 left-6">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white">
                  <AvatarImage
                    src={currentUser?.profileImage}
                    alt={currentUser?.fullName}
                  />
                  <AvatarFallback>
                    {currentUser?.fullName?.substring(0, 2) || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full"
                  onClick={handleProfileImageChange}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-20 flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <h1 className="font-poppins font-bold text-2xl mb-1">
                  {currentUser?.fullName || "User"}
                </h1>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 text-neutral-600 text-sm">
                  {currentUser?.occupation && (
                    <div className="flex items-center mt-1">
                      <Briefcase className="h-4 w-4 mr-1" />
                      <span>{currentUser.occupation}</span>
                    </div>
                  )}

                  {currentUser?.location && (
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{currentUser.location}</span>
                    </div>
                  )}

                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      Joined{" "}
                      {currentUser?.joinDate
                        ? new Date(currentUser.joinDate).toLocaleDateString()
                        : "recently"}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="mt-4 md:mt-0 bg-primary text-white hover:bg-primary-dark"
                onClick={openEditDialog}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {currentUser?.bio && (
              <div className="mt-4 text-neutral-600">
                <p>{currentUser.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full bg-white rounded-lg mb-4">
            <TabsTrigger value="posts" className="flex-1">
              Posts
            </TabsTrigger>
            <TabsTrigger value="about" className="flex-1">
              About
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex-1">
              Connections
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex-1">
              Photos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            {isLoadingPosts ? (
              <div className="text-center py-8">
                <p>Loading posts...</p>
              </div>
            ) : userPosts && userPosts.length > 0 ? (
              <>
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </>
            ) : (
              <Card className="bg-white p-6 text-center">
                <h3 className="font-medium text-lg mb-2">No Posts Yet</h3>
                <p className="text-neutral-600 mb-4">
                  You haven't created any posts yet.
                </p>
                <Button className="bg-primary text-white hover:bg-primary-dark">
                  Create Your First Post
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="about">
            <Card className="bg-white p-6">
              <h3 className="font-poppins font-semibold text-lg mb-4">
                About Me
              </h3>
              {currentUser?.bio ? (
                <p className="text-neutral-600">{currentUser.bio}</p>
              ) : (
                <div className="text-center py-4">
                  <p className="text-neutral-500 mb-4">
                    No bio information added yet.
                  </p>
                  <Button onClick={openEditDialog}>Add Bio</Button>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="connections">
            <Card className="bg-white p-6 text-center">
              <h3 className="font-medium text-lg mb-2">Coming Soon</h3>
              <p className="text-neutral-600">
                The connections feature will be available soon.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <Card className="bg-white p-6 text-center">
              <h3 className="font-medium text-lg mb-2">Coming Soon</h3>
              <p className="text-neutral-600">
                The photos feature will be available soon.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitUpdate}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Your full name"
                  value={profileData.fullName || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  name="occupation"
                  placeholder="Your occupation"
                  value={profileData.occupation || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Your location"
                  value={profileData.location || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself"
                  className="min-h-[100px]"
                  value={profileData.bio || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary-dark"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
