import mongoose, { Schema, Document } from 'mongoose';
import { ClinicContent, Doctor, Appointment, ContactMessage, PatientRecord } from '../types.js';

// Clinic Content Schema
export interface ClinicContentDocument extends Document, Omit<ClinicContent, 'id'> {}
const ClinicContentSchemaField = new Schema<ClinicContentDocument>({
  heroTitle: { type: String, required: true },
  heroSubtitle: { type: String, required: true },
  announcement: { type: String, required: true },
  phone: { type: String, required: true },
  tagline: { type: String, required: true }
}, { timestamps: true });

// Doctor Schema
export interface DoctorDocument extends Document, Omit<Doctor, 'id'> {}
const DoctorSchemaField = new Schema<DoctorDocument>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  specialty: { type: String, required: true },
  bio: { type: String, required: true },
  rating: { type: Number, required: true, default: 5 },
  image: { type: String, required: true },
  schedule: [{
    days: { type: String, required: true },
    hours: { type: String, required: true }
  }]
}, { timestamps: true });

// Appointment Schema
export interface AppointmentDocument extends Document, Omit<Appointment, 'id'> {}
const AppointmentSchemaField = new Schema<AppointmentDocument>({
  patientName: { type: String, required: true },
  phoneNumber: { type: String },
  email: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  serviceType: { type: String, required: true },
  status: { type: String, enum: ['Scheduled', 'In Session', 'Completed'], required: true, default: 'Scheduled' },
  notes: { type: String },
  createdAt: { type: String, required: true }
}, { timestamps: true });

// Contact Message Schema
export interface ContactMessageDocument extends Document, Omit<ContactMessage, 'id'> {}
const ContactMessageSchemaField = new Schema<ContactMessageDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  createdAt: { type: String, required: true }
}, { timestamps: true });

// Patient Record Schema
export interface PatientRecordDocument extends Document, Omit<PatientRecord, 'id'> {}
const PatientRecordSchemaField = new Schema<PatientRecordDocument>({
  name: { type: String, required: true },
  patientNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  lastVisit: { type: String, required: true },
  procedure: { type: String, required: true },
  status: { type: String, required: true }
}, { timestamps: true });


// Export Mongoose Models, check if already compiled
export const ClinicContentModel = mongoose.models.ClinicContent || mongoose.model<ClinicContentDocument>('ClinicContent', ClinicContentSchemaField);
export const DoctorModel = mongoose.models.Doctor || mongoose.model<DoctorDocument>('Doctor', DoctorSchemaField);
export const AppointmentModel = mongoose.models.Appointment || mongoose.model<AppointmentDocument>('Appointment', AppointmentSchemaField);
export const ContactMessageModel = mongoose.models.ContactMessage || mongoose.model<ContactMessageDocument>('ContactMessage', ContactMessageSchemaField);
export const PatientRecordModel = mongoose.models.PatientRecord || mongoose.model<PatientRecordDocument>('PatientRecord', PatientRecordSchemaField);
