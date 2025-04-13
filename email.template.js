   export const WELCOME_EMAIL = ({ name, email, link, password }) => `
    Hello ${name},

    Welcome to Seedling Propagation.
    
    To get started, kindly login using the following link:
    ${link}

    Your credentials are:
    Email: ${email}
    Password: ${password}

    Regards,
    Seedling Propagation Centre, Kiambu.
`;

export const RESET_PASSWORD_EMAIL = ({ name, link }) => `
    Hello ${name},

    To reset your password, click this link:
    ${link}

    This link expires in one hour.
    
    Regards,
    Seedling Propagation Centre, Kiambu.
`;
