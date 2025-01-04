import React, { useState } from 'react';
import { Box, Typography, Button, TextField, CircularProgress, Paper, Grid, Divider } from '@mui/material';
import axios from '../../services/api';

const KYCComponent = ({ verificationStatus }) => {
  const [completedSteps, setCompletedSteps] = useState({
    aadhaar: false,
    pan: false,
    bankAccount: false,
    upi: false,
    address: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [inputs, setInputs] = useState({ aadhaar: '', otp: '', pan: '', bankAccount: '', upi: '', address: '' });

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (step) => {
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      switch (step) {
        case 'aadhaar':
          await axios.post('/api/uidai/validate-otp', { aadhaar: inputs.aadhaar, otp: inputs.otp });
          setCompletedSteps((prev) => ({ ...prev, aadhaar: true }));
          setSuccessMessage('Aadhaar verified successfully!');
          break;
        case 'pan':
          await axios.post('/api/artist/verify-pan', { pan: inputs.pan });
          setCompletedSteps((prev) => ({ ...prev, pan: true }));
          setSuccessMessage('PAN verified successfully!');
          break;
        case 'bankAccount':
          await axios.post('/api/artist/verify-bank', { bankAccount: inputs.bankAccount });
          setCompletedSteps((prev) => ({ ...prev, bankAccount: true }));
          setSuccessMessage('Bank account verified successfully!');
          break;
        case 'upi':
          await axios.post('/api/artist/verify-upi', { upi: inputs.upi });
          setCompletedSteps((prev) => ({ ...prev, upi: true }));
          setSuccessMessage('UPI verified successfully!');
          break;
        case 'address':
          await axios.post('/api/artist/verify-address', { address: inputs.address });
          setCompletedSteps((prev) => ({ ...prev, address: true }));
          setSuccessMessage('Address verified successfully!');
          break;
        default:
          throw new Error('Unknown step');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete this step.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ padding: 3, marginBottom: 2, boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom>
        KYC Verification
      </Typography>
      <Divider sx={{ marginY: 2 }} />

      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      {successMessage && (
        <Typography color="success.main" gutterBottom>
          {successMessage}
        </Typography>
      )}

      <Grid container spacing={2}>
        {/* Aadhaar Verification */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Aadhaar Verification</Typography>
            {completedSteps.aadhaar ? (
              <Typography color="success.main">Completed</Typography>
            ) : (
              <>
                <TextField
                  label="Aadhaar Number"
                  value={inputs.aadhaar}
                  onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="OTP"
                  value={inputs.otp}
                  onChange={(e) => handleInputChange('otp', e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={() => handleSubmit('aadhaar')}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Verify Aadhaar'}
                </Button>
              </>
            )}
          </Box>
        </Grid>

        {/* PAN Verification */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">PAN Verification</Typography>
            {completedSteps.pan ? (
              <Typography color="success.main">Completed</Typography>
            ) : (
              <>
                <TextField
                  label="PAN Number"
                  value={inputs.pan}
                  onChange={(e) => handleInputChange('pan', e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={() => handleSubmit('pan')}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Verify PAN'}
                </Button>
              </>
            )}
          </Box>
        </Grid>

        {/* Bank Account Verification */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Bank Account Verification</Typography>
            {completedSteps.bankAccount ? (
              <Typography color="success.main">Completed</Typography>
            ) : (
              <>
                <TextField
                  label="Bank Account Number"
                  value={inputs.bankAccount}
                  onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={() => handleSubmit('bankAccount')}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Verify Bank Account'}
                </Button>
              </>
            )}
          </Box>
        </Grid>

        {/* UPI Verification */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">UPI Verification</Typography>
            {completedSteps.upi ? (
              <Typography color="success.main">Completed</Typography>
            ) : (
              <>
                <TextField
                  label="UPI ID"
                  value={inputs.upi}
                  onChange={(e) => handleInputChange('upi', e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={() => handleSubmit('upi')}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Verify UPI'}
                </Button>
              </>
            )}
          </Box>
        </Grid>

        {/* Address Verification */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Address Verification</Typography>
            {completedSteps.address ? (
              <Typography color="success.main">Completed</Typography>
            ) : (
              <>
                <TextField
                  label="Address"
                  value={inputs.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={() => handleSubmit('address')}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Verify Address'}
                </Button>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default KYCComponent;
