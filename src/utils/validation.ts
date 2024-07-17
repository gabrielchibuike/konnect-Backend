import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
// const passwordComplexity = require('joi-password-complexity')

interface CreateAccSchema {
  fullName: string;
  mobileNumber: number;
  email: string;
  password: string;
}

export const createAccSchema: Joi.ObjectSchema<CreateAccSchema> = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net"] } })
    .messages({
      "string.empty": "This field is required",
      "string.email": "email must be a valid email",
    }),
  password: passwordComplexity({
    min: 6,
    max: 20,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 6,
  }),
});

export const moreUserInfo = Joi.object({
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  state: Joi.string().required(),
  postal_code: Joi.string().required().trim(),
  // desired_jobs: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: ["com", "net"] } }),
  password: passwordComplexity({
    min: 6,
    max: 20,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 6,
  }),
});

export const emailSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: ["com", "net"] } }),
});

export const updateSchema = Joi.object({
  password: passwordComplexity({
    min: 6,
    max: 20,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 6,
  }),
  Cpassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Retyped password must match the password",
  }),
});

export const changePasswordSchema = Joi.object({
  Newpassword: passwordComplexity({
    min: 6,
    max: 20,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 6,
  }),
});

export const jobPrefrenceSchema = Joi.object({
  Jobs: Joi.string().required(),
  // Location: Joi.string(),
});

