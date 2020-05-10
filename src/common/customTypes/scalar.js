const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const Date = new GraphQLScalarType({
  name: 'Date',
  description: 'A string represent date in ISO format',
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

module.exports = {
  Date,
};
