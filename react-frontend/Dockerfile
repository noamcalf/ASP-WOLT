# Stage 1: Build the React Application
FROM node:22-alpine AS builder

# We'll set the working directory for the frontend
WORKDIR /app/react-frontend

# Copy package.json and install dependencies
COPY react-frontend/package*.json ./
RUN npm install

# Copy the rest of the frontend source code
COPY react-frontend/ ./

# Build the React application (Vite outputs to 'dist' folder)
RUN npm run build

# Stage 2: Setup the Node.js Backend and serve the static files
FROM node:22-alpine

WORKDIR /app/nodejs_server

# Copy the backend package.json and install dependencies
COPY nodejs_server/package*.json ./
RUN npm install --production

# Copy the backend source code
COPY nodejs_server/ ./

# Copy the compiled React static assets from Stage 1 directly into the 'public' folder
COPY --from=builder /app/react-frontend/dist ./public

# Expose the unified port (3000)
EXPOSE 3000

# Start the Node.js server
CMD ["npm", "start"]
