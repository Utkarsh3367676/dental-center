import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Box,
  Typography,
  Avatar
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  Person as PersonIcon, 
  EventNote as EventIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  AdminPanelSettings as AdminIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ open, toggleSidebar }) => {
  const navigate = useNavigate();
  const { authState, logout } = useAuth();
  const isAdmin = authState.user?.role === 'admin';
  const isAuthenticated = authState.isAuthenticated;
  
  // Get patient ID if user is a patient
  const getPatientId = () => {
    if (authState.user?.role === 'patient') {
      const patients = JSON.parse(localStorage.getItem('patients') || '[]');
      const patient = patients.find(p => p.name === authState.user.name);
      return patient?.id;
    }
    return null;
  };
  
  const patientId = getPatientId();
  
  // Define menu items based on authentication and role
  const getMenuItems = () => {
    // Not authenticated - only show login
    if (!isAuthenticated) {
      return [
        { text: 'Login', icon: <LoginIcon />, path: '/login' },
      ];
    }
    
    // Common items for authenticated users
    const commonItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    ];
    
    // Admin specific items
    if (isAdmin) {
      return [
        ...commonItems,
        { text: 'Patients', icon: <PersonIcon />, path: '/patients' },
        { text: 'Appointments', icon: <EventIcon />, path: '/appointments' },
        { text: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
      ];
    }
    
    // Patient specific items - removed Patients tab
    else if (patientId) {
      return [
        ...commonItems,
        { text: 'My Profile', icon: <PersonIcon />, path: `/patients/${patientId}` },
        { text: 'My Appointments', icon: <EventIcon />, path: '/appointments' },
      ];
    }
    
    // Fallback (should not reach here)
    return commonItems;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toggleSidebar();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleSidebar}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
      >
        {/* User info section */}
        {isAuthenticated && (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ width: 60, height: 60, mb: 1, bgcolor: isAdmin ? 'primary.main' : 'secondary.main' }}>
              {isAdmin ? <AdminIcon /> : <PersonIcon />}
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {authState.user?.name || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isAdmin ? 'Administrator' : 'Patient'}
            </Typography>
          </Box>
        )}
        
        <Divider />
        
        {/* Menu Items */}
        <List>
          {getMenuItems().map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => { navigate(item.path); toggleSidebar(); }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        
        <Divider />
        
        {/* Logout option for authenticated users */}
        {isAuthenticated && (
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;