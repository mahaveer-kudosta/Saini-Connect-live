import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Group, User } from "@shared/schema";

interface GroupCardProps {
  group: Group;
  currentUser?: User | null;
}

const GroupCard = ({ group, currentUser }: GroupCardProps) => {
  const isCreator = currentUser && group.createdBy === currentUser.id;
  const isMember = false; // This would be determined by API call in a real app

  return (
    <Card className="bg-white shadow-sm overflow-hidden h-full flex flex-col">
      <div className="h-32 bg-gradient-to-r from-secondary-light to-secondary relative">
        {group.image ? (
          <img 
            src={group.image} 
            alt={group.name} 
            className="w-full h-full object-cover opacity-50" 
          />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="font-poppins font-semibold text-2xl text-white">{group.name}</h3>
        </div>
      </div>
      
      <CardContent className="flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <span className="text-sm text-neutral-600">{group.memberCount} members</span>
          </div>
          {isCreator && (
            <span className="text-xs bg-primary-light/20 text-primary-dark px-2 py-0.5 rounded-full">
              Creator
            </span>
          )}
        </div>
        
        <p className="text-neutral-600 text-sm mb-3">
          {group.description || `A group for Saini community members interested in ${group.name}.`}
        </p>
      </CardContent>
      
      <CardFooter className="border-t border-neutral-100 p-4">
        <div className="w-full flex justify-between">
          <Link href={`/groups/${group.id}`}>
            <Button variant="outline" className="text-secondary border-secondary">
              View Group
            </Button>
          </Link>
          
          {!isMember ? (
            <Button className="bg-primary text-white hover:bg-primary-dark">
              Join Group
            </Button>
          ) : (
            <Button variant="outline">
              Already Joined
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default GroupCard;
