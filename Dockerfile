# Use a lightweight Ubuntu image as the base
FROM ubuntu:22.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install essential C++ build tools, CMake, and GTest library
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    g++ \
    libgtest-dev \
    && rm -rf /var/lib/apt/lists/*

# Pre-compile the GTest library so it's ready for the project
WORKDIR /usr/src/gtest
RUN cmake CMakeLists.txt && make && cp lib/*.a /usr/lib

# Set the working directory for the project
WORKDIR /app

# Copy the project files into the container
COPY . .

# Default command (can be overridden later)
CMD ["bash"]