import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Container,
  CircularProgress
} from '@mui/material';
import { 
  Person as PersonIcon, 
  CalendarToday as CalendarIcon,
  MedicalServices as MedicalIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { getPatients, getAppointments, getTreatments, initializeData } from '../../services/data';

// Simple Dashboard Component
const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { authState } = useAuth();
  const isAdmin = authState?.user?.role === 'admin';
  
  // Load data on mount only
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading dashboard data...');
        
        // Force initialize test data
        initializeData();
        
        // Get data directly
        const allPatients = getPatients();
        const allAppointments = getAppointments();
        const allTreatments = getTreatments();
        
        console.log('Data loaded:', {
          patients: allPatients?.length || 0,
          appointments: allAppointments?.length || 0,
          treatments: allTreatments?.length || 0
        });
        
        setPatients(allPatients || []);
        setAppointments(allAppointments || []);
        setTreatments(allTreatments || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <CircularProgress />
          <Typography variant="h6" ml={2}>Loading...</Typography>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      {/* Debug Panel */}
      <Paper elevation={3} sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6">Debug Information</Typography>
        <Typography><strong>User Role:</strong> {isAdmin ? 'Admin' : 'Patient'}</Typography>
        <Typography><strong>User Name:</strong> {authState?.user?.name || 'Not logged in'}</Typography>
        <Typography><strong>Patients:</strong> {patients?.length || 0}</Typography>
        <Typography><strong>Appointments:</strong> {appointments?.length || 0}</Typography>
        <Typography><strong>Treatments:</strong> {treatments?.length || 0}</Typography>
      </Paper>
      
      {/* Main Dashboard */}
      <Box mt={4}>
        {/* Summary Cards */}
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Patients</Typography>
              </Box>
              <Typography variant="h3" textAlign="center">{patients?.length || 0}</Typography>
            </Paper>
          </Grid>
          
          <Grid xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Appointments</Typography>
              </Box>
              <Typography variant="h3" textAlign="center">{appointments?.length || 0}</Typography>
            </Paper>
          </Grid>
          
          <Grid xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MedicalIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Treatments</Typography>
              </Box>
              <Typography variant="h3" textAlign="center">{treatments?.length || 0}</Typography>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Appointments List */}
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" mb={2}>Recent Appointments</Typography>
          
          {appointments && appointments.length > 0 ? (
            <List>
              {appointments.slice(0, 5).map((appointment) => (
                <React.Fragment key={appointment.id}>
                  <ListItem>
                    <ListItemText 
                      primary={`${appointment.patientName || 'Patient'}`}
                      secondary={`Date: ${appointment.date} - ${appointment.reason || 'Appointment'}`}
                    />
                    <Chip 
                      label={appointment.status || 'Scheduled'} 
                      color="primary" 
                      size="small" 
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography>No appointments found</Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
