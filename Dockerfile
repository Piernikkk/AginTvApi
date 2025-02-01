FROM node:22
WORKDIR /app
COPY package*.json /app
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 42070
CMD ["node", "build/index.js"]