import React from 'react';
import ReliableAppointmentList from '../components/appointments/ReliableAppointmentList';

const Appointments = () => {
  // Using reliable component that properly handles data loading
  return <ReliableAppointmentList />;
};

export default Appointments;
