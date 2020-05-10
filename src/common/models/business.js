const mongoose = require('mongoose');

const { Schema } = mongoose;

const businessSchema = Schema({
  abn: { type: String },
  name: { type: String },
  email: { type: String },
  address: { type: String },
  phone: { type: String },
  type: { type: String },
  status: String,
  primaryContactId: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Business = mongoose.model('Business', businessSchema);

// available business types
Business.TYPE_SUPPLIER = 'SUPPLIER';
Business.TYPE_CLIENT = 'CLIENT';

// available account statuses
Business.STATUS_ACTIVE = 'ACTIVE';
Business.STATUS_INACTIVE = 'INACTIVE';

module.exports = Business;
