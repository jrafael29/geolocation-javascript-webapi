FROM node:20-alpine

WORKDIR /app

COPY . . 

RUN npm install -g npm

RUN npm install

CMD ["npm", "start"]