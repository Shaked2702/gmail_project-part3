# Dockerfile for building and running the project main & tests.

FROM node:latest

COPY . /usr/src/proj_ex3
# That command especially includes package-lock.json and package.json files

WORKDIR /usr/src/proj_ex3/src

RUN npm install
# Notice that download of express and module is done here via package.json

CMD ["node", "app.js"]