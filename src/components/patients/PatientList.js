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
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getPatients, addPatient, updatePatient, deletePatient } from '../../services/data';
import { useAuth } from '../../context/AuthContext';

const PatientList = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const isAdmin = authState.user?.role === 'admin';
  
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPatient, setCurrentPatient] = useState({
    id: null,
    name: '',
    age: '',
    gender: '',
    contact: '',
    email: '',
    address: '',
    lastVisit: '',
    nextAppointment: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadPatients();
    // eslint-disable-next-line
  }, [authState]);

  const loadPatients = () => {
    // Initialize data first
    const allPatients = getPatients();
    console.log('All patients:', allPatients);
    
    // For patient users, only show their own record
    if (authState.user?.role === 'patient') {
      const filteredPatients = allPatients.filter(p => p.name === authState.user.name);
      console.log('Filtered patients for patient role:', filteredPatients);
      setPatients(filteredPatients);
    } else {
      // For admin, show all patients
      console.log('Setting all patients for admin');
      setPatients(allPatients);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm)
  );

  const handleOpenDialog = (patient = null) => {
    if (patient) {
      setCurrentPatient(patient);
      setIsEditing(true);
    } else {
      setCurrentPatient({
        id: null,
        name: '',
        age: '',
        gender: '',
        contact: '',
        email: '',
        address: '',
        lastVisit: new Date().toISOString().split('T')[0],
        nextAppointment: ''
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
    setCurrentPatient({
      ...currentPatient,
      [name]: value
    });
  };

  const handleSavePatient = () => {
    if (isEditing) {
      updatePatient(currentPatient);
    } else {
      addPatient(currentPatient);
    }
    loadPatients();
    handleCloseDialog();
  };

  const handleDeletePatient = (id) => {
    deletePatient(id);
    loadPatients();
  };

  const handleViewPatient = (id) => {
    navigate(`/patients/${id}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="div">
          Patients
        </Typography>
        {isAdmin && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Patient
          </Button>
        )}
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Search Patients"
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

      {/* Patient Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Last Visit</TableCell>
              <TableCell>Next Appointment</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.contact}</TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>{patient.nextAppointment}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleViewPatient(patient.id)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    {isAdmin && (
                      <>
                        <IconButton size="small" onClick={() => handleOpenDialog(patient)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeletePatient(patient.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No patients found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Patient Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={currentPatient.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={currentPatient.age}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={currentPatient.gender}
                  label="Gender"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact"
                name="contact"
                value={currentPatient.contact}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={currentPatient.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={currentPatient.address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Visit"
                name="lastVisit"
                type="date"
                value={currentPatient.lastVisit}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Next Appointment"
                name="nextAppointment"
                type="date"
                value={currentPatient.nextAppointment}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSavePatient} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientList;
