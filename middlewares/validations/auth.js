import Joi from 'joi';

const handleValidation = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        res.status(422).json({
            success: false,
            message: error.message?.replaceAll('"', '') || "Invalid input"
        });
    }
};

export const validateLoginData = handleValidation(
    Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
);

export const validateForgetPasswordData = handleValidation(
    Joi.object({
        email: Joi.string().email().required()
    })
);

export const validateResetPasswordData = handleValidation(
    Joi.object({
        password: Joi.string().required()
    })
);

export const validateChangePasswordData = handleValidation(
    Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().required()
    })
);
