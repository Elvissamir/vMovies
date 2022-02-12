FROM node:16-alpine3.14

ARG DEV_PORT

WORKDIR /var/www
COPY package*.json ./
RUN npm install -g nodemon
COPY . .
CMD [ "nodemon", "server.js"]
EXPOSE ${DEV_PORT}