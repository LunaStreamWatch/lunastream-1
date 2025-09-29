import React from "react";

interface EmbeddedFrameProps {
  src: string;
  title: string;
  className?: string;
}

const EmbeddedFrame: React.FC<EmbeddedFrameProps> = ({ src, title, className }) => {
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

  if (!isHttps) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-6">
        <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 max-w-md w-full p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure context required</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            The player requires HTTPS due to Content Security Policy. Please reload this page over HTTPS.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <a
              href={window.location.href.replace('http://', 'https://')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:from-pink-600 hover:to-purple-700"
            >
              Open HTTPS
            </a>
            <a
              href={src}
              target="_blank"
              rel="noreferrer noopener"
              className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              Open Player
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={src}
      className={className}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      referrerPolicy="origin-when-cross-origin"
    />
  );
};

export default EmbeddedFrame;


