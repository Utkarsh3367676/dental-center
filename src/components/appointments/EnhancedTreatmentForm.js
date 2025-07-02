import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Box,
  InputAdornment
} from '@mui/material';
import { addTreatment, updateTreatment } from '../../services/data';
import FileUpload from './FileUpload';

/**
 * Enhanced Treatment Form that includes cost tracking and file uploads
 */
const EnhancedTreatmentForm = ({ open, onClose, appointment, patientId, patientName, existingTreatment = null }) => {
  const [treatment, setTreatment] = useState({
    patientId: patientId,
    patientName: patientName,
    date: new Date().toISOString().split('T')[0],
    treatment: '',
    notes: '',
    cost: 0,
    paymentStatus: 'Pending',
    nextVisitRecommended: '',
    dentistNotes: '',
    attachments: []
  });

  // Initialize form with existing treatment data if provided
  useEffect(() => {
    if (existingTreatment) {
      setTreatment(existingTreatment);
    } else if (appointment) {
      setTreatment(prev => ({
        ...prev,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        treatment: appointment.treatment,
        date: appointment.date,
        notes: appointment.notes,
        cost: appointment.estimatedCost || 0,
        nextVisitRecommended: appointment.nextAppointment || '',
      }));
    }
  }, [existingTreatment, appointment]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTreatment(prev => ({
      ...prev,
      [name]: name === 'cost' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle file addition
  const handleFileAdded = (newFile) => {
    setTreatment(prev => ({
      ...prev,
      attachments: [...prev.attachments, newFile]
    }));
  };

  // Handle file removal
  const handleFileRemoved = (index) => {
    setTreatment(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    const treatmentToSave = {
      ...treatment,
      id: existingTreatment?.id || Date.now()
    };

    if (existingTreatment) {
      updateTreatment(treatmentToSave);
    } else {
      addTreatment(treatmentToSave);
    }

    onClose(true);
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        {existingTreatment ? 'Edit Treatment Record' : 'Add Treatment Record'}
      </DialogTitle>
      
      <DialogContent>
        <Box my={2}>
          <Typography variant="subtitle1" gutterBottom>
            Patient: {treatment.patientName}
          </Typography>
          
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="date"
                label="Treatment Date"
                type="date"
                value={treatment.date}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="treatment"
                label="Treatment Type"
                value={treatment.treatment}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="cost"
                label="Treatment Cost"
                type="number"
                value={treatment.cost}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Payment Status</InputLabel>
                <Select
                  name="paymentStatus"
                  value={treatment.paymentStatus}
                  onChange={handleChange}
                  label="Payment Status"
                >
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Insurance claim submitted">Insurance claim submitted</MenuItem>
                  <MenuItem value="Partially paid">Partially paid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="nextVisitRecommended"
                label="Next Visit Date"
                type="date"
                value={treatment.nextVisitRecommended}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Treatment Notes"
                multiline
                rows={2}
                value={treatment.notes}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="dentistNotes"
                label="Dentist Notes"
                multiline
                rows={3}
                value={treatment.dentistNotes}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Attachments
              </Typography>
              <FileUpload
                files={treatment.attachments}
                onFileAdded={handleFileAdded}
                onFileRemoved={handleFileRemoved}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {existingTreatment ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EnhancedTreatmentForm;
