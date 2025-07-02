import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@mui/material';
import { 
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { initializeData, getPatientById, getAppointmentsByPatientId } from '../../services/data';
import TreatmentRecords from '../treatments/TreatmentRecords';
import { useAuth } from '../../context/AuthContext';

const ReliablePatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const isAdmin = authState?.user?.role === 'admin';

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Define isPatientOwner only after patient is loaded
  const isPatientOwner = patient ? 
    authState?.user?.role === 'patient' && 
    authState?.user?.name?.toLowerCase() === patient?.name?.toLowerCase() : 
    false;

  // Load patient data using our reliable approach
  useEffect(() => {
    const loadPatientData = () => {
      try {
        console.log('%c Loading patient details...', 'background: #ff9800; color: white; padding: 4px');
        console.log('%c Patient ID:', 'background: #4caf50; color: white; padding: 2px', id);
        
        // Initialize test data in localStorage
        initializeData();
        
        if (id) {
          // Get patient data
          const patientData = getPatientById(id);
          console.log('%c Patient data loaded:', 'background: #2196f3; color: white; padding: 2px', patientData);
          
          if (patientData) {
            setPatient(patientData);
            
            // Get patient appointments
            const patientAppointments = getAppointmentsByPatientId(id);
            console.log('%c Patient appointments:', 'background: #9c27b0; color: white; padding: 2px', 
              patientAppointments?.length || 0);
            setAppointments(patientAppointments || []);
          } else {
            console.error('%c Patient not found with ID:', 'background: #f44336; color: white; padding: 2px', id);
            // Redirect to patients list if patient not found
            navigate('/patients');
          }
        } else {
          console.error('%c No patient ID provided', 'background: #f44336; color: white; padding: 2px');
          navigate('/patients');
        }
      } catch (error) {
        console.error('%c Error loading patient details:', 'background: #f44336; color: white; padding: 2px', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPatientData();
  }, [id, navigate]);

  // Authorization check
  useEffect(() => {
    // Check if user has permission to view this patient
    if (!loading && patient && !isAdmin && !isPatientOwner) {
      console.warn('%c Unauthorized access to patient details', 'background: #f44336; color: white; padding: 2px');
      navigate('/unauthorized');
    }
  }, [patient, isAdmin, isPatientOwner, navigate, loading]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleGoBack = () => {
    navigate('/patients');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" color="error">Patient not found</Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />} 
            onClick={handleGoBack}
            sx={{ mt: 2 }}
          >
            Back to Patients
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />} 
              onClick={handleGoBack}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h5">
              Patient Details
            </Typography>
          </Box>
          
          {isAdmin && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate(`/patients/edit/${id}`)}
            >
              Edit Patient
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Name" 
                      secondary={patient.name} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Age" 
                      secondary={patient.age} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Gender" 
                      secondary={patient.gender} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Contact" 
                      secondary={patient.contact || "Not provided"} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email" 
                      secondary={patient.email || "Not provided"} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Address" 
                      secondary={patient.address || "Not provided"} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="patient information tabs">
                  <Tab label="Appointments" />
                  <Tab label="Treatment History" />
                </Tabs>
              </Box>
              
              {/* Appointments Tab */}
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Upcoming Appointments
                  </Typography>
                  
                  {appointments.length > 0 ? (
                    <Grid container spacing={2}>
                      {appointments.map((appointment) => (
                        <Grid item xs={12} sm={6} key={appointment.id}>
                          <Card variant="outlined" sx={{ mb: 1 }}>
                            <CardContent>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {appointment.treatment}
                              </Typography>
                              
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {appointment.date} {appointment.time && `at ${appointment.time}`}
                              </Typography>
                              
                              {appointment.notes && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  {appointment.notes}
                                </Typography>
                              )}
                              
                              <Typography variant="body2">
                                Status: <strong>{appointment.status || "Scheduled"}</strong>
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography color="text.secondary">
                      No upcoming appointments
                    </Typography>
                  )}
                </Box>
              )}
              
              {/* Treatment History Tab */}
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Treatment History
                  </Typography>
                  <TreatmentRecords patientId={id} />
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ReliablePatientDetails;
