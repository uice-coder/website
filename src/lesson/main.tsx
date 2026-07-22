import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LessonPage } from './LessonPage';
import './lesson.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

createRoot(container).render(
  <StrictMode>
    <LessonPage />
  </StrictMode>,
);
