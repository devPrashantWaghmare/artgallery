const mongoose = require('mongoose');
const crypto = require('crypto');

// Encryption configuration
const algorithm = 'aes-256-cbc';
const secretKey = 'myartgallery'; // Replace with a secure key
const iv = crypto.randomBytes(16); // Initialization vector

// Helper functions
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

function decrypt(text) {
    const [storedIv, encryptedText] = text.split(':');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(storedIv, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Schema definition
const bankDetailsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accountNumber: { 
        type: String, 
        required: function() { 
            return !this.upiId; // Bank account is required if UPI ID is not provided 
        } 
    },
    ifscCode: { type: String },
    accountHolderName: { type: String },
    upiId: { type: String }, // Optional field for UPI ID
    isUpiVerified: { type: Boolean, default: false }, // Status of UPI verification
    isBankAccountVerified: { type: Boolean, default: false }, // Status of bank account verification
}, { timestamps: true });

// Middleware for encryption
bankDetailsSchema.pre('save', function (next) {
    if (this.isModified('accountNumber')) {
        this.accountNumber = encrypt(this.accountNumber);
    }
    if (this.isModified('ifscCode')) {
        this.ifscCode = encrypt(this.ifscCode);
    }
    if (this.isModified('upiId')) {
        this.upiId = encrypt(this.upiId);
    }
    next();
});

// Method to decrypt sensitive fields
bankDetailsSchema.methods.decryptFields = function () {
    return {
        accountNumber: this.accountNumber ? decrypt(this.accountNumber) : null,
        ifscCode: this.ifscCode ? decrypt(this.ifscCode) : null,
        upiId: this.upiId ? decrypt(this.upiId) : null,
    };
};

const BankDetails = mongoose.model('BankDetails', bankDetailsSchema);
module.exports = BankDetails;
