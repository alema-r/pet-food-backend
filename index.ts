import express from "express";
import sequelize from "./src/util/db";
import userRouter from "./src/routes/users.route";
import { register, login } from "./src/controllers/auth.controller";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', userRouter);

app.post('/register', register);
app.post('/login', login);

(async () => {
    try {
        await sequelize.sync({ force: false });
        app.listen(process.env.PORT || 3001);
    } catch (error) {
        console.error(error);
    }
})()