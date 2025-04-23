import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Guidelines = () => {
  const guidelineSections = [
    {
      id: "respect",
      title: "Respect & Kindness",
      content: "Treat all community members with respect. Harassment, hate speech, discrimination, or bullying will not be tolerated. Remember that Saini Connect aims to bring our community together in a positive and supportive environment."
    },
    {
      id: "content",
      title: "Content Guidelines",
      content: "Share content that is relevant to the Saini community. Do not post offensive, explicit, or harmful content. Respect intellectual property rights and give credit where it's due. Avoid spreading misinformation or unverified news."
    },
    {
      id: "privacy",
      title: "Privacy & Safety",
      content: "Respect the privacy of other members. Do not share personal information about others without their consent. Be mindful of what personal information you share publicly on your own profile. Report any concerning behavior to the administrators."
    },
    {
      id: "engagement",
      title: "Community Engagement",
      content: "Actively participate in discussions and events in a constructive manner. Support fellow community members and their initiatives. Share your knowledge and experiences to enrich the community. Use appropriate channels for different types of discussions."
    },
    {
      id: "moderation",
      title: "Moderation",
      content: "Posts that violate community guidelines may be removed without notice. Repeated violations may result in temporary or permanent restriction from certain community features. All decisions by the moderators are final, though you may appeal through proper channels."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
      {/* Left Sidebar */}
      <LeftSidebar />
      
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-secondary to-secondary-dark text-white">
            <CardTitle className="text-2xl font-poppins">Community Guidelines</CardTitle>
            <p className="text-secondary-light mt-2">
              Our community thrives when everyone contributes positively. These guidelines help ensure a respectful and enriching experience for all members.
            </p>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="prose max-w-none">
              <p className="text-lg mb-6">
                SainiConnect is a platform dedicated to bringing together members of the Saini community from around the world. 
                To maintain a positive, respectful, and productive environment, we ask all members to follow these guidelines.
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                {guidelineSections.map((section) => (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="text-lg font-medium py-4">
                      {section.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-600 pb-4">
                      {section.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="bg-neutral-50 p-4 rounded-lg mt-6 border border-neutral-200">
                <h3 className="font-poppins font-semibold text-lg mb-2">Reporting Violations</h3>
                <p>
                  If you encounter content or behavior that violates these guidelines, please report it immediately.
                  Click the "Report" option found on posts, comments, or user profiles, or contact our administrators directly.
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="font-poppins font-semibold text-lg mb-2">Our Commitment</h3>
                <p>
                  The SainiConnect team is committed to reviewing all reports promptly and taking appropriate action.
                  We regularly review and update these guidelines to ensure they serve our community well.
                </p>
              </div>
              
              <div className="mt-6 text-center">
                <p className="italic">
                  By using SainiConnect, you agree to follow these community guidelines.
                  Thank you for helping make our community a welcoming place for all Saini members.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
};

export default Guidelines;
