FROM node:8.9.4-alpine

COPY *.json ./
COPY ./public ./public
COPY ./src ./src
#COPY ./migration ./migration


RUN npm install
RUN ./node_modules/.bin/tsc --outDir ./dist && rm -r ./src

EXPOSE 3000
CMD ["node", "./dist/index.js"]