import { Router } from "express";
import { getAllUsers, getUserById} from "../controllers/user.controller";
import { checkAuth, checkPrivileges } from "../middleware/auth.middleware";
import { Role } from "../models/users";

const userRouter: Router = Router()

userRouter.use(checkAuth);
userRouter.use(checkPrivileges([Role.ADMIN]));

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);

export default userRouter;