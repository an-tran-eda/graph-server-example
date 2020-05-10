// const { GraphQLEnumType } = require('graphql');

const SortDirectionEnum = {
  ASC: 1,
  DESC: -1,
};

const UserSortFieldEnum = {
  FIRSTNAME: 'firstname',
  LASTNAME: 'lastname',
  ROLE: 'roles',
  STATUS: 'status',
};

module.exports = {
  SortDirectionEnum,
  UserSortFieldEnum,
};
