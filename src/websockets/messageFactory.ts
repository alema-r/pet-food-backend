import { Attributes } from "sequelize/types";
import { Order } from "../models/orders";
import { OrderAttributesExtended } from "./modelsInterface";

export class BaseMessage {
    type?: MessageType;
    message: string;
    timestamp: number;
    uuid: string;
    order?: OrderAttributesExtended;
    food?: string;
    place?: string;
    weight?: number;
    constructor(message: string, uuid: string) {
        this.message = message;
        this.uuid = uuid;
        this.timestamp = Date.now();
    }
}

class ExecutedMessage extends BaseMessage {
    constructor(uuid: string, order: OrderAttributesExtended) {
        super("Execute order", uuid);
        this.type = MessageType.EXECUTE_ORDER;
        this.order = order;

    }
}

class StartMessage extends BaseMessage {
    constructor(uuid: string) {
        super("Order taken in charge", uuid);
        this.type = MessageType.START_ORDER;
    }
}

class CompletedMessage extends BaseMessage {

    constructor(uuid: string) {
        super("Order completed succesfully", uuid);
        this.type = MessageType.COMPLETE_ORDER;
        this.uuid = uuid;
    }
}

class EnterLoadMessage extends BaseMessage {

    constructor(uuid: string, food: string) {
        super("Entering load zone", uuid);
        this.type = MessageType.ENTER_LOAD;
        this.food = food;
    }
}

class ExitLoadMessage extends BaseMessage {

    constructor(uuid: string, food: string) {
        super("Exiting load zone", uuid);
        this.type = MessageType.EXIT_LOAD;
        this.food = food;
    }
}

class EnterDeliverMessage extends BaseMessage {

    constructor(uuid: string, place: string) {
        super("Entering deliver zone", uuid);
        this.type = MessageType.ENTER_DELIVER;
        this.place = place;
    }
}

class ExitDeliverMessage extends BaseMessage {

    constructor(uuid: string, place: string) {
        super("Exiting deliver zone", uuid);
        this.type = MessageType.EXIT_DELIVER;
        this.place = place;
    }
}

export class WeightScaleMessage extends BaseMessage {
    constructor(uuid: string, weight: number) {
        super("Scale measurement", uuid);
        this.type = MessageType.SCALE;
        this.weight = weight;
    }
}

class OrderFailedError extends BaseMessage {
    constructor(uuid: string) {
        super("Order failed", uuid);
        this.type = MessageType.ORDER_FAILED_ERROR;
    }
}

class QuantityErrorMessage extends BaseMessage {
    constructor(uuid: string) {
        super("Quantities do not match", uuid);
        this.type = MessageType.QUANTITY_ERROR;
    }
}

class FoodOrderErrorMessage extends BaseMessage {
    constructor(uuid: string) {
        super("Withdrawal order was not respected.", uuid);
        this.type = MessageType.FOOD_ORDER_ERROR;
    }
}

export enum MessageType {
    EXECUTE_ORDER,
    START_ORDER,
    COMPLETE_ORDER,
    ENTER_LOAD,
    EXIT_LOAD,
    ENTER_DELIVER,
    EXIT_DELIVER,
    SCALE,
    ORDER_FAILED_ERROR,
    QUANTITY_ERROR,
    FOOD_ORDER_ERROR,
}


class MessageFactory {
    getMessage(type: MessageType, uuid: string, order?: OrderAttributesExtended, foodOrPlace?: string, weight?: number): BaseMessage {
        let msg: BaseMessage = new BaseMessage("An error occured", uuid);
        switch (type) {
            case MessageType.SCALE:
                msg = new WeightScaleMessage(uuid, weight!);
                break;
            case MessageType.COMPLETE_ORDER:
                msg = new CompletedMessage(uuid);
                break;

            case MessageType.START_ORDER:
                msg = new StartMessage(uuid);
                break;

            case MessageType.EXECUTE_ORDER:
                msg = new ExecutedMessage(uuid, order!);
                break;

            case MessageType.ENTER_LOAD:
                msg = new EnterLoadMessage(uuid, foodOrPlace!);
                break;

            case MessageType.EXIT_LOAD:
                msg = new ExitLoadMessage(uuid, foodOrPlace!);
                break;

            case MessageType.ENTER_DELIVER:
                msg = new EnterDeliverMessage(uuid, foodOrPlace!);
                break;

            case MessageType.EXIT_DELIVER:
                msg = new ExitDeliverMessage(uuid, foodOrPlace!);
                break;

            case MessageType.ORDER_FAILED_ERROR:
                msg = new OrderFailedError(uuid);
                break;

            case MessageType.QUANTITY_ERROR:
                msg = new QuantityErrorMessage(uuid);
                break;

            case MessageType.FOOD_ORDER_ERROR:
                msg = new FoodOrderErrorMessage(uuid);
                break;

            case MessageType.EXIT_DELIVER:
                msg = new FoodOrderErrorMessage(uuid);
                break;

            default:
                break;
        }
        return msg!;
    }
}

export const messageFactory = new MessageFactory()
