import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Users, Camera, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Group } from "@shared/schema";
import MemberCard from "@/components/connections/MemberCard";
import GroupCard from "@/components/groups/GroupCard";
import { safeString } from "@/lib/utils";

const RightSidebar = () => {
  // Get suggested connections
  const { data: suggestedUsers } = useQuery<User[]>({
    queryKey: ["/api/users/suggested"],
  });

  // Get community groups
  const { data: communityGroups } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
  });

  return (
    <div className="hidden lg:block w-64 flex-shrink-0 space-y-6">
      {/* Suggested Members */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-poppins font-semibold text-neutral-800 mb-3">People You May Know</h3>
        
        {suggestedUsers && suggestedUsers.length > 0 ? (
          <>
            {suggestedUsers.slice(0, 3).map((user) => (
              <div key={user.id} className="flex items-center py-2 border-b border-neutral-100 last:border-0">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={safeString(user.profileImage)} alt={user.fullName} />
                  <AvatarFallback>{user.fullName.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-800 text-sm">{user.fullName}</h4>
                  <p className="text-xs text-neutral-500">{user.occupation || 'Member'}</p>
                </div>
                <Button 
                  size="icon"
                  variant="ghost"
                  className="text-secondary hover:text-secondary-dark"
                  onClick={() => {/* Add connection logic */}}
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            ))}
            <Link href="/members">
              <div className="block text-center mt-3 text-sm font-medium text-secondary hover:text-secondary-dark transition cursor-pointer">
                View All Suggestions
              </div>
            </Link>
          </>
        ) : (
          <p className="text-sm text-neutral-500">No suggestions available</p>
        )}
      </div>
      
      {/* Community Groups */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-poppins font-semibold text-neutral-800 mb-3">Community Groups</h3>
        
        {communityGroups && communityGroups.length > 0 ? (
          <>
            <Link href="/groups/saini-business-network">
              <div className="flex items-center py-2 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 rounded-lg px-2 transition cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-white mr-3">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 text-sm">Saini Business Network</h4>
                  <p className="text-xs text-neutral-500">485 members</p>
                </div>
              </div>
            </Link>
            
            <Link href="/groups/saini-photography-club">
              <div className="flex items-center py-2 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 rounded-lg px-2 transition cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white mr-3">
                  <Camera className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 text-sm">Saini Photography Club</h4>
                  <p className="text-xs text-neutral-500">238 members</p>
                </div>
              </div>
            </Link>
            
            <Link href="/groups/saini-heritage-culture">
              <div className="flex items-center py-2 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 rounded-lg px-2 transition cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-white mr-3">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 text-sm">Saini Heritage & Culture</h4>
                  <p className="text-xs text-neutral-500">692 members</p>
                </div>
              </div>
            </Link>
            
            <Link href="/groups">
              <div className="block text-center mt-3 text-sm font-medium text-secondary hover:text-secondary-dark transition cursor-pointer">
                Discover More Groups
              </div>
            </Link>
          </>
        ) : (
          <p className="text-sm text-neutral-500">No groups available</p>
        )}
      </div>
      
      {/* Community Guidelines */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-poppins font-semibold text-neutral-800 mb-2">Community Guidelines</h3>
        <p className="text-sm text-neutral-600 mb-3">
          Our community thrives on respect and kindness. Please review our guidelines to maintain a positive space for all members.
        </p>
        <Link href="/guidelines">
          <div className="text-sm font-medium text-secondary hover:text-secondary-dark transition cursor-pointer">
            Read Guidelines
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RightSidebar;
