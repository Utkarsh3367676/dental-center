import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, Box, Typography, Dialog,
  DialogTitle, DialogContent, DialogActions, Grid, FormControl,
  InputLabel, Select, MenuItem, CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { initializeData, getPatients, addPatient, updatePatient } from '../../services/data';
import { useAuth } from '../../context/AuthContext';

const ReliablePatientList = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const isAdmin = authState?.user?.role === 'admin';
  const userName = authState?.user?.name;
  const isAuthenticated = !!authState?.user;
  
  // States
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
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

  // Load data using our reliable approach
  useEffect(() => {
    const loadPatients = () => {
      try {
        console.log('%c Loading patients data...', 'background: #ff9800; color: white; padding: 4px');
        console.log('%c Auth State:', 'background: #4caf50; color: white; padding: 2px', {
          isAuthenticated,
          isAdmin,
          userName
        });
        
        // Initialize test data in localStorage
        initializeData();
        
        // Get all patients
        const allPatients = getPatients();
        console.log('%c All patients loaded:', 'background: #2196f3; color: white; padding: 2px', 
          allPatients?.length || 0);
        
        // Filter based on role
        if (isAdmin) {
          // Admin sees all patients
          setPatients(allPatients || []);
          console.log('%c Admin view: showing all patients', 'background: #4caf50; color: white; padding: 2px');
        } else if (isAuthenticated) {
          // Patient sees only their record
          const patientRecord = allPatients.filter(
            p => p.name.toLowerCase() === userName?.toLowerCase()
          );
          
          setPatients(patientRecord);
          console.log('%c Patient view: showing filtered patients', 'background: #e91e63; color: white; padding: 2px', 
            patientRecord.length);
        } else {
          // Not authenticated, show all for development
          setPatients(allPatients || []);
          console.log('%c Not authenticated: showing all for development', 'background: #ff9800; color: white; padding: 2px');
        }
      } catch (error) {
        console.error('%c Error loading patients:', 'background: #f44336; color: white; padding: 2px', error);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadPatients();
  }, [isAuthenticated, isAdmin, userName]);

  // Search functionality
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.contact && patient.contact.includes(searchTerm))
  );

  // Dialog handlers
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
        lastVisit: '',
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

  // CRUD operations
  const handleSavePatient = () => {
    try {
      // Generate a simple ID if new patient
      if (!currentPatient.id) {
        const newPatient = {
          ...currentPatient,
          id: Date.now().toString()
        };
        addPatient(newPatient);
      } else {
        updatePatient(currentPatient);
      }
      
      // Refresh the list
      setPatients(getPatients());
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

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
            {isAdmin ? 'Manage Patients' : 'Your Patient Record'}
          </Typography>
          
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              color="primary"
            >
              Add New Patient
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'gray' }} />
            }}
            sx={{ width: '100%', maxWidth: 500 }}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="patient table">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow 
                    key={patient.id} 
                    onClick={() => navigate(`/patients/${patient.id}`)} 
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { bgcolor: '#f5f5f5' } 
                    }}
                  >
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.contact}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No patients found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Patient Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Full Name"
                value={currentPatient.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="age"
                label="Age"
                value={currentPatient.age}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={currentPatient.gender}
                  onChange={handleInputChange}
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="contact"
                label="Contact Number"
                value={currentPatient.contact}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                value={currentPatient.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                value={currentPatient.address}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSavePatient} variant="contained" color="primary">
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReliablePatientList;
