import { useLocation, Link } from "wouter";
import { Home, Search, Bell, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { User as UserType } from "@shared/schema";

const MobileNavigation = () => {
  const [location] = useLocation();
  
  // Get current user
  const { data: currentUser } = useQuery<UserType | null>({
    queryKey: ["/api/users/me"],
  });

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
      <div className="flex justify-around py-2">
        <Link href="/">
          <a className="flex flex-col items-center justify-center px-4 py-2 text-neutral-500 hover:text-primary">
            <Home className={`h-6 w-6 ${location === "/" ? "text-primary" : ""}`} />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        
        <Link href="/search">
          <a className="flex flex-col items-center justify-center px-4 py-2 text-neutral-500 hover:text-primary">
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">Search</span>
          </a>
        </Link>
        
        <Link href="/notifications">
          <a className="flex flex-col items-center justify-center px-4 py-2 text-neutral-500 hover:text-primary">
            <Bell className="h-6 w-6" />
            <span className="text-xs mt-1">Alerts</span>
          </a>
        </Link>
        
        <Link href="/profile">
          <a className="flex flex-col items-center justify-center px-4 py-2 text-neutral-500 hover:text-primary">
            {currentUser?.profileImage ? (
              <Avatar className="h-6 w-6">
                <AvatarImage src={currentUser.profileImage} alt="Profile" />
                <AvatarFallback>{currentUser.fullName.substring(0, 2)}</AvatarFallback>
              </Avatar>
            ) : (
              <User className="h-6 w-6" />
            )}
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;
