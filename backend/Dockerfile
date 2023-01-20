FROM node:19.2.0-alpine


WORKDIR /usr/src/app
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN npm install
EXPOSE 8080
COPY . .
CMD [ "npm", "start" ]
