import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Completing authentication...');

  useEffect(() => {
    const finalize = async () => {
      try {
        // Supabase client will pick up the session from the URL fragment automatically
        // We just wait briefly for the session to be processed and then redirect.
        const start = Date.now();
        let done = false;
        while (!done && Date.now() - start < 4000) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            done = true;
            break;
          }
          await new Promise(r => setTimeout(r, 150));
        }
        setMessage('Authenticated! Redirecting...');
      } catch (_) {
        setMessage('Redirecting...');
      } finally {
        setTimeout(() => navigate('/', { replace: true }), 600);
      }
    };
    finalize();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200/50 dark:border-gray-700/50 p-6 text-center">
        <p className="text-gray-900 dark:text-white font-medium">{message}</p>
      </div>
    </div>
  );
};

export default AuthCallback;


