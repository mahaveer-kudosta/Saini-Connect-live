import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Bell, MessageSquare, Menu, Search as SearchIcon, LogOut, User as UserIcon, Settings } from "lucide-react";
import { User } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

const Header = () => {
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Get auth data from context
  const { user, logout } = useAuth();

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
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                // Update the search term in React Query cache
                queryClient.setQueryData(["/api/search"], searchTerm);
              }}
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
            {user?.id && (
              <Badge className="absolute -top-1 -right-1 bg-primary text-white rounded-full text-xs w-4 h-4 flex items-center justify-center p-0">
                3
              </Badge>
            )}
          </Button>
          
          <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-primary transition">
            <MessageSquare className="h-6 w-6" />
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9 border border-neutral-200">
                    <AvatarImage src={user.profileImage} alt="Profile" />
                    <AvatarFallback>{user.fullName?.substring(0, 2) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={async () => {
                    await logout();
                    navigate("/auth");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate("/auth")}>
              Login
            </Button>
          )}
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
