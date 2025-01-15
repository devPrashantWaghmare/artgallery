// backend/controllers/otpController.js

const jwt = require('jsonwebtoken');
const User = require('../models/UserDetails/baseUser'); // Adjust path as needed
const { Role } = require('../models/UserDetails/role');
const { redisClient, connectRedis } = require('../utils/redisClient');
const twilioClient = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Utility function to format mobile numbers
function formatMobileNumber(number) {
    return number.startsWith('+91') ? number : `+91${number.replace(/^0/, '')}`;
}

// Calculate effective permissions recursively
const calculateEffectivePermissions = async (role) => {
    let permissions = { ...role.permissions };
    if (role.inherits) {
        const parentRole = await Role.findById(role.inherits).populate('inherits');
        if (parentRole) {
            const parentPermissions = await calculateEffectivePermissions(parentRole);
            permissions = { ...parentPermissions, ...permissions };
        }
    }
    return permissions;
};

// Request OTP Endpoint
const requestOtp = async (req, res) => {
    const { mobile } = req.body;

    if (!mobile) {
        return res.status(400).json({ message: 'Mobile number is required' });
    }

    const formattedMobile = formatMobileNumber(mobile);

    try {
        await connectRedis();

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
        await redisClient.setEx(formattedMobile, 300, otp); // Store OTP with 5-min expiry

        // Send OTP via Twilio
        await twilioClient.messages.create({
            body: `Your OTP code is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedMobile,
        });

        console.log(`OTP sent to ${formattedMobile}: ${otp}`);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error.message);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

// Verify OTP Endpoint
const verifyOtp = async (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
        return res.status(400).json({ message: 'Mobile number and OTP are required' });
    }

    const formattedMobile = formatMobileNumber(mobile);

    try {
        await connectRedis();

        const cachedOtp = await redisClient.get(formattedMobile);

        if (!cachedOtp || cachedOtp !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const mobileWithoutCountryCode = formattedMobile.replace(/^(\+91|91)/, '');
        let user = await redisClient.get(`user:${mobileWithoutCountryCode}`);

        if (!user) {
            user = await User.findOne({ mobile: mobileWithoutCountryCode })
                .populate({
                    path: 'role',
                    populate: {
                        path: 'inherits', // Populate inherited roles
                    },
                });
            if (user) {
                await redisClient.setEx(`user:${mobileWithoutCountryCode}`, 3600, JSON.stringify(user));
            }
        } else {
            user = JSON.parse(user);
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const role = user.role;
        const permissions = await calculateEffectivePermissions(role);

        const token = jwt.sign(
            {
                userId: user._id,
                role: role.name,
                permissions,
                version: user.version,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Clear OTP after successful verification
        await redisClient.del(formattedMobile);

        res.status(200).json({
            user: {
                _id: user._id,
                username: user.name,
                mobile: user.mobile,
                email: user.email,
                role: role.name,
                permissions,
            },
            token,
            message: 'Login successful',
        });
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { requestOtp, verifyOtp };





/* 
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import User from '../models/UserDetails/baseUser'; // Adjust path as needed
import { Role } from '../models/UserDetails/role';
import { redisClient, connectRedis } from '../utils/redisClient';
import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Utility function to format mobile numbers
function formatMobileNumber(number) {
  return number.startsWith('+91') ? number : `+91${number.replace(/^0/, '')}`;
}

const calculateEffectivePermissions = async (role) => {
  let permissions = { ...role.permissions };
  if (role.inherits) {
    const parentRole = await Role.findById(role.inherits).populate('inherits');
    if (parentRole) {
      const parentPermissions = await calculateEffectivePermissions(parentRole);
      permissions = { ...parentPermissions, ...permissions };
    }
  }
  return permissions;
};

// Request OTP Endpoint
export const requestOtp = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ message: 'Mobile number is required' });
  }

  const formattedMobile = formatMobileNumber(mobile);

  try {
    await connectRedis();

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    await redisClient.setEx(formattedMobile, 300, otp); // Store OTP in Redis with a 5-minute expiry

    // Send OTP via Twilio
    await twilioClient.messages.create({
      body: `Your OTP code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedMobile,
    });

    console.log(`OTP sent to ${formattedMobile}: ${otp}`);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Verify OTP Endpoint
export const verifyOtp = async (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.status(400).json({ message: 'Mobile number and OTP are required' });
  }

  const formattedMobile = formatMobileNumber(mobile);

  try {
    await connectRedis();

    const cachedOtp = await redisClient.get(formattedMobile);

    if (!cachedOtp || cachedOtp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const mobileWithoutCountryCode = formattedMobile.replace(/^\+91|91/, '');
    let user = await User.findOne({ mobile: mobileWithoutCountryCode })
      .populate({
        path: 'role',
        populate: {
          path: 'inherits',
        },
      });

    if (!user) {
      // Optionally register a new user if not found
      user = new User({
        mobile: mobileWithoutCountryCode,
        name: 'New User',
        role: await Role.findOne({ name: 'user' }),
      });
      await user.save();
    }

    const role = user.role;
    const permissions = await calculateEffectivePermissions(role);

    // Use NextAuth to create a session token
    const sessionToken = await getServerSession(req, res, authOptions);

    // Clear OTP after successful verification
    await redisClient.del(formattedMobile);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: role.name,
        permissions,
      },
      session: sessionToken,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
 */