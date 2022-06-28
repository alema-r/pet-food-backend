import { Router } from 'express';
import { createOrder, executeOrder, getAllOrders, getOrderByUuid, getOrderStatus } from '../controllers/order.controller'; 
import { checkAuth, checkPrivileges, hasAccessToOrder } from '../middleware/auth.middleware';
import { Role } from '../models/users';
import { validateParams } from '../middleware/validation.middleware';
import { GetParameters, PostParameters } from '../util/parametersInterface';

const orderRouter: Router = Router();

// create new order
orderRouter.post('/', checkAuth, checkPrivileges([Role.USER]), validateParams([PostParameters.ORDER_DETAIL, PostParameters.ORDER_PLACE]), createOrder);
// get all orders
orderRouter.get('/', checkAuth, checkPrivileges([Role.ADMIN]), getAllOrders);
// get order with specified uuid
orderRouter.get('/:uuid', checkAuth, checkPrivileges([Role.ADMIN, Role.USER]), validateParams([GetParameters.UUID]), hasAccessToOrder, getOrderByUuid);
// get order status
orderRouter.get('/status/:uuid', validateParams([GetParameters.UUID]), getOrderStatus);
// execute order with specified uuid
orderRouter.get('/execute/:uuid', checkAuth, checkPrivileges([Role.ADMIN, Role.USER]),  validateParams([GetParameters.UUID]), hasAccessToOrder, executeOrder);

export default orderRouter;