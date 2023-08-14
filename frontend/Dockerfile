FROM node:20

WORKDIR /usr/src/app/app-angular

COPY package*.json ./

RUN npm install -g @angular/cli @angular-devkit/build-angular && npm install

COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]
