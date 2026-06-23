import fs from 'fs';
import path from 'path';
import { connectToDatabase, isDbConnected } from './mongodb.js';
import {
  ClinicContentModel,
  DoctorModel,
  AppointmentModel,
  ContactMessageModel,
  PatientRecordModel,
} from './models.js';
import { ClinicContent, Doctor, Appointment, ContactMessage, PatientRecord } from '../types.js';

const DATA_FILE_PATH = path.join(process.cwd(), 'data-store.json');

// Seeds data matching the images exactly
const INITIAL_CONTENT: ClinicContent = {
  heroTitle: "Experience the Digital Lounge.",
  heroSubtitle: "Precision oral health meets high-tech comfort. We've redesigned dentistry from the ground up to provide a serene, data-driven experience for the modern lifestyle.",
  announcement: "The Future of Dental Care",
  phone: "(555) 012-3456",
  tagline: "The Digital Lounge"
};

const INITIAL_DOCTORS: Doctor[] = [
  {
    id: "doc1",
    name: "Dr. Elena Vance",
    role: "Lead Precision Specialist",
    specialty: "Orthodontist",
    bio: "Mastering the art of alignment through 3D scanning and invisible aligner technology.",
    rating: 5,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3XH4NJ5b0w3psI1efHW9QdRsicidIEbbmA1USvYF6qdpE4VxSf16T4WlEI9TizNOrJvZNuSimpcIKzrYEXDJUfMweZ6HQ3rymRNVinmYw8AG0HbOQUghYPWt36ewlhyc9v60KyLY1WAWHW_zKt7a07ASzUC5KQeg3ibXUXPbmDKfi7JMQQbnJTw87RTVQZzFbe0wvn84pvAWS8HOGE083nlPzslOqHGf55AYv3Oj1BBK_I5nbvJGDPiGa5yICH7HlyEgMlxVlKuSF",
    schedule: [
      { days: "Mon — Wed", hours: "09:00 - 17:00" },
      { days: "Fri — Sat", hours: "10:00 - 14:00" }
    ]
  },
  {
    id: "doc2",
    name: "Dr. Julian Thorne",
    role: "Cosmetic Specialist",
    specialty: "Cosmetic Dentist",
    bio: "Expert in digital smile design and premium porcelain veneers for a natural, luminous finish.",
    rating: 5,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEFG1yvCqg_nWSlftTrMt_zcUKI-IgbQ6q-tkbkFsQCOLDPQ7lMX_tYwe7CXt7HUlLZ72a6NkNYAb8UqQPQYN6xy9PQruLiT8mi97jx3lvR2COu2WC3JVR89nS_mu2n_oypbPlTrMFRcEvTZUGS_q8cB8kFDWpPtKWBzME2WvpLSXZUvhexVha8nhrDFHE-mBZ2gVzGjiuc56TLozxwJr8VqzVOJVC7b0WMOR-orJJiZB9PO9hbLHq5yVXDd-3sNnlL3uYIJxyco8Y",
    schedule: [
      { days: "Tue — Thu", hours: "11:00 - 19:00" },
      { days: "Sat", hours: "09:00 - 13:00" }
    ]
  },
  {
    id: "doc3",
    name: "Dr. Sarah Chen",
    role: "Implantologist",
    specialty: "Implantologist",
    bio: "Precision-driven restorative surgery utilizing advanced robotics and biocompatible materials.",
    rating: 5,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUxKFh8wyEBlmpAek9gluyrR0g-hTDB7f4mYNcCTLE5-bnWfXNIa7sfxuUr-0Pv_9ERE-9kAHZC-rFq1mvYf3LojyyeMX2YbPkCliHvVtflLhtcYz6xRZoPcVUmTQ0Aom8VSXvSEUm6sCSSDJPG6phzuQQxo7nacMOmaBbbZFFxYSg6E4CCuLb75_X0U_f_p53g4u0C-78sIPLCW7FE6YyfLeCHu_1SEHUlJ4yJ8XWbkQpg_LVlnPd78E7j7mGNoXXZ3EAPdf252sN",
    schedule: [
      { days: "Mon, Wed, Fri", hours: "08:00 - 16:00" },
      { days: "Thu", hours: "14:00 - 20:00" }
    ]
  }
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "appt1",
    patientName: "Elena Mitchell",
    phoneNumber: "555-010-2244",
    email: "elena@example.com",
    date: "2026-06-23",
    time: "10:30",
    serviceType: "Laser Whitening",
    status: "Completed",
    createdAt: new Date().toISOString()
  },
  {
    id: "appt2",
    patientName: "Julian Black",
    phoneNumber: "555-011-3388",
    email: "julian.black@example.com",
    date: "2026-06-23",
    time: "09:00",
    serviceType: "Annual Checkup",
    status: "In Session",
    createdAt: new Date().toISOString()
  },
  {
    id: "appt3",
    patientName: "Sarah Connor",
    phoneNumber: "555-012-9988",
    email: "sconnor@example.com",
    date: "2026-06-25",
    time: "14:00",
    serviceType: "Invisalign Consult",
    status: "Scheduled",
    createdAt: new Date().toISOString()
  }
];

const INITIAL_PATIENTS: PatientRecord[] = [
  {
    id: "pat1",
    name: "Elena Mitchell",
    patientNumber: "1024",
    email: "elena@example.com",
    phone: "555-010-2244",
    lastVisit: "Oct 12, 2024",
    procedure: "Laser Whitening",
    status: "Completed"
  },
  {
    id: "pat2",
    name: "Julian Black",
    patientNumber: "0988",
    email: "julian.black@example.com",
    phone: "555-011-3388",
    lastVisit: "Today, 09:00 AM",
    procedure: "Annual Checkup",
    status: "In Session"
  },
  {
    id: "pat3",
    name: "Sarah Connor",
    patientNumber: "1042",
    email: "sconnor@example.com",
    phone: "555-012-9988",
    lastVisit: "Sep 28, 2024",
    procedure: "Invisalign Consult",
    status: "Scheduled"
  }
];

interface FileDataStore {
  content: ClinicContent;
  doctors: Doctor[];
  appointments: Appointment[];
  patients: PatientRecord[];
  messages: ContactMessage[];
}

class UnifiedStore {
  private fileData: FileDataStore = {
    content: INITIAL_CONTENT,
    doctors: INITIAL_DOCTORS,
    appointments: INITIAL_APPOINTMENTS,
    patients: INITIAL_PATIENTS,
    messages: []
  };

  constructor() {
    this.readFromFile();
  }

  private readFromFile() {
    try {
      if (fs.existsSync(DATA_FILE_PATH)) {
        const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
        this.fileData = JSON.parse(fileContent);
      } else {
        this.saveToFile();
      }
    } catch (e) {
      console.error("Failed to read local fallback store:", e);
    }
  }

  private saveToFile() {
    try {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(this.fileData, null, 2), 'utf-8');
    } catch (e) {
      console.error("Failed to write to fallback store:", e);
    }
  }

  // Pre-seed MongoDB if empty
  async seedMongoIfEmpty() {
    if (!isDbConnected()) return;

    try {
      const contentCount = await ClinicContentModel.countDocuments();
      if (contentCount === 0) {
        await new ClinicContentModel(INITIAL_CONTENT).save();
      }

      const docCount = await DoctorModel.countDocuments();
      if (docCount === 0) {
        await (DoctorModel as any).insertMany(INITIAL_DOCTORS.map(d => ({ ...d, _id: undefined })));
      }

      const apptCount = await AppointmentModel.countDocuments();
      if (apptCount === 0) {
        await (AppointmentModel as any).insertMany(INITIAL_APPOINTMENTS.map(a => ({ ...a, _id: undefined })));
      }

      const patientCount = await PatientRecordModel.countDocuments();
      if (patientCount === 0) {
        await (PatientRecordModel as any).insertMany(INITIAL_PATIENTS.map(p => ({ ...p, _id: undefined })));
      }
      console.log("🌱 Database seeded successfully with initial high-fidelity mock assets.");
    } catch (e) {
      console.error("Failed seeding MongoDB:", e);
    }
  }

  // Clinic Content CRUD
  async getContent(): Promise<ClinicContent> {
    if (isDbConnected()) {
      try {
        const item = await ClinicContentModel.findOne();
        if (item) {
          return {
            heroTitle: item.heroTitle,
            heroSubtitle: item.heroSubtitle,
            announcement: item.announcement,
            phone: item.phone,
            tagline: item.tagline
          };
        }
      } catch (e) {
        console.error("Mongo getContent error, falling back:", e);
      }
    }
    return this.fileData.content;
  }

  async updateContent(data: Partial<ClinicContent>): Promise<ClinicContent> {
    this.fileData.content = { ...this.fileData.content, ...data };
    this.saveToFile();

    if (isDbConnected()) {
      try {
        await (ClinicContentModel as any).findOneAndUpdate({}, { $set: data }, { upsert: true, new: true });
      } catch (e) {
        console.error("Mongo updateContent error:", e);
      }
    }

    return this.fileData.content;
  }

  // Doctors
  async getDoctors(): Promise<Doctor[]> {
    if (isDbConnected()) {
      try {
        const list = await DoctorModel.find();
        return list.map(item => ({
          id: (item as any)._id.toString(),
          name: (item as any).name,
          role: (item as any).role,
          specialty: (item as any).specialty,
          bio: (item as any).bio,
          rating: (item as any).rating,
          image: (item as any).image,
          schedule: (item as any).schedule
        }));
      } catch (e) {
        console.error("Mongo getDoctors error, falling back:", e);
      }
    }
    return this.fileData.doctors;
  }

  async createDoctor(doc: Omit<Doctor, 'id'>): Promise<Doctor> {
    const newId = "doc_" + Date.now().toString(36);
    const newDoc: Doctor = {
      ...doc,
      id: newId
    };

    this.fileData.doctors.push(newDoc);
    this.saveToFile();

    if (isDbConnected()) {
      try {
        const mongoDoc = await new DoctorModel({
          name: doc.name,
          role: doc.role,
          specialty: doc.specialty,
          bio: doc.bio,
          rating: doc.rating,
          image: doc.image,
          schedule: doc.schedule
        }).save();
        newDoc.id = mongoDoc._id.toString();
      } catch (e) {
        console.error("Mongo createDoctor error:", e);
      }
    }

    return newDoc;
  }

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    if (isDbConnected()) {
      try {
        const list = await AppointmentModel.find().sort({ createdAt: -1 });
        return list.map(item => ({
          id: item._id.toString(),
          patientName: item.patientName,
          phoneNumber: item.phoneNumber,
          email: item.email,
          date: item.date,
          time: item.time,
          serviceType: item.serviceType,
          status: item.status,
          notes: item.notes,
          createdAt: item.createdAt
        }));
      } catch (e) {
        console.error("Mongo getAppointments error, falling back:", e);
      }
    }
    return this.fileData.appointments;
  }

  async createAppointment(appt: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
    const newId = "appt_" + Date.now().toString(36);
    const createdAt = new Date().toISOString();
    const newAppt: Appointment = {
      ...appt,
      id: newId,
      createdAt
    };

    this.fileData.appointments.unshift(newAppt);
    
    // Also create patient record if it doesn't exist
    const patientExists = this.fileData.patients.some(p => p.name.toLowerCase() === appt.patientName.toLowerCase());
    if (!patientExists) {
      const patientId = "pat_" + Math.floor(1000 + Math.random() * 9000).toString();
      const patientNum = Math.floor(1000 + Math.random() * 9000).toString();
      const newPatient: PatientRecord = {
        id: patientId,
        name: appt.patientName,
        patientNumber: patientNum,
        email: appt.email || `${appt.patientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        phone: appt.phoneNumber || "555-019-9944",
        lastVisit: "Today",
        procedure: appt.serviceType,
        status: appt.status
      };
      this.fileData.patients.unshift(newPatient);

      if (isDbConnected()) {
        try {
          await new PatientRecordModel({
            name: newPatient.name,
            patientNumber: newPatient.patientNumber,
            email: newPatient.email,
            phone: newPatient.phone,
            lastVisit: newPatient.lastVisit,
            procedure: newPatient.procedure,
            status: newPatient.status
          }).save();
        } catch (e) {
          console.error("Mongo patient auto-create failed:", e);
        }
      }
    }

    this.saveToFile();

    if (isDbConnected()) {
      try {
        const mongoAppt = await new AppointmentModel({
          patientName: appt.patientName,
          phoneNumber: appt.phoneNumber,
          email: appt.email,
          date: appt.date,
          time: appt.time,
          serviceType: appt.serviceType,
          status: appt.status,
          notes: appt.notes,
          createdAt
        }).save();
        newAppt.id = mongoAppt._id.toString();
      } catch (e) {
        console.error("Mongo createAppointment error:", e);
      }
    }

    return newAppt;
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<boolean> {
    const idx = this.fileData.appointments.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.fileData.appointments[idx].status = status;
      this.saveToFile();
    }

    if (isDbConnected()) {
      try {
        await (AppointmentModel as any).findByIdAndUpdate(id, { $set: { status } });
        return true;
      } catch (e) {
        console.error("Mongo updateAppointmentStatus error:", e);
      }
    }
    return idx !== -1;
  }

  // Patients
  async getPatients(): Promise<PatientRecord[]> {
    if (isDbConnected()) {
      try {
        const list = await PatientRecordModel.find();
        return list.map(item => ({
          id: item._id.toString(),
          name: item.name,
          patientNumber: item.patientNumber,
          email: item.email,
          phone: item.phone,
          lastVisit: item.lastVisit,
          procedure: item.procedure,
          status: item.status
        }));
      } catch (e) {
        console.error("Mongo getPatients error, falling back:", e);
      }
    }
    return this.fileData.patients;
  }

  // Messages
  async createMessage(msg: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage> {
    const newId = "msg_" + Date.now().toString(36);
    const createdAt = new Date().toISOString();
    const newMsg: ContactMessage = {
      ...msg,
      id: newId,
      createdAt
    };

    this.fileData.messages.push(newMsg);
    this.saveToFile();

    if (isDbConnected()) {
      try {
        const model = await new ContactMessageModel({
          name: msg.name,
          email: msg.email,
          phone: msg.phone,
          message: msg.message,
          createdAt
        }).save();
        newMsg.id = model._id.toString();
      } catch (e) {
        console.error("Mongo createMessage error:", e);
      }
    }

    return newMsg;
  }

  async getMessages(): Promise<ContactMessage[]> {
    if (isDbConnected()) {
      try {
        const list = await ContactMessageModel.find().sort({ createdAt: -1 });
        return list.map(item => ({
          id: item._id.toString(),
          name: item.name,
          email: item.email,
          phone: item.phone,
          message: item.message,
          createdAt: item.createdAt
        }));
      } catch (e) {
        console.error("Mongo getMessages error:", e);
      }
    }
    return this.fileData.messages;
  }
}

export const store = new UnifiedStore();
