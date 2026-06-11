import { useEffect } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { theme } from './theme.js';
import { socket } from './ws/socket.js';
import { dispatchServerEvent, useAppStore } from './store/appStore.js';
import { Shell } from './components/Shell.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { PipelinePage } from './pages/PipelinePage.js';
import { BoardPage } from './pages/BoardPage.js';
import { WorkspacePage } from './pages/WorkspacePage.js';
import { SessionsPage } from './pages/SessionsPage.js';
import { DocsPage } from './pages/DocsPage.js';
import { SkillsPage } from './pages/SkillsPage.js';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

function WsBridge() {
  const qc = useQueryClient();
  const setWsConnected = useAppStore((s) => s.setWsConnected);

  useEffect(() => {
    socket.start();
    const offStatus = socket.onStatus(setWsConnected);
    const off = socket.addListener((event) => {
      dispatchServerEvent(event);
      switch (event.type) {
        case 'state-changed':
          void qc.invalidateQueries({ queryKey: ['project-state', event.projectId] });
          break;
        case 'session-update':
          void qc.invalidateQueries({ queryKey: ['sessions'] });
          break;
        case 'fs-changed':
          void qc.invalidateQueries({ queryKey: ['docs', event.projectId] });
          break;
        default:
          break;
      }
    });
    return () => {
      off();
      offStatus();
    };
  }, [qc, setWsConnected]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <WsBridge />
        <BrowserRouter>
          <Routes>
            <Route element={<Shell />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/pipeline" element={<PipelinePage />} />
              <Route path="/board" element={<BoardPage />} />
              <Route path="/workspace" element={<WorkspacePage />} />
              <Route path="/workspace/:sessionId" element={<WorkspacePage />} />
              <Route path="/sessions" element={<SessionsPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
