FROM node:latest

WORKDIR /library

COPY . /library
RUN npm install

EXPOSE 3000
CMD ["npm", "run", "dev"]