import Joi from 'joi';

export const validateUserData = async (req,res,next) => {
    const {body} = req;
    const schema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().required(),
        password: Joi.string().required()
    });
    try{
        await schema.validateAsync(body);
        next();
    }catch(error){
        return res.status(422).json({
            success:false,
            message: error.message ? error.message.replaceAll('\"','') : "Invalid input"
        });
    }   
}

export const validateStaffData = async (req,res,next) => {
    const {body} = req;
    const schema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().required(),
        password: Joi.string().required()
    });
    try{
        await schema.validateAsync(body);
        next();
    }catch(error){
        return res.status(422).json({
            success:false,
            message: error.message ? error.message.replaceAll('\"','') : "Invalid input"
        });
    }   
}

export const validateGetUser = async (req,res,next) => {
    const {body} = req;
    const schema = Joi.object({
        email: Joi.string().email().required()
    });
    try{
        await schema.validateAsync(body);
        next();
    }catch(error){
        return res.status(422).json({
            success:false,
            message: error.message ? error.message.replaceAll('\"','') : "Invalid input"
        });
    }

}
export const validateUpdateProfilePicture = async (req,res,next) => {
    const {body} = req;
    const schema = Joi.object({
        profilePicture:Joi.string()
    });
    try{
        await schema.validateAsync(body);
        next();
    }catch(error){
        return res.status(422).json({
            success:false,
            message: error.message ? error.message.replaceAll('\"','') : "Invalid input"
        });
    }
}

export const validateUpdateUserProfileData = async (req,res,next) => {
    const {body} = req;
    const schema = Joi.object({
        fullName: Joi.string(),
        email: Joi.string().email(),
        phoneNumber: Joi.string()
    });
    try{
        await schema.validateAsync(body);
        next();
    }catch(error){
        return res.status(422).json({
            success:false,
            message: error.message ? error.message.replaceAll('\"','') : "Invalid input"
        });
    }
}  


export const validateUpdateAdminProfileData = async (req,res,next) => {
    const {body} = req;
    const schema = Joi.object({
        fullName: Joi.string(),
        email: Joi.string().email()
    });
    try{
        await schema.validateAsync(body);
        next();
    }catch(error){
        return res.status(422).json({
            success:false,
            message: error.message ? error.message.replaceAll('\"','') : "Invalid input"
        });
    }
}  
