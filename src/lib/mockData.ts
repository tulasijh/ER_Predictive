import { Patient, Staff, Department, Incident } from '../types';

// Mock data generation utilities
const generateRandomId = () => Math.random().toString(36).substr(2, 9);

const departments = ['Emergency', 'Trauma', 'Pediatric Emergency', 'Critical Care'];
const symptoms = ['Fever', 'Cough', 'Shortness of breath', 'Chest pain'];
const severities = ['low', 'medium', 'high', 'critical'] as const;
const statuses = ['waiting', 'in_treatment', 'discharged'] as const;

// Mock staff data with passwords for demo
export const mockStaff: (Staff & { password?: string })[] = [
  {
    id: '1',
    email: 'admin@gmail.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'management',
    department: 'Administration',
    schedule: [
      { day: 'Monday', hours: '9:00 AM - 5:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 5:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 5:00 PM' }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    email: 'dr.smith@gmail.com',
    password: 'doctor123',
    name: 'Dr. Sarah Smith',
    role: 'doctor',
    department: 'Emergency',
    schedule: [
      { day: 'Monday', hours: '7:00 AM - 3:00 PM' },
      { day: 'Tuesday', hours: '7:00 AM - 3:00 PM' },
      { day: 'Wednesday', hours: '3:00 PM - 11:00 PM' }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    email: 'nurse.wilson@gmail.com',
    password: 'staff123',
    name: 'Nurse David Wilson',
    role: 'staff',
    department: 'Emergency',
    schedule: [
      { day: 'Monday', hours: '7:00 AM - 3:00 PM' },
      { day: 'Wednesday', hours: '7:00 AM - 3:00 PM' },
      { day: 'Friday', hours: '7:00 AM - 3:00 PM' }
    ],
    created_at: new Date().toISOString()
  }
];

// Mock incidents data
export const mockIncidents: Incident[] = [
  {
    id: '1',
    type: 'outbreak',
    title: 'Flu Outbreak in Downtown',
    description: 'Increased cases of influenza reported in the downtown area',
    severity: 'medium',
    location: 'Downtown Dallas',
    date: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '2',
    type: 'accident',
    title: 'Major Traffic Incident',
    description: 'Multi-vehicle collision on I-35',
    severity: 'high',
    location: 'I-35 North',
    date: new Date().toISOString(),
    status: 'active'
  }
];

// Mock department data
export const mockDepartments: Department[] = departments.map(name => ({
  id: generateRandomId(),
  name,
  current_capacity: Math.floor(Math.random() * 50),
  max_capacity: 50,
  wait_time: Math.floor(Math.random() * 120)
}));

// Calculate wait time based on staff and patient load
const calculateWaitTime = (hour: number, doctorCount: number, staffCount: number, patientCount: number): number => {
  const baseProcessingTime = 15;
  const totalCapacity = (doctorCount * 3 + staffCount * 2);
  const loadFactor = patientCount / totalCapacity;
  
  let timeOfDayFactor = 1;
  if (hour >= 8 && hour <= 11) timeOfDayFactor = 1.5;
  if (hour >= 14 && hour <= 17) timeOfDayFactor = 1.3;
  if (hour >= 0 && hour <= 5) timeOfDayFactor = 0.7;
  
  let waitTime = Math.round(baseProcessingTime * loadFactor * timeOfDayFactor);
  return Math.min(Math.max(waitTime, 5), 180);
};

// Generate mock patient data with realistic wait times
export const generateMockPatients = (count: number): Patient[] => {
  const patients: Patient[] = [];
  const doctorCount = mockStaff.filter(s => s.role === 'doctor').length;
  const staffCount = mockStaff.filter(s => s.role === 'staff').length;
  
  for (let i = 0; i < count; i++) {
    const visitDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const hour = visitDate.getHours();
    
    const existingPatients = patients.filter(p => {
      const pHour = new Date(p.visit_time).getHours();
      return pHour === hour;
    }).length;
    
    patients.push({
      id: generateRandomId(),
      visit_time: visitDate.toISOString(),
      severity: severities[Math.floor(Math.random() * severities.length)],
      symptoms: Array.from(
        { length: Math.floor(Math.random() * 3) + 1 },
        () => symptoms[Math.floor(Math.random() * symptoms.length)]
      ),
      age: Math.floor(Math.random() * 80) + 1,
      wait_time: calculateWaitTime(hour, doctorCount, staffCount, existingPatients),
      department: departments[Math.floor(Math.random() * departments.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      created_at: visitDate.toISOString()
    });
  }
  
  return patients;
};