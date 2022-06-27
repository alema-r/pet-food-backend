import { finalize, from, delay, concatMap, of, Subject, concat, interval, startWith, combineLatest, Observable, merge, takeUntil, map, tap, generate } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import WebSocket from 'ws';
import { BaseMessage, messageFactory, MessageType } from './messageFactory';
import { Food } from '../models/foods';
import { Place } from '../models/places';
import { implementsStructure } from '../util/parametersInterface';
import { Attributes } from 'sequelize/types';
import { FoodAttributesExtended, OrderAttributesExtended, PlaceAttributesExtended } from './modelsInterface';

const WebSocketConstructor = WebSocket;

// The only way I've found to work with client websockets in typescript :)
// @ts-ignore
const eventClient: WebSocketSubject<BaseMessage> = webSocket({ url: `ws://localhost:${process.env.PORT || 3001}/websockets`, WebSocketCtor: WebSocketConstructor });

/**
 * Class used to imitate the execution flow of an order
 */
class OrderExecution {
    order: OrderAttributesExtended;
    scaleSubject$: Subject<number>;
    //
    scaleWeight: number;
    foodObs$: Observable<FoodAttributesExtended>;
    placeObs$: Observable<PlaceAttributesExtended>;
    private unsubscribe$: Subject<void> = new Subject();

    /**
     * The constructor
     * @param order the order that we are executing
     * @param quantityError if true, will change the food quantities of the order to generate an error from the server
     * @param wrongOrderError if true, will change the order of withdrawal of food, generating an error from the server
     */
    constructor(order: OrderAttributesExtended, quantityError?: boolean, wrongOrderError?: boolean) {
        this.order = order;
        this.scaleSubject$ = new Subject();
        this.scaleWeight = 0;

        // quantities withdrawn will exceed the maximum threshold
        if (quantityError) {
            this.foodObs$ = from(
                this.order.food
                    .sort(
                        (a: FoodAttributesExtended, b: FoodAttributesExtended) => {
                            const ordA = a.order_detail.withdrawal_order;
                            const ordB = b.order_detail.withdrawal_order;
                            return (ordA - ordB);
                        }
                    )
            ).pipe(
                map(elem => (
                    // we change the quantity to withdraw
                    {
                        ...elem,
                        order_detail: {
                            ...elem.order_detail,
                            quantity: 0//(elem.order_detail.quantity + (elem.order_detail.quantity * parseInt(process.env.N) / 100) + 1)
                        }
                    }
                )),
                tap(x => console.log(x)),
                // delay each item emission of the observable by 3 sec 
                concatMap(item => of(item).pipe(delay(3000))),
                // delay start time by 1 sec
                delay(1000),
            );
        }

        // Food will be picked up in the wrong order
        else if (wrongOrderError) {
            this.foodObs$ = from(
                this.order.food
                    .sort((a: FoodAttributesExtended, b: FoodAttributesExtended) => {
                        const ordA = a.order_detail.withdrawal_order;
                        const ordB = b.order_detail.withdrawal_order;
                        return (ordA - ordB);
                    })
                    .reverse()
            ).pipe(
                // delay each item emission of the observable by 3 sec 
                concatMap(item => of(item).pipe(delay(3000))),
                // delay start time by 1 sec
                delay(1000),
            );
        }

        // Normal execution
        else {
            this.foodObs$ = from(
                this.order.food
                    .sort((a: FoodAttributesExtended, b: FoodAttributesExtended) => {
                        const ordA = a.order_detail.withdrawal_order;
                        const ordB = b.order_detail.withdrawal_order;
                        return (ordA - ordB);
                    })
            ).pipe(
                // delay each item emission of the observable by 3 sec 
                concatMap(item => of(item).pipe(delay(3000))),
                // delay start time by 1 sec
                delay(1000),
            );
        }

        this.placeObs$ = from(
            this.order.places
        ).pipe(
            // delay each item emission of the observable by 3 sec 
            concatMap(item => of(item).pipe(delay(3000))),
            delay(1000),
        );
    }

    /**
     * Updates the weight of the scale
     * @param value the value to be added
     */
    updateScale(value: number) {
        this.scaleWeight = this.scaleWeight + value;
        //console.log(`Updated weight: ${this.scaleWeight}`);
        this.scaleSubject$.next(this.scaleWeight);
    }

    /**
     * Notifies the server by sending messages based on the type of input.
     * See {@link implementsStructure}
     * @param v the value to send
     */
    sendUpdates(v: number | any) {
        if (typeof v === "number") {
            eventClient.next(messageFactory.getMessage(MessageType.SCALE, this.order.uuid, undefined, undefined, v))
        }

        else if (implementsStructure<FoodAttributesExtended, keyof FoodAttributesExtended>(v, ["name", "order_detail"])) {
            setTimeout(() => {
                eventClient.next(messageFactory.getMessage(MessageType.ENTER_LOAD, this.order.uuid, undefined, v.name));
                this.updateScale(v.order_detail!.quantity);
                setTimeout(() => {
                    eventClient.next(messageFactory.getMessage(MessageType.EXIT_LOAD, this.order.uuid, undefined, v.name));

                }, 1000)
            }, 2000)
        }
        else if (implementsStructure<PlaceAttributesExtended, keyof PlaceAttributesExtended>(v, ["name", "order_place"])) {
            setTimeout(() => {
                eventClient.next(messageFactory.getMessage(MessageType.ENTER_DELIVER, this.order.uuid, undefined, v.name));
                this.updateScale(-v.order_place!.quantity_to_deliver);
                setTimeout(() => {
                    eventClient.next(messageFactory.getMessage(MessageType.EXIT_DELIVER, this.order.uuid, undefined, v.name));

                }, 1000);
            }, 2000)
        }

    }

    /**
     * Started the execution of the order.
     * First creates an observable by merging two observables, then it subscribes to it.
     */
    start() {
        eventClient.next(messageFactory.getMessage(MessageType.START_ORDER, this.order.uuid));
        merge(
            // with concat, `this.placeObs$` will start only after `this.foodObs$` completes
            concat(this.foodObs$, this.placeObs$).pipe(
                // when both the observable completes, call `this.end()`
                finalize(() => this.end())
            ),
            combineLatest([
                // set the first value of the scale to 0
                this.scaleSubject$.pipe(startWith(0)),
                interval(1000)
            ],
                // take values only from the first observable. In this way we can emit values every second.
                // if no new value has been provided by the first observable, it will output the last one.
                (first, second) => first),
        ).pipe(
            // We use `takeUntil` in order to unsubscribe from the observable on demand.
            // Otherwise the observable will continue emitting value because of `interval`
            takeUntil(this.unsubscribe$)
        ).subscribe({
            next: (value: PlaceAttributesExtended | FoodAttributesExtended | number) => {
                this.sendUpdates(value);
            },
            error: (err: any) => {
                eventClient.error({ code: 4000, message: err });
            }
        });

    }

    /**
     * End the subscription and sends an error to the server.
     */
    endWithError() {
        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();
        //eventClient.next(messageFactory.getMessage(MessageType.ORDER_FAILED_ERROR, this.order.uuid));
        eventClient.error({ code: 4000, message: "Order stopped due to error" });
    }

    /**
     * Ends the subscription and sends a message of completion to the server.
     */
    end() {
        setTimeout(() => {
            this.unsubscribe$.next();
            this.unsubscribe$.unsubscribe();
            eventClient.next(messageFactory.getMessage(MessageType.COMPLETE_ORDER, this.order.uuid));
            console.log("Order completed");
        }, 4000);
    }
}

try {
    let orderExec: OrderExecution;
    eventClient.subscribe({
        next: (msg: BaseMessage) => {
            console.log('received: %s', msg);
            if (msg.type! === MessageType.EXECUTE_ORDER) {
                orderExec = new OrderExecution(msg.order!); //Normal execution
                //orderExec = new OrderExecution(msg.order!, true); //quantity error
                //orderExec = new OrderExecution(msg.order!, undefined, true); //order error
                orderExec.start();
            }
            else if (msg.type! === MessageType.ORDER_FAILED_ERROR) {
                orderExec.endWithError();
            };
        },
        error: err => {
            console.log(err);
            orderExec.endWithError();
        },
        complete: () => console.log("complete")
    });

} catch (error) {
    console.log(error);
}
