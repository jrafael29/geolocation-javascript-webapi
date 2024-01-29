FROM node:20-alpine

WORKDIR /app

ADD package.json . 

RUN npm install

COPY . .

CMD ["npm", "start"]