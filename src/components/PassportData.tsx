import { AlertCircle, Edit2 } from 'lucide-react';
import { EditableField } from './EditableField';

interface PassportDataProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

export const PassportData = ({ data, onUpdate }: PassportDataProps) => {
  if (!data?.applicant) return null;

  const renderField = (key: string, value: any) => {
    if (!value) return null;

    if (typeof value === 'object' && value.name && value.code) {
      return (
        <div key={key} className="bg-gray-50 p-4 rounded-lg">
          <dt className="text-sm text-gray-500 capitalize mb-1">{key.replace(/_/g, ' ')}</dt>
          <dd className="font-medium text-gray-900">{value.name} ({value.code})</dd>
        </div>
      );
    }

    return (
      <EditableField
        key={key}
        label={key}
        value={value}
        onSave={(newValue) => onUpdate(key, newValue)}
      />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium">Passport Details</h2>
          <p className="text-sm text-gray-500 mt-1">Review and edit if needed</p>
        </div>
        <span className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          AI Extracted
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(data.applicant).map(([key, value]) => renderField(key, value))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-sm text-blue-700">
            The above information was automatically extracted from your passport.
          </p>
          <p className="text-sm text-blue-600">
            Click the edit icon <Edit2 className="h-3 w-3 inline mb-0.5" /> next to any field to make corrections.
          </p>
        </div>
      </div>
    </div>
  );
};
