

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "OpenAPI - API",
        version: "1.0.0",
        description: "A simple Express API that utilizes OpenAPI",
    },
};
const options = {
    swaggerDefinition,
    apis: ["./controller/*.js"],
};

export default {
    options
}

// import usersRouter from "./routers/usersRouter.js";
// app.use(usersRouter);


