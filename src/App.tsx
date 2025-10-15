import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePageWrapper from './components/HomePageWrapper';
import SearchResults from './components/SearchResults';
import MovieDetail from './components/MovieDetail';
import TVDetail from './components/TVDetail';
import LastUpdated from './components/LastUpdated';
import DonatePage from './components/DonatePage';
import VersionPage from './components/VersionPage';
import CustomCursor from './components/CustomCursor';
import NotFoundPage from './components/NotFoundPage';
import ScrollToTopButton from './components/ScrollToTop';
import Discover from './components/Discover';
import Watchlist from './components/Watchlist';
import Vault from './components/Vault'
import ComingSoon from './components/ComingSoon';
import Footer from './components/Footer';
import SeasonDetail from './components/SeasonDetail';
import EpisodeDetail from './components/EpisodeDetail';
import AnimeSection from './components/AnimeSection';
import AnimeMovieDetail from './components/AnimeMovieDetail';
import AnimeTVDetail from './components/AnimeTVDetail';
import IntroAnimation from './components/IntroAnimation';
import { LanguageProvider } from './components/LanguageContext';
import { AnimationProvider } from './components/AnimationContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from './contexts/AuthContext';
import AuthCallback from './components/AuthCallback';
import { watchStatsService } from './services/watchStats';

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return sessionStorage.getItem('hasShownIntro') !== 'true';
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem('hasShownIntro', 'true');
    setShowIntro(false);
  };

  useEffect(() => {
    const trackVisitor = async () => {
      const hasTracked = sessionStorage.getItem('visitorTracked');
      if (!hasTracked) {
        await watchStatsService.recordUniqueVisitor();
        sessionStorage.setItem('visitorTracked', 'true');
      }
    };
    trackVisitor();
  }, []);

  return (
      <AuthProvider>
        <LanguageProvider>
          <AnimationProvider>
            <Router>
          {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
          <ScrollToTopButton />
          <Routes>
            <Route path="/" element={<HomePageWrapper />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/tv/:id" element={<TVDetail />} />
            <Route path="/tv/:id/season/:seasonNumber" element={<SeasonDetail />} />
            <Route path="/tv/:id/season/:seasonNumber/episode/:episodeNumber" element={<EpisodeDetail />} />
            <Route path="/v" element={<VersionPage />} />
            <Route path="/last-updated" element={<LastUpdated />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/soon" element={<ComingSoon />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/anime" element={<AnimeSection />} />
            <Route path="/anime/movie/:id" element={<AnimeMovieDetail />} />
            <Route path="/anime/tv/:id" element={<AnimeTVDetail />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <footer>
            <Footer />
          </footer>
          </Router>
        </AnimationProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;