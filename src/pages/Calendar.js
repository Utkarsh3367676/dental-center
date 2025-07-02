import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import CalendarView from '../components/calendar/CalendarView';

/**
 * Calendar page for viewing appointments in monthly or weekly view
 */
const Calendar = () => {
  return (
    <Container maxWidth="xl">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Appointment Calendar
          </Typography>
          <Typography variant="body1" color="textSecondary">
            View and manage upcoming appointments in monthly or weekly view
          </Typography>
        </Box>
        
        <CalendarView />
      </Paper>
    </Container>
  );
};

export default Calendar;
