import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Event as EventIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAppointments, addAppointment, updateAppointment, deleteAppointment, getPatients } from '../../services/data';
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

const AppointmentList = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const isAdmin = authState.user?.role === 'admin';
  
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState({
    id: null,
    patientId: '',
    patientName: '',
    date: '',
    time: '',
    treatment: '',
    status: '',
    notes: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    loadAppointments();
    loadPatients();
    // eslint-disable-next-line
  }, [authState]);
  
  const loadAppointments = () => {
    // Get all appointments
    const allAppointments = getAppointments();
    console.log('All appointments:', allAppointments);
    
    // For patient users, only show their own appointments
    if (authState.user?.role === 'patient') {
      const patientList = getPatients();
      const patient = patientList.find(p => p.name === authState.user.name);
      
      if (patient) {
        console.log('Found patient:', patient);
        const filteredAppointments = allAppointments.filter(a => a.patientId === patient.id);
        console.log('Filtered appointments for patient:', filteredAppointments);
        setAppointments(filteredAppointments);
      } else {
        console.log('Patient not found in patient list');
        setAppointments([]);
      }
    } else {
      // For admin, show all appointments
      console.log('Setting all appointments for admin');
      setAppointments(allAppointments);
    }
  };
  
  const loadPatients = () => {
    const allPatients = getPatients();
    console.log('Loaded patients for appointment selection:', allPatients);
    setPatients(allPatients);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.treatment.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        treatment: '',
        status: '',
        notes: ''
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
    
    if (name === 'patientId') {
      const selectedPatient = patients.find(p => p.id === parseInt(value));
      setCurrentAppointment({
        ...currentAppointment,
        patientId: parseInt(value),
        patientName: selectedPatient ? selectedPatient.name : ''
      });
    } else {
      setCurrentAppointment({
        ...currentAppointment,
        [name]: value
      });
    }
  };

  const handleSaveAppointment = () => {
    if (isEditing) {
      updateAppointment(currentAppointment);
    } else {
      addAppointment(currentAppointment);
    }
    loadAppointments();
    handleCloseDialog();
  };

  const handleDeleteAppointment = (id) => {
    deleteAppointment(id);
    loadAppointments();
  };
  
  const handleViewPatient = (patientId) => {
    navigate(`/patients/${patientId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Scheduled':
        return 'primary';
      case 'Completed':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="div">
          Appointments
        </Typography>
        {isAdmin && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Appointment
          </Button>
        )}
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Search Appointments"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: 300 }}
        />
        <IconButton>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* Appointments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Treatment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.treatment}</TableCell>
                  <TableCell>
                    <Chip 
                      label={appointment.status} 
                      color={getStatusColor(appointment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {isAdmin && (
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewPatient(appointment.patientId)}
                        title="View Patient"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    )}
                    {isAdmin && (
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog(appointment)}
                        title="Edit Appointment"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    {isAdmin && (
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        title="Delete Appointment"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No appointments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Appointment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EventIcon sx={{ mr: 1 }} />
            {isEditing ? 'Edit Appointment' : 'Schedule New Appointment'}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Patient</InputLabel>
                <Select
                  name="patientId"
                  value={currentAppointment.patientId}
                  label="Patient"
                  onChange={handleInputChange}
                >
                  {patients.map((patient) => (
                    <MenuItem key={patient.id} value={patient.id}>{patient.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Treatment</InputLabel>
                <Select
                  name="treatment"
                  value={currentAppointment.treatment}
                  label="Treatment"
                  onChange={handleInputChange}
                >
                  {treatmentOptions.map((treatment) => (
                    <MenuItem key={treatment} value={treatment}>{treatment}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={currentAppointment.date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time"
                name="time"
                type="time"
                value={currentAppointment.time}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={currentAppointment.status}
                  label="Status"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="Confirmed">Confirmed</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={3}
                value={currentAppointment.notes}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveAppointment} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentList;
