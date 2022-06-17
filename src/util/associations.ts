import { Sequelize } from "sequelize/types";

export function createAssociations(sequelize: Sequelize) {
    const { user, food, order, place, order_detail, order_place } = sequelize.models;
    console.log(sequelize.models)
    user.hasMany(order);
    order.belongsTo(user);

    food.belongsToMany(order, { through: order_detail });
    order.belongsToMany(food, { through: order_detail });

    place.belongsToMany(order, { through: order_place });
    order.belongsToMany(place, { through: order_place });
}