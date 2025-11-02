# Use official Node.js LTS image (lightweight Alpine version)
FROM node:20-alpine

# Create and set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy all other source files
COPY . .

# Expose port (Koyeb uses dynamic PORT environment variable)
EXPOSE 8080

# Start the bot
CMD ["npm", "start"]
