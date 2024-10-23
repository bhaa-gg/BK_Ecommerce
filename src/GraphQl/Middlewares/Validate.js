


export const graphValidationMiddleware = async (schema, args) => {
    const { error } = schema.validate(args, { abortEarly: false })
    return error ? error.details : true;
}