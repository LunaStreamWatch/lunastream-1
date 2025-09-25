import React from 'react';
import { initializeChromecast, isChromecastAvailable } from '../utils/subtitleUtils';

export function useChromecast() {
  const [isAvailable, setIsAvailable] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    if (isChromecastAvailable() && !isInitialized) {
      initializeChromecast()
        .then(() => {
          setIsAvailable(true);
          setIsInitialized(true);
          
          // Initialize Cast context
          const cast = (window as any).cast;
          const context = cast.framework.CastContext.getInstance();
          
          context.addEventListener(
            cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
            (event: any) => {
              setIsConnected(event.sessionState === cast.framework.SessionState.SESSION_STARTED);
            }
          );
        })
        .catch((error) => {
          console.error('Chromecast initialization failed:', error);
          setIsAvailable(false);
        });
    }
  }, [isInitialized]);

  const startCasting = React.useCallback((mediaUrl: string, title: string = 'Video') => {
    if (!isAvailable) return;

    const cast = (window as any).cast;
    const context = cast.framework.CastContext.getInstance();
    
    const mediaInfo = new cast.framework.messages.MediaInfo(mediaUrl, 'video/mp4');
    mediaInfo.metadata = new cast.framework.messages.GenericMediaMetadata();
    mediaInfo.metadata.title = title;
    
    const request = new cast.framework.messages.LoadRequest(mediaInfo);
    
    context.getCurrentSession()?.loadMedia(request);
  }, [isAvailable]);

  const stopCasting = React.useCallback(() => {
    if (!isAvailable) return;
    
    const cast = (window as any).cast;
    const context = cast.framework.CastContext.getInstance();
    context.getCurrentSession()?.endSession(true);
  }, [isAvailable]);

  return {
    isAvailable,
    isConnected,
    startCasting,
    stopCasting
  };
}