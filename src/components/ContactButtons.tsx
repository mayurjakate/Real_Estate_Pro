import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

interface ContactButtonsProps {
  phoneNumber: string;
  whatsappNumber: string;
}

const ContactButtons: React.FC<ContactButtonsProps> = ({ phoneNumber, whatsappNumber }) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Call Icon */}
      <a
        href={`tel:${phoneNumber}`}
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 shadow-md transform hover:scale-105"
        aria-label="Call us"
      >
        <Phone size={20} />
      </a>

      {/* WhatsApp Icon */}
      <a
  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello! I would like to know more about your services.")}`}
  target="_blank"
  rel="noopener noreferrer"
  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200 shadow-md transform hover:scale-105"
  aria-label="Message us on WhatsApp"
>
  <MessageSquare size={20} />
</a>
    </div>
  );
};

export default ContactButtons;
