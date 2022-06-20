import { CreationOptional, DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Sequelize } from "sequelize/types";
import { Order } from './orders';

export enum Role {
    ADMIN,
    USER
}

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    // CreationOptional is used because id can be undefined when using autoIncrement
    declare id: CreationOptional<number>;
    declare username: string;
    declare password: string;
    declare role: Role;

    // In typescript we have to manually declare associations
    // Association with Order
    declare getOrders: HasManyGetAssociationsMixin<Order>;
    declare addOrder: HasManyAddAssociationMixin<Order, number>;
    declare addOrders: HasManyAddAssociationsMixin<Order, number>;
    declare setOrders: HasManySetAssociationsMixin<Order, number>;
    declare removeOrder: HasManyRemoveAssociationMixin<Order, number>;
    declare removeOrders: HasManyRemoveAssociationsMixin<Order, number>;
    declare hasOrder: HasManyHasAssociationMixin<Order, number>;
    declare hasOrders: HasManyHasAssociationsMixin<Order, number>;
    declare countOrders: HasManyCountAssociationsMixin;
    declare createOrder: HasManyCreateAssociationMixin<Order, 'userId'>;
}

// this interface will come in handy when dealing with requests
export interface UserCreateModel {
    username: string;
    password: string;
    role: Role;
}

export const initUser = (sequelize: Sequelize) => {
    User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                is: /^[0,1]{1}$/
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'user'
    });
};