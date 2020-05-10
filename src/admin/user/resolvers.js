const { escapeRegExp } = require('../../common/helpers');
const { combineResolvers } = require('graphql-resolvers');
const { requirePermission } = require('../../common/helpers');
const { UserInputError } = require('apollo-server');
const config = require('../../../config');
const { validateUser } = require('./helpers');

async function adminGetUsers(obj, {
  limit = 5,
  page = 0,
  search = '',
  sort = { _id: -1 },
}, { db }) {
  const { User } = db.models;
  // console.log(first, offset)
  const filter = {
  };
  if (search) {
    filter.$or = [
      { firstname: new RegExp(escapeRegExp(search), 'i') },
      { lastname: new RegExp(escapeRegExp(search), 'i') },
      { roles: new RegExp(escapeRegExp(search), 'i') },
    ];
  }
  const users = await User.find(filter).sort(sort)
    .skip(page * limit)
    .limit(limit);
  const totalCount = await User.countDocuments(filter);
  const totalPage = Math.ceil(totalCount / limit);
  const result = {
    users,
    totalCount,
    totalPage,
    page,
    search,
  };
  // console.log('result' , result)
  return result;
}

async function getUsers(obj, { s }, { db }) {
  const { User } = db.models;
  const filter = {};
  if (s) {
    filter.$or = [
      { firstName: new RegExp(escapeRegExp(s), 'i') },
      { lastName: new RegExp(escapeRegExp(s), 'i') },
    ];
  }
  const posts = await User.find(filter).sort({ _id: -1 });
  return posts;
}

async function getUser(obj, { id }, { db }) {
  const item = await db.models.User.findById(id);
  return item;
}

async function login(obj, { email, password }, context) {
  const user = await context.db.models.User.findOne({ email });
  if (!user || !user.isPasswordValid(password)) {
    throw new UserInputError('Incorrect email or password');
  }
  const { value, expireAt } = user.createToken(config.accessTokenLifeTime);
  return {
    value,
    expireAt,
    user,
  };
}

async function createUser(obj, data, { db }) {
  const user = new db.models.User();
  const inputErrors = validateUser(data);
  if (inputErrors) {
    throw new UserInputError('Please correct your inputs', {
      inputErrors,
    });
  }

  user.email = data.email;
  user.firstname = data.firstname;
  user.lastname = data.lastname;
  user.username = data.firstname + data.lastname;
  user.status = data.status || 'ACTIVE';
  user.roles = data.roles || ['CLIENT'];
  user.setPassword('1');
  await user.save();
  return user;
}

async function deleteUser(obj, { id }, { db }) {
  const user = await db.models.User.findOne({ _id: id });
  if (!user) {
    throw new UserInputError('User not found');
  }

  await user.remove();
  return user;
}

async function updateUser(obj, { id, ...data }, { db }) {
  const user = await db.models.User.findOne({ _id: id });
  if (!user) {
    throw new UserInputError('Post not found');
  }

  const inputErrors = validateUser(data);
  if (inputErrors) {
    throw new UserInputError('Please correct your inputs', { inputErrors });
  }

  user.email = data.email;
  user.firstname = data.firstname;
  user.lastname = data.lastname;
  user.roles = data.roles;
  user.status = data.status;
  await user.save();
  return user;
}

module.exports = {
  Query: {
    adminGetUsers: combineResolvers(requirePermission('ADMIN'), adminGetUsers),
    getUsers: combineResolvers(requirePermission('ADMIN'), getUsers),
    getUser: combineResolvers(requirePermission('ADMIN'), getUser),
  },
  Mutation: {
    login,
    createUser: combineResolvers(requirePermission('ADMIN'), createUser),
    deleteUser: combineResolvers(requirePermission('ADMIN'), deleteUser),
    updateUser: combineResolvers(requirePermission('ADMIN'), updateUser),
  },
};
