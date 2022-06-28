# Pet food workflow

## Table of contents
1. [Project Goal](#project-goal)
2. [Design](#design)
3. [Prerequisites](#prerequisites)
3. [Usage](#usage)
4. [Test](#test)

## Project Goal
The goal of this project is to manage a workflow reguarding the withdrawal of foods that will be used to produce pet food. In particular, an operator carries out operations in the right sequence by loading the defined quantities of some foods, mix them together and finally delivers the result to some deliver places.

This will be managed by an [Express]() backend server paired with a websocket server.
Furthermore, it is also provided a websocket client to generate data and test the interaction.

The express backend has to manage:
- Order creation and execution
- Checking the status of the order
- Store order and user data in a [PostgreSQL](https://www.postgresql.org/) database (Using [Sequelize](https://sequelize.org/))
- User registration / login (to obtain the JWT token)

The websocket client will generate two different types of events:
- Events related to the collection and delivery process
- Events emitted by a weight scale on board of the veichle every second

The backend has also the job of checking (based on the websocket events) if:
- loading sequence of foods was not respected
- quantities loaded differs from the requested quantities by a percent value N stored in the .env file

## Design

The backend is divided in the following modules:
- models: models of the DB tables
- controllers: controllers used to perform action on models 
- routes: routes grouped by topic
- middleware: contains all the middlewares of the application 
- util: connection to the db and interfaces for requests
- websockets: websocket client and server implementation
- errors: custom HTTP errors

The whole project is written in TypeScript to take advantages of type checks and to enhance safety and readability of the code.

### Design of the database
![Database](img/db.png)


### UML Diagrams
- Use case diagram:

![Use Cases diagram](img/UseCases.png)

For simplicity, only the most important sequence diagrams were provided.

- Create order sequence diagram:

![Create order sequence diagram](img/CreateOrderDiagram.png)

- Execute order sequence diagram:

![Execute order sequence diagram](img/ExecuteOrderDiagram.png)

- Detailed sequence diagram of communication between websockets:

![Websockets communication sequence diagram](img/wsSequence.png)


### Design Pattern

**Middleware**
The middleware pattern was used to handle various control on the HTTP requests. It's the pattern utilized by Express and it's useful to separate the responsibilities of the components by assigning to each one a specific function. In particular, we have three middlewares:
- auth middleware
- validation middleware
- error handler middleware

The auth middleware is responsible for:
- checking the existence and validity of the JWT token
- checking if a user have the necessary privileges (by checking role or property of an order)

The validation middleware is responsible for validating the parameters passed to a POST or GET request. In this case, no use was made of packages to check the vality of parameters. The `implementsStructure` function is noteworthy. Since parameters passed through POST request adhere to ad-hoc interfaces, we could not check at runtime if the passed value implements or not the interface. This is the goal accomplished by `implementsStructure`:
```ts
function implementsStructure<T, K extends keyof T>(obj: any, props: K[], types?: string[]): obj is T {
    if (!obj) return false;
    // check if properties exists
    const checkExistence = props.reduce((prevProp, nextProp) => prevProp && nextProp in obj, true);
    if(!checkExistence) return false;
    // check types of properties, if types were provided
    if (types !== undefined) {
        const checkType = Object.values(obj).map((value, index) => typeof value === types[index]);
        if(checkType.some( (elem) => elem === false)) return false;
    }
    return true;
}
```

Using [generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) we can implement a function that checks for property existence and type. 

The error handler middleware is a special middleware that is the last used by the app. Its goal is to return errors occured in the previous middlewares. To create errors, a factory is used. 

**Factory**

The factory pattern is used two times here: to create HTTP errors and to create websocket messages. This pattern allows us to create an object without having to specify the exact class.

In detail, for HTTP errors we have:
- an enum that specifies all the HTTP status code 
- a base class `HttpError` which extends the Error class and defines two properties: status code and message
- the specific classes that extends HttpError and that are created by the factory, by passing the value of an enum (EnumError)

The same pattern was used to handle websockets messages. By doing this `eventClient` and `executedOrderStream` are subjects about `BaseMessage` (that is messages base class). In this way, not only we no longer have to worry about the creation process but also we can take advantages of the known structures of the messages when receiving them, filtering by their type.


**Observer**

The observer pattern was used in the execution of the order. Like stated above we have two subjects: one is responsible to send execution order requests, the other one is implemented by the websocket client. A subject is at the same time an Observer and an Observable: you can subscribe to it and you can send it values.

Moreover, observables are used by the websocket client to emit event based on the particular order that we are processing.

[RxJS](https://rxjs.dev/) library has been used to add the support for obesrvables.

## Prerequisites

To run this app, you must have the following installed:
- [Node.js/npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Docker/Docker-compose

## Usage

1. Clone the project and cd to the directory:

```git clone https://github.com/alema-r/pet_food.git && cd pet_food```

2. Run and build docker-compose:

```docker-compose up --build```

3. Run the `seed.sh` script:

```./seed.sh```

This will run all the migrations and seed utilizing [sequelize-cli](https://github.com/sequelize/cli).

The app will now listen to the port 3000.

### Seeds and migrations

The sequelize-cli custom configuration can be found in the file `.sequelizerc`
Seeds and migrations can be found, respectevely, in /dist/src/db/seeders and /dist/src/db/migrations

### Websocket Client

The script `start-ws-client.sh` is used to run the websocket client.

It will behave differently based on the argument passed:
- no argument: it starts a normal client
- argument=1: it starts a client that will send wrong quantities
- argument=2: it starts a client that will withdraw foods in the wrong order

## Test

To test the project you can use the Postman collection in the repo.

In the responses some objects are omitted for the sake of brevity (represented with `...`).

### Admin user

- GET /orders
```
curl http://localhost:3000/orders -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOjAsImlhdCI6MTY1NjQxMDA2MH0.U8Qizgywf2wHXsnAxwIMYKEhCPMtmszfWi4TbzeOVMo'
```

Response: 
```json
[
    {
        "uuid":"d2bfc481-a9cf-473c-a6ce-501379fb2cfc","status":1,"createdAt":"2022-06-28T12:36:42.512Z","updatedAt":"2022-06-28T12:37:09.293Z",
        "userId":2,
        "food":
            [
                {
                    "id":4,"name":"Tuna",
                    "order_detail":
                    {
                        "quantity":15,
                        "withdrawal_order":2,
                        "foodId":4,
                        "orderUuid":"d2bfc481-a9cf-473c-a6ce-501379fb2cfc"
                    }
                },
                ...
            ],
            "places":
            [
                {
                    "id":1,
                    "name":"Deliver Place 1",
                    "area":"Ancona",
                    "coords":
                    {
                        "crs":
                        {
                            "type":"name","properties":{"name":"EPSG:4326"}
                        },
                        "type":"Point",
                        "coordinates":[43.545121,13.509598]
                    },
                    "order_place":
                    {
                        "quantity_to_deliver":5,
                        "placeId":1,
                        "orderUuid":"d2bfc481-a9cf-473c-a6ce-501379fb2cfc"
                    }
                },
                ...
            ]
    } 
    ...
]
```

- GET orders/:uuid
```
curl http://localhost:3000/orders/d2bfc481-a9cf-473c-a6ce-501379fb2cfc -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOjAsImlhdCI6MTY1NjQxMDA2MH0.U8Qizgywf2wHXsnAxwIMYKEhCPMtmszfWi4TbzeOVMo'
```
Response:

```json
{
    "uuid":"d2bfc481-a9cf-473c-a6ce-501379fb2cfc",
    "status":1,
    "createdAt":"2022-06-28T12:36:42.512Z",
    "updatedAt":"2022-06-28T12:37:09.293Z",
    "userId":2,
    "food":[
        {
            "id":1,
            "name":"Rice",
            "order_detail":{
                "quantity":10,
                "withdrawal_order":1,
                "foodId":1,
                "orderUuid":"d2bfc481-a9cf-473c-a6ce-501379fb2cfc"
            }
        },
        {
            "id":4,
            "name":"Tuna",
            "order_detail":{
                "quantity":15,
                "withdrawal_order":2,
                "foodId":4,
                "orderUuid":"d2bfc481-a9cf-473c-a6ce-501379fb2cfc"
            }
        }
    ],
    "places":[
        {
            "id":1,
            "name":"Deliver Place 1",
            "area":"Ancona",
            "coords":{
                "crs":{
                    "type":"name",
                    "properties":{
                        "name":"EPSG:4326"
                    }
                },
                "type":"Point",
                "coordinates":[
                    43.545121,
                    13.509598
                ]
            },
            "order_place":{
                "quantity_to_deliver":5,
                "placeId":1,
                "orderUuid":"d2bfc481-a9cf-473c-a6ce-501379fb2cfc"
            }
        },
        {
            "id":2,
            "name":"Deliver Place 2",
            "area":"Ancona",
            "coords":{
                "crs":{
                    "type":"name",
                    "properties":{
                        "name":"EPSG:4326"
                    }
                },
                "type":"Point",
                "coordinates":[
                    43.546,
                    13.509652
                ]
            },
            "order_place":{
                "quantity_to_deliver":12,
                "placeId":2,
                "orderUuid":"d2bfc481-a9cf-473c-a6ce-501379fb2cfc"
            }
        },
        {
            "id":3,
            "name":"Deliver Place 3",
            "area":"Ancona",
            "coords":{
                "crs":{
                    "type":"name",
                    "properties":{
                        "name":"EPSG:4326"
                    }
                },
                "type":"Point",
                "coordinates":[
                    43.547582,
                    13.509738
                ]
            },
            "order_place":{
                "quantity_to_deliver":8,
                "placeId":3,
                "orderUuid":"d2bfc481-a9cf-473c-a6ce-501379fb2cfc"
            }
        }
    ]
}
```

- GET /users
```
curl http://localhost:3000/users -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOjAsImlhdCI6MTY1NjQxMDA2MH0.U8Qizgywf2wHXsnAxwIMYKEhCPMtmszfWi4TbzeOVMo'
```

Response:
```json
[
    {
        "id":1,
        "username":"admin",
        "role":0,
        "password":"$2b$10$WvBljXwWoS6YKpcNG7Na7u.oGOpKWrmNKzoy14T.9GLMeyQO9oIDi",
        "createdAt":"2022-06-28T12:36:41.963Z",
        "updatedAt":"2022-06-28T12:36:41.963Z"
    },
    {
        "id":2,
        "username":"testUser",
        "role":1,
        "password":"$2b$10$EPNGnHJhbt.coT6C9EIdw.ypmDJ8NBhI7kKe5ZH7XefgnaO5qRvfu",
        "createdAt":"2022-06-28T12:36:42.197Z",
        "updatedAt":"2022-06-28T12:36:42.197Z"
    },
    ...
]
```

- GET users/:id
```
curl http://localhost:3000/users/2 -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOjAsImlhdCI6MTY1NjQxMDA2MH0.U8Qizgywf2wHXsnAxwIMYKEhCPMtmszfWi4TbzeOVMo'
```

Response:
```json

{
    "id":2,
    "username":"testUser",
    "role":1,
    "password":"$2b$10$EPNGnHJhbt.coT6C9EIdw.ypmDJ8NBhI7kKe5ZH7XefgnaO5qRvfu",
    "createdAt":"2022-06-28T12:36:42.197Z",
    "updatedAt":"2022-06-28T12:36:42.197Z"
    },
```



### Normal user

- POST /register
```
curl http://localhost:3001/register -H 'Content-type: application/json' -X POST --data '{"username": "am", "password": "pass"}
```

Response:
```json
{
    "message":"User correctly created"
} 
```


- POST /login

```
curl -X POST http://localhost:3000/login -H 'Content-type: application/json' --data '{"username":"testUser", "password":"UserPass"}' 
```

Response:
```json
{
    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0VXNlciIsInJvbGUiOjEsImlhdCI6MTY1NjQzMTIwMX0.F7jHA0WmhTklAjbH5n8STrv2m9rSD6_99Y54MgQTU7w"
}
```

- POST /orders/
```
curl http://localhost:3000/orders/ -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0VXNlciIsInJvbGUiOjEsImlhdCI6MTY1NjQzMTIwMX0.F7jHA0WmhTklAjbH5n8STrv2m9rSD6_99Y54MgQTU7w ' --data '{                  
    "places": [                                                
        {"name": "Deliver Place 1", "quantity_to_deliver": 13},
        {"name": "Deliver Place 3", "quantity_to_deliver": 21},
        {"name": "Deliver Place 4", "quantity_to_deliver": 20}    
    ],                                                          
    "foods": [
        {"name": "Salmon", "quantity": 10, "withdrawal_order": 1},
        {"name": "Rice", "quantity": 23, "withdrawal_order": 2},
        {"name": "Tuna", "quantity": 21, "withdrawal_order": 3}
    ]
}'
```

Response:
```json
{
    "message":"Order created"
}
```


- POST /orders/ with quantities that do not match

```
curl http://localhost:3000/orders/ -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0VXNlciIsInJvbGUiOjEsImlhdCI6MTY1NjQzMTIwMX0.F7jHA0WmhTklAjbH5n8STrv2m9rSD6_99Y54MgQTU7w ' --data '{
    "places": [
        {"name": "Deliver Place 1", "quantity_to_deliver": 13},
        {"name": "Deliver Place 4", "quantity_to_deliver": 20}
    ],
    "foods": [
        {"name": "Salmon", "quantity": 10, "withdrawal_order": 1},
        {"name": "Rice", "quantity": 21, "withdrawal_order": 2} 
    ]
}'
```

Response: 

```json
{
    "error":"Quantity inserted do not match"
}
```

- POST /orders/ with missing/wrong parameter
```
curl http://localhost:3000/orders/ -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0VXNlciIsInJvbGUiOjEsImlhdCI6MTY1NjQzMTIwMX0.F7jHA0WmhTklAjbH5n8STrv2m9rSD6_99Y54MgQTU7w ' --data '{
    "places": [
        {"name": "Deliver Place 4", "quantity_to_deliver": 20} 
    ],
    "foods": [
        {"names": "Rice", "quantity": 20, "withdrawal_order": 1}
    ]
}'

```

Response:
```json
{
    "error":"One or more required parameters are missing or not valid"
}
```

- GET /orders/execute/:uuid

```
curl http://localhost:3000/orders/execute/d2bfc481-a9cf-473c-a6ce-501379fb2cfc -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0VXNlciIsInJvbGUiOjEsImlhdCI6MTY1NjQzMTIwMX0.F7jHA0WmhTklAjbH5n8STrv2m9rSD6_99Y54MgQTU7w '
```

Response:
```json
{
    "message":"Order started succesfully"
}
```

Response when websocket client is not connected:
```json
{
    "error":"The websocket client is not available. Check if it's running"
}
```

Response when you execute an order already started/executed
```json
{
    "error":"Order has been already started."
}

```

### Unauthenticated user

- GET /orders/status/:uuid
```
curl http://localhost:3000/orders/status/d2bfc481-a9cf-473c-a6ce-501379fb2cfc -H 'Content-Type: application/json'  
```

Response:

```json
{
    "status":"Completed"
}
```