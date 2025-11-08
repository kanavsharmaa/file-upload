import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext, type Role } from './contexts/UserContext';

// We will create these components in the next steps
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { PdfViewerPage } from './pages/PdfViewerPage';

function App() {
  // 1. This is our main state. Default to 'A1' (Admin).
  const [currentUser, setCurrentUser] = useState<Role>('A1');

  // 2. We create a 'value' object to pass to our context.
  // This lets any child component read 'currentUser'
  // or change it using 'setCurrentUser'.
  const contextValue = {
    currentUser,
    setCurrentUser,
  };

  return (
    // 3. The Provider "provides" the value to all components inside it.
    <UserContext.Provider value={contextValue}>
      <BrowserRouter>
        {/* 4. The Header will read from the context to show the 
              dropdown and change the user. */}
        <Header />
        
        <main>
          {/* 5. This sets up our different pages */}
          <Routes>
            {/* Route for the main dashboard */}
            <Route 
              path="/" 
              element={<DashboardPage />} 
            />
            
            {/* Route for the PDF viewer */}
            <Route 
              path="/files/:fileId" 
              element={<PdfViewerPage />} 
            />
          </Routes>
        </main>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;