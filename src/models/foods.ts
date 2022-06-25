import { CreationOptional, DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { Sequelize } from "sequelize/types";
import { OrderDetail } from "./order_details";

export class Food extends Model<InferAttributes<Food>, InferCreationAttributes<Food>> {
    declare id: CreationOptional<number>;
    declare name: string;

    // Association with OrderDetail
    declare getOrderDetails: HasManyGetAssociationsMixin<OrderDetail>;
    declare addOrderDetail: HasManyAddAssociationMixin<OrderDetail, number>;
    declare addOrderDetails: HasManyAddAssociationsMixin<OrderDetail, number>;
    declare setOrderDetails: HasManySetAssociationsMixin<OrderDetail, number>;
    declare removeOrderDetail: HasManyRemoveAssociationMixin<OrderDetail, number>;
    declare removeOrderDetails: HasManyRemoveAssociationsMixin<OrderDetail, number>;
    declare hasOrderDetail: HasManyHasAssociationMixin<OrderDetail, number>;
    declare hasOrderDetails: HasManyHasAssociationsMixin<OrderDetail, number>;
    declare countOrderDetails: HasManyCountAssociationsMixin;
    declare createOrderDetail: HasManyCreateAssociationMixin<OrderDetail, 'foodId'>;

    declare order_detail?: NonAttribute<OrderDetail>;
}

export const initFood = (sequelize: Sequelize) => {
    Food.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'food',
        timestamps: false
    });
};
