const { combineResolvers } = require('graphql-resolvers');
const { UserInputError } = require('apollo-server');
const { requirePermission } = require('../../common/helpers');
const { validateSupplierForm } = require('./helpers');

async function adminGetSuppliers(obj, data, { db }) {
  const { Business } = db.models;
  const items = await Business.find({
    type: Business.TYPE_SUPPLIER,
  });
  return items;
}

async function adminGetSupplier(obj, { id }, { db }) {
  const item = await db.models.Business.findById(id);
  return item;
}

async function adminCreateSupplier(obj, data, { db }) {
  const inputErrors = await validateSupplierForm(data);
  if (inputErrors) {
    throw new UserInputError('Please correct your inputs', {
      inputErrors,
    });
  }

  const { Business } = db.models;
  const business = new Business();
  business.set(data);
  business.type = Business.TYPE_SUPPLIER;
  await business.save();
  return business;
}

async function adminUpdateSupplier(obj, { id, ...data }, { db }) {
  const { Business } = db.models;
  const business = await Business.findById(id);
  if (!business) {
    throw new UserInputError('Resource not found');
  }

  const inputErrors = await validateSupplierForm(data);
  if (inputErrors) {
    throw new UserInputError('Please correct your inputs', {
      inputErrors,
    });
  }

  business.set(data);
  await business.save();
  return business;
}

module.exports = {
  Query: {
    adminGetSupplier: combineResolvers(requirePermission('ADMIN'), adminGetSupplier),
    adminGetSuppliers: combineResolvers(requirePermission('ADMIN'), adminGetSuppliers),
  },
  Mutation: {
    adminCreateSupplier: combineResolvers(requirePermission('ADMIN'), adminCreateSupplier),
    adminUpdateSupplier: combineResolvers(requirePermission('ADMIN'), adminUpdateSupplier),
  },
};
