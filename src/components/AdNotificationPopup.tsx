import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { ExternalLinkIcon } from 'lucide-react';

const AD_NOTIFICATION_KEY = 'adNotificationDismissed';

export default function AdNotificationPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem(AD_NOTIFICATION_KEY);
    if (!isDismissed) {
      setIsOpen(true);
    }
  }, []);

  const handleDontShowAgain = () => {
    localStorage.setItem(AD_NOTIFICATION_KEY, 'true');
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-gray-950 border border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gradient text-2xl">
            Important Notice - December 2025
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-base leading-relaxed pt-2">
            Ads will be enabled throughout December to help maintain and improve LunaStream. 
            Your support during this time helps us keep the service free and running smoothly. 
            Happy Christmas! 🎄
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2 space-y-3">
          <div>
            <p className="text-sm text-gray-400 mb-3">
              If you prefer an ad-free experience, consider using an ad blocker:
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://ublockorigin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gradient hover:opacity-80 transition-opacity"
              >
                Get uBlock Origin
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
              <a
                href="https://adguard.com/en/adguard-ios/overview.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gradient hover:opacity-80 transition-opacity"
              >
                AdGuard for iOS
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
              <a
                href="https://brave.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gradient hover:opacity-80 transition-opacity"
              >
                Brave Browser (Built-in Ad Blocker)
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">
              If you experience any issues with an ad, please join our Discord:
            </p>
            <a
              href="https://discord.gg/RSK3jvuTUY"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gradient hover:opacity-80 transition-opacity"
            >
              Join Discord
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-gray-700 hover:bg-gray-900 text-white"
          >
            OK
          </Button>
          <Button
            onClick={handleDontShowAgain}
            className="bg-gradient hover:opacity-90 text-white border-none"
          >
            Don't Show Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}