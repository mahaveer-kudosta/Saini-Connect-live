import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Home, Users, CalendarDays, UsersRound, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NavItem } from "@/lib/types";
import { User, Event } from "@shared/schema";
import EventCard from "@/components/events/EventCard";
import { safeString } from "@/lib/utils";

const LeftSidebar = () => {
  const [location] = useLocation();

  // Get current user data
  const { data: currentUser } = useQuery<User | null>({
    queryKey: ["/api/users/me"],
  });

  // Get upcoming events
  const { data: upcomingEvents } = useQuery<Event[]>({
    queryKey: ["/api/events/upcoming"],
  });

  const navItems: NavItem[] = [
    {
      label: "News Feed",
      href: "/",
      icon: <Home className="h-5 w-5 mr-3" />,
      active: location === "/",
    },
    {
      label: "Members",
      href: "/members",
      icon: <Users className="h-5 w-5 mr-3" />,
      active: location === "/members",
    },
    {
      label: "Events",
      href: "/events",
      icon: <CalendarDays className="h-5 w-5 mr-3" />,
      active: location === "/events",
    },
    {
      label: "Groups",
      href: "/groups",
      icon: <UsersRound className="h-5 w-5 mr-3" />,
      active: location === "/groups",
    },
    {
      label: "Guidelines",
      href: "/guidelines",
      icon: <FileText className="h-5 w-5 mr-3" />,
      active: location === "/guidelines",
    },
  ];

  return (
    <div className="hidden lg:block w-60 flex-shrink-0 space-y-6">
      {/* Current User Profile Card */}
      {currentUser ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="h-24 bg-secondary-light relative">
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 p-1 bg-white rounded-full">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={safeString(currentUser.profileImage)}
                  alt="Profile"
                />
                <AvatarFallback>
                  {currentUser.fullName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="pt-12 pb-6 px-4 text-center">
            <h3 className="font-poppins font-semibold text-lg text-neutral-800">
              {currentUser.fullName}
            </h3>
            <p className="text-neutral-500 text-sm">
              {currentUser.occupation || "Member"}
            </p>
            <div className="mt-4 flex justify-center">
              <Link href="/profile">
                <Button className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="font-medium mb-2">Welcome to KudosConnect</p>
          <p className="text-sm text-neutral-500 mb-4">
            Sign in to connect with the community
          </p>
          <div className="flex space-x-2 justify-center">
            <Button className="bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition">
              Sign In
            </Button>
            <Button variant="outline" className="text-sm">
              Register
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <div
                    className={`flex items-center px-3 py-2 rounded-lg font-medium transition cursor-pointer ${
                      item.active
                        ? "text-secondary-dark bg-secondary-light/20 hover:bg-secondary-light hover:text-gray-800"
                        : "text-neutral-600 hover:bg-secondary-light hover:text-gray-800"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-poppins font-semibold text-neutral-800 mb-3">
          Upcoming Events
        </h3>
        {upcomingEvents && upcomingEvents.length > 0 ? (
          <>
            {upcomingEvents.slice(0, 2).map((event) => (
              <EventCard key={event.id} event={event} variant="sidebar" />
            ))}
            <Link href="/events">
              <div className="block text-center mt-3 text-sm font-medium text-secondary hover:text-secondary-dark transition cursor-pointer">
                View All Events
              </div>
            </Link>
          </>
        ) : (
          <p className="text-sm text-neutral-500">No upcoming events</p>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
