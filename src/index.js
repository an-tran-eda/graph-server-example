// Type Defs
const CommonTypeDef = require('./common/types/common.gql');
const UserTypeDef = require('./common/types/user.gql');
const BusinessTypeDef = require('./common/types/business.gql');
const ServiceTypeDef = require('./common/types/service.gql');
const adminSupplierTypes = require('./admin/supplier/types.gql');
const adminServiceTypes = require('./admin/service/types.gql');
const ServiceCategoryTypeDef = require('./common/types/service-category.gql');

// Admin queries and mutations types
const AdminUserTypes = require('./admin/user/types.gql');
const AdminServiceCategoryTypes = require('./admin/service-category/types.gql');

// Resolvers
const UserResolver = require('./admin/user/resolvers');
const serviceResolver = require('./common/resolvers/service');
const adminSupplierResolvers = require('./admin/supplier/resolvers');
const adminServiceResolvers = require('./admin/service/resolvers');
const ServiceCategoryResolver = require('./admin/service-category/resolvers');
const CustomTypes = require('./common/customTypes/index');

const typeDefs = [
  CommonTypeDef,
  UserTypeDef,
  ServiceTypeDef,
  BusinessTypeDef,
  adminSupplierTypes,
  adminServiceTypes,
  ServiceCategoryTypeDef,
  AdminServiceCategoryTypes,
  AdminUserTypes,
];

const resolvers = [
  CustomTypes,
  UserResolver,
  serviceResolver,
  adminSupplierResolvers,
  adminServiceResolvers,
  ServiceCategoryResolver,
];

module.exports = {
  typeDefs,
  resolvers,
};
