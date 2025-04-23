import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface MemberCardProps {
  user: User;
}

const MemberCard = ({ user }: MemberCardProps) => {
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'connected'>('none');
  const { toast } = useToast();

  const connectMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/connections", { 
        addresseeId: user.id 
      });
    },
    onSuccess: () => {
      setConnectionStatus('pending');
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
      toast({
        title: "Connection Request Sent",
        description: `Your connection request has been sent to ${user.fullName}.`,
      });
    }
  });

  const handleConnect = () => {
    connectMutation.mutate();
  };

  return (
    <Card className="bg-white shadow-sm overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-secondary to-secondary-dark"></div>
      <CardContent className="pt-12 pb-6 px-4 text-center relative">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 p-1 bg-white rounded-full">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profileImage} alt={user.fullName} />
            <AvatarFallback>{user.fullName.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
        
        <h3 className="font-poppins font-semibold text-lg text-neutral-800">{user.fullName}</h3>
        <p className="text-neutral-500 text-sm">{user.occupation || 'Saini Community Member'}</p>
        <p className="text-neutral-600 text-sm mt-2">{user.location || 'Unknown Location'}</p>
        
        <div className="mt-4">
          {connectionStatus === 'none' && (
            <Button 
              className="bg-primary text-white hover:bg-primary-dark transition"
              onClick={handleConnect}
              disabled={connectMutation.isPending}
            >
              Connect
            </Button>
          )}
          
          {connectionStatus === 'pending' && (
            <Button variant="outline" disabled>
              Request Sent
            </Button>
          )}
          
          {connectionStatus === 'connected' && (
            <Button variant="outline" className="text-secondary border-secondary">
              Message
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
