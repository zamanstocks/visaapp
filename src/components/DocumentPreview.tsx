// src/components/DocumentPreview.tsx
import React from 'react';
import { Camera, FileText, Edit2 } from 'lucide-react';
import type { DocumentImage } from '../types/verification-types';

interface DocumentPreviewProps {
  type: 'passport' | 'photo';
  data: DocumentImage | null;
  onReupload?: () => void;
  showReupload?: boolean;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  type, 
  data, 
  onReupload,
  showReupload = true
}) => {
  const aspectRatio = type === 'passport' ? 'aspect-[4/3]' : 'aspect-[3/4]';
  const title = type === 'passport' ? 'Passport Document' : 'Photo Document';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            {type === 'passport' ? 
              <FileText className="w-5 h-5 text-blue-600" /> : 
              <Camera className="w-5 h-5 text-blue-600" />
            }
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {showReupload && onReupload && (
          <button
            onClick={onReupload}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Edit2 className="w-3 h-3" />
            Reupload
          </button>
        )}
      </div>

      <div className="relative bg-gray-50 rounded-lg p-2">
        {data ? (
          <div className="space-y-2">
            <div className={`${aspectRatio} relative overflow-hidden rounded-lg border border-gray-200`}>
              <img
                src={data.dataUrl}
                alt={`${type} preview`}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <p className="text-sm text-gray-500 truncate px-1">{data.fileName}</p>
          </div>
        ) : (
          <div className={`${aspectRatio} flex items-center justify-center border border-gray-200 rounded-lg`}>
            <p className="text-gray-400 text-sm">No {type} uploaded</p>
          </div>
        )}
      </div>
    </div>
  );
};