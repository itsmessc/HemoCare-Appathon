const pool = require('../db');

exports.signup = async (req, res) => {
    console.log('Request body:', req.body); 

    const query = 'INSERT INTO Patient (name, age, hospital_number, adhaar_number, address, photograph, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    
    const { name, age, hnumber, aadhar, address, photo, pnumber } = req.body;

    try {
        await pool.query(query, [name, age, hnumber, aadhar, address, photo, pnumber]);
        res.status(201).json({ message: "Registration Successful" });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ message: err.message });
    }
}
