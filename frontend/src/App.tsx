import { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from '@contexts/UserContext';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { Header } from '@components/Header';
import { DashboardPage } from '@pages/Dashboard';
import { PdfViewerPage } from '@pages/PdfViewer';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { Role } from '@/types';

function App() {
  const [currentUser, setCurrentUser] = useState<Role>('A1');

  const contextValue = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
    }),
    [currentUser]
  );

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <UserContext.Provider value={contextValue}>
          <BrowserRouter>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/files/:fileId" element={<PdfViewerPage />} />
              </Routes>
            </main>
          </BrowserRouter>
          <Toaster />
        </UserContext.Provider>
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;