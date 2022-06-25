import { CreationOptional, DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { OrderPlace } from "./order_places";
import { Sequelize } from "sequelize/types";

export class Place extends Model<InferAttributes<Place>, InferCreationAttributes<Place>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare area: string;
    declare coords: any;

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
    declare createOrderPlace: HasManyCreateAssociationMixin<OrderPlace, 'placeId'>;

    declare order_place?: NonAttribute<OrderPlace>;
}

export const initPlace = (sequelize: Sequelize) => {
    Place.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        area: {
            type: DataTypes.STRING,
            allowNull: false
        },
        coords: {
            type: DataTypes.GEOMETRY('POINT'),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'place',
        timestamps: false
    });
};