import Joi from 'joi';
export const validateLoginData = async (req,res,next) => {
    const {body} = req;
    const schema = Joi.object({
        email: Joi.string().email().required(),
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