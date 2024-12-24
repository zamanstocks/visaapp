import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const VerificationWarning: React.FC = () => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-medium text-yellow-800">Please Verify Your Information</h4>
        <p className="text-sm text-yellow-700 mt-1">
          Review all details carefully. Once verified and payment is completed, 
          these details will be used for your visa application and cannot be modified.
          Make sure all information is accurate before proceeding.
        </p>
      </div>
    </div>
  </div>
);