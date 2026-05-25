# Use a lightweight Node.JS image as the base
FROM node:18-alpine

# Set the working directory for the project
WORKDIR /app

# Copy the json files we created into the container
COPY package*.json ./

# Install npm
RUN npm install --omit=dev

# Copy the rest of the files from /nodejs_server into the container
COPY . .

# Set the server's port
EXPOSE 3000

# Activate the container
CMD ["npm", "start"]