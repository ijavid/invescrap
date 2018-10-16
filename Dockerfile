FROM node:8.9.4-alpine

COPY *.json ./
COPY ./public ./public
COPY ./src ./src

RUN npm install
RUN npm run docker && rm -r ./src

EXPOSE 3000
CMD ["node", "./dist/index.js"]