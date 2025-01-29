export interface Staff {
  id: string;
  email: string;
  name: string;
  role: 'doctor' | 'staff' | 'management';
  department: string;
  schedule?: { day: string; hours: string; }[];
  created_at: string;
}

export interface Patient {
  id: string;
  visit_time: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  symptoms: string[];
  age: number;
  wait_time: number;
  department: string;
  status: 'waiting' | 'in_treatment' | 'discharged';
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  current_capacity: number;
  max_capacity: number;
  wait_time: number;
}

export interface Incident {
  id: string;
  type: 'outbreak' | 'accident' | 'disaster' | 'mass_casualty';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  date: string;
  status: 'active' | 'resolved';
}