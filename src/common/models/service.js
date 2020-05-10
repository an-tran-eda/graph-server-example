const mongoose = require('mongoose');

const { Schema } = mongoose;

const serviceSchema = Schema({
  name: { type: String },
  description: { type: String },
  supplierId: { type: Schema.Types.ObjectId, ref: 'Business' },
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
