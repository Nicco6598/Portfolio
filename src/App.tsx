import { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useLenis } from './hooks/useLenis';
import type { Project } from './data/projects';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectList from './components/ProjectList';
import ProjectSheet from './components/ProjectSheet';
import About from './components/About';
import Contact from './components/Contact';

function App() {
  useLenis();
  
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <ThemeProvider>
      <HashRouter>
        {!loaderComplete && <Loader onComplete={() => setLoaderComplete(true)} />}
        
        {loaderComplete && (
          <>
            <Navbar />
            <main>
              <Hero onProjectSelect={handleProjectSelect} />
              <ProjectList onProjectSelect={handleProjectSelect} />
              <About />
              <Contact />
            </main>
            <ProjectSheet
              project={selectedProject}
              isOpen={isSheetOpen}
              onClose={handleCloseSheet}
            />
          </>
        )}
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
