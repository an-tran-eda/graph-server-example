const validate = require('validate.js');

function validateUser(data) {
  const rules = {
    firstname: {
      presence: { allowEmpty: false },
    },
    lastname: {
      presence: { allowEmpty: false },
    },
    email: {
      presence: { allowEmpty: false },
    },
  };

  return validate(data, rules);
}

module.exports = {
  validateUser,
};
