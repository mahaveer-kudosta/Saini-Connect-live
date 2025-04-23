import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Bell, MessageSquare, Menu, Search as SearchIcon } from "lucide-react";
import { User } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [location] = useLocation();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Get current user data
  const { data: currentUser } = useQuery<User | null>({
    queryKey: ["/api/users/me"],
  });

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <div className="text-primary-dark font-poppins font-bold text-xl cursor-pointer">
              <span className="text-primary">Saini</span>
              <span className="text-secondary">Connect</span>
            </div>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-lg mx-6">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search members, posts, events..."
              className="w-full py-2 pl-10 pr-4 rounded-full bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-secondary transition"
            />
            <div className="absolute left-3 top-2.5 text-neutral-400">
              <SearchIcon className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Desktop Header Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" size="icon" className="relative text-neutral-600 hover:text-primary transition">
            <Bell className="h-6 w-6" />
            {currentUser?.id && (
              <Badge className="absolute -top-1 -right-1 bg-primary text-white rounded-full text-xs w-4 h-4 flex items-center justify-center p-0">
                3
              </Badge>
            )}
          </Button>
          
          <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-primary transition">
            <MessageSquare className="h-6 w-6" />
          </Button>
          
          <Link href="/profile">
            <div className="flex items-center cursor-pointer">
              <Avatar className="h-9 w-9 border border-neutral-200">
                <AvatarImage src={currentUser?.profileImage} alt="Profile" />
                <AvatarFallback>{currentUser?.fullName?.substring(0, 2) || "U"}</AvatarFallback>
              </Avatar>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={toggleMobileSearch} className="text-neutral-700 hover:text-primary">
            <SearchIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-neutral-700 hover:text-primary">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Search (conditionally shown) */}
      {showMobileSearch && (
        <div className="px-4 py-2 md:hidden">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              className="w-full py-2 pl-10 pr-4 rounded-full bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-secondary transition"
            />
            <div className="absolute left-3 top-2.5 text-neutral-400">
              <SearchIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
