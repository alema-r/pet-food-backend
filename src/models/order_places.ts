import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { Sequelize } from "sequelize/types";
import { Order } from './orders';
import { Place } from './places';

export class OrderPlace extends Model<InferAttributes<OrderPlace>, InferCreationAttributes<OrderPlace>> {
    declare quantity_to_deliver: number;

    declare orderUuid: ForeignKey<Order['uuid']>;
    declare placeId: ForeignKey<Place['id']>;
}

export const initOrderPlace = (sequelize: Sequelize) => {
    OrderPlace.init({
        quantity_to_deliver: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'order_place',
        timestamps: false
    });
};
