import express from "express";
import sequelize from "./src/util/db";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


(async () => {
    try {
        await sequelize.sync({ force: true });
        console.log("test");
        app.listen(process.env.PORT || 3001);
    } catch (error) {
        console.error(error);
    }
})()