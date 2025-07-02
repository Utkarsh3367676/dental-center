import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Avatar, Chip, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, AccountCircle, Logout, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { authState, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleMenuClose();
    if (authState.user?.role === 'patient') {
      // Find patient ID based on name
      const patients = JSON.parse(localStorage.getItem('patients') || '[]');
      const patient = patients.find(p => p.name === authState.user.name);
      if (patient) {
        navigate(`/patients/${patient.id}`);
      }
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dental Center Dashboard
        </Typography>
        
        {authState.isAuthenticated ? (
          <>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" onClick={() => navigate('/')}>Dashboard</Button>
              {authState.user?.role === 'admin' && (
                <Button color="inherit" onClick={() => navigate('/patients')}>Patients</Button>
              )}
              <Button color="inherit" onClick={() => navigate('/appointments')}>
                {authState.user?.role === 'admin' ? 'Appointments' : 'My Appointments'}
              </Button>
              <Button color="inherit" onClick={() => navigate('/calendar')}>Calendar</Button>
            </Box>
            
            <Chip
              avatar={<Avatar><AccountCircle /></Avatar>}
              label={`${authState.user?.name} (${authState.user?.role === 'admin' ? 'Admin' : 'Patient'})`}
              color="primary"
              variant="outlined"
              onClick={handleMenuOpen}
              sx={{ ml: 2, color: 'white', borderColor: 'white' }}
            />
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {authState.user?.role === 'patient' && (
                <MenuItem onClick={handleProfile}>
                  <Person fontSize="small" sx={{ mr: 1 }} />
                  My Profile
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>
                <Logout fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
