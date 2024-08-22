
import { ErrorApp } from './../Utils/index.js';
const reqKey = ["body", "params", "query", "headers", "authUser"]


export const validationMiddleware = (schema) => {
    return async (req, res, next) => {
        let validatiosErrors = [];
        for (const key of reqKey) {
            const validationRess = schema[key]?.validate(req[key], { abortEarly: false });
            if (validationRess?.error) validatiosErrors.push(validationRess?.error)
        }

        return validatiosErrors.length ? next(new ErrorApp(validatiosErrors, 300)) : next();
    }
}
