FROM node:latest

WORKDIR /client

COPY package.json ./

COPY package-lock.json ./

RUN npm install

COPY . .

COPY ./dist ./dist

CMD ["npm", "run", "start"]