const mongoose = require('mongoose');

const { Schema } = mongoose;

const serviceCategorySchema = Schema({
  active: { type: Boolean, required: true },
  name: { type: String, required: true },
  // services: [{ type: Schema.Types.ObjectId, ref: '' }],
}, {
  timestamps: true,
  collection: 'serviceCategories',
});

const ServiceCategory = mongoose.model('ServiceCategory', serviceCategorySchema);

module.exports = ServiceCategory;
