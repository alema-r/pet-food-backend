import { WebSocket } from "ws";
import { Server } from "http";
import { Order, OrderStatus } from "../models/orders";
import { Subject } from "rxjs";
import { BaseMessage, MessageType } from "./messageFactory";
import { updateOrderStatus } from "../controllers/order.controller";

export let executedOrderStream: Subject<BaseMessage> = new Subject();

export async function createWebSocket(server: Server) {
    const wss = new WebSocket.Server({ noServer: true, path: "/websockets"});

    server.on("upgrade", (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (websocket) => {
            wss.emit("connection", websocket, request);
        })
    })

    wss.on('connection', function connection(ws) {
        console.log("ws: connection");
        executedOrderStream.subscribe( (msg) => { ws.send(JSON.stringify(msg)); console.log(`Started execution of order with uuid: ${msg.uuid}`) });

        ws.on('message', function message(data: string) {
            const msg: BaseMessage = JSON.parse(data);
            console.log('received: %s', msg);
            switch (msg.type!) {
                case MessageType.START_ORDER:
                    updateOrderStatus(msg.uuid, OrderStatus.RUNNING);
                case MessageType.ENTER_LOAD:
                    //verifyWithdrawalOrder();
                    break;
                case MessageType.EXIT_LOAD:
                    break;
                case MessageType.ENTER_DELIVER:
                    break;
                case MessageType.EXIT_DELIVER:
                    break;
                case MessageType.COMPLETE_ORDER:
                    updateOrderStatus(msg.uuid, OrderStatus.COMPLETED);
                    break;
                default:
                    break;
            }
        });
    });

    return wss;
}


