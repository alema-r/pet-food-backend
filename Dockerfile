FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm install sequelize-cli
RUN npm run build
CMD ["node", "/app/dist/index.js"]