FROM node:24.2-alpine3.22

WORKDIR /usr/local/app

COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

ENTRYPOINT [ "npm", "start" ]
