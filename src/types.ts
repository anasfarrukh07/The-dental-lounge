export interface ClinicContent {
  heroTitle: string;
  heroSubtitle: string;
  announcement: string;
  phone: string;
  tagline: string;
}

export interface Doctor {
  id: string;
  name: string;
  role: string;
  specialty: string;
  bio: string;
  rating: number;
  image: string;
  schedule: Array<{
    days: string;
    hours: string;
  }>;
}

export interface Appointment {
  id: string;
  patientName: string;
  phoneNumber?: string;
  email?: string;
  date: string;
  time: string;
  serviceType: string;
  status: 'Scheduled' | 'In Session' | 'Completed';
  notes?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  patientNumber: string;
  email: string;
  phone: string;
  lastVisit: string;
  procedure: string;
  status: string;
}
