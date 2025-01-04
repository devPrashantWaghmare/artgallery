const mongoose = require('mongoose');
const crypto = require('crypto');

// Encryption key and algorithm
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your_32_character_long_key'; // Must be 32 chars
const IV_LENGTH = 16; // Initialization vector length

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    let parts = text.split(':');
    let iv = Buffer.from(parts.shift(), 'hex');
    let encryptedText = Buffer.from(parts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

const aadhaarPanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    aadhaarNumber: { 
        type: String, 
        required: true, 
        unique: true, 
        set: encrypt, // Encrypt before saving to the database
        get: decrypt // Decrypt when retrieving from the database
    },
    panNumber: { 
        type: String, 
        required: true, 
        unique: true, 
        set: encrypt, 
        get: decrypt 
    },
}, { 
    timestamps: true, 
    toJSON: { getters: true }, 
    toObject: { getters: true }
});

const AadhaarPan = mongoose.model('kyc', aadhaarPanSchema);
module.exports = AadhaarPan;
