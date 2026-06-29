# Stage 1: Build the Universal Expo Application for Web
FROM node:22-alpine AS builder

# We'll set the working directory for the frontend
WORKDIR /app/expo-frontend

# Copy package.json and install dependencies
COPY expo-frontend/package*.json ./
RUN npm install

# Copy the rest of the frontend source code
COPY expo-frontend/ ./

# Build the Expo application for the web (outputs to 'dist' folder)
RUN npx expo export -p web

# Stage 2: Setup the Node.js Backend and serve the static files
FROM node:22-alpine

WORKDIR /app/nodejs_server

# Copy the backend package.json and install dependencies
COPY nodejs_server/package*.json ./
RUN npm install --production

# Copy the backend source code
COPY nodejs_server/ ./

# Copy the seed images to the container's /app/images directory
COPY images/ /app/images/

# Copy the compiled Expo web static assets from Stage 1 directly into the 'public' folder
COPY --from=builder /app/expo-frontend/dist ./public

# Expose the unified port (3000)
EXPOSE 3000

# Start the Node.js server
CMD ["npm", "start"]
