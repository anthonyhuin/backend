//validation
const Joi = require("joi");

//register validation

const registerValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email().messages({
      "string.base": `"email" should be a type of 'text'`,
      "string.empty": `"email" cannot be an empty field`,
      "string.min": `"email" should have a minimum length of {#limit}`,
      "any.required": `"email" is a required field`,
      "string.email": `email must be valid`,
    }),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
