import mongoose from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const authoritiesSchema = new mongoose.Schema({
    // authority: TOUR_GUIDE, TALE_SUPPORTER, TOI_SUPPORTER, TRAVELER, ADMIN
    authority: {
        type: String,
        default: 'TRAVELER',
        enum: ['TOUR_GUIDE', 'TALE_SUPPORTER', 'TOI_SUPPORTER', 'TRAVELER', 'ADMIN']
    },
    name: String
});
const metadataSchema = new mongoose.Schema({
    blocked: {
        type: Boolean,
        default: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    phoneVerified: {
        type: Boolean,
        default: false
    },
    lastPasswordReset: Date,
    passwordSetDate: {
        type: Date,
        default: Date.now
    },
    lastIP: String,
    lastLogin: Date
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    hash: String,
    salt: String,
    type: String,
    firstName: String,
    lastName: String,
    userName: {
        type: String,
        unique: true
    },
    authorities: [authoritiesSchema],
    gender: String,
    phoneNumber: String,
    passcode: String,
    metadata: metadataSchema,
    createDate: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.setPasscode = function() {
    const passcode = Math.random().toString(36).slice(-6);
    this.passcode = passcode.toUpperCase();
};

userSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 1); // currently we set expiration Date is 1 day
    return jwt.sign({
        email: this.email,
        id: this._id,
        authorities: this.authorities,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
};

userSchema.methods.getFullName = function() {
    if (this.firstName && this.lastName){
        return this.firstName + ' '+ this.lastName;
    } else if (this.firstName){
        return this.firstName;
    } else if (this.lastName) {
        return this.lastName;
    } else {
        return '';
    }
};

userSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        name: this.getFullName(),
        token: this.generateJWT(),
    };
};

const Users = mongoose.model('Users', userSchema);

export default Users;

