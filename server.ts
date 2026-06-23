import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { connectToDatabase } from './src/db/mongodb.js';
import { store } from './src/db/store.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB Connection (with fallback automatically if URI isn't configured)
  const connected = await connectToDatabase();
  if (connected) {
    await store.seedMongoIfEmpty();
  } else {
    console.log("ℹ️ Server running in highly interactive fallback storage mode.");
  }

  // Middleware
  app.use(express.json());

  // Backend API Routes

  // 1. Static copies
  app.get('/api/content', async (req, res) => {
    try {
      const content = await store.getContent();
      res.json(content);
    } catch (e) {
      res.status(500).json({ error: "Failed to load clinic copies" });
    }
  });

  app.post('/api/content', async (req, res) => {
    try {
      const updated = await store.updateContent(req.body);
      res.json({ success: true, content: updated });
    } catch (e) {
      res.status(500).json({ error: "Failed to save clinic copies" });
    }
  });

  // 2. Doctors team
  app.get('/api/doctors', async (req, res) => {
    try {
      const list = await store.getDoctors();
      res.json(list);
    } catch (e) {
      res.status(500).json({ error: "Failed to load doctors list" });
    }
  });

  app.post('/api/doctors', async (req, res) => {
    try {
      const { name, role, specialty, bio, rating, image, schedule } = req.body;
      if (!name || !role || !specialty) {
        return res.status(400).json({ error: "Missing required doctor fields (name, role, specialty)" });
      }
      const created = await store.createDoctor({
        name,
        role,
        specialty,
        bio: bio || '',
        rating: Number(rating) || 5,
        image: image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
        schedule: schedule || [{ days: "Mon — Fri", hours: "09:00 - 17:00" }]
      });
      res.status(201).json({ success: true, doctor: created });
    } catch (e) {
      res.status(500).json({ error: "Failed to create doctor record" });
    }
  });

  // 3. Appointments
  app.get('/api/appointments', async (req, res) => {
    try {
      const list = await store.getAppointments();
      res.json(list);
    } catch (e) {
      res.status(500).json({ error: "Failed to load appointments" });
    }
  });

  app.post('/api/appointments', async (req, res) => {
    try {
      const { patientName, phoneNumber, email, date, time, serviceType, notes } = req.body;
      if (!patientName || !date || !time || !serviceType) {
        return res.status(400).json({ error: "Missing required appointment variables (patientName, date, time, serviceType)" });
      }
      const created = await store.createAppointment({
        patientName,
        phoneNumber,
        email,
        date,
        time,
        serviceType,
        status: 'Scheduled',
        notes
      });
      res.status(201).json({ success: true, appointment: created });
    } catch (e) {
      res.status(500).json({ error: "Failed to create appointment record" });
    }
  });

  app.patch('/api/appointments/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Missing status field" });
      }
      const success = await store.updateAppointmentStatus(id, status);
      if (success) {
        res.json({ success: true, message: `Appointment status updated to ${status}` });
      } else {
        res.status(404).json({ error: "Appointment not found" });
      }
    } catch (e) {
      res.status(500).json({ error: "Failed to update appointment status" });
    }
  });

  // 4. Patient Logs List
  app.get('/api/patients', async (req, res) => {
    try {
      const list = await store.getPatients();
      res.json(list);
    } catch (e) {
      res.status(500).json({ error: "Failed to load patient records" });
    }
  });

  // 5. Contact Enquiries List
  app.get('/api/messages', async (req, res) => {
    try {
      const list = await store.getMessages();
      res.json(list);
    } catch (e) {
      res.status(500).json({ error: "Failed to load dynamic messages" });
    }
  });

  // 6. Support/Contact Query Form Handler
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Parameters 'name', 'email', and 'message' are mandatory." });
      }

      // Save to server-side database store
      const created = await store.createMessage({ name, email, phone, message });

      // Dynamic Nodemailer Email Dispatch Simulation
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@thedigitallounge.com';
      const mailHost = process.env.SMTP_HOST || 'smtp.resend.com';

      console.log('📬 📥 INCOMING CONTACT DISPATCH - SIMULATED SMTP TRANSACTION:');
      console.log(`📡 Host Server: ${mailHost}`);
      console.log(`👤 Customer: ${name} (${email})`);
      console.log(`📞 Phone Ref: ${phone || 'Not Supplied'}`);
      console.log(`✉️ Recipient Mailbox: ${adminEmail}`);
      console.log(`📋 Content Payload:`);
      console.log(`-----------------------------------------------`);
      console.log(`"${message}"`);
      console.log(`-----------------------------------------------`);
      console.log(`🚀 Dispatch outcome: Connection Successful. Simulated SMTP transmission processed fully.`);

      res.status(200).json({
        success: true,
        message: "Your message has been securely submitted. An automated SMTP notification was compiled and logged successfully for the clinic administration team.",
        record: created,
        simulatedTransmission: {
          recipient: adminEmail,
          host: mailHost,
          subject: `New Aesthetic Digital Lounge Inquiry from ${name}`
        }
      });
    } catch (e) {
      res.status(500).json({ error: "Failed to compile contact request metadata" });
    }
  });


  // Frontend Assets Rendering via Vite or Dist Serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to 0.0.0.0 and port 3000 as strictly mandated
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 The Digital Lounge dynamic backend active at http://localhost:${PORT}`);
  });
}

startServer();
