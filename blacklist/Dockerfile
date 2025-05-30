# Dockerfile for building and running the project main & tests.

FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

COPY . /usr/src/proj_ex3

WORKDIR /usr/src/proj_ex3/src/build

RUN cmake .. && make

WORKDIR /usr/src/proj_ex3/src/exe

CMD ["/usr/bin/bash"]