const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } }); // Adjust CORS settings as needed

const port = 7878; 

mongoose.connect(
    'mongodb+srv://heycharan:8CA3WEy0czKSIyLf@appethon.5ebyw.mongodb.net/hemotrack?retryWrites=true&w=majority&appName=AppeThon ',
).then(() => {
    console.log('Database Connected');
}).catch((err) => {
    console.error('Database Connection Error:', err);
});

app.use(cors());
app.use(express.json());

const patientrouter = require('./routes/patient');
const staffroute = require('./routes/staff');
const appointmentroute = require('./routes/appointment');
const machine = require('./routes/machine');
app.use('/patient', patientrouter);
app.use('/staff', staffroute);
app.use('/appointment', appointmentroute);
app.use('/machine', machine);
const Chatbox=require('./models/chatbox');
// WebSocket Connection
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', async (data) => {
        try {
            // Save the message to MongoDB
            const newMessage = new Chatbox({
                sender_id: data.sender_id,
                content: data.content,
                location: data.location || '', 
            });

            await newMessage.save();

            // Emit the message to all connected clients
            io.emit('message', newMessage);
            console.log('New message:', newMessage);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });


    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


  app.get('/messages', async (req, res) => {
    try {
      const messages = await Chatbox.find().sort({ timestamp: 1 });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });
  



// Watch for changes in the Machine collection
const Machine = require('./models/machine');
const Appointments=require('./models/appointment');
const { log } = require('console');

Appointments.watch().on('change', async (change) => {
    try {
        // Check if the change type is 'insert' or 'update'
        if (change.operationType === 'insert' || change.operationType === 'update') {
            // Fetch the full document based on the document key
            const appointment = await Appointments.findById(change.documentKey._id);

            if (appointment) {
                // Check the type of the appointment or its status
                if (appointment.type === 'Reservation') {
                    // Emit the appointment update to the clients
                    io.emit('appointmentreservation', appointment);
                    console.log('Appointment reservation updated:', appointment);
                } else {
                    // Log or handle other types of appointments if needed
                    console.log('Other appointment type or status:', appointment);
                }
            } else {
                console.error('Appointment not found for ID:', change.documentKey._id);
            }
        }
    } catch (err) {
        console.error('Error fetching or handling document:', err);
    }
});



Machine.watch().on('change', async (change) => {
    try {
        const fullDocument = await Machine.findById(change.documentKey._id);
        io.emit('machineUpdate', fullDocument);
        console.log(fullDocument);
    } catch (err) {
        console.error('Error fetching full document:', err);
    }
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});