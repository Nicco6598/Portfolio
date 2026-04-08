import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useLenis } from './hooks/useLenis';
import { useScrollbarVisibility } from './hooks/useScrollbarVisibility';
import type { Project } from './data/projects';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectList from './components/ProjectList';
import About from './components/About';
import Contact from './components/Contact';

const loadProjectSheet = () => import('./components/ProjectSheet');
const ProjectSheet = lazy(loadProjectSheet);

function App() {
  useLenis();
  useScrollbarVisibility();
  
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [isAppRevealed, setIsAppRevealed] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleProjectSelect = useCallback((project: Project) => {
    setSelectedProject(project);
    setIsSheetOpen(true);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setIsSheetOpen(false);
  }, []);

  const handleLoaderReveal = useCallback(() => {
    setIsAppRevealed(true);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setIsIntroActive(false);
  }, []);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (!isAppRevealed) {
      return;
    }

    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    const frameId = window.requestAnimationFrame(resetScroll);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isAppRevealed]);

  useEffect(() => {
    if (!isAppRevealed) {
      return;
    }

    const preloadTimerId = window.setTimeout(() => {
      void loadProjectSheet();
    }, 300);

    return () => {
      window.clearTimeout(preloadTimerId);
    };
  }, [isAppRevealed]);

  return (
    <ThemeProvider>
      <HashRouter>
        <div
          style={{
            opacity: isAppRevealed ? 1 : 0,
            transform: isAppRevealed ? 'none' : 'translate3d(0, 24px, 0)',
            transition: 'opacity 560ms cubic-bezier(0.22, 1, 0.36, 1), transform 720ms cubic-bezier(0.22, 1, 0.36, 1)',
            pointerEvents: isIntroActive ? 'none' : 'auto',
          }}
          aria-hidden={isIntroActive}
        >
          <>
            <Navbar />
            <main>
              <Hero onProjectSelect={handleProjectSelect} isReady={isAppRevealed} />
              <ProjectList onProjectSelect={handleProjectSelect} />
              <About />
              <Contact />
            </main>
            <Suspense fallback={null}>
              <ProjectSheet
                project={selectedProject}
                isOpen={isSheetOpen}
                onClose={handleCloseSheet}
              />
            </Suspense>
          </>
        </div>

        {isIntroActive ? (
          <Loader onReveal={handleLoaderReveal} onComplete={handleLoaderComplete} />
        ) : null}
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
