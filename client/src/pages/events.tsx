import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import EventCard from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Plus } from "lucide-react";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get community events
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  // Filter events based on search query
  const filteredEvents = events?.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
      {/* Left Sidebar */}
      <LeftSidebar />
      
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="font-poppins font-bold text-2xl mb-4 md:mb-0">Community Events</h1>
            <Button className="bg-primary text-white hover:bg-primary-dark">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Search events by title, description or location..."
              className="w-full py-2 pl-10 pr-4 rounded-lg border border-neutral-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-neutral-400">
              <Search className="h-5 w-5" />
            </div>
          </div>
          
          {/* Calendar View Switch */}
          <div className="flex space-x-2 mb-6">
            <Button variant="outline" className="text-secondary border-secondary">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
            <Button className="bg-secondary text-white hover:bg-secondary-dark">
              List View
            </Button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading events...</p>
            </div>
          ) : filteredEvents && filteredEvents.length > 0 ? (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} variant="full" />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="font-medium text-lg mb-2">No Events Found</h3>
              <p className="text-neutral-600 mb-4">Be the first to create a community event!</p>
              <Button className="bg-primary text-white hover:bg-primary-dark">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
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

export default Events;
