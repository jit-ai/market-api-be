# Use the official Node.js image as base
FROM node:18.19.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 4001

# Command to run your application
CMD ["npm", "run", "start:prod"]
