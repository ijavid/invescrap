FROM bitnami/node:latest

COPY *.json ./
COPY ./public ./public
COPY ./src ./src

RUN npm install
RUN npm run build-docker
RUN rm -r ./src ./dist/public

EXPOSE 3000
CMD ["node", "./dist/index.js"]