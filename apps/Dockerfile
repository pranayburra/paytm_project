FROM node:22-alpine3.22

WORKDIR /app
COPY package*.json turbo.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm i
RUN npm run db:generate


RUN npm run build
CMD [ "npm","run","start-user-app" ] 