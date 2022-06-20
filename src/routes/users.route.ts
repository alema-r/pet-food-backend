import express from "express";
import { getAllUsers, getUserById} from "../controllers/user.controller";

const userRouter = express.Router()

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);

export default userRouter;