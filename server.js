const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
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

const patientrouter=require('./routes/patient');
app.use('/patient',patientrouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
