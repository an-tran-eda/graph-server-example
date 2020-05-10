const { escapeRegExp } = require('../../common/helpers');
const { combineResolvers } = require('graphql-resolvers');
const { requirePermission } = require('../../common/helpers');
const { UserInputError } = require('apollo-server');
const { validateServiceCategory } = require('./helper');

async function getServiceCategory(obj, { id }, { db }) {
  const item = await db.models.ServiceCategory.findById(id);
  return item;
}

async function getServiceCategories(obj, { limit = 3, page = 0, filter = '' }, { db }) {
  const { ServiceCategory } = db.models;
  const conditions = {};

  if (filter) {
    conditions.$or = [
      { name: new RegExp(escapeRegExp(filter), 'i') },
    ];
  }
  const categories = await ServiceCategory.find(conditions).sort({ _id: -1 })
    .skip(page * limit)
    .limit(limit);
  const totalCount = await ServiceCategory.countDocuments(conditions);
  const totalPage = Math.ceil(totalCount / limit);
  const result = {
    categories,
    totalCount,
    totalPage,
    page,
    filter,
  };
  // console.log('result' , result)
  return result;
}

async function createServiceCategory(obj, data, { db }) {
  const category = new db.models.ServiceCategory();
  const inputErrors = validateServiceCategory(data);
  if (inputErrors) {
    throw new UserInputError('Please correct your inputs', {
      inputErrors,
    });
  }

  category.name = data.name;
  category.active = data.active;
  await category.save();
  return category;
}

async function deleteServiceCategory(obj, { id }, { db }) {
  const category = await db.models.ServiceCategory.findById(id);
  if (!category) {
    throw new UserInputError('Category not found');
  }

  await category.remove();
  return category;
}

async function updateServiceCategory(obj, data, { db }) {
  const category = await db.models.ServiceCategory.findById(data.id);
  if (!category) {
    throw new UserInputError('Category not found');
  }

  category.name = data.name;
  category.active = data.active;
  await category.save();
  return category;
}

module.exports = {
  Query: {
    getServiceCategory: combineResolvers(requirePermission('ADMIN'), getServiceCategory),
    getServiceCategories: combineResolvers(requirePermission('ADMIN'), getServiceCategories),
  },
  Mutation: {
    createServiceCategory: combineResolvers(requirePermission('ADMIN'), createServiceCategory),
    deleteServiceCategory: combineResolvers(requirePermission('ADMIN'), deleteServiceCategory),
    updateServiceCategory: combineResolvers(requirePermission('ADMIN'), updateServiceCategory),
  },
};
