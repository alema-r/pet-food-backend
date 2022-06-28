import { Router } from "express";
import { getAllUsers, getUserById} from "../controllers/user.controller";
import { checkAuth, checkPrivileges } from "../middleware/auth.middleware";
import { validateParams } from "../middleware/validation.middleware";
import { Role } from "../models/users";
import { GetParameters } from "../util/parametersInterface";

const userRouter: Router = Router()

userRouter.use(checkAuth);
userRouter.use(checkPrivileges([Role.ADMIN]));

userRouter.get('/', getAllUsers);
userRouter.get('/:id', validateParams([GetParameters.USER_ID]), getUserById);

export default userRouter;