# Dockerfile for building and running the project NodeJS Mailbox server.

FROM node:latest

COPY . /usr/src/proj_ex3_mailbox
# That command especially includes package-lock.json and package.json files

WORKDIR /usr/src/proj_ex3_mailbox/src

RUN npm install
# Notice that download of express and module is done here via package.json

CMD ["node", "app.js"]