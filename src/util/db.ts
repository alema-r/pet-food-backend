import { Sequelize } from 'sequelize';
import { createAssociations } from './associations';
import { initUser } from '../models/users';
import { initOrder } from '../models/orders';
import { initFood } from '../models/foods';
import { initPlace } from '../models/places';
import { initOrderDetail } from '../models/order_details';
import { initOrderPlace } from '../models/order_places';

const sequelize = new Sequelize(
    process.env.PGDATABASE,
    process.env.PGUSER,
    process.env.PGPASS,
    {
        host: process.env.PGHOST,
        dialect: 'postgres'
    }
);

// initialize all models
[initFood, initUser, initOrder, initPlace, initOrderDetail, initOrderPlace].map(fn => fn(sequelize));

createAssociations(sequelize);

export default sequelize;