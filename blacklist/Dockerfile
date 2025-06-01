# Dockerfile for building and running the Blacklist server in C++.
# Default command for ./main 9160 16 1 2

FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

COPY . /usr/src/proj_ex3_blacklist

WORKDIR /usr/src/proj_ex3_blacklist/src/build

RUN cmake .. && make

WORKDIR /usr/src/proj_ex3_blacklist/src/exe

CMD ["./main", "9160", "16", "1", "2"]
# The command above runs the main executable with the specified arguments.