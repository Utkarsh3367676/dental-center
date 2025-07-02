import React from 'react';
import ReliablePatientList from '../components/patients/ReliablePatientList';

const Patients = () => {
  // Using reliable component that properly handles data loading
  return <ReliablePatientList />;
};

export default Patients;
