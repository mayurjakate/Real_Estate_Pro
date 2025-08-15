import React from 'react';
import { Users, Mail, Phone, Award } from 'lucide-react'; // Added Award icon

interface ProjectMembersProps {
  siteData: any;
}

const ProjectMembers: React.FC<ProjectMembersProps> = ({ siteData }) => {
  const projectMembers = siteData?.projectMembers || [];

  // Function to determine gradient color based on role
  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'architecture': return 'from-blue-500 to-cyan-500';
      case 'structural designer': return 'from-purple-500 to-pink-500';
      case 'legal advisor': return 'from-green-500 to-emerald-500';
      // Default color if role doesn't match
      default: return 'from-indigo-500 to-purple-500';
    }
  };

  // Function to determine icon based on role (using Award for all for simplicity as per original)
  const getRoleIcon = (role: string) => {
    // In a real application, you might want different icons for different roles
    return Award;
  };

  return (
    // Main container with responsive padding and max-width
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 font-inter">

      {/* Team Overview Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="text-center">
           
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
            Our Project Team
          </h2>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto">
            Meet the expert professionals behind <span className="font-semibold">{siteData?.name || 'this project'}</span>
          </p>
        </div>
      </div>

      {/* Team Members Grid */}
      {projectMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projectMembers.map((member: any, index: number) => {
            const colorClass = getRoleColor(member.role);
            const IconComponent = getRoleIcon(member.role);

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl
                           transition-all duration-300 transform hover:-translate-y-2
                           overflow-hidden group relative" // Added relative for absolute positioning of contact buttons
              >
                {/* Header with gradient and icon */}
                <div className={`h-28 sm:h-32 bg-gradient-to-r ${colorClass} relative`}>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute top-4 left-6 flex items-center space-x-2">
                    <IconComponent size={28} className="text-white drop-shadow-md" />
                    <span className="text-white text-lg font-semibold capitalize drop-shadow-md">{member.role}</span>
                  </div>
                </div>

                {/* Profile Image */}
                <div className="relative -mt-16 sm:-mt-20 px-6 z-10"> {/* Increased negative margin for larger overlap */}
                  <div className="w-32 h-32 sm:w-36 sm:h-36 mx-auto"> {/* Larger image on desktop */}
                    <img
                      src={member.photo || 'https://placehold.co/144x144/E0E0E0/333333?text=Member'} // Placeholder for missing photo
                      alt={member.name}
                      className="w-full h-full rounded-full border-4 border-white shadow-xl
                                 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // prevents infinite loop
                        target.src = 'https://placehold.co/144x144/E0E0E0/333333?text=Member';
                      }}
                    />
                  </div>
                </div>

                {/* Member Information */}
                <div className="px-6 pb-6 pt-4 sm:pt-6 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-indigo-600 font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                    Experience: <span className="font-medium">{member.experience || 'Not specified'}</span>
                  </p>

                  {/* Contact Actions - positioned at the bottom of the card for better flow */}
                  <div className="flex justify-center space-x-3">
                    <a
                      href={`mailto:${member.email}`}
                      className="p-3 bg-indigo-100 text-indigo-600 rounded-full
                                 hover:bg-indigo-600 hover:text-white transition-colors duration-200
                                 transform hover:scale-110 shadow-md"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail size={20} />
                    </a>
                    <a
                      href={`tel:${member.phone}`}
                      className="p-3 bg-green-100 text-green-600 rounded-full
                                 hover:bg-green-600 hover:text-white transition-colors duration-200
                                 transform hover:scale-110 shadow-md"
                      aria-label={`Call ${member.name}`}
                    >
                      <Phone size={20} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // No members found message
        <div className="text-center py-12 bg-white rounded-xl shadow-lg px-4">
          <Users className="mx-auto text-gray-400 mb-4" size={56} />
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-2">No team members listed</h3>
          <p className="text-gray-500 text-base sm:text-lg">Team information will be updated soon.</p>
        </div>
      )}

      {/* Additional Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Our Expertise Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Our Expertise</h3>
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-start space-x-3">
              <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-gray-900 text-base sm:text-lg">Architectural Excellence</h4>
                <p className="text-gray-600 text-sm sm:text-base mt-0.5">
                  Innovative designs that blend aesthetics with functionality.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2.5 h-2.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-gray-900 text-base sm:text-lg">Structural Integrity</h4>
                <p className="text-gray-600 text-sm sm:text-base mt-0.5">
                  Advanced engineering solutions for safe and durable construction.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2.5 h-2.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-gray-900 text-base sm:text-lg">Legal Compliance</h4>
                <p className="text-gray-600 text-sm sm:text-base mt-0.5">
                  Complete regulatory compliance and transparent documentation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Commitment Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Project Commitment</h3>
          <div className="space-y-4 sm:space-y-5">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2 text-base sm:text-lg">Quality Assurance</h4>
              <p className="text-blue-700 text-sm sm:text-base">
                Rigorous quality checks at every stage of construction.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h4 className="font-semibold text-green-900 mb-2 text-base sm:text-lg">Timely Delivery</h4>
              <p className="text-green-700 text-sm sm:text-base">
                Committed to delivering projects on schedule.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h4 className="font-semibold text-purple-900 mb-2 text-base sm:text-lg">Customer Support</h4>
              <p className="text-purple-700 text-sm sm:text-base">
                Dedicated support throughout and after project completion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMembers;
