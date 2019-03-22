FROM node:8.9.4-alpine

RUN mkdir /app && cd /app
WORKDIR /app
EXPOSE 3000
CMD ["node", "./dist/index.js"]

COPY *.json ./
RUN npm install

COPY ./src ./src
RUN ./node_modules/.bin/tsc --outDir ./dist
RUN ./node_modules/.bin/webpack --config ./dist/webpack.config.js

COPY ./public ./public

RUN rm -r ./src ./dist/public