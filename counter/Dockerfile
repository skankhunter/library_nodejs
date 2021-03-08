FROM node:latest

WORKDIR /counter

COPY . /counter
RUN npm install

EXPOSE 3000
CMD ["node", "index.js"]