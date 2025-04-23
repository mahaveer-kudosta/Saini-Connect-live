import { format } from "date-fns";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
  variant?: "sidebar" | "full";
}

const EventCard = ({ event, variant = "sidebar" }: EventCardProps) => {
  const eventDate = new Date(event.date);
  const month = format(eventDate, "MMM");
  const day = format(eventDate, "d");
  
  const startTime = format(eventDate, "h:mm a");
  const endTime = event.endDate ? format(new Date(event.endDate), "h:mm a") : undefined;

  if (variant === "sidebar") {
    return (
      <div className="border-b border-neutral-100 last:border-0 py-3">
        <div className="flex items-start">
          <div className="bg-accent-light bg-opacity-20 rounded-lg p-2 mr-3 text-center">
            <span className="block text-sm font-bold text-accent-dark">{day}</span>
            <span className="block text-xs text-neutral-600">{month}</span>
          </div>
          <div>
            <h4 className="font-medium text-neutral-800">{event.title}</h4>
            <p className="text-sm text-neutral-500">{event.location}</p>
            <div className="flex items-center mt-1 text-xs text-neutral-500">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {startTime}{endTime ? ` - ${endTime}` : ""}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-white hover:shadow-md transition">
      <CardContent className="p-4">
        <div className="flex">
          <div className="bg-accent-light bg-opacity-20 rounded-lg p-3 mr-4 text-center flex flex-col justify-center w-16">
            <span className="block text-lg font-bold text-accent-dark">{day}</span>
            <span className="block text-sm text-neutral-600">{month}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <p className="text-neutral-600 mb-2">{event.description}</p>
            <div className="text-sm text-neutral-500 space-y-1">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.location}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {startTime}{endTime ? ` - ${endTime}` : ""}
              </div>
            </div>
            <div className="mt-4">
              <button className="bg-secondary text-white px-4 py-1.5 rounded-lg text-sm hover:bg-secondary-dark transition">
                View Details
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
