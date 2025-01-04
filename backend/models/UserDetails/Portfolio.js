const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bio: {
        type: String,
        trim: true
    },
    skills: [
        {
            type: String,
            trim: true
        }
    ],
    projects: [
        {
            title: {
                type: String,
                required: true,
                trim: true
            },
            description: {
                type: String,
                trim: true
            },
            url: {
                type: String,
                trim: true
            }
        }
    ],
    experience: [
        {
            company: {
                type: String,
                trim: true
            },
            role: {
                type: String,
                trim: true
            },
            startDate: {
                type: Date
            },
            endDate: {
                type: Date
            },
            description: {
                type: String,
                trim: true
            }
        }
    ],
    education: [
        {
            institution: {
                type: String,
                trim: true
            },
            degree: {
                type: String,
                trim: true
            },
            fieldOfStudy: {
                type: String,
                trim: true
            },
            startDate: {
                type: Date
            },
            endDate: {
                type: Date
            }
        }
    ],
    certifications: [
        {
            name: {
                type: String,
                trim: true
            },
            issuingOrganization: {
                type: String,
                trim: true
            },
            issueDate: {
                type: Date
            },
            expirationDate: {
                type: Date
            },
            credentialId: {
                type: String,
                trim: true
            },
            credentialUrl: {
                type: String,
                trim: true
            }
        }
    ],
    socialLinks: {
        linkedin: {
            type: String,
            trim: true
        },
        github: {
            type: String,
            trim: true
        },
        portfolioWebsite: {
            type: String,
            trim: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

portfolioSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
