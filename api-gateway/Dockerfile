FROM node:alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the API Gateway port (modify if needed)
EXPOSE 3000

# Start the API Gateway
CMD ["npm", "run", "dev"]
