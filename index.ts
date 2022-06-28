import "dotenv/config"
import express from "express";
import sequelize from "./src/util/db";
import userRouter from "./src/routes/users.route";
import { register, login } from "./src/controllers/auth.controller";
import { errorHandler } from "./src/middleware/error-handler.middleware";
import orderRouter from "./src/routes/orders.route";
import { createWebSocket } from "./src/websockets/server.websocket";
import { validateParams } from "./src/middleware/validation.middleware";
import { PostParameters } from "./src/util/parametersInterface";
import { ErrorEnum } from "./src/errors/httpErrors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);
app.use('/orders', orderRouter);

app.post('/register', validateParams([PostParameters.USER]), register);
app.post('/login', validateParams([PostParameters.USER]), login);

// All routes not implemented will return an error
app.all('*', function (req, res, next) {
    next(ErrorEnum.NOT_IMPLEMENTED);
})

app.use(errorHandler);

(async () => {
    try {
        await sequelize.sync({ force: false });
        const server = app.listen(process.env.PORT || 3001);

        console.log(`Server on http://localhost:${process.env.PORT || 3001}`);
        const wss = await createWebSocket(server);
    } catch (error) {
        console.error(error);
    }
})()