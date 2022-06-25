import { CreationOptional, DataTypes, ForeignKey, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import { Sequelize } from "sequelize/types";
import { Food } from './foods';
import { OrderDetail } from './order_details';
import { OrderPlace } from './order_places';
import { Place } from './places';
import { User } from './users';

export enum OrderStatus {
    'CREATED',
    'FAILED',
    'RUNNING',
    'COMPLETED'
}

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
    declare uuid: CreationOptional<string>;
    declare status: OrderStatus;

    declare userId: ForeignKey<User['id']>;

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
    declare createOrderDetail: HasManyCreateAssociationMixin<OrderDetail, 'orderUuid'>;

    // Association with OrderPlace
    declare getOrderPlaces: HasManyGetAssociationsMixin<OrderPlace>;
    declare addOrderPlace: HasManyAddAssociationMixin<OrderPlace, number>;
    declare addOrderPlaces: HasManyAddAssociationsMixin<OrderPlace, number>;
    declare setOrderPlaces: HasManySetAssociationsMixin<OrderPlace, number>;
    declare removeOrderPlace: HasManyRemoveAssociationMixin<OrderPlace, number>;
    declare removeOrderPlaces: HasManyRemoveAssociationsMixin<OrderPlace, number>;
    declare hasOrderPlace: HasManyHasAssociationMixin<OrderPlace, number>;
    declare hasOrderPlaces: HasManyHasAssociationsMixin<OrderPlace, number>;
    declare countOrderPlaces: HasManyCountAssociationsMixin;
    declare createOrderPlace: HasManyCreateAssociationMixin<OrderPlace, 'orderUuid'>;

    declare food?: NonAttribute<Food[]>;
    declare places?: NonAttribute<Place[]>;
}

export const initOrder = (sequelize: Sequelize) => {
    Order.init({
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                is: /^[0,1,2,3]{1}$/
            }
        }
    }, {
        sequelize,
        modelName: 'order'
    });
};