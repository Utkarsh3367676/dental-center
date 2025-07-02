import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid
} from '@mui/material';
import { LockOutlined, PersonOutline } from '@mui/icons-material';
import { login } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { setAuthState } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'admin'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    // Attempt login
    const authResult = login(formData.username, formData.password);
    
    if (authResult.isAuthenticated) {
      // Check if role matches
      if (authResult.user.role !== formData.role) {
        setError(`Invalid credentials for ${formData.role} role`);
        return;
      }
      
      // Update auth state with login result
      setAuthState(authResult);
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <LockOutlined sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography component="h1" variant="h5">
              Dental Center Login
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              InputProps={{
                startAdornment: <PersonOutline sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Login As</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                label="Login As"
                onChange={handleChange}
              >
                <MenuItem value="admin">Admin (Dentist)</MenuItem>
                <MenuItem value="patient">Patient</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            
            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body2" color="text.secondary" align="center">
                  Demo Credentials:
                </Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Admin: username: admin, password: admin123
                </Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Patient: username: patient1, password: patient123
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
