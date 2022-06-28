import { WebSocket } from "ws";
import { Server } from "http";
import { OrderStatus } from "../models/orders";
import { Subject, Subscription } from "rxjs";
import { BaseMessage, messageFactory, MessageType } from "./messageFactory";
import { updateOrderStatus } from "../controllers/order.controller";
import { FoodAttributesExtended, OrderAttributesExtended, PlaceAttributesExtended } from "./modelsInterface";

// Subject where to push events to execute
export let executedOrderStream$: Subject<BaseMessage> = new Subject();

/**
 * Sends an error message to the client and closes the connection.
 * @param ws the WebSocket
 * @param type {@link MessageType}
 * @param uuid uuid of the order
 */
const sendErrorMessage = (ws: WebSocket, type: MessageType, uuid: string) => {
    const msg = messageFactory.getMessage(type, uuid);
    ws.send(JSON.stringify(msg));
    ws.close();
}

/**
 * Creates a websocket server and attaches it to the server on the path "/websockets"
 * @param server `http.Server` ( in this case the express.Server)
 * @returns a websocket server
 */
export async function createWebSocket(server: Server) {
    const wss = new WebSocket.Server({ noServer: true, path: "/websockets" });

    server.on("upgrade", (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (websocket) => {
            wss.emit("connection", websocket, request);
        })
    })

    wss.on('connection', function connection(ws) {
        console.log("ws: connection");
        let check: CheckOrder;
        const sub = executedOrderStream$.subscribe((msg) => {
            ws.send(JSON.stringify(msg));
            console.log(`Requested execution of order with uuid: ${msg.uuid}`);
            check = new CheckOrder(msg.order!);
        });


        ws.on('message', function message(data: string) {
            const msg: BaseMessage = JSON.parse(data);
            console.log('received: %s', msg);
            switch (msg.type!) {
                case MessageType.START_ORDER:
                    check.updateStatus(OrderStatus.RUNNING);
                    break;

                case MessageType.SCALE:
                    if (!check.updateLastMeasurement(msg.weight!)) {
                        sendErrorMessage(ws, MessageType.QUANTITY_ERROR, msg.uuid);
                        sub.unsubscribe();
                        check.updateStatus(OrderStatus.FAILED);
                    };
                    break;

                case MessageType.ENTER_LOAD:
                    if (!check.checkWithdrawalOrder(msg.food!)) {
                        sendErrorMessage(ws, MessageType.FOOD_ORDER_ERROR, msg.uuid);
                        sub.unsubscribe();
                        check.updateStatus(OrderStatus.FAILED);
                    }
                    break;

                case MessageType.EXIT_LOAD:
                    if (!check.checkWithdrawnQuantities()) {
                        sendErrorMessage(ws, MessageType.QUANTITY_ERROR, msg.uuid);
                        sub.unsubscribe();
                        check.updateStatus(OrderStatus.FAILED);
                    };
                    break;

                case MessageType.ENTER_DELIVER:
                    check.updateLastPlace(msg.place!);
                    break;

                case MessageType.EXIT_DELIVER:
                    if (!check.checkDeliveredQuantities()) {
                        sendErrorMessage(ws, MessageType.QUANTITY_ERROR, msg.uuid);
                        sub.unsubscribe();
                        check.updateStatus(OrderStatus.FAILED);
                    };
                    break;

                case MessageType.COMPLETE_ORDER:
                    if (check.checkIfFinished()) check.updateStatus(OrderStatus.COMPLETED);
                    else sendErrorMessage(ws, MessageType.ORDER_FAILED_ERROR, msg.uuid);
                    sub.unsubscribe();
                    break;

                case MessageType.ORDER_FAILED_ERROR:
                    check.updateStatus(OrderStatus.FAILED);
                    sub.unsubscribe();
                    break;

                default:
                    break;
            }
        });

        ws.on("error", function(err) {
            console.log('Received error: ', err);
            ws.close();
            sub.unsubscribe();
        })

        ws.on("close", function(code, reason){
            console.log('Received close event', {code, reason});
            sub.unsubscribe();
        })

    });

    return wss;
}


/**
 * Class to perform checks on the execution of the order
 */
class CheckOrder {
    order: OrderAttributesExtended;
    foods: FoodAttributesExtended[];
    places: PlaceAttributesExtended[];
    lastMeasurement: number;
    lastWeight: number;
    lastFood?: FoodAttributesExtended;
    lastPlace?: PlaceAttributesExtended;

    
    constructor(order: OrderAttributesExtended) {
        this.order = order;
        this.foods = this.order.food!.sort((a: FoodAttributesExtended, b: FoodAttributesExtended) => {
            const ordA = a.order_detail!.withdrawal_order;
            const ordB = b.order_detail!.withdrawal_order;
            return (ordA - ordB);
        })
        this.places = this.order.places;
        this.lastMeasurement = 0;
        this.lastWeight = 0;
    }

    /**
     * Check if the food withdrawn is the correct one
     * @param foodName the name of the food
     * @returns a boolean
     */
    checkWithdrawalOrder(foodName: string) {
        const food = this.foods.find((elem) => elem.name === foodName);
        if (!food || this.foods.indexOf(food) !== 0) {
            return false;
        }
        else {
            this.lastFood = this.foods.shift();
            return true;
        }
    }

    /**
     * Check if the withdrawn quantities are within a predefined tolerance
     * @returns a boolean
     */
    checkWithdrawnQuantities() {
        const expectedQuantity = this.lastFood!.order_detail.quantity;
        const tolerance = expectedQuantity * parseInt(process.env.N) / 100;
        if (this.lastWeight >= expectedQuantity - tolerance && this.lastWeight <= expectedQuantity + tolerance) return true;
        else return false;
    }

    /**
     * Updates the last place visited
     * @param place the name of the place
     */
    updateLastPlace(place: string) {
        this.lastPlace = this.places.splice(this.places.findIndex((elem) => elem.name === place), 1)[0];
    }

    /**
     * Updates the `lastWeight` and `lastMeasuremnt` values
     * @param value the new value obtained
     * @returns false if `value` is < 0, else true
     */
    updateLastMeasurement(value: number) {
        if (value < 0) return false;
        else if (value > this.lastMeasurement) {
            this.lastWeight = value - this.lastMeasurement;
        }
        else if (value < this.lastMeasurement) {
            this.lastWeight = this.lastMeasurement - value;
        }
        this.lastMeasurement = value;
        return true;
    }

    /**
     * Check if the delivered quantities are within a predefined tolerance
     * @returns a boolean
     */
    checkDeliveredQuantities() {
        const expectedQuantity = this.lastPlace!.order_place.quantity_to_deliver;
        const tolerance = expectedQuantity * parseInt(process.env.N) / 100;
        if (this.lastWeight >= expectedQuantity - tolerance && this.lastWeight <= expectedQuantity + tolerance) return true;
        else return false;
    }

    /**
     * Check if the order has been completed correctly, by checking food picked up and delivery locations
     * @returns a boolean
     */
    checkIfFinished() {
        return ((this.foods.length === 0 && this.places.length === 0) ? true : false);
    }

    /**
     * Updates the status of the order.
     * {@see updateOrderStatus}
     * @param status the new status 
     */
    updateStatus(status: OrderStatus) {
        updateOrderStatus(this.order.uuid, status).then(() => console.log(`Status of order ${this.order.uuid} updated succesfully.`));
    }

}