const Joi = require('joi')

module.exports = {
  signup: {
    body: {
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().max(12).required()
    }
  }
}
