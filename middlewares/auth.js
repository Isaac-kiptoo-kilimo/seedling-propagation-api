export const isAdmin = async (req,res,next) => {
    const {user} = req;
    if (user.role != 'admin'){
        return res.status(403).json({
            success:false,
            message: 'Administrative permission is required to access this resource.'
        });
    }
    next();   
}

export const isStaff = async (req,res,next) => {
    const {user} = req;
    if (user.role != 'staff'){
        return res.status(403).json({
            success:false,
            message: 'This resource is limited to staff only.'
        });
    }
    next(); 
}

export const isCustomer = async (req,res,next) => {
    const {user} = req;
    if (user.role != 'customer'){
        return res.status(403).json({
            success:false,
            message: 'This resource is limited to customer only.'
        });
    }
    next(); 
}