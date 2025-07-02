import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, Box, Typography, Dialog,
  DialogTitle, DialogContent, DialogActions, Grid, FormControl,
  InputLabel, Select, MenuItem, Chip, CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { initializeData, getAppointments, addAppointment, updateAppointment, getPatients } from '../../services/data';
import { useAuth } from '../../context/AuthContext';

// Treatment options
const treatmentOptions = [
  'Regular Checkup',
  'Teeth Cleaning',
  'Root Canal',
  'Extraction',
  'Orthodontics',
  'Dental Implants',
  'Teeth Whitening',
  'Fillings'
];

const ReliableAppointmentList = () => {
  const { authState } = useAuth();
  const isAdmin = authState?.user?.role === 'admin';
  const userName = authState?.user?.name;
  const isAuthenticated = !!authState?.user;
  
  // States
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentAppointment, setCurrentAppointment] = useState({
    id: null,
    patientId: '',
    patientName: '',
    date: '',
    time: '',
    treatment: '',
    notes: '',
    status: 'Scheduled'
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load data using our reliable approach
  useEffect(() => {
    const loadData = () => {
      try {
        console.log('%c Loading appointments data...', 'background: #ff9800; color: white; padding: 4px');
        console.log('%c Auth State:', 'background: #4caf50; color: white; padding: 2px', {
          isAuthenticated,
          isAdmin,
          userName
        });
        
        // Initialize test data in localStorage
        initializeData();
        
        // Get patients for dropdown
        const allPatients = getPatients();
        setPatients(allPatients || []);
        
        // Get all appointments
        const allAppointments = getAppointments();
        console.log('%c All appointments loaded:', 'background: #2196f3; color: white; padding: 2px', 
          allAppointments?.length || 0);
        
        // Filter based on role
        if (isAdmin) {
          // Admin sees all appointments
          setAppointments(allAppointments || []);
          console.log('%c Admin view: showing all appointments', 'background: #4caf50; color: white; padding: 2px');
        } else if (isAuthenticated) {
          // Patient sees only their appointments
          const patient = allPatients.find(
            p => p.name.toLowerCase() === userName?.toLowerCase()
          );
          
          if (patient) {
            const patientAppointments = allAppointments.filter(
              a => a.patientId === patient.id
            );
            
            setAppointments(patientAppointments);
            console.log('%c Patient view: filtered appointments', 'background: #e91e63; color: white; padding: 2px', 
              patientAppointments.length);
          } else {
            console.warn('%c No patient record found for user: ' + userName, 'background: #f44336; color: white; padding: 2px');
            setAppointments([]);
          }
        } else {
          // Not authenticated: show all for development
          setAppointments(allAppointments || []);
          console.log('%c Not authenticated: showing all for development', 'background: #ff9800; color: white; padding: 2px');
        }
      } catch (error) {
        console.error('%c Error loading appointments:', 'background: #f44336; color: white; padding: 2px', error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [isAuthenticated, isAdmin, userName]);

  // Search functionality
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAppointments = appointments.filter(appointment =>
    (appointment.patientName && appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (appointment.treatment && appointment.treatment.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (appointment.date && appointment.date.includes(searchTerm))
  );

  // Dialog handlers
  const handleOpenDialog = (appointment = null) => {
    if (appointment) {
      setCurrentAppointment(appointment);
      setIsEditing(true);
    } else {
      setCurrentAppointment({
        id: null,
        patientId: '',
        patientName: '',
        date: '',
        time: '',
        treatment: 'Regular Checkup',
        notes: '',
        status: 'Scheduled'
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAppointment({
      ...currentAppointment,
      [name]: value
    });
    
    // Set patientName if patientId changes
    if (name === 'patientId') {
      const selectedPatient = patients.find(p => p.id === value);
      if (selectedPatient) {
        setCurrentAppointment(prev => ({
          ...prev,
          patientId: value,
          patientName: selectedPatient.name
        }));
      }
    }
  };

  // CRUD operations
  const handleSaveAppointment = () => {
    try {
      // Validate required fields
      if (!currentAppointment.patientId || !currentAppointment.date) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Generate a simple ID if new appointment
      if (!currentAppointment.id) {
        const newAppointment = {
          ...currentAppointment,
          id: Date.now().toString()
        };
        addAppointment(newAppointment);
      } else {
        updateAppointment(currentAppointment);
      }
      
      // Refresh the list
      const updatedAppointments = getAppointments();
      
      // Apply role-based filtering
      if (!isAdmin && isAuthenticated) {
        const patient = patients.find(
          p => p.name.toLowerCase() === userName?.toLowerCase()
        );
        
        if (patient) {
          setAppointments(updatedAppointments.filter(a => a.patientId === patient.id));
        }
      } else {
        setAppointments(updatedAppointments);
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  // Appointment deletion is now handled through the edit form

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            {isAdmin ? 'Manage Appointments' : 'Your Appointments'}
          </Typography>
          
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              color="primary"
            >
              New Appointment
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'gray' }} />
            }}
            sx={{ width: '100%', maxWidth: 500 }}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="appointments table">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Patient</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Treatment</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <TableRow 
                    key={appointment.id}
                    onClick={() => isAdmin ? handleOpenDialog(appointment) : null}
                    sx={{ 
                      cursor: isAdmin ? 'pointer' : 'default', 
                      '&:hover': { bgcolor: isAdmin ? '#f5f5f5' : 'inherit' } 
                    }}
                  >
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time || "Not specified"}</TableCell>
                    <TableCell>{appointment.treatment}</TableCell>
                    <TableCell>
                      <Chip 
                        label={appointment.status || "Scheduled"} 
                        color={
                          appointment.status === 'Completed' ? 'success' : 
                          appointment.status === 'Cancelled' ? 'error' : 
                          'primary'
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No appointments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Appointment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Appointment' : 'New Appointment'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Patient</InputLabel>
                <Select
                  name="patientId"
                  value={currentAppointment.patientId}
                  onChange={handleInputChange}
                  label="Patient"
                >
                  {patients.map(patient => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Treatment</InputLabel>
                <Select
                  name="treatment"
                  value={currentAppointment.treatment}
                  onChange={handleInputChange}
                  label="Treatment"
                >
                  {treatmentOptions.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="date"
                label="Date"
                type="date"
                value={currentAppointment.date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="time"
                label="Time"
                type="time"
                value={currentAppointment.time}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={currentAppointment.status || 'Scheduled'}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                  <MenuItem value="Rescheduled">Rescheduled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes"
                value={currentAppointment.notes}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveAppointment} variant="contained" color="primary">
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReliableAppointmentList;
