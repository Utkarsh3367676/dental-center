import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button,
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  EventNote as EventIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { getPatientById, getAppointmentsByPatientId } from '../../services/data';
import TreatmentRecords from '../treatments/TreatmentRecords';
import { useAuth } from '../../context/AuthContext';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const isAdmin = authState.user?.role === 'admin';
  const isPatientOwner = authState.user?.role === 'patient' && authState.user?.name === patient?.name;

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (id) {
      const patientData = getPatientById(parseInt(id));
      if (patientData) {
        setPatient(patientData);
        const patientAppointments = getAppointmentsByPatientId(parseInt(id));
        setAppointments(patientAppointments);
      }
    }
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!patient) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Patient not found</Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/patients')}
          sx={{ mt: 2 }}
        >
          Back to Patients
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/patients')}
        sx={{ mb: 3 }}
      >
        Back to Patients
      </Button>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="div">
            Patient Details
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
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
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Phone" 
                      secondary={patient.contact} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email" 
                      secondary={patient.email || 'Not provided'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Address" 
                      secondary={patient.address || 'Not provided'} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="patient tabs">
            <Tab label="Appointments" />
            <Tab label="Treatment Records" />
          </Tabs>
        </Box>
        <Box sx={{ py: 2 }}>
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Upcoming Appointments
              </Typography>
              {appointments.length > 0 ? (
                <List>
                  {appointments.map((appointment) => (
                    <ListItem key={appointment.id} divider>
                      <ListItemIcon>
                        <EventIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${appointment.date} at ${appointment.time}`}
                        secondary={`Treatment: ${appointment.treatment} - Status: ${appointment.status}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1">No upcoming appointments</Typography>
              )}
            </Box>
          )}
          {tabValue === 1 && (
            <TreatmentRecords patientId={id} patientName={patient.name} />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default PatientDetails;
