import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import MemberCard from "@/components/connections/MemberCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Members = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get community members
  const { data: members, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Filter members based on search query
  const filteredMembers = members?.filter(member => 
    member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.occupation && member.occupation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
      {/* Left Sidebar */}
      <LeftSidebar />
      
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="font-poppins font-bold text-2xl mb-6">Saini Community Members</h1>
          
          {/* Search */}
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Search members by name or occupation..."
              className="w-full py-2 pl-10 pr-4 rounded-lg border border-neutral-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-neutral-400">
              <Search className="h-5 w-5" />
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading members...</p>
            </div>
          ) : filteredMembers && filteredMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <MemberCard key={member.id} user={member} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="font-medium text-lg mb-2">No Members Found</h3>
              <p className="text-neutral-600">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
};

export default Members;
