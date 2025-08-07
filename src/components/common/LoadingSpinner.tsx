import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <Loader2 size={size} className="animate-spin text-blue-600" />
    </div>
  );
};

export default LoadingSpinner;
