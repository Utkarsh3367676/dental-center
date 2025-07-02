import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { initializeData, getPatients, getAppointments, getTreatments } from '../../services/data';

// Ultra simple dashboard component
const SimpleDashboard = () => {
  // Basic state
  const [data, setData] = useState({
    patients: [],
    appointments: [],
    treatments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load data immediately on component mount
  useEffect(() => {
    const loadData = () => {
      try {
        console.log('SimpleDashboard: Loading data...');
        
        // Force initialize data in localStorage
        initializeData();
        
        // Print localStorage content directly to verify it exists
        console.log('Raw localStorage data:');
        console.log('Patients:', localStorage.getItem('dental_patients'));
        console.log('Appointments:', localStorage.getItem('dental_appointments'));
        console.log('Treatments:', localStorage.getItem('dental_treatments'));
        
        // Get data using the service functions
        const patients = getPatients();
        const appointments = getAppointments();
        const treatments = getTreatments();
        
        console.log('Data loaded through service functions:', {
          patientsCount: patients?.length,
          appointmentsCount: appointments?.length,
          treatmentsCount: treatments?.length
        });
        
        // Set state with the data
        setData({
          patients: patients || [],
          appointments: appointments || [],
          treatments: treatments || []
        });
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Paper sx={{ p: 3, bgcolor: '#ffebee', mt: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Paper>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#f9f9f9' }}>
        <Typography variant="h4">Simple Dashboard</Typography>
        <Typography>
          This is a minimal dashboard to verify data loading from localStorage.
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Debug Info:</Typography>
          <Typography>Patients: {data.patients.length}</Typography>
          <Typography>Appointments: {data.appointments.length}</Typography>
          <Typography>Treatments: {data.treatments.length}</Typography>
        </Box>
      </Paper>
      
      {/* Display the first few patients */}
      {data.patients.length > 0 ? (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Patients:</Typography>
          <List>
            {data.patients.slice(0, 5).map((patient) => (
              <React.Fragment key={patient.id}>
                <ListItem>
                  <ListItemText 
                    primary={patient.name} 
                    secondary={`Email: ${patient.email} | Phone: ${patient.contact}`} 
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, mb: 3, bgcolor: '#fff8e1' }}>
          <Typography>No patients found.</Typography>
        </Paper>
      )}
      
      {/* Display the first few appointments */}
      {data.appointments.length > 0 ? (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Appointments:</Typography>
          <List>
            {data.appointments.slice(0, 5).map((appointment) => (
              <React.Fragment key={appointment.id}>
                <ListItem>
                  <ListItemText 
                    primary={`Date: ${appointment.date} - ${appointment.time}`} 
                    secondary={`Patient: ${appointment.patientName} | Reason: ${appointment.treatment}`} 
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, mb: 3, bgcolor: '#fff8e1' }}>
          <Typography>No appointments found.</Typography>
        </Paper>
      )}
    </Container>
  );
};

export default SimpleDashboard;
