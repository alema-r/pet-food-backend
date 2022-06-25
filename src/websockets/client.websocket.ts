import { finalize, Observer, from, delay, concatMap, of, bindCallback } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Order } from "../models/orders";
import WebSocket from 'ws';
import { BaseMessage, messageFactory, MessageType } from './messageFactory';
import { Food } from '../models/foods';
import { Place } from '../models/places';


export interface WsScale {
    order_uuid: string;
    value: number;
}

const WebSocketConstructor = WebSocket;

// The only way I've found to work with client websockets in typescript :)
// @ts-ignore
const eventClient: WebSocketSubject<BaseMessage> = webSocket({ url: `ws://localhost:${process.env.PORT || 3001}/websockets`, WebSocketCtor: WebSocketConstructor });
// @ts-ignore
//const weightScaleClient = webSocket({ url: `ws://localhost:${process.env.PORT || 3001}/websockets`, WebSocketCtor: WebSocketConstructor });


function sendFoodMsg(f: Food) {
    setTimeout(() => {
        eventClient.next(messageFactory.getMessage(MessageType.ENTER_LOAD, f.order_detail!.orderUuid, undefined, f.name));
        setTimeout(() => {
            eventClient.next(messageFactory.getMessage(MessageType.EXIT_LOAD, f.order_detail!.orderUuid, undefined, f.name));
        }, 1000)
    }, 2000)

}


function sendPlaceMsg(p: Place) {
    eventClient.next(messageFactory.getMessage(MessageType.ENTER_DELIVER, p.order_place!.orderUuid, undefined, p.name));
    eventClient.next(messageFactory.getMessage(MessageType.EXIT_DELIVER, p.order_place!.orderUuid, undefined, p.name));
}

const foodObserver: Observer<Food> = {
    next: (f: Food) => sendFoodMsg(f),//console.log(`Food ${x.name}, ${x.order_detail!.withdrawal_order}`),
    error: (err: any) => console.log(err),
    complete: () => console.log("complete food sub")
};

const placeObserver: Observer<Place> = {
    next: (p: Place) => sendPlaceMsg(p),//console.log(`Place: ${x.name}, ${x.order_place}`),
    error: (err: any) => console.log(err),
    complete: () => console.log("complete place sub")
}


async function startOrder(order: Order) {
    //console.log(order.food![0].order_detail);
    eventClient.next(messageFactory.getMessage(MessageType.START_ORDER, order.uuid));
    
    const placeObs = from(order.places!).pipe(
        // delay each item emission of the observable for 6 sec 
        concatMap(item => of(item).pipe(delay(6000))),
        delay(2000),
        finalize(() => eventClient.next(messageFactory.getMessage(MessageType.COMPLETE_ORDER, order.uuid))));

    const foodObs = from(order.food!.sort((a: Food, b: Food) => {
        const ordA = a.order_detail!.withdrawal_order;
        const ordB = b.order_detail!.withdrawal_order;
        return (ordA - ordB);
    })).pipe(
        // delay each item emission of the observable for 6 sec 
        concatMap(item => of(item).pipe(delay(6000))),
        // delay start time by 6 sec
        delay(4000),
        // subscribe to `placeObs` observer when finished
        finalize(() => placeObs.subscribe(placeObserver))
    );

    foodObs.subscribe(foodObserver)
}



try {
    eventClient.subscribe({
        next: async (msg: BaseMessage) => {
            if (msg.type! === MessageType.EXECUTE_ORDER) startOrder(msg.order!);
        },
        error: err => console.log(err),
        complete: () => console.log("complete")
    });
} catch (error) {
    console.log(error);
}
