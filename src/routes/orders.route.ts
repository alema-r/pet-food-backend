import { Router } from 'express';
import { createOrder, getAllOrders, getOrderByUuid, getOrderStatus } from '../controllers/order.controller'; 
import { checkAuth, checkPrivileges, hasAccessToOrder } from '../middleware/auth.middleware';
import { Role } from '../models/users';

const orderRouter: Router = Router();

// create new order
orderRouter.post('/', checkAuth, checkPrivileges([Role.USER]), createOrder);
// get all orders
orderRouter.get('/', checkAuth, checkPrivileges([Role.ADMIN]), getAllOrders);
// get order with specified uuid
orderRouter.get('/:uuid', checkAuth, checkPrivileges([Role.ADMIN, Role.USER]), hasAccessToOrder, getOrderByUuid);
// get order status
orderRouter.get('/status/:uuid', getOrderStatus);
// execute order with specified uuid
orderRouter.get('/execute/:uuid');

export default orderRouter;