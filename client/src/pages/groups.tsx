import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Group } from "@shared/schema";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import GroupCard from "@/components/groups/GroupCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

const Groups = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ["/api/users/me"],
  });
  
  // Get community groups
  const { data: groups, isLoading } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
  });

  // Filter groups based on search query
  const filteredGroups = groups?.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
      {/* Left Sidebar */}
      <LeftSidebar />
      
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="font-poppins font-bold text-2xl mb-4 md:mb-0">Community Groups</h1>
            <Button className="bg-primary text-white hover:bg-primary-dark">
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Search groups by name or description..."
              className="w-full py-2 pl-10 pr-4 rounded-lg border border-neutral-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-neutral-400">
              <Search className="h-5 w-5" />
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button variant="outline" className="text-secondary border-secondary">
              All Groups
            </Button>
            <Button variant="outline">
              My Groups
            </Button>
            <Button variant="outline">
              Recently Active
            </Button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading groups...</p>
            </div>
          ) : filteredGroups && filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <GroupCard key={group.id} group={group} currentUser={currentUser} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="font-medium text-lg mb-2">No Groups Found</h3>
              <p className="text-neutral-600 mb-4">Be the first to create a community group!</p>
              <Button className="bg-primary text-white hover:bg-primary-dark">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
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

export default Groups;
