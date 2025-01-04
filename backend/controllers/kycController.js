const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/send-otp', async (req, res) => {
  const { aadhaar } = req.body;

  if (!aadhaar || aadhaar.length !== 12) {
    return res.status(400).json({ success: false, message: 'Invalid Aadhaar number.' });
  }

  try {
    /**
     * Following is the URL format for Aadhaar authentication service:
https://<host>/<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>
     */
    // Replace with UIDAI API call
    const response = await axios.post('https://auth.uidai.gov.in/send-otp', { aadhaar });
    if (response.data.status === 'success') {
      res.json({ success: true, message: 'OTP sent successfully.' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send OTP.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error connecting to UIDAI.', error: err.message });
  }
});

router.post('/validate-otp', async (req, res) => {
    const { aadhaar, otp } = req.body;
  
    if (!aadhaar || aadhaar.length !== 12 || !otp || otp.length !== 6) {
      return res.status(400).json({ success: false, message: 'Invalid Aadhaar or OTP.' });
    }
  
    try {
      // Replace with UIDAI API call
      const response = await axios.post('https://uidai-api/validate-otp', { aadhaar, otp });
      if (response.data.status === 'success') {
        res.json({ success: true, message: 'OTP validated successfully.' });
      } else {
        res.status(400).json({ success: false, message: 'Invalid OTP.' });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error connecting to UIDAI.', error: err.message });
    }
  });

module.exports = router;
