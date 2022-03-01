//Validation
const Joi = require("@hapi/joi");

//Register Validation
const registerValidation = data => {
  const schema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().required().email(),
    number: Joi.number().required(),
    password: Joi.string().min(3).required(),
    confirmpassword: Joi.any().valid(Joi.ref("password")).required(),
  });

  return schema.validate(data);
};

//Login Validation
const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(3).required(),
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
