import { useState } from 'react';
import { X, Megaphone } from 'lucide-react';
import { cn } from '../utils/cn';

export function AnnouncementBanner({ announcement, onDismiss }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss(announcement.id);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Megaphone className="w-5 h-5" />
            <div>
              <h3 className="font-semibold text-sm">{announcement.title}</h3>
              <p className="text-sm opacity-90">{announcement.message}</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-primary-foreground hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 