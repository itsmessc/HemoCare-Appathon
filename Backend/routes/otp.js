const express = require('express');
const router = express.Router();
const Staff=require('../models/staff');
const Otp = require('../models/otp');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const jwt=require('jsonwebtoken');


router.post('/sendOTP', async (req, res) => {
    const { email } = req.body;
    const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets : false, upperCaseAlphabets : false, specialChars: false });
    try{
        let otprec=await Otp.findOne({email: email});
        if(otprec){
            otprec.otp= otp;
            otprec.createdAt= new Date();
            await otprec.save();
        }
        else{
            await Otp.create({email,otp});
        }
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:
            {
                user:'wixpolo@gmail.com',
                pass:process.env.PASS
            }
        });
        await transporter.sendMail({
            from:'HemoCare <wixpolo@gmail.com>',
            to: email,
            subject: 'OTP for Verification',
            text: `Welcome to HemoCare\nYour OTP for verification is: ${otp}`
        });

        res.status(200).send('OTP sent successfully');
    }
    catch(error){
        console.log(error);
        res.status(500);
    }
});

router.post('/validateotp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpRecord = await Otp.findOne({ email });

        if (!otpRecord) {
            return res.status(400).send('OTP record not found');
        }

        if (otpRecord.otp === otp) {
            // Check if user exists

                res.status(200).json({ message: 'OTP verified successfully', exists: true });
        } else {
            res.status(400).send('Invalid OTP');
        }
    } catch (error) {
        console.error('Error validating OTP:', error);
        res.status(500).send('Failed to validate OTP');
    }
});

router.post('/update', async (req, resp) => {
    console.log("Chanfing otp")
    const { email, newPassword } = req.body;

    try {
        // Find the patient by email
        const staff = await Staff.findOne({ email: email });

        if (!staff) {
            return resp.status(404).json({ message: "Patient not found." });
        }

        // Update the patient's password
        staff.password = newPassword; // Ensure you hash the password before saving

        // Save the updated patient
        await staff.save();

        return resp.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Error updating password:", error);
        return resp.status(500).json({ message: "Internal server error." });
    }
});





// router.post('/signin', async (req, res) => {
//     const { phone, email } = req.body;

//     try {
//         let user;

//         if (phone) {
//             user = await User.findOne({ phone: phone });
//         } else if (email) {
//             user = await User.findOne({ email: email });
//         }

//         if (user) {
//             const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//             res.status(200).json({ token, user });
//         } else {
//             res.status(400).json({ message: "User not found" });
//         }
//     } catch (error) {
//         console.error('Error during signin:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


module.exports=router;