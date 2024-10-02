FROM node:21-bullseye-slim

# Install required dependencies for sharp
RUN apt-get update && apt-get install -y \
    libvips-dev \
    build-essential \
    gcc \
    g++ \
    make \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json ./ 
COPY package-lock.json ./
RUN npm install

COPY . .

EXPOSE 4000