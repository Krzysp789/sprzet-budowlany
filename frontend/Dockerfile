# syntax=docker/dockerfile:1

ARG NODE_VERSION=18.16.1

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

RUN npm install -g @angular/cli@15

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/root/.npm \
  npm ci --omit=dev

COPY ./package* .

RUN npm i

COPY . .

EXPOSE 4200

CMD ng serve --host 0.0.0.0
