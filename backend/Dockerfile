FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

ENV MONGO_DB_CONNECTION_STRING=mongodb://mongodb:27017/course-goals

CMD ["npm", "start"]