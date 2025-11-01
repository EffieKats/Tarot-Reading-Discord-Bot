# Use Node.js LTS version
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Expose port if needed (for Koyeb, optional)
EXPOSE 3000

# Run the bot
CMD ["npm", "start"]
