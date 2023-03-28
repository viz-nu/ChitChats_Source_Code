import { body, validationResult } from 'express-validator';

function userRegisterValidations() {
    return [
        body("name", "Name is required").notEmpty().isLength({ min: 2 }),
        body("email", "Email is Required").isEmail(),
        body("password", "Password should be Min 8 Chars, Atleast 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Char")
            .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    ]
}
function userLoginValidations() {
    return [
        body("email", "Email is required").notEmpty(),
        body("password", "Password is required").notEmpty()
    ]
}

function errorMiddleware(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return next();
}

export {
    userRegisterValidations,
    errorMiddleware,
    userLoginValidations
} 