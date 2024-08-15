
import { ErrorApp } from './../Utils/index.js';
const reqKey = ["body", "params", "query", "headers"]


export const validationMiddleware = (schema) => {
    return async (req, res, next) => {
        let validatiosErrors = [];
        for (const key of reqKey) {
            const validationRess = schema[key]?.validate(req[key], { abortEarly: false });
            if (validationRess?.error) validatiosErrors.push(validationRess?.error)

            console.log(validationRess?.error);
        }

        return validatiosErrors.length ? next(new ErrorApp(validatiosErrors, 300)) : next();
    }
}
