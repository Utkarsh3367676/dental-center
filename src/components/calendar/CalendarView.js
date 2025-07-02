// Updated Calendar Grid Layout with Alignment and Readability Fixes

import React, { useState, useEffect, useContext } from 'react';
import {
  Box, Typography, Button, ButtonGroup, IconButton, Divider, Chip, List, ListItem, ListItemText, Dialog, Container, Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TodayIcon from '@mui/icons-material/Today';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { getAppointments } from '../../services/data';
import { AuthContext } from '../../context/AuthContext';
import EnhancedTreatmentForm from '../appointments/EnhancedTreatmentForm';

const CalendarCell = styled(Box)(({ theme, istoday, isselected, hasappointments, iscurrentmonth }) => ({
  padding: theme.spacing(1),
  minHeight: '110px',
  width: '100%',
  backgroundColor:
    isselected === 'true' ? theme.palette.primary.main :
    istoday === 'true' ? 'rgba(33, 150, 243, 0.15)' :
    iscurrentmonth === 'true' ? theme.palette.background.paper : '#f5f5f5',
  color: isselected === 'true' ? theme.palette.primary.contrastText : 'inherit',
  border: istoday === 'true' ? `3px solid ${theme.palette.secondary.main}` :
    isselected === 'true' ? `2px solid ${theme.palette.primary.dark}` : '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: istoday === 'true' ? '0 0 10px rgba(33, 150, 243, 0.3)' : 'none',
  cursor: hasappointments === 'true' ? 'pointer' : 'default',
  position: 'relative',
  '&:hover': {
    backgroundColor: hasappointments === 'true' ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
  },
}));

const DateDisplay = styled(Box)(({ theme, istoday }) => ({
  position: 'absolute',
  top: '8px',
  right: '8px',
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  backgroundColor: istoday === 'true' ? theme.palette.secondary.main : 'transparent',
  color: istoday === 'true' ? theme.palette.secondary.contrastText : theme.palette.text.primary,
  fontWeight: 600,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '0.95rem'
}));

const AppointmentBadge = styled(Chip)(({ theme }) => ({
  fontSize: '0.75rem',
  height: '24px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  position: 'absolute',
  bottom: '10px',
  left: '10px',
  fontWeight: 500,
}));

const WeekdayHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  padding: theme.spacing(1),
  fontSize: '1rem',
}));

const CalendarView = () => {
  const { authState } = useContext(AuthContext);
  const [viewType, setViewType] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarData, setCalendarData] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedAppointment] = useState(null);
  const [treatmentFormOpen, setTreatmentFormOpen] = useState(false);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    const data = getAppointments();
    setAppointments(
      authState.user?.role === 'patient'
        ? data.filter((a) => a.patientId === authState.user.id)
        : data
    );
  }, [authState.user]);

  useEffect(() => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    const end = new Date(last);
    end.setDate(last.getDate() + (6 - last.getDay()));

    const temp = [];
    const todayStr = new Date().toISOString().split('T')[0];
    let day = new Date(start);

    while (day <= end) {
      const dateStr = day.toISOString().split('T')[0];
      const daily = appointments.filter((a) => a.date === dateStr);
      temp.push({
        date: new Date(day),
        hasAppointments: daily.length > 0,
        appointmentCount: daily.length,
        isToday: dateStr === todayStr,
        isCurrentMonth: day.getMonth() === month,
      });
      day.setDate(day.getDate() + 1);
    }
    setCalendarData(temp);
  }, [appointments, currentDate]);

  const handleClick = (date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split('T')[0];
    setSelectedAppointments(appointments.filter((a) => a.date === dateStr));
    setDetailsOpen(true);
  };

  return (
    <Box>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</Typography>
        <Box>
          <ButtonGroup sx={{ mr: 1 }}>
            <Button onClick={() => setViewType('month')} variant={viewType === 'month' ? 'contained' : 'outlined'}><CalendarViewMonthIcon /> Month</Button>
            <Button onClick={() => setViewType('week')} variant={viewType === 'week' ? 'contained' : 'outlined'}><ViewWeekIcon /> Week</Button>
          </ButtonGroup>
          <ButtonGroup>
            <IconButton onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}><NavigateBeforeIcon /></IconButton>
            <IconButton onClick={() => setCurrentDate(new Date())}><TodayIcon /></IconButton>
            <IconButton onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}><NavigateNextIcon /></IconButton>
          </ButtonGroup>
        </Box>
      </Box>

      <Container maxWidth="lg">
        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1} mb={2}>
          {weekdays.map((day, i) => <WeekdayHeader key={i}>{day}</WeekdayHeader>)}
        </Box>

        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
          {calendarData.map((day, i) => {
            const isSelected = selectedDate?.toDateString() === day.date.toDateString();
            return (
              <CalendarCell
                key={i}
                istoday={day.isToday ? 'true' : 'false'}
                isselected={isSelected ? 'true' : 'false'}
                hasappointments={day.hasAppointments ? 'true' : 'false'}
                iscurrentmonth={day.isCurrentMonth ? 'true' : 'false'}
                onClick={() => day.hasAppointments && handleClick(day.date)}
              >
                <DateDisplay istoday={day.isToday ? 'true' : 'false'}>
                  {day.date.getDate()}
                </DateDisplay>
                {day.hasAppointments && (
                  <Tooltip title={`${day.appointmentCount} appointments`}>
                    <span><AppointmentBadge label={`${day.appointmentCount} appt`} /></span>
                  </Tooltip>
                )}
              </CalendarCell>
            );
          })}
        </Box>
      </Container>

      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <Box p={3}>
          <Typography variant="h6">Appointments on {selectedDate?.toDateString()}</Typography>
          <Divider sx={{ mb: 2 }} />
          {selectedAppointments.length ? (
            <List>
              {selectedAppointments.map((a) => (
                <ListItem key={a.id}>
                  <ListItemText
                    primary={`${a.time} - ${a.treatment}`}
                    secondary={`Patient: ${a.patientName}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : <Typography>No appointments.</Typography>}
        </Box>
      </Dialog>

      {treatmentFormOpen && selectedAppointment && (
        <EnhancedTreatmentForm
          open={treatmentFormOpen}
          onClose={() => setTreatmentFormOpen(false)}
          appointmentId={selectedAppointment.id}
          patientId={selectedAppointment.patientId}
          initialData={selectedAppointment}
          viewOnly={authState.user?.role !== 'admin'}
        />
      )}
    </Box>
  );
};

export default CalendarView;
