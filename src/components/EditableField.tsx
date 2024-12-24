import { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
}

export const EditableField = ({ label, value, onSave }: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-start">
        <dt className="text-sm text-gray-500 capitalize">{label.replace(/_/g, ' ')}</dt>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-700">
            <Edit2 className="h-4 w-4" />
          </button>
        )}
      </div>
      {isEditing ? (
        <div className="mt-1">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-600 hover:text-gray-700 p-1"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={handleSave}
              className="text-green-600 hover:text-green-700 p-1"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <dd className="mt-1 font-medium text-gray-900">{value}</dd>
      )}
    </div>
  );
};
