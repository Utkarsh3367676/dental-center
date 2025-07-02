import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  FileUpload as FileUploadIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { getTreatmentsByPatientId, addTreatment, updateTreatment, deleteTreatment } from '../../services/data';
import { useAuth } from '../../context/AuthContext';

const TreatmentRecords = ({ patientId, patientName }) => {
  const { authState } = useAuth();
  const isAdmin = authState.user?.role === 'admin';
  
  const [treatments, setTreatments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTreatment, setCurrentTreatment] = useState({
    id: null,
    patientId: patientId,
    date: '',
    treatment: '',
    notes: '',
    fileUrl: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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

  const loadTreatments = useCallback(() => {
    const patientTreatments = getTreatmentsByPatientId(parseInt(patientId));
    setTreatments(patientTreatments);
  }, [patientId]);

  const loadTreatmentsData = useCallback(() => {
    if (patientId) {
      loadTreatments();
    }
  }, [patientId, loadTreatments]);
  
  useEffect(() => {
    loadTreatmentsData();
  }, [loadTreatmentsData]);

  const handleOpenDialog = (treatment = null) => {
    if (treatment) {
      setCurrentTreatment(treatment);
      setIsEditing(true);
    } else {
      setCurrentTreatment({
        id: null,
        patientId: parseInt(patientId),
        date: new Date().toISOString().split('T')[0],
        treatment: '',
        notes: '',
        fileUrl: null
      });
      setIsEditing(false);
    }
    setSelectedFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTreatment({
      ...currentTreatment,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSaveTreatment = () => {
    // Create a copy of the current treatment
    const treatmentToSave = { ...currentTreatment };
    
    // Handle file upload (in a real app, this would upload to a server)
    if (selectedFile) {
      // In a real app, we'd upload the file to a server and get a URL back
      // For this demo, we'll create a fake URL using base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target.result;
        treatmentToSave.fileUrl = {
          name: selectedFile.name,
          type: selectedFile.type,
          data: fileData
        };
        
        saveTreatmentRecord(treatmentToSave);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      saveTreatmentRecord(treatmentToSave);
    }
  };
  
  const saveTreatmentRecord = (treatmentRecord) => {
    if (isEditing) {
      updateTreatment(treatmentRecord);
    } else {
      addTreatment(treatmentRecord);
    }
    loadTreatments();
    handleCloseDialog();
  };

  const handleDeleteTreatment = (id) => {
    deleteTreatment(id);
    loadTreatments();
  };

  const downloadFile = (fileData) => {
    // Create a download link for the file
    const link = document.createElement('a');
    link.href = fileData.data;
    link.download = fileData.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="div">
          Treatment Records
        </Typography>
        {isAdmin && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Treatment Record
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Treatment</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Files</TableCell>
              {isAdmin && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {treatments.length > 0 ? (
              treatments.map((treatment) => (
                <TableRow key={treatment.id}>
                  <TableCell>{treatment.date}</TableCell>
                  <TableCell>{treatment.treatment}</TableCell>
                  <TableCell>{treatment.notes}</TableCell>
                  <TableCell>
                    {treatment.fileUrl ? (
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => downloadFile(treatment.fileUrl)}
                      >
                        {treatment.fileUrl.name}
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No files
                      </Typography>
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenDialog(treatment)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteTreatment(treatment.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isAdmin ? 5 : 4} align="center">
                  No treatment records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Treatment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Treatment Record' : 'Add Treatment Record'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={currentTreatment.date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Treatment</InputLabel>
                <Select
                  name="treatment"
                  value={currentTreatment.treatment}
                  label="Treatment"
                  onChange={handleInputChange}
                >
                  {treatmentOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
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
                value={currentTreatment.notes}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<FileUploadIcon />}
              >
                Upload File
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {selectedFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {selectedFile.name}
                </Typography>
              )}
              {!selectedFile && currentTreatment.fileUrl && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Current file: {currentTreatment.fileUrl.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTreatment} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TreatmentRecords;
