#!/bin/sh
docker exec -it node_backend sh -c "npx sequelize-cli db:migrate:undo:all; npx sequelize-cli db:migrate; npx sequelize-cli db:seed:all;"