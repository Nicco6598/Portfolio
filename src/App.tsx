import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { useLenis } from './hooks/useLenis';
import { useScrollbarVisibility } from './hooks/useScrollbarVisibility';
import { projects, type Project } from './data/projects';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectList from './components/ProjectList';
import About from './components/About';
import Contact from './components/Contact';
import { getProjectSlug } from './utils/project-display';

const loadProjectSheet = () => import('./components/ProjectSheet');
const ProjectSheet = lazy(loadProjectSheet);
const INTRO_STORAGE_KEY = 'mn-portfolio-intro-seen';
const PROJECT_QUERY_PARAM = 'project';

function shouldShowIntro() {
  if (typeof window === 'undefined') {
    return true;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return false;
  }

  try {
    return localStorage.getItem(INTRO_STORAGE_KEY) !== 'true';
  } catch {
    return true;
  }
}

function getProjectFromLocation() {
  if (typeof window === 'undefined') {
    return null;
  }

  const projectSlug = new URL(window.location.href).searchParams.get(PROJECT_QUERY_PARAM);

  if (!projectSlug) {
    return null;
  }

  return projects.find((project) => getProjectSlug(project.name) === projectSlug) ?? null;
}

function syncProjectUrl(project: Project | null, historyMode: 'push' | 'replace') {
  const url = new URL(window.location.href);

  if (project) {
    url.searchParams.set(PROJECT_QUERY_PARAM, getProjectSlug(project.name));
    url.hash = '';
  } else {
    url.searchParams.delete(PROJECT_QUERY_PARAM);
  }

  const method = historyMode === 'push' ? 'pushState' : 'replaceState';
  window.history[method](window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
}

function App() {
  useLenis();
  useScrollbarVisibility();
  
  const [isIntroActive, setIsIntroActive] = useState(() => shouldShowIntro());
  const [isAppRevealed, setIsAppRevealed] = useState(() => !shouldShowIntro());
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => getProjectFromLocation());
  const [isSheetOpen, setIsSheetOpen] = useState(() => Boolean(getProjectFromLocation()));
  const projectTriggerRef = useRef<HTMLElement | null>(null);

  const syncProjectStateFromLocation = useCallback(() => {
    const projectFromLocation = getProjectFromLocation();
    setSelectedProject(projectFromLocation);
    setIsSheetOpen(Boolean(projectFromLocation));
  }, []);

  const handleProjectSelect = useCallback((project: Project) => {
    projectTriggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    setSelectedProject(project);
    setIsSheetOpen(true);
    syncProjectUrl(project, isSheetOpen ? 'replace' : 'push');
  }, [isSheetOpen]);

  const handleCloseSheet = useCallback(() => {
    setIsSheetOpen(false);
    syncProjectUrl(null, 'replace');
  }, []);

  const handleLoaderReveal = useCallback(() => {
    setIsAppRevealed(true);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setIsIntroActive(false);
  }, []);

  useEffect(() => {
    if (!isAppRevealed) {
      return;
    }

    try {
      localStorage.setItem(INTRO_STORAGE_KEY, 'true');
    } catch {
      // Ignore localStorage failures and keep the experience functional.
    }
  }, [isAppRevealed]);

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

  useEffect(() => {
    const handlePopState = () => {
      syncProjectStateFromLocation();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [syncProjectStateFromLocation]);

  return (
    <ThemeProvider>
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
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <Navbar />
          <main id="main-content" tabIndex={-1}>
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
              returnFocusRef={projectTriggerRef}
            />
          </Suspense>
        </>
      </div>

      {isIntroActive ? (
        <Loader onReveal={handleLoaderReveal} onComplete={handleLoaderComplete} />
      ) : null}
    </ThemeProvider>
  );
}

export default App;
