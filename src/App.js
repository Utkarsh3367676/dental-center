import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';

// Import components
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
// Import dashboard components
import EnhancedDashboard from './components/dashboard/EnhancedDashboard';

// Import pages
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import PatientDetail from './pages/PatientDetail';
import Calendar from './pages/Calendar';
import Login from './components/auth/Login';
import Unauthorized from './pages/Unauthorized';

// Import context
import { AuthProvider } from './context/AuthContext';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
            
            <Container component="main" sx={{ flexGrow: 1, py: 2 }}>
              <Routes>
                {/* Dashboard route - accessible without authentication for demo purposes */}
                <Route path="/dashboard" element={<EnhancedDashboard />} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Root route uses EnhancedDashboard with proper ProtectedRoute */}
                <Route path="/" element={<ProtectedRoute element={<EnhancedDashboard />} />} />
                
                <Route path="/patients" element={<ProtectedRoute element={<Patients />} />} />
                
                <Route path="/patients/:id" element={<ProtectedRoute element={<PatientDetail />} />} />
                
                <Route path="/appointments" element={<ProtectedRoute element={<Appointments />} />} />
                
                <Route path="/calendar" element={<ProtectedRoute element={<Calendar />} allowedRoles={['admin']} />} />
              </Routes>
            </Container>
            
            <Footer />
          </Box>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
