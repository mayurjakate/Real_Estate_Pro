import React from 'react';
import { Users, Mail, Phone, Award } from 'lucide-react';

interface ProjectMembersProps {
  siteData: any;
}

const ProjectMembers: React.FC<ProjectMembersProps> = ({ siteData }) => {
  const projectMembers = siteData?.projectMembers || [];

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'architecture': return 'from-blue-500 to-cyan-500';
      case 'structural designer': return 'from-purple-500 to-pink-500';
      case 'legal advisor': return 'from-green-500 to-emerald-500';
      default: return 'from-indigo-500 to-purple-500';
    }
  };

  const getRoleIcon = (role: string) => {
    // For simplicity, using Award icon for all roles
    // In a real application, you might want different icons for different roles
    return Award;
  };

  return (
    <div className="space-y-8">
      
      {/* Team Overview */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-xl">
        <div className="text-center">
          <Users size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Our Project Team</h2>
          <p className="text-xl ">
          Meet the expert professionals behind {siteData?.name}
        </p>
        </div>
      </div>

      {/* Team Members */}
      {projectMembers.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectMembers.map((member: any, index: number) => {
            const colorClass = getRoleColor(member.role);
            const IconComponent = getRoleIcon(member.role);
            
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl 
                         transition-all duration-300 transform hover:-translate-y-2 
                         overflow-hidden group"
              >
                {/* Header with gradient */}
                <div className={`h-24 bg-gradient-to-r ${colorClass} relative`}>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-4 left-6">
                    <IconComponent size={24} className="text-white" />
                  </div>
                </div>
                
                {/* Profile Image */}
                <div className="relative -mt-12 px-6">
                  <div className="w-24 h-24 mx-auto">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full rounded-full border-4 border-white shadow-lg 
                               object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                
                {/* Member Information */}
                <div className="px-6 pb-6 pt-4 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-indigo-600 font-semibold mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Experience: {member.experience}
                  </p>
                  
                  {/* Contact Actions */}
                  <div className="flex justify-center space-x-2">
                    <button className="p-2 bg-indigo-100 text-indigo-600 rounded-lg 
                                     hover:bg-indigo-600 hover:text-white transition-colors">
                      <Mail size={16} />
                    </button>
                    <button className="p-2 bg-green-100 text-green-600 rounded-lg 
                                     hover:bg-green-600 hover:text-white transition-colors">
                      <Phone size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No team members listed</h3>
          <p className="text-gray-500">Team information will be updated soon</p>
        </div>
      )}

      {/* Additional Information */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Expertise</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900">Architectural Excellence</h4>
                <p className="text-gray-600 text-sm">
                  Innovative designs that blend aesthetics with functionality
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900">Structural Integrity</h4>
                <p className="text-gray-600 text-sm">
                  Advanced engineering solutions for safe and durable construction
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900">Legal Compliance</h4>
                <p className="text-gray-600 text-sm">
                  Complete regulatory compliance and transparent documentation
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Project Commitment</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Quality Assurance</h4>
              <p className="text-blue-700 text-sm">
                Rigorous quality checks at every stage of construction
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Timely Delivery</h4>
              <p className="text-green-700 text-sm">
                Committed to delivering projects on schedule
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Customer Support</h4>
              <p className="text-purple-700 text-sm">
                Dedicated support throughout and after project completion
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMembers;