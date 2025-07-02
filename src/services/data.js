// Data service using localStorage
const PATIENTS_KEY = 'dental_patients';
const APPOINTMENTS_KEY = 'dental_appointments';
const TREATMENTS_KEY = 'dental_treatments';

// Initialize default data if none exists
const initializePatients = () => {
  // Always ensure we have the default patients for testing
  const defaultPatients = [
    { 
      id: 1, 
      name: 'John Doe', 
      age: 35, 
      gender: 'Male', 
      contact: '555-1234', 
      email: 'john@example.com', 
      address: '123 Main St', 
      lastVisit: '2025-06-15', 
      nextAppointment: '2025-07-15',
      healthInfo: {
        allergies: 'Penicillin',
        medicalHistory: 'Hypertension',
        currentMedications: 'Lisinopril',
        emergencyContact: 'Mary Doe, 555-9876',
        bloodType: 'O+',
        notes: 'Patient is anxious about dental procedures'
      }
    },
    { 
      id: 2, 
      name: 'Jane Doe', 
      age: 28, 
      gender: 'Female', 
      contact: '555-5678', 
      email: 'jane@example.com', 
      address: '456 Oak Ave', 
      lastVisit: '2025-06-20', 
      nextAppointment: '2025-07-20',
      healthInfo: {
        allergies: 'None',
        medicalHistory: 'None',
        currentMedications: 'Birth control',
        emergencyContact: 'John Doe, 555-1234',
        bloodType: 'A+',
        notes: 'Patient prefers morning appointments'
      }
    },
    { 
      id: 3, 
      name: 'Robert Johnson', 
      age: 42, 
      gender: 'Male', 
      contact: '555-9012', 
      email: 'robert@example.com', 
      address: '789 Pine Rd', 
      lastVisit: '2025-06-10', 
      nextAppointment: '2025-07-10',
      healthInfo: {
        allergies: 'Latex',
        medicalHistory: 'Diabetes Type 2',
        currentMedications: 'Metformin',
        emergencyContact: 'Sarah Johnson, 555-3344',
        bloodType: 'B-',
        notes: 'Patient requires longer appointments due to anxiety'
      }
    },
    { 
      id: 4, 
      name: 'Emily Davis', 
      age: 31, 
      gender: 'Female', 
      contact: '555-3456', 
      email: 'emily@example.com', 
      address: '101 Cedar Ln', 
      lastVisit: '2025-06-25', 
      nextAppointment: '2025-07-25',
      healthInfo: {
        allergies: 'Aspirin',
        medicalHistory: 'Asthma',
        currentMedications: 'Albuterol inhaler',
        emergencyContact: 'James Davis, 555-6789',
        bloodType: 'AB+',
        notes: 'Patient prefers nitrous oxide during procedures'
      }
    },
    { 
      id: 5, 
      name: 'Michael Wilson', 
      age: 45, 
      gender: 'Male', 
      contact: '555-7890', 
      email: 'michael@example.com', 
      address: '202 Elm St', 
      lastVisit: '2025-06-05', 
      nextAppointment: '2025-07-05',
      healthInfo: {
        allergies: 'Sulfa drugs',
        medicalHistory: 'Heart murmur',
        currentMedications: 'None',
        emergencyContact: 'Linda Wilson, 555-2345',
        bloodType: 'O-',
        notes: 'Requires antibiotic prophylaxis before procedures'
      }
    },
    { 
      id: 6, 
      name: 'Dr. John Smith', 
      age: 45, 
      gender: 'Male', 
      contact: '555-1111', 
      email: 'admin@example.com', 
      address: '100 Hospital Ave', 
      lastVisit: '', 
      nextAppointment: '',
      healthInfo: {
        allergies: 'None',
        medicalHistory: 'None',
        currentMedications: 'None',
        emergencyContact: 'Hospital Main Desk, 555-0000',
        bloodType: 'A+',
        notes: 'Staff member'
      }
    }
  ];
  
  // Store the patients data
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(defaultPatients));
  console.log('Initialized patients:', defaultPatients);
};

const initializeAppointments = () => {
  // Always ensure we have default appointments for testing
  const defaultAppointments = [
    { 
      id: 1, 
      patientId: 1, 
      patientName: 'John Doe', 
      date: '2025-07-15', 
      time: '10:00', 
      duration: 30, // minutes
      treatment: 'Regular Checkup', 
      status: 'Scheduled', 
      notes: 'Follow-up on previous treatment',
      estimatedCost: 120.00,
      insuranceDetails: 'Coverage: 80%, Delta Dental',
      reason: 'Routine six-month checkup',
      isRecurring: true,
      recurringInterval: 'semi-annual',
      reminderSent: false,
      lastReminderDate: null,
      dentistId: 1,
      dentistName: 'Dr. John Smith',
      room: 'Examination Room 1'
    },
    { 
      id: 2, 
      patientId: 2, 
      patientName: 'Jane Doe', 
      date: '2025-07-20', 
      time: '11:30', 
      duration: 60, // minutes
      treatment: 'Teeth Cleaning', 
      status: 'Confirmed', 
      notes: 'Patient requested early appointment',
      estimatedCost: 150.00,
      insuranceDetails: 'Coverage: 100%, Aetna Dental',
      reason: 'Regular cleaning and checkup',
      isRecurring: true,
      recurringInterval: 'annual',
      reminderSent: true,
      lastReminderDate: '2025-07-13',
      dentistId: 1,
      dentistName: 'Dr. John Smith',
      room: 'Hygiene Room 2'
    },
    { 
      id: 3, 
      patientId: 3, 
      patientName: 'Robert Johnson', 
      date: '2025-07-10', 
      time: '14:00', 
      duration: 90, // minutes
      treatment: 'Root Canal', 
      status: 'Scheduled', 
      notes: 'Patient has dental anxiety',
      estimatedCost: 1200.00,
      insuranceDetails: 'Coverage: 60%, MetLife Dental',
      reason: 'Severe tooth pain and infection',
      isRecurring: false,
      recurringInterval: null,
      reminderSent: true,
      lastReminderDate: '2025-07-03',
      dentistId: 1,
      dentistName: 'Dr. John Smith',
      room: 'Surgery Room 1'
    },
    { 
      id: 4, 
      patientId: 4, 
      patientName: 'Emily Davis', 
      date: '2025-07-25', 
      time: '15:30', 
      duration: 45, // minutes
      treatment: 'Extraction', 
      status: 'Pending', 
      notes: 'Wisdom tooth extraction',
      estimatedCost: 450.00,
      insuranceDetails: 'Coverage: 70%, Cigna Dental',
      reason: 'Impacted wisdom tooth causing pain',
      isRecurring: false,
      recurringInterval: null,
      reminderSent: false,
      lastReminderDate: null,
      dentistId: 1,
      dentistName: 'Dr. John Smith',
      room: 'Surgery Room 2'
    },
    { 
      id: 5, 
      patientId: 5, 
      patientName: 'Michael Wilson', 
      date: '2025-07-05', 
      time: '09:00', 
      duration: 30, // minutes
      treatment: 'Orthodontics', 
      status: 'Confirmed', 
      notes: 'Braces adjustment',
      estimatedCost: 200.00,
      insuranceDetails: 'Coverage: 50%, Guardian Dental',
      reason: 'Monthly adjustment of braces',
      isRecurring: true,
      recurringInterval: 'monthly',
      reminderSent: true,
      lastReminderDate: '2025-07-01',
      dentistId: 1,
      dentistName: 'Dr. John Smith',
      room: 'Orthodontics Room'
    },
    // Add today's appointment for testing
    { 
      id: 6, 
      patientId: 2, 
      patientName: 'Jane Doe', 
      date: new Date().toISOString().split('T')[0], 
      time: '14:00', 
      duration: 30, // minutes
      treatment: 'Emergency Checkup', 
      status: 'Confirmed', 
      notes: 'Tooth pain',
      estimatedCost: 95.00,
      insuranceDetails: 'Coverage: 90%, Aetna Dental',
      reason: 'Sudden tooth pain in lower right molar',
      isRecurring: false,
      recurringInterval: null,
      reminderSent: true,
      lastReminderDate: new Date().toISOString().split('T')[0],
      dentistId: 1,
      dentistName: 'Dr. John Smith',
      room: 'Emergency Room'
    },
  ];
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(defaultAppointments));
  console.log('Initialized appointments:', defaultAppointments);
};

const initializeTreatments = () => {
  // Always ensure we have default treatments for testing
  const defaultTreatments = [
    { 
      id: 1, 
      patientId: 1, 
      patientName: 'John Doe',
      date: '2025-06-15', 
      treatment: 'Regular Checkup', 
      notes: 'No issues found', 
      cost: 120.00,
      paymentStatus: 'Paid',
      nextVisitRecommended: '2025-12-15',
      dentistNotes: 'Maintain regular brushing and flossing routine',
      attachments: [
        {
          name: 'dental_xray.jpg',
          type: 'image/jpeg',
          // This would be a base64 string in a real app
          data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/wAALCABAAEABAREA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAA/AKpgAAAAAAAAAAAAAAAAAAAAH//Z',
          uploadedAt: '2025-06-15'
        }
      ]
    },
    { 
      id: 2, 
      patientId: 2, 
      patientName: 'Jane Doe',
      date: '2025-06-20', 
      treatment: 'Cavity Filling', 
      notes: 'Filled cavity in upper molar', 
      cost: 250.00,
      paymentStatus: 'Pending',
      nextVisitRecommended: '2025-09-20',
      dentistNotes: 'Monitor for sensitivity, avoid hard foods for 24 hours',
      attachments: [
        {
          name: 'treatment_invoice.pdf',
          type: 'application/pdf',
          data: 'data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwgL0xlbmd0aCA1IDAgUiAvRmlsdGVyIC9GbGF0ZURlY29kZSA+PgpzdHJlYW0KeAFLy0gtSgQADMMBCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iagoxMgplbmRvYmoKMiAwIG9iago8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDMgMCBSIC9SZXNvdXJjZXMgNiAwIFIgL0NvbnRlbnRzIDQgMCBSIC9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCj4+CmVuZG9iago2IDAgb2JqCjw8IC9Qcm9jU2V0IFsgL1BERiBdIC9Db2xvclNwYWNlIDw8IC9DczEgNyAwIFIgPj4gPj4KZW5kb2JqCjggMCBvYmoKPDwgL0xlbmd0aCA5IDAgUiAvTiAxIC9BbHRlcm5hdGUgL0RldmljZUdyYXkgL0ZpbHRlciAvRmxhdGVEZWNvZGUgPj4Kc3RyZWFtCngBKYpJjYrJzEvVS87P1UtOLNJzzs/VL0ktLtEPKMrPTs0rKcpMzywGAP/1CzUKZW5kc3RyZWFtCmVuZG9iago5IDAgb2JqCjUyCmVuZG9iagoxMCAwIG9iago8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL05hbWUgL0YxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iagozIDAgb2JqCjw8IC9UeXBlIC9QYWdlcyAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSAvQ291bnQgMSAvS2lkcyBbIDIgMCBSIF0gPj4KZW5kb2JqCjExIDAgb2JqCjw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAzIDAgUiA+PgplbmRvYmoKNyAwIG9iagpbIC9JQ0NCYXNlZCA4IDAgUiBdCmVuZG9iagoxMiAwIG9iago8PCAvVGl0bGUgKERlbnRhbCBJbnZvaWNlKSAvQXV0aG9yIChEZW50YWwgQ2xpbmljKSAvQ3JlYXRvciAoRGVudGFsIFN5c3RlbSkKPj4KZW5kb2JqCnhyZWYKMCAxMwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA5OCAwMDAwMCBuIAowMDAwMDAwNDk2IDAwMDAwIG4gCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTk2IDAwMDAwIG4gCjAwMDAwMDA1OTEgMDAwMDAgbiAKMDAwMDAwMDI2MSAwMDAwMCBuIAowMDAwMDAwMzk0IDAwMDAwIG4gCjAwMDAwMDA0MTMgMDAwMDAgbiAKMDAwMDAwMDU1MiAwMDAwMCBuIAowMDAwMDAwNjI1IDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgMTMgL1Jvb3QgMTEgMCBSIC9JbmZvIDEyIDAgUiAvSUQgWyA8NjUzY2E2MzFlOTM5NjNiYjA2YzQ3MTU2ZjE5YmUzYTI+Cjw2NTNjYTYzMWU5Mzk2M2JiMDZjNDcxNTZmMTliZTNhMj4gXSA+PgpzdGFydHhyZWYKNzMzCiUlRU9GCg==',
          uploadedAt: '2025-06-20'
        }
      ]
    },
    { 
      id: 3, 
      patientId: 3, 
      patientName: 'Robert Johnson',
      date: '2025-06-10', 
      treatment: 'Root Canal', 
      notes: 'Successful procedure', 
      cost: 950.00,
      paymentStatus: 'Paid',
      nextVisitRecommended: '2025-07-10',
      dentistNotes: 'Follow up appointment scheduled for crown placement',
      attachments: [
        {
          name: 'post_treatment.jpg',
          type: 'image/jpeg',
          data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/wAALCABAAEABAREA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAA/AKpgAAAAAAAAAAAAAAAAAAAAH//Z',
          uploadedAt: '2025-06-10'
        }
      ]
    },
    { 
      id: 4, 
      patientId: 4, 
      patientName: 'Emily Davis',
      date: '2025-06-25', 
      treatment: 'Teeth Whitening', 
      notes: 'Significant improvement', 
      cost: 350.00,
      paymentStatus: 'Paid',
      nextVisitRecommended: '2026-06-25',
      dentistNotes: 'Maintain results with home care kit provided',
      attachments: []
    },
    { 
      id: 5, 
      patientId: 5, 
      patientName: 'Michael Wilson',
      date: '2025-06-05', 
      treatment: 'Braces Adjustment', 
      notes: 'Progress as expected', 
      cost: 150.00,
      paymentStatus: 'Insurance claim submitted',
      nextVisitRecommended: '2025-07-05',
      dentistNotes: 'Monthly adjustment required, progress photos taken',
      attachments: []
    },
    // Add recent treatment for Jane Doe
    { 
      id: 6, 
      patientId: 2, 
      patientName: 'Jane Doe',
      date: new Date().toISOString().split('T')[0], 
      treatment: 'Emergency Checkup', 
      notes: 'Prescribed pain medication', 
      cost: 85.00,
      paymentStatus: 'Pending',
      nextVisitRecommended: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dentistNotes: 'Pain in lower right molar, possible infection',
      attachments: []
    },
  ];
  localStorage.setItem(TREATMENTS_KEY, JSON.stringify(defaultTreatments));
  console.log('Initialized treatments:', defaultTreatments);
};

// Initialize all data
export const initializeData = () => {
  // Initialize each data type
  initializePatients();
  initializeAppointments();
  initializeTreatments();
  
  // Get the data directly from localStorage to ensure it's fresh
  const patients = JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
  const appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
  const treatments = JSON.parse(localStorage.getItem(TREATMENTS_KEY) || '[]');
  
  console.log('Data service returning:', { patients, appointments, treatments });
  
  // Return the initialized data
  return {
    patients,
    appointments,
    treatments
  };
};

// Patient CRUD operations
export const getPatients = () => {
  return JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
};

export const getPatientById = (id) => {
  const patients = getPatients();
  return patients.find(patient => patient.id === id) || null;
};

export const addPatient = (patient) => {
  const patients = getPatients();
  const newPatient = {
    id: patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1,
    ...patient
  };
  patients.push(newPatient);
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  return newPatient;
};

export const updatePatient = (updatedPatient) => {
  const patients = getPatients();
  const index = patients.findIndex(p => p.id === updatedPatient.id);
  if (index !== -1) {
    patients[index] = updatedPatient;
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
    return updatedPatient;
  }
  return null;
};

export const deletePatient = (id) => {
  const patients = getPatients();
  const filteredPatients = patients.filter(p => p.id !== id);
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(filteredPatients));
};

// Appointment CRUD operations
export const getAppointments = () => {
  return JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
};

export const getAppointmentsByPatientId = (patientId) => {
  const appointments = getAppointments();
  return appointments.filter(appointment => appointment.patientId === patientId);
};

export const addAppointment = (appointment) => {
  const appointments = getAppointments();
  const newAppointment = {
    id: appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
    ...appointment
  };
  appointments.push(newAppointment);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  return newAppointment;
};

export const updateAppointment = (updatedAppointment) => {
  const appointments = getAppointments();
  const index = appointments.findIndex(a => a.id === updatedAppointment.id);
  if (index !== -1) {
    appointments[index] = updatedAppointment;
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    return updatedAppointment;
  }
  return null;
};

export const deleteAppointment = (id) => {
  const appointments = getAppointments();
  const filteredAppointments = appointments.filter(a => a.id !== id);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(filteredAppointments));
};

// Treatment records CRUD operations
export const getTreatments = () => {
  return JSON.parse(localStorage.getItem(TREATMENTS_KEY) || '[]');
};

export const getTreatmentsByPatientId = (patientId) => {
  const treatments = getTreatments();
  return treatments.filter(treatment => treatment.patientId === patientId);
};

export const addTreatment = (treatment) => {
  const treatments = getTreatments();
  const newTreatment = {
    id: treatments.length > 0 ? Math.max(...treatments.map(t => t.id)) + 1 : 1,
    ...treatment
  };
  treatments.push(newTreatment);
  localStorage.setItem(TREATMENTS_KEY, JSON.stringify(treatments));
  return newTreatment;
};

export const updateTreatment = (updatedTreatment) => {
  const treatments = getTreatments();
  const index = treatments.findIndex(t => t.id === updatedTreatment.id);
  if (index !== -1) {
    treatments[index] = updatedTreatment;
    localStorage.setItem(TREATMENTS_KEY, JSON.stringify(treatments));
    return updatedTreatment;
  }
  return null;
};

export const deleteTreatment = (id) => {
  const treatments = getTreatments();
  const filteredTreatments = treatments.filter(t => t.id !== id);
  localStorage.setItem(TREATMENTS_KEY, JSON.stringify(filteredTreatments));
};
