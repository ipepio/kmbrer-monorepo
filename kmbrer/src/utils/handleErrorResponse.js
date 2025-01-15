const handleErrorResponse = (e, ctx, message) => {
    console.error(message);

    if (e instanceof Error) {
        return ctx.send(e.name, e.message)
    }

    const genericError = new GenericError(message);
    return ctx.send(genericError.name, genericError.status)
}


class GenericError extends Error {
    name = ""
    status = 500
    constructor(name) {
        super();
        this.name = name;
    }
}

module.exports = { handleErrorResponse };
