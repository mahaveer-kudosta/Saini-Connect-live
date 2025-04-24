
import { useQuery } from "@tanstack/react-query";
import { Bell, Check } from "lucide-react";
import { format } from "date-fns";
import LeftSidebar from "@/components/layout/LeftSidebar";
import { Button } from "@/components/ui/button";

interface Notification {
  id: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function Notifications() {
  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
      <LeftSidebar />
      
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="font-poppins font-bold text-2xl mb-6 flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications
          </h1>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading notifications...</p>
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read ? 'bg-gray-50' : 'bg-white border-primary/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="shrink-0"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="font-medium text-lg mb-2">No Notifications</h3>
              <p className="text-gray-500">You don't have any notifications yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
