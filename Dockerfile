# Use an official Node.js runtime as a parent image
FROM node:16-alpine3.14 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install the dependencies in the container
RUN npm install

# Copy the rest of the application's code into the container
COPY . .

# Build the application
RUN npm run build

# Use a lightweight Nginx image as a parent image
FROM nginx:1.21.1-alpine

# Copy the built React app from the previous stage into the Nginx container
COPY --from=builder /app/build /usr/share/nginx/html

# Copy the Nginx configuration file into the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start the Nginx server when the container starts
CMD ["nginx", "-g", "daemon off;"]
