import { PresentationProvider } from './context/PresentationContext';
import { KeyboardManager } from './components/KeyboardManager';
import { TopBar } from './components/TopBar';
import { ChapterProgress } from './components/ChapterProgress';
import { SceneViewport } from './components/SceneViewport';
import { SceneControls } from './components/SceneControls';
import { PresenterNotesPanel } from './components/PresenterNotesPanel';
import { GlossaryDrawer } from './components/GlossaryDrawer';

export default function App() {
  return (
    <PresentationProvider>
      <KeyboardManager />
      <a className="skip-link" href="#main">
        Skip to the current chapter
      </a>
      <div className="shell">
        <TopBar />
        <ChapterProgress />
        <SceneViewport />
        <SceneControls />
      </div>
      <PresenterNotesPanel />
      <GlossaryDrawer />
    </PresentationProvider>
  );
}
