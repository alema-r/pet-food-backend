import express from "express";
import sequelize from "./src/util/db";
import userRouter from "./src/routes/users.route";
import { register, login } from "./src/controllers/auth.controller";
import { errorHandler } from "./src/middleware/error-handler.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', userRouter);
app.use(errorHandler);
app.post('/register', register);
app.post('/login', login);

(async () => {
    try {
        await sequelize.sync({ force: true });
        app.listen(process.env.PORT || 3001);
        console.log(`Server on http://localhost:${process.env.port || 3001}`);
    } catch (error) {
        console.error(error);
    }
})()