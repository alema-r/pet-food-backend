import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { Sequelize } from "sequelize/types";
import { Food } from "./foods";
import { Order } from "./orders";

export class OrderDetail extends Model<InferAttributes<OrderDetail>, InferCreationAttributes<OrderDetail>> {
    declare quantity: number;
    
    declare orderUuid: ForeignKey<Order['uuid']>;
    declare foodId: ForeignKey<Food['id']>;
}

export const initOrderDetail = (sequelize: Sequelize) => {
    OrderDetail.init({
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'order_detail'
    });
};