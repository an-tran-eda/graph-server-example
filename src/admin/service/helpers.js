const validate = require('validate.js');

async function validateServiceForm(data) {
  validate.Promise = global.Promise;

  let errors;
  const rules = {
    name: {
      presence: { allowEmpty: false },
    },
  };
  try {
    await validate.async(data, rules, { format: 'grouped' });
  } catch (err) {
    errors = err;
  }
  return errors;
}

module.exports = {
  validateServiceForm,
};
