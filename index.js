const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const port = 7878; 

mongoose.connect(
    'mongodb+srv://heycharan:8CA3WEy0czKSIyLf@appethon.5ebyw.mongodb.net/hemotrack?retryWrites=true&w=majority&appName=AppeThon',
    { useNewUrlParser: true, useUnifiedTopology: true }
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

const Chatbox = require('./models/chatbox');
const Machine = require('./models/machine');
const Appointments = require('./models/appointment');

// WebSocket Connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Fetch message history
    socket.on('getHistory', async () => {
        try {
            const messages = await Chatbox.find()
                .sort({ createdAt: -1 });

            socket.emit('history', messages);
        } catch (err) {
            console.error('Error fetching messages:', err);
            socket.emit('error', { message: 'Failed to fetch message history' });
        }
    });

    // Handle incoming messages
    socket.on('message', async (data) => {
        try {
            // Save the message to MongoDB
            const newMessage = new Chatbox({
                sender_id: data.sender_id,
                content: data.content,
                location: data.location || '',
                staff: data.staff
            });

            const savedMessage = await newMessage.save();

            // Populate the sender_id field for the saved message
            const populatedMessage = await Chatbox.findById(savedMessage._id)
                .exec();

            // Emit the populated message to all connected clients
            io.emit('message', populatedMessage);
            console.log('New message:', populatedMessage);
        } catch (error) {
            console.error('Error saving message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Endpoint to fetch messages
app.get('/messages', async (req, res) => {
    try {
        const messages = await Chatbox.find().sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Watch for changes in the Machine and Appointments collections
Appointments.watch().on('change', async (change) => {
    try {
        if (change.operationType === 'insert' || change.operationType === 'update') {
            const appointment = await Appointments.findById(change.documentKey._id);
            console.log("Tet"+appointment)
            if (appointment) {
                if (appointment.type === 'Reservation') {
                    io.emit('appointmentreservation', appointment);
                    console.log('Appointment reservation updated:', appointment);
                } else {
                    console.log('Other appointment type or status:', appointment);
                }
            } else {
                console.error('Appointment not found for ID:', change.documentKey._id);
            }
        }
        if (change.operationType === 'delete') {
            console.log('Delete detected');
            io.emit('cancelreser', change.documentKey._id);
        }
    } catch (err) {
        console.error('Error handling appointment change:', err);
    }
});

Machine.watch().on('change', async (change) => {
    try {
        const fullDocument = await Machine.findById(change.documentKey._id);
        io.emit('machineUpdate', fullDocument);
        console.log('Machine document updated:', fullDocument);
    } catch (err) {
        console.error('Error fetching machine document:', err);
    }
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
