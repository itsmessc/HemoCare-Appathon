const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 7878; 
const patientroute=require('./routes/patient.route')
const doctorroute=require('./routes/doctor.router')

app.use(cors());
app.use(express.json());
app.use('/patient',patientroute);
app.use('/doctor',doctorroute)



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
