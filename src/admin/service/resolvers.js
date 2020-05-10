const { combineResolvers } = require('graphql-resolvers');
const { UserInputError } = require('apollo-server');
const { requirePermission } = require('../../common/helpers');
const { validateServiceForm } = require('./helpers');

async function adminGetServices(obj, data, { db }) {
  const { Service } = db.models;
  const items = await Service.find({
    type: Service.TYPE_SUPPLIER,
  });
  return items;
}

async function adminGetService(obj, { id }, { db }) {
  const { Service } = db.models;
  const item = await Service.findById(id);
  return item;
}

async function adminCreateService(obj, data, { db }) {
  const inputErrors = await validateServiceForm(data);
  if (inputErrors) {
    throw new UserInputError('Please correct your inputs', {
      inputErrors,
    });
  }

  const { Service } = db.models;
  const svc = new Service();
  svc.set(data);
  await svc.save();
  return svc;
}

async function adminUpdateService(obj, { id, ...data }, { db }) {
  const { Service } = db.models;
  const svc = await Service.findById(id);
  if (!svc) {
    throw new UserInputError('Resource not found');
  }

  const inputErrors = await validateServiceForm(data);
  if (inputErrors) {
    throw new UserInputError('Please correct your inputs', {
      inputErrors,
    });
  }

  svc.set(data);
  await svc.save();
  return svc;
}

module.exports = {
  Query: {
    adminGetService: combineResolvers(requirePermission('ADMIN'), adminGetService),
    adminGetServices: combineResolvers(requirePermission('ADMIN'), adminGetServices),
  },
  Mutation: {
    adminCreateService: combineResolvers(requirePermission('ADMIN'), adminCreateService),
    adminUpdateService: combineResolvers(requirePermission('ADMIN'), adminUpdateService),
  },
};
