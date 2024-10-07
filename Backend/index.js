const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const OneSignal = require('onesignal-node');
const env = require('dotenv');
// const fetch = require('node-fetch');
env.config(); // Load environment variables

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });
const port = 7878;
console.log("OneSignal App ID:", process.env.ONEAPID);
console.log("OneSignal API Key:", process.env.ONEAPI);


async function testOneSignal(location,name,message) {
  const response = await fetch(`https://onesignal.com/api/v1/notifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${process.env.ONEAPI}`,
    },
    body: JSON.stringify({
      app_id: process.env.ONEAPID,
      contents: { en: message },
      included_segments: ["All"],
      headings: { en: location+": "+name },
    }),
  });

  const data = await response.json();
  console.log(data);
}



// Initialize OneSignal Client
const client = new OneSignal.Client({
  app: {
    appAuthKey: process.env.ONEAPI, // Your OneSignal API Key
    appId: process.env.ONEAPID.trim() // Your OneSignal App ID
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.error("Database Connection Error:", err);
  });

app.use(cors());
app.use(express.json());
const Chatbox = require("./models/chatbox");
const Machine = require("./models/machine");
const Appointments = require("./models/appointment");
const Patient=require('./models/patient');
// Routes
app.use("/patient", require("./routes/patient"));
app.use("/staff", require("./routes/staff"));
app.use("/appointment", require("./routes/appointment"));
app.use("/machine", require("./routes/machine"));
app.use("/otp", require("./routes/otp"));

// Send Notification Function



// Test Notification
// sendnoti("Hi", "Hello");

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Fetch message history
  socket.on("getHistory", async () => {
    try {
      const messages = await Chatbox.find().sort({ createdAt: -1 });
      socket.emit("history", messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      socket.emit("error", { message: "Failed to fetch message history" });
    }
  });

  // Handle incoming messages
  socket.on("message", async (data) => {
    try {
      const newMessage = new Chatbox({
        sender_id: data.sender_id,
        content: data.content,
        location: data.location || "",
        staff: data.staff,
      });

      const savedMessage = await newMessage.save();
      const populatedMessage = await Chatbox.findById(savedMessage._id).exec();
      testOneSignal(data.location,data.staff,data.content);
      io.emit("message", populatedMessage);
      console.log("New message:", populatedMessage);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Endpoint to fetch messages
app.get("/messages", async (req, res) => {
  try {
    const messages = await Chatbox.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// MongoDB Change Streams
Appointments.watch().on("change", async (change) => {
  try {
    if (change.operationType === "insert" || change.operationType === "update") {
      const appointment = await Appointments.findById(change.documentKey._id);
      if (appointment) {
        io.emit("appointmentreservation", appointment);
        console.log("Appointment reservation updated:", appointment);
      } else {
        console.error("Appointment not found for ID:", change.documentKey._id);
      }
    }
    if (change.operationType === "delete") {
      io.emit("cancelreser", change.documentKey._id);
    }
  } catch (err) {
    console.error("Error handling appointment change:", err);
  }
});

Machine.watch().on("change", async (change) => {
  try {
    const fullDocument = await Machine.findById(change.documentKey._id);
    io.emit("machineUpdate", fullDocument);
    console.log("Machine document updated:", fullDocument);
  } catch (err) {
    console.error("Error fetching machine document:", err);
  }
});

Patient.watch().on("change", async (change) => {
  try {
    const fullDocument = await Patient.findById(change.documentKey._id);
    io.emit("patientUpdate", fullDocument);
    console.log("Patient document updated:", fullDocument);
  } catch (err) {
    console.error("Error fetching patient document:", err);
  }
});

// Start Server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
