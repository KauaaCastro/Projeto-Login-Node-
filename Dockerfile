FROM node:20

WORKDIR /app

COPY package*.json ./

COPY . .

EXPOSE 8000

CMD ["node", "src/server.js"]