import Joi from "joi";

const LOGIN_SCHEMA = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required()
});

export const validateLogin = (input: any) => LOGIN_SCHEMA.validate(input);

const REGISTER_SCHEMA = Joi.object({
    displayName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
                    .min(8)
                    .max(30)
                    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$'))
                    .required()
});

export const validateRegister = (input: any) => REGISTER_SCHEMA.validate(input);