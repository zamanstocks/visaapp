// src/components/UserDetails.tsx
import React from 'react';
import { User, Phone, Globe, Mail } from 'lucide-react';
import type { UserDetails as UserDetailsType } from '../types/verification-types';

interface UserDetailsProps {
  data: UserDetailsType;
  editable?: boolean;
  onEdit?: (field: keyof UserDetailsType, value: any) => void;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ 
  data, 
  editable = false, 
  onEdit 
}) => {
  const renderField = (
    icon: React.ReactNode, 
    label: string, 
    value: string, 
    field?: keyof UserDetailsType
  ) => (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="p-2 bg-blue-50 rounded-lg">
        {icon}
      </div>
      <div className="flex-grow">
        <p className="text-sm text-gray-500">{label}</p>
        {editable && onEdit && field ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onEdit(field, e.target.value)}
            className="w-full mt-1 px-2 py-1 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <p className="font-medium text-gray-900">{value || 'Not provided'}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField(
          <User className="w-5 h-5 text-blue-600" />,
          'Full Name',
          `${data.firstName} ${data.lastName}`
        )}
        {renderField(
          <Phone className="w-5 h-5 text-blue-600" />,
          'Phone Number',
          data.phone,
          'phone'
        )}
        {renderField(
          <Mail className="w-5 h-5 text-blue-600" />,
          'Email',
          data.email,
          'email'
        )}
        {renderField(
          <Globe className="w-5 h-5 text-blue-600" />,
          'Nationality',
          `${data.nationality.name} (${data.nationality.code})`
        )}
        {renderField(
          <Globe className="w-5 h-5 text-blue-600" />,
          'Destination',
          `${data.destination.name} (${data.destination.code})`
        )}
      </div>
    </div>
  );
};