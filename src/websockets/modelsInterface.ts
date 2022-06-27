import { Attributes } from "sequelize/types";
import { Food } from "../models/foods";
import { Order } from "../models/orders";
import { OrderDetail } from "../models/order_details";
import { OrderPlace } from "../models/order_places";
import { Place } from "../models/places";

export interface FoodAttributesExtended extends Attributes<Food> {
    order_detail: Attributes<OrderDetail>;
}

export interface PlaceAttributesExtended extends Attributes<Place> {
    order_place: Attributes<OrderPlace>;
}

export interface OrderAttributesExtended extends Attributes<Order> {
    food: FoodAttributesExtended[];
    places: PlaceAttributesExtended[];
}

