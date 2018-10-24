FROM node:8.9.4-alpine

RUN mkdir /app && cd /app
WORKDIR /app

COPY *.json ./
COPY ./public ./public
COPY ./src ./src

RUN npm install
RUN ./node_modules/.bin/tsc --outDir ./dist
RUN ./node_modules/.bin/webpack --config ./dist/webpack.config.js
RUN rm -r ./src ./dist/public

EXPOSE 3000
CMD ["node", "./dist/index.js"]