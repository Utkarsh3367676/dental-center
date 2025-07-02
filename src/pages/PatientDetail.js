import React from 'react';
import ReliablePatientDetails from '../components/patients/ReliablePatientDetails';

const PatientDetail = () => {
  // Using reliable component that properly handles patient data loading
  return <ReliablePatientDetails />;
};

export default PatientDetail;
