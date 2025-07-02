import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Container,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  ButtonGroup,
  Button,
  Typography
} from '@mui/material';
import { 
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  MedicalServices as MedicalIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getPatients, getAppointments, getTreatments } from '../../services/data';

// Custom stat card component
const StatCard = ({ icon, title, value, color, subtitle }) => (
  <Card elevation={3} sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h3" component="div">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

// Enhanced Dashboard Component
const EnhancedDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    upcomingAppointments: 0,
    revenue: 0,
    completedTreatments: 0,
    pendingTreatments: 0
  });
  
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const isAdmin = authState?.user?.role === 'admin';
  const currentUserId = authState?.user?.id;
  
  // Calculate all statistics
  const calculateStats = useCallback((patients, appointments, treatments) => {
    // Get date range
    const today = new Date();
    let rangeStart = new Date();
    
    switch(timeRange) {
      case 'week':
        rangeStart.setDate(today.getDate() - 7);
        break;
      case 'month':
        rangeStart.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        rangeStart.setFullYear(today.getFullYear() - 1);
        break;
      default:
        rangeStart.setDate(today.getDate() - 7);
    }
    
    // Get date strings for comparison
    const todayStr = today.toISOString().split('T')[0];
    const rangeStartStr = rangeStart.toISOString().split('T')[0];
    
    // Calculate active patients (had appointment in the time range)
    const activePatientIds = new Set(
      appointments
        .filter(apt => apt.date >= rangeStartStr && apt.date <= todayStr)
        .map(apt => apt.patientId)
    );
    
    // Calculate upcoming appointments (scheduled after today)
    const upcomingApts = appointments.filter(apt => apt.date > todayStr);
    
    // Calculate revenue from treatments in the time range
    const revenue = treatments
      .filter(t => t.date >= rangeStartStr && t.date <= todayStr)
      .reduce((sum, t) => sum + (t.cost || 0), 0);
    
    // Calculate completed and pending treatments
    const completedTreatments = treatments.filter(t => 
      t.date >= rangeStartStr && 
      t.date <= todayStr && 
      t.paymentStatus === 'Paid'
    ).length;
    
    const pendingTreatments = treatments.filter(t => 
      t.paymentStatus !== 'Paid'
    ).length;
    
    // Update stats
    setStats({
      totalPatients: patients.length,
      activePatients: activePatientIds.size,
      upcomingAppointments: upcomingApts.length,
      revenue: revenue,
      completedTreatments,
      pendingTreatments
    });
  }, [timeRange]);
  
  // Load data on mount and when time range changes
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading dashboard data...');
        
        // Get data directly
        const allPatients = getPatients();
        const allAppointments = getAppointments();
        const allTreatments = getTreatments();
        
        // Process treatments to ensure attachments are properly structured
        const processedTreatments = allTreatments.map(treatment => {
          // Ensure treatment has attachments array
          if (!treatment.attachments) {
            return {...treatment, attachments: []};
          }
          
          // Make sure attachments are properly formatted
          const validAttachments = Array.isArray(treatment.attachments) 
            ? treatment.attachments
            : [];
            
          return {
            ...treatment,
            attachments: validAttachments
          };
        });
        
        // Filter based on user role
        const filteredPatients = isAdmin 
          ? allPatients 
          : allPatients.filter(p => p.id === currentUserId);
          
        const filteredAppointments = isAdmin 
          ? allAppointments 
          : allAppointments.filter(a => a.patientId === currentUserId);
          
        const filteredTreatments = isAdmin 
          ? processedTreatments 
          : processedTreatments.filter(t => t.patientId === currentUserId);
        
        // Add patient name to appointments for easier reference
        const appointmentsWithNames = filteredAppointments.map(apt => {
          const patient = allPatients.find(p => p.id === apt.patientId);
          return {
            ...apt,
            patientName: patient ? patient.name : 'Unknown Patient'
          };
        });
        
        setPatients(filteredPatients || []);
        setAppointments(appointmentsWithNames || []);
        setTreatments(filteredTreatments || []);
        
        // Calculate statistics
        calculateStats(filteredPatients, appointmentsWithNames, filteredTreatments);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // No duplicate functions here
    
    loadData();
  }, [isAdmin, currentUserId, timeRange, calculateStats]);
  
  // Handle time range change
  // const handleTimeRangeChange = (range) => {
  //   setTimeRange(range);
  // };
  
  // Sort appointments by date, most recent first
  const sortedAppointments = [...appointments].sort((a, b) => 
    new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time)
  );
  
  // Get upcoming appointments (next 10)
  const upcomingAppointments = sortedAppointments
    .filter(apt => new Date(apt.date + 'T' + apt.time) > new Date())
    .slice(0, 10);
  
  // Calculate top patients (by number of appointments)
  const patientAppointmentCounts = isAdmin ? appointments.reduce((counts, apt) => {
    counts[apt.patientId] = (counts[apt.patientId] || 0) + 1;
    return counts;
  }, {}) : {};
  
  const topPatients = isAdmin ? Object.entries(patientAppointmentCounts)
    .map(([patientId, count]) => ({
      patient: patients.find(p => p.id === parseInt(patientId)) || { name: 'Unknown' },
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) : [];
  
  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <CircularProgress />
          <Typography variant="h6" ml={2}>Loading...</Typography>
        </Box>
      </Container>
    );
  }
  
  // Render different dashboards based on role
  if (!isAdmin) {
    // PATIENT VIEW
    return (
      <Container maxWidth="lg">
        {/* User info */}
        {patients.length > 0 && (
          <Box mb={4}>
            <Card elevation={3}>
              <CardHeader 
                title="My Information" 
                avatar={<Avatar sx={{ bgcolor: '#f50057' }}><PersonIcon /></Avatar>}
              />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                    <Typography variant="body1">{patients[0].name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Contact</Typography>
                    <Typography variant="body1">{patients[0].contact}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{patients[0].email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                    <Typography variant="body1">{patients[0].address || 'Not provided'}</Typography>
                  </Grid>
                  {patients[0].bloodType && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Blood Type</Typography>
                      <Typography variant="body1">{patients[0].bloodType}</Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Upcoming Appointments */}
        <Box mb={4}>
          <Card elevation={3}>
            <CardHeader 
              title="My Upcoming Appointments" 
              avatar={<Avatar sx={{ bgcolor: '#3f51b5' }}><CalendarIcon /></Avatar>}
              action={upcomingAppointments.length > 0 && (
                <Button color="primary" size="small" onClick={() => navigate('/appointments')}>
                  View All
                </Button>
              )}
            />
            <Divider />
            <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {appointment.treatment}
                            <Chip 
                              size="small" 
                              label={appointment.status} 
                              color={
                                appointment.status === 'Confirmed' ? 'success' :
                                appointment.status === 'Pending' ? 'warning' : 'default'
                              }
                              sx={{ ml: 1 }}
                            />
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              <strong>Date:</strong> {appointment.date} at {appointment.time}
                            </Typography>
                            <Typography variant="body2" display="block">
                              <strong>Room:</strong> {appointment.roomLocation || 'TBD'}
                            </Typography>
                            <Typography variant="body2" display="block">
                              <strong>Estimated cost:</strong> ${appointment.estimatedCost || 'TBD'}
                            </Typography>
                            {appointment.notes && (
                              <Typography variant="caption" display="block">
                                <strong>Notes:</strong> {appointment.notes}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary="No upcoming appointments"
                    secondary="Contact your dental office to schedule an appointment"
                  />
                </ListItem>
              )}
            </List>
          </Card>
        </Box>

        {/* Treatment History with Attachments */}
        <Box>
          <Card elevation={3}>
            <CardHeader 
              title="My Treatment History" 
              avatar={<Avatar sx={{ bgcolor: '#4caf50' }}><MedicalIcon /></Avatar>}
            />
            <Divider />
            {treatments.length > 0 ? (
              <List sx={{ maxHeight: '500px', overflow: 'auto' }}>
                {treatments.map((treatment) => (
                  <React.Fragment key={treatment.id}>
                    <ListItem alignItems="flex-start" sx={{ flexDirection: 'column' }}>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1">{treatment.name}</Typography>
                            <Chip 
                              size="small" 
                              label={treatment.paymentStatus || 'Unknown'} 
                              color={
                                treatment.paymentStatus === 'Paid' ? 'success' :
                                treatment.paymentStatus === 'Pending' ? 'warning' : 
                                treatment.paymentStatus === 'Insurance claim submitted' ? 'info' : 'default'
                              }
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2" display="block">
                              <strong>Date:</strong> {treatment.date}
                            </Typography>
                            <Typography component="span" variant="body2" display="block">
                              <strong>Cost:</strong> ${treatment.cost || 0}
                            </Typography>
                            {treatment.dentistNotes && (
                              <Typography variant="body2" display="block">
                                <strong>Notes:</strong> {treatment.dentistNotes}
                              </Typography>
                            )}
                            {treatment.nextVisitDate && (
                              <Typography variant="body2" display="block">
                                <strong>Next recommended visit:</strong> {treatment.nextVisitDate}
                              </Typography>
                            )}
                          </>
                        }
                      />
                      
                      {/* File Attachments */}
                      {treatment.attachments && treatment.attachments.length > 0 && (
                        <Box mt={2} width="100%">
                          <Typography variant="subtitle2">Attachments:</Typography>
                          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                            {treatment.attachments.map((file, idx) => {
                              // Determine file type
                              const isImage = file.type.startsWith('image/');
                              const isPdf = file.type === 'application/pdf';
                              
                              return (
                                <Box key={idx} 
                                  sx={{
                                    border: '1px solid #ddd',
                                    borderRadius: 1,
                                    p: 1,
                                    width: isImage ? 120 : 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                  }}
                                >
                                  {isImage ? (
                                    <img 
                                      src={file.data} 
                                      alt={file.name}
                                      style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain' }} 
                                    />
                                  ) : (
                                    <Box display="flex" alignItems="center" px={2}>
                                      {isPdf ? (
                                        <Box component="span" sx={{ color: 'error.main', mr: 1 }}>PDF</Box>
                                      ) : (
                                        <Box component="span" sx={{ color: 'primary.main', mr: 1 }}>DOC</Box>
                                      )}
                                    </Box>
                                  )}
                                  <Typography variant="caption" noWrap sx={{ maxWidth: '100%', mt: 1 }}>
                                    {file.name}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        </Box>
                      )}
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box p={3}>
                <Typography>No treatment history available</Typography>
              </Box>
            )}
          </Card>
        </Box>
      </Container>
    );
  }
  
  // ADMIN VIEW
  return (
    <Container maxWidth="lg">
      {/* Time Range Selector */}
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <ButtonGroup variant="outlined" aria-label="Time range">
          <Button 
            onClick={() => setTimeRange('week')}
            variant={timeRange === 'week' ? 'contained' : 'outlined'}
          >
            Week
          </Button>
          <Button 
            onClick={() => setTimeRange('month')}
            variant={timeRange === 'month' ? 'contained' : 'outlined'}
          >
            Month
          </Button>
          <Button 
            onClick={() => setTimeRange('year')}
            variant={timeRange === 'year' ? 'contained' : 'outlined'}
          >
            Year
          </Button>
        </ButtonGroup>
      </Box>
      
      {/* Main Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            icon={<PersonIcon />}
            title="Total Patients"
            value={stats.totalPatients}
            color="#3f51b5"
            subtitle={`${stats.activePatients} active ${timeRange}`}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            icon={<CalendarIcon />}
            title="Upcoming Appointments"
            value={stats.upcomingAppointments}
            color="#f50057"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            icon={<MoneyIcon />}
            title="Revenue"
            value={`$${stats.revenue.toFixed(2)}`}
            color="#4caf50"
            subtitle={`Past ${timeRange}`}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            icon={<MedicalIcon />}
            title="Treatments Completed"
            value={stats.completedTreatments}
            color="#ff9800"
            subtitle={`Past ${timeRange}`}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            icon={<TimelineIcon />}
            title="Treatments Pending"
            value={stats.pendingTreatments}
            color="#9c27b0"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            icon={<TrendingUpIcon />}
            title="Appointment Utilization"
            value={`${appointments.length ? Math.round((appointments.filter(apt => apt.status === 'Confirmed').length / appointments.length) * 100) : 0}%`}
            color="#2196f3"
          />
        </Grid>
      </Grid>
      
      {/* Upcoming Appointments */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={isAdmin ? 6 : 12}>
          <Card elevation={3}>
            <CardHeader 
              title="Upcoming Appointments" 
              action={
                <Button color="primary" size="small" onClick={() => navigate('/appointments')}>
                  View All
                </Button>
              }
            />
            <Divider />
            <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {appointment.treatment}
                            <Chip 
                              size="small" 
                              label={appointment.status} 
                              color={
                                appointment.status === 'Confirmed' ? 'success' :
                                appointment.status === 'Pending' ? 'warning' : 'default'
                              }
                              sx={{ ml: 1 }}
                            />
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              {appointment.patientName} | {appointment.date} at {appointment.time}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {appointment.notes}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary="No upcoming appointments"
                    secondary="Schedule an appointment to see it here"
                  />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
        
        {/* Top Patients (Admin Only) */}
        {isAdmin && (
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardHeader 
                title="Top Patients" 
                action={
                  <Button color="primary" size="small" onClick={() => navigate('/patients')}>
                    View All
                  </Button>
                }
              />
              <Divider />
              <List>
                {topPatients.length > 0 ? (
                  topPatients.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <Avatar sx={{ bgcolor: '#3f51b5', mr: 2 }}>
                          {item.patient.name.charAt(0)}
                        </Avatar>
                        <ListItemText
                          primary={item.patient.name}
                          secondary={`${item.count} appointments`}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primary="No patient data available"
                    />
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        )}
      </Grid>
      
      {/* This section is now handled in the patient view above */}
    </Container>
  );
};

export default EnhancedDashboard;
