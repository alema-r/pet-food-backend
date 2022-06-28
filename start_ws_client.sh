#!/bin/sh

# 1 = quantity error, 2 = order error, blank = normal execution


command="node dist/src/websockets/client.websocket.js $1"

docker exec -it node_backend sh -c "$command";