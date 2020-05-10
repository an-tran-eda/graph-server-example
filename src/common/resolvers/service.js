const { UserInputError } = require('apollo-server');

async function serviceGetSupplier(service, data, { db }) {
  if (!service.supplierId) return null;
  const { Business } = db.models;
  const business = await Business.findById(service.supplierId);
  if (!business) {
    throw new UserInputError('Resource not found');
  }

  return business;
}

module.exports = {
  Service: {
    supplier: serviceGetSupplier,
  },
};
