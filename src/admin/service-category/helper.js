const validate = require('validate.js');

function validateServiceCategory(data) {
  const rules = {
    name: {
      presence: { allowEmpty: false },
    },
    active: {
      presence: { allowEmpty: false },
    },
  };

  return validate(data, rules);
}

module.exports = {
  validateServiceCategory,
};
