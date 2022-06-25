import { OrderItem } from "sequelize/types";
import { Order } from "../models/orders";

export class BaseMessage {
    type?: MessageType;
    message: string;
    timestamp: number;
    uuid: string;
    order?: Order;
    food?: string;
    place?: string;
    constructor(message: string, uuid: string) {
        this.message = message;
        this.uuid = uuid;
        this.timestamp = Date.now();
    }
}

class ExecutedMessage extends BaseMessage {
    constructor(uuid: string, order: Order) {
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


export enum MessageType {
    EXECUTE_ORDER,
    START_ORDER,
    COMPLETE_ORDER,
    ENTER_LOAD,
    EXIT_LOAD,
    ENTER_DELIVER,
    EXIT_DELIVER
}


class MessageFactory {
    getMessage(type: MessageType, uuid: string, order?: Order, foodOrPlace?: string): BaseMessage {
        let msg: BaseMessage | null = null;
        switch (type) {
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

            default:
                break;
        }
        return msg!;
    }
}

export const messageFactory = new MessageFactory()


/*
interface BaseMessage {
    message: string;
    timestamp: number
}

interface OrderMessage {
    type: MessageType.EXECUTE_ORDER;
    order: Order;
}

interface CompleteMessage extends BaseMessage {
    type: MessageType.COMPLETE_ORDER;
}

interface FoodMessage extends BaseMessage {
    type: MessageType.ENTER_LOAD | MessageType.EXIT_LOAD;
    food: string;
}

interface PlaceMessage extends BaseMessage {
    type: MessageType.ENTER_DELIVER | MessageType.EXIT_DELIVER;
    place: string;
}




export interface WsMessage {
    type: MessageType;
    order_uuid: string;
    food?: string;
    place?: string;
    //message: string;
    //args: string;
    //scale: number
    timestamp?: Date;
}
*/